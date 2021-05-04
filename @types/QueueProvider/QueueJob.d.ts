import Agenda from "agenda";
import {JobAttributes} from "agenda";

declare interface QueueJob {

  /**
   * The database record associated with the job.
   */
  attrs: JobAttributes & {
    result?: any
  };

  /**
   * The agenda that created the job.
   */
  agenda: Agenda;

  /**
   * Specifies an interval on which the job should repeat.
   * @param interval A human-readable format String, a cron format String, or a Number.
   * @param options An optional argument that can include a timezone field or skipImmediate field.
   * The timezone should be a string as accepted by moment-timezone and is considered when using an interval in the cron string format.
   * Setting skipImmediate as true will skip the immediate run. The first run will occur only in configured interval.
   */
  repeatEvery(interval: string | number, options?: { timezone?: string, skipImmediate?: boolean }): this

  /**
   * Specifies a time when the job should repeat. [Possible values](https://github.com/matthewmueller/date#examples).
   * @param time
   */
  repeatAt(time: string): this

  /**
   * Disables the job.
   */
  disable(): this;

  /**
   * Enables the job.
   */
  enable(): this;

  /**
   * Ensure that only one instance of this job exists with the specified properties
   * @param value The properties associated with the job that must be unqiue.
   * @param opts
   */
  unique(value: any, opts?: { insertOnly?: boolean }): this;

  /**
   * Specifies the next time at which the job should run.
   * @param time The next time at which the job should run.
   */
  schedule(time: string | Date): this;

  /**
   * Specifies the priority weighting of the job.
   * @param value The priority of the job (lowest|low|normal|high|highest|number).
   */
  priority(value: string | number): this;

  /**
   * Sets job.attrs.failedAt to now, and sets job.attrs.failReason to reason.
   * @param reason A message or Error object that indicates why the job failed.
   */
  fail(reason: string | Error): this;

  /**
   * Runs the given job and calls callback(err, job) upon completion. Normally you never need to call this manually
   */
  run(): Promise<this>;

  /**
   * Returns true if the job is running; otherwise, returns false.
   */
  isRunning(): boolean;

  /**
   * Saves the job into the database.
   */
  save(): Promise<this>;

  /**
   * Removes the job from the database and cancels the job.
   */
  remove(): Promise<number>;

  /**
   * Resets the lock on the job. Useful to indicate that the job hasn't timed out when you have very long running
   * jobs.
   */
  touch(): Promise<this>;

  /**
   * Calculates next time the job should run
   */
  computeNextRunAt(): this;
}

export {QueueJob}
export default QueueJob
