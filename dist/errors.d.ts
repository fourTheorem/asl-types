/* tslint:disable */
/**
 * This file was automatically generated */

import {StateMachine} from "./state-machine";
import {State} from "./state";
import {Choice} from "./choice";
import {Fail} from "./fail";
import {Parallel} from "./parallel";
import {Pass} from "./pass";
import {Succeed} from "./succeed";
import {Task} from "./task";
import {Wait} from "./wait";
import {Map} from "./map";

/**
 * https://states-language.net/#appendix-a
 */
export type Errors =
  | string
  | "States.ALL"
  | "States.HeartbeatTimeout"
  | "States.Timeout"
  | "States.TaskFailed"
  | "States.Permissions"
  | "States.ResultPathMatchFailure"
  | "States.ParameterPathFailure"
  | "States.BranchFailed"
  | "States.NoChoiceMatched"
  | "States.IntrinsicFailure";
