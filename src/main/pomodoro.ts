/* eslint promise/always-return: off */

type PomodoroEvent = 'pomodoro' | 'shortBreak' | 'longBreak' | 'idle';

export type PomodoroInfo = {
  currentEvent: {
    type: PomodoroEvent;
    endTime: Date;
  };
  nextLongBreak: Date;
  pomodoroCount: number;
};

const defaultPomodoroInfo: PomodoroInfo = {
  currentEvent: {
    type: 'idle',
    endTime: new Date(),
  },
  nextLongBreak: new Date(),
  pomodoroCount: 0,
};

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

  interval: ReturnType<typeof setInterval> | null = null;

  info: PomodoroInfo;

  constructor(functionToGetStartTime: () => Promise<Date | null>) {
    this.functionToGetStartTime = functionToGetStartTime;

    this.info = defaultPomodoroInfo;
  }

  calculatePomodoro(startTime: Date, currentTime: Date = new Date()) {
    // convert durations to seconds
    const pomodoroDurationSeconds = 25 * 60;
    const shortBreakDurationSeconds = 5 * 60;
    const longBreakDurationSeconds = 20 * 60;

    // calculate the duration in seconds since the start time
    const secondsSinceStart = Math.floor(
      (currentTime.getTime() - startTime.getTime()) / 1000
    );

    // calculate the total duration of one full cycle (4 pomodoros, 3 short breaks, and 1 long break)
    const fullCycleDurationSeconds =
      4 * pomodoroDurationSeconds +
      3 * shortBreakDurationSeconds +
      longBreakDurationSeconds;

    // calculate the current position within the cycle
    const currentCyclePositionSeconds =
      secondsSinceStart % fullCycleDurationSeconds;

    let currentEventType: PomodoroEvent;
    let currentEventEndTime: Date;

    if (currentCyclePositionSeconds < pomodoroDurationSeconds) {
      currentEventType = 'pomodoro';
      currentEventEndTime = new Date(
        currentTime.getTime() +
          (pomodoroDurationSeconds - currentCyclePositionSeconds) * 1000
      );
    } else if (
      currentCyclePositionSeconds <
      pomodoroDurationSeconds + shortBreakDurationSeconds
    ) {
      currentEventType = 'shortBreak';
      currentEventEndTime = new Date(
        currentTime.getTime() +
          (pomodoroDurationSeconds +
            shortBreakDurationSeconds -
            currentCyclePositionSeconds) *
            1000
      );
    } else if (
      currentCyclePositionSeconds <
      pomodoroDurationSeconds * 2 + shortBreakDurationSeconds
    ) {
      currentEventType = 'pomodoro';
      currentEventEndTime = new Date(
        currentTime.getTime() +
          (pomodoroDurationSeconds * 2 +
            shortBreakDurationSeconds -
            currentCyclePositionSeconds) *
            1000
      );
    } else if (
      currentCyclePositionSeconds <
      pomodoroDurationSeconds * 2 + shortBreakDurationSeconds * 2
    ) {
      currentEventType = 'shortBreak';
      currentEventEndTime = new Date(
        currentTime.getTime() +
          (pomodoroDurationSeconds * 2 +
            shortBreakDurationSeconds * 2 -
            currentCyclePositionSeconds) *
            1000
      );
    } else if (
      currentCyclePositionSeconds <
      pomodoroDurationSeconds * 3 + shortBreakDurationSeconds * 2
    ) {
      currentEventType = 'pomodoro';
      currentEventEndTime = new Date(
        currentTime.getTime() +
          (pomodoroDurationSeconds * 3 +
            shortBreakDurationSeconds * 2 -
            currentCyclePositionSeconds) *
            1000
      );
    } else if (
      currentCyclePositionSeconds <
      pomodoroDurationSeconds * 3 + shortBreakDurationSeconds * 3
    ) {
      currentEventType = 'shortBreak';
      currentEventEndTime = new Date(
        currentTime.getTime() +
          (pomodoroDurationSeconds * 3 +
            shortBreakDurationSeconds * 3 -
            currentCyclePositionSeconds) *
            1000
      );
    } else if (
      currentCyclePositionSeconds <
      pomodoroDurationSeconds * 4 + shortBreakDurationSeconds * 3
    ) {
      currentEventType = 'pomodoro';
      currentEventEndTime = new Date(
        currentTime.getTime() +
          (pomodoroDurationSeconds * 4 +
            shortBreakDurationSeconds * 3 -
            currentCyclePositionSeconds) *
            1000
      );
    } else {
      currentEventType = 'longBreak';
      currentEventEndTime = new Date(
        currentTime.getTime() +
          (fullCycleDurationSeconds - currentCyclePositionSeconds) * 1000
      );
    }

    // calculate the number of completed pomodoros
    const completedPomodoros =
      Math.floor(
        secondsSinceStart /
          (pomodoroDurationSeconds + shortBreakDurationSeconds)
      ) +
      1 -
      // Subtract as long breaks are not counted as pomodoros
      // Not sure if it will go wrong for extremely long pomodoro sessions
      // TODO: Test for extremely long pomodoro sessions
      Math.floor(secondsSinceStart / fullCycleDurationSeconds);

    // calculate the time for the next long break
    const nextLongBreakStartTime = new Date(
      startTime.getTime() +
        Math.ceil(secondsSinceStart / fullCycleDurationSeconds) *
          fullCycleDurationSeconds *
          1000
    );

    // update the info object
    this.info = {
      currentEvent: {
        type: currentEventType,
        endTime: currentEventEndTime,
      },
      nextLongBreak: nextLongBreakStartTime,
      pomodoroCount: completedPomodoros,
    };
  }

  startWatchingFunction(callback?: (info: PomodoroInfo) => void) {
    this.interval = setInterval(() => {
      this.functionToGetStartTime()
        .then((startTime) => {
          if (!startTime) {
            this.info = defaultPomodoroInfo;
          } else {
            this.calculatePomodoro(startTime);
          }
          if (callback) {
            setImmediate(() => callback(this.info));
          }
        })
        .catch((e: any) => {
          throw new Error(e);
        });
    }, 5000);
  }

  stopWatchingFunction() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
