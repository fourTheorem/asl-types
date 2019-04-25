import tap, { Test } from 'tap';

import { StateMachine } from '../dist/state-machine'
import { Task } from '../dist/state'

const testLambdaArn = "arn:aws:lambda:eu-west-1:123456789123:function:function-name";

tap.test('it creates a state machine', (t: Test) => {
  const startState : Task = {
    Type: "Task",
    Resource: testLambdaArn    
  }

  const sm: StateMachine = {
    StartAt: 'startState',
    Comment: 'Test state machine',
    States: {
      'startState': startState
    }
  };

  const aslJson = JSON.stringify(sm, null, " ");
  const parsedAsl = JSON.parse(aslJson);

  t.same(parsedAsl, {
    Comment: 'Test state machine',
    StartAt: 'startState',
    States: {
      startState: {
        Type: 'Task',
        Resource: testLambdaArn
      }
    }
  });
  t.end();
})
