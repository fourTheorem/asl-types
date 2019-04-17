export class State {

  /**
   * The state type
   */
  public type: string;

  /**
   * A human-readable description of the state
   */
  public comment: string;

  /**
   * Path to the subset of input data to be processed by the state
   */
  public inputPath: string;

  /**
   * Path to the subset of output data to be provided by the state
   */
  public outputPath: string;

}
