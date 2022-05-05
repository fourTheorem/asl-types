/* tslint:disable */
/**
 * This file was automatically generated */

import {StateMachine} from "./state-machine";
import {Errors} from "./errors";
import {State} from "./state";
import {Choice} from "./choice";
import {Fail} from "./fail";
import {Pass} from "./pass";
import {Succeed} from "./succeed";
import {Task} from "./task";
import {Wait} from "./wait";
import {Map} from "./map";

export interface Parallel {
  Type: "Parallel";
  Parameters?:
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }[];
  ResultSelector?: {
    [k: string]: unknown;
  };
  Next?: string;
  End?: true;
  Comment?: string;
  OutputPath?: string | null;
  InputPath?: string | null;
  ResultPath?: string | null;
  Branches: StateMachine[];
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
}
