import Pomodoro from 'main/pomodoro';

describe('Pomodoro class', () => {
  describe('calculatePomodoro method', () => {
    // Here is an example pomodoro session that starts at 8:00PM
    const startTime = new Date(2023, 7, 11, 20, 0, 0); // 8:00PM

    it('correctly recognizes first work interval', () => {
      const pomodoro = new Pomodoro(() => Promise.resolve(startTime));

      // Work session starts at 8:00PM and ends at 8:25PM
      const testTime = new Date(2023, 7, 11, 20, 10, 0); // 8:10PM

      pomodoro.calculatePomodoro(startTime, testTime);
      expect(pomodoro.info.currentEvent.type).toEqual('pomodoro');
      expect(pomodoro.info.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 20, 25, 0) // Should end at 8:25PM
      );
      expect(pomodoro.info.pomodoroCount).toEqual(1);
    });

    it('correctly recognizes first short break interval', () => {
      const pomodoro = new Pomodoro(() => Promise.resolve(startTime));

      // Short break session starts at 8:25PM and ends at 8:30PM
      const testTime = new Date(2023, 7, 11, 20, 27, 0); // 8:27PM

      pomodoro.calculatePomodoro(startTime, testTime);
      expect(pomodoro.info.currentEvent.type).toEqual('shortBreak');
      expect(pomodoro.info.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 20, 30, 0) // Should end at 8:30PM
      );
      expect(pomodoro.info.pomodoroCount).toEqual(1);
    });

    it('correctly recognizes second work interval', () => {
      const pomodoro = new Pomodoro(() => Promise.resolve(startTime));

      // Work session starts at 8:30PM and ends at 8:55PM
      const testTime = new Date(2023, 7, 11, 20, 46, 0); // 8:46PM

      pomodoro.calculatePomodoro(startTime, testTime);
      expect(pomodoro.info.currentEvent.type).toEqual('pomodoro');
      expect(pomodoro.info.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 20, 55, 0) // Should end at 8:55PM
      );
      expect(pomodoro.info.pomodoroCount).toEqual(2);
    });

    it('correctly recognizes second short break interval', () => {
      const pomodoro = new Pomodoro(() => Promise.resolve(startTime));

      // Short break session starts at 8:55PM and ends at 9:00PM
      const testTime = new Date(2023, 7, 11, 20, 58, 0); // 8:58PM

      pomodoro.calculatePomodoro(startTime, testTime);
      expect(pomodoro.info.currentEvent.type).toEqual('shortBreak');
      expect(pomodoro.info.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 21, 0, 0) // Should end at 9:00PM
      );
      expect(pomodoro.info.pomodoroCount).toEqual(2);
    });

    it('correctly recognizes long break interval', () => {
      const pomodoro = new Pomodoro(() => Promise.resolve(startTime));

      // Long break session starts at 9:55PM and ends at 10:15PM
      const testTime = new Date(2023, 7, 11, 21, 55, 0); // 9:55PM

      pomodoro.calculatePomodoro(startTime, testTime);
      expect(pomodoro.info.currentEvent.type).toEqual('longBreak');
      expect(pomodoro.info.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 22, 15, 0) // Should end at 10:15PM
      );
    });
  });
});
