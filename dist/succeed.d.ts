/* tslint:disable */
/**
 * This file was automatically generated */

import {StateMachine} from "./state-machine";
import {Errors} from "./errors";
import {State} from "./state";
import {Choice} from "./choice";
import {Fail} from "./fail";
import {Parallel} from "./parallel";
import {Pass} from "./pass";
import {Task} from "./task";
import {Wait} from "./wait";
import {Map} from "./map";

export interface Succeed {
  Type: "Succeed";
  Comment?: string;
  OutputPath?: string | null;
  InputPath?: string | null;
}
