import * as asl from '..';

const startState: asl.Task = {
  Type: 'Task',
  Resource: 'arn:aws:lambda:eu-west-1:123456789123:function:function-name',
  Next: "secondState"
};

const secondState: asl.Wait = {
  Type: 'Wait',
  Seconds: 3,
  Next: 'finishState'
};

const finishState: asl.Succeed = {
  Type: 'Succeed'
};

const sm: asl.StateMachine = {
  StartAt: "startState",
  States: {
    startState,
    secondState,
    finishState
  }
};

console.log(JSON.stringify(sm, null, '  '));