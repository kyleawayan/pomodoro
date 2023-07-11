/**
 * This pomodoro class takes in a function that returns the start time of the whole pomodoro session.
 * This is meant to be used with the Toggl Track API, which when a user is running a timer,
 * will return the start time of the timer.
 *
 * Theoretically, this class can be used with any function that returns the start time of the whole pomodoro session.
 *
 * @param functionToGetStartTime A function that returns the start time of the *whole* pomodoro session. If the function returns null, it is assumed that the user is not running a timer.
 */
export default class Pomodoro {
  functionToGetStartTime: () => Promise<Date | null>;

  interval: NodeJS.Timer | null = null;

  constructor(functionToGetStartTime: () => Promise<Date | null>) {
    this.functionToGetStartTime = functionToGetStartTime;
  }

  calculatePomodoro(startTime: Date) {
    console.log(startTime);
  }

  startWatchingFunction() {
    this.interval = setInterval(() => {
      this.functionToGetStartTime()
        .then((startTime) => {
          if (!startTime) {
            return;
          }
          this.calculatePomodoro(startTime);
        })
        .catch((e: any) => {
          throw new Error(e);
        });
    }, 1000);
  }

  stopWatchingFunction() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
