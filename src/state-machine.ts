import { State } from './state';

/**
 *
 */
export class StateMachine {

  /**
   * The states in the state machine by name
   */
  public readonly states: { [stateName: string]: State };

  /**
   * The name of the start state
   */
  public startAt: string;

  /**
   * A human-readable description of the machine
   */
  public comment: string;

  /**
   * The version of the states langauges used
   */
  public readonly version: string = '1.0';

  /**
   * The maximum number of seconds the machine is allowed to run.
   */
  public timeoutSeconds: number;

}
