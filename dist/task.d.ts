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
import {Succeed} from "./succeed";
import {Wait} from "./wait";
import {Map} from "./map";

export interface Task {
  Type: "Task";
  Next?: string;
  End?: true;
  Comment?: string;
  OutputPath?: string | null;
  InputPath?: string | null;
  Resource:
    | string
    | {
        [k: string]: unknown;
      };
  ResultPath?: string | null;
  Retry?: {
    ErrorEquals: Errors[];
    IntervalSeconds?: number;
    MaxAttempts?: number;
    BackoffRate?: number;
    [k: string]: unknown;
  }[];
  Catch?: {
    ErrorEquals: Errors[];
    Next: string;
    ResultPath?: string | null;
    [k: string]: unknown;
  }[];
  TimeoutSeconds?: number;
  TimeoutSecondsPath?: string;
  HeartbeatSeconds?: number;
  HeartbeatSecondsPath?: string;
  ResultSelector?: {
    [k: string]: unknown;
  };
  Parameters?:
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }[];
}
