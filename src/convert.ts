import { promises as fs } from 'fs'
import path from 'path'
import url from 'url'

import { pascalCase } from 'change-case'
const traverse = require('traverse')
import { compileFromFile } from 'json-schema-to-typescript'
import { JSONSchema4 } from 'json-schema';

const schemaRoot = path.join(__dirname, '..', 'node_modules', 'asl-validator', 'src', 'schemas')
const genSchemaDir = path.join(__dirname, '..', 'gen');

declare type Declarations = { [schemaName: string] : string };

const DEFAULT_BANNER_COMMENT = '/* tslint:disable */\n/**\n* This file was automatically generated */\n';

const redundantExport = /^export type (\w+) = \1;\n+/gm;

/**
 * Read all JSON schemas from the `asl-validator` module and generate TypeScript definitions for them
 */
async function convert () {
  console.log('Generating type definitions')

  const declarations: Declarations = {}
  const schemaFiles: {[schemaName : string] :string} = {}
  await fs.mkdir(genSchemaDir).catch(() => {});

  const files = await fs.readdir(schemaRoot);
  while(files.length) {
    const file = files.shift();
    if (file && file.endsWith('.json')) {
      const schemaName = file.replace('.json', '');
      const genSchemaFile = await createSchemaFile(schemaName, declarations)
      schemaFiles[schemaName] = genSchemaFile;
    }
  }

  for (let schemaName of Object.keys(schemaFiles)) {
    const schemaTypeFile = `dist/${schemaName}.d.ts`;
    console.log(`Creating ${schemaTypeFile}`);

    // Create 'import' statements for all other types
    const importLines = createImportLines(declarations, Object.keys(declarations).filter(key => key !== schemaName));
    const ts = await compileFromFile(path.join(genSchemaDir, `${schemaName}.json`), {
      cwd: genSchemaDir,
      declareExternallyReferenced: true,
      bannerComment: `${DEFAULT_BANNER_COMMENT}\n${importLines.join('\n')}\n\n`
    });
    
    await fs.writeFile(schemaTypeFile, ts.replace(redundantExport, ''));
  }

  createTypeIndex(declarations);

  console.log('Done')
}

/**
 * Make slight modifications to the `asl-validator` JSON schemas to aid generation
 * of more useful TypeScript definitions. This consists of two things:
 *  1. Remove `oneOf`, `anyOf` and `allOf`
 *  2. Replace `$ref`s to other ASL types with `tsType` references
 */
async function transformSchema (file: string, declarations: { [key: string] : string }) : Promise<JSONSchema4> {
  const json = await fs.readFile(file, 'utf-8');
  const obj : JSONSchema4 = JSON.parse(json);
  const newDefinitions : any = {}
  traverse(obj).forEach(function (this: any, node: any) {
    if (node) {
      if (node.properties) {
        /*
        * oneOf, anyOf and allOf cause a very loose definition to be generated ({ [k: string] : any })
        * by json-schema-to-typescript
        * This is tracked in https://github.com/bcherny/json-schema-to-typescript/issues/96
        * We can get a better definition by removing them. The downside of the resulting schema
        * is that we don't get great validation of required fields which use anyOf, oneOf or allOf
        */
        ['oneOf', 'anyOf', 'allOf'].forEach(combiner => {
          if (node[combiner]) {
            delete node[combiner];
          }
        });
      }
      if (node['$ref']) {
        const pathPart = url.parse(node['$ref']).path;
        if (pathPart) {
          const schemaName = pathPart.substring(1);
          // The only way found to get and use separate classes per schema
          // is by using tsType definitions
          // Idea from https://github.com/bcherny/json-schema-to-typescript/issues/211
          node['$ref'] = `#/definitions/${schemaName}`;
          declarations[schemaName] = pascalCase(schemaName)
          newDefinitions[schemaName] = {
            tsType: declarations[schemaName]
          }
          this.update(node);
        }
      }
    }
  });

  obj.definitions = Object.assign(obj.definitions || {}, newDefinitions);
  return obj;
}

async function createSchemaFile(schemaName: string, declarations: Declarations) {
  const genSchemaFile = path.join(genSchemaDir, `${schemaName}.json`);
  console.log(`Generating ${genSchemaFile}`);
  const schema = await transformSchema(path.join(schemaRoot, `${schemaName}.json`), declarations);
  await fs.writeFile(genSchemaFile, JSON.stringify(schema, null, ' '));
  return genSchemaFile;
}

function createImportLines(declarations: Declarations, modules: string[]) : string[] {
  return modules.reduce((prev: string[], importSchemaName: string) => {
      return [
        ...prev,
        `import { ${declarations[importSchemaName]} } from './${importSchemaName}';`
      ]
    }, []);
  }

async function createTypeIndex (declarations: Declarations) {
  const code = Object.keys(declarations).reduce(
    (prev: string, importSchemaName: string) =>
      `${prev}export type { ${declarations[importSchemaName]} } from './${importSchemaName}';\n`,
    ''
  );

  const typeIndexFile = `dist/index.d.ts`;
  console.log(`Creating ${typeIndexFile}`);
  await fs.writeFile(typeIndexFile, code, { encoding: 'utf8' });
}

convert().catch(err => {
  console.error(err.stack);
  process.exit(-1);
});