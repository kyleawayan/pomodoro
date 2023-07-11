import Pomodoro from 'main/pomodoro';

function getPomodoroResults(startTime: Date, fakeTime: Date) {
  const pomodoro = new Pomodoro(() => Promise.resolve(startTime));
  pomodoro.calculatePomodoro(startTime, fakeTime);
  return pomodoro.info;
}

describe('Pomodoro class', () => {
  describe('calculatePomodoro method', () => {
    // Here is an example pomodoro session that starts at 8:00PM
    const startTime = new Date(2023, 7, 11, 20, 0, 0); // 8:00PM

    it('correctly recognizes first work interval', () => {
      // Work session starts at 8:00PM and ends at 8:25PM
      // Test 8:10PM
      const res = getPomodoroResults(
        startTime,
        new Date(2023, 7, 11, 20, 10, 0)
      );

      expect(res.currentEvent.type).toEqual('pomodoro');
      expect(res.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 20, 25, 0) // Should end at 8:25PM
      );
      expect(res.pomodoroCount).toEqual(1);
    });

    it("correctly calculates the next long break's start time", () => {
      // Long break session starts at 9:55PM
      // Test 8:10PM
      const res = getPomodoroResults(
        startTime,
        new Date(2023, 7, 11, 20, 10, 0)
      );

      expect(res.nextLongBreak).toEqual(
        new Date(2023, 7, 11, 21, 55, 0) // Should start at 9:55PM
      );
    });

    it('correctly recognizes first short break interval', () => {
      // Short break session starts at 8:25PM and ends at 8:30PM
      // Test 8:27PM
      const res = getPomodoroResults(
        startTime,
        new Date(2023, 7, 11, 20, 27, 0)
      );

      expect(res.currentEvent.type).toEqual('shortBreak');
      expect(res.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 20, 30, 0) // Should end at 8:30PM
      );
      expect(res.pomodoroCount).toEqual(1);
    });

    it('correctly recognizes second work interval', () => {
      // Work session starts at 8:30PM and ends at 8:55PM
      // Test 8:46PM
      const res = getPomodoroResults(
        startTime,
        new Date(2023, 7, 11, 20, 46, 0)
      );

      expect(res.currentEvent.type).toEqual('pomodoro');
      expect(res.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 20, 55, 0) // Should end at 8:55PM
      );
      expect(res.pomodoroCount).toEqual(2);
    });

    it('correctly recognizes second short break interval', () => {
      // Short break session starts at 8:55PM and ends at 9:00PM
      // Test 8:58PM
      const res = getPomodoroResults(
        startTime,
        new Date(2023, 7, 11, 20, 58, 0)
      );

      expect(res.currentEvent.type).toEqual('shortBreak');
      expect(res.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 21, 0, 0) // Should end at 9:00PM
      );
      expect(res.pomodoroCount).toEqual(2);
    });

    it('correctly recognizes long break interval', () => {
      // Long break session starts at 9:55PM and ends at 10:15PM
      // Test 9:55PM
      const res = getPomodoroResults(
        startTime,
        new Date(2023, 7, 11, 21, 55, 0)
      );

      expect(res.currentEvent.type).toEqual('longBreak');
      expect(res.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 22, 15, 0) // Should end at 10:15PM
      );
      expect(res.pomodoroCount).toEqual(4);
    });

    it('correctly recognizes work interval after long break', () => {
      // Work session after long break starts at 10:15PM and ends at 10:40PM
      // Test 10:30PM
      const res = getPomodoroResults(
        startTime,
        new Date(2023, 7, 11, 22, 30, 0)
      );

      expect(res.currentEvent.type).toEqual('pomodoro');
      expect(res.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 22, 40, 0) // Should end at 10:40PM
      );
      expect(res.pomodoroCount).toEqual(5);
    });

    it('correctly recognizes first short break interval after long break', () => {
      // The first short break session after long break starts at 10:40PM and ends at 10:45PM
      // Test 10:42PM
      const res = getPomodoroResults(
        startTime,
        new Date(2023, 7, 11, 22, 42, 0)
      );

      expect(res.currentEvent.type).toEqual('shortBreak');
      expect(res.currentEvent.endTime).toEqual(
        new Date(2023, 7, 11, 22, 45, 0) // Should end at 10:45PM
      );
      expect(res.pomodoroCount).toEqual(5);
    });

    it("correctly calculates the second next long break's start time", () => {
      // Next long break session starts at 12:10AM
      // Test 10:42PM
      const res = getPomodoroResults(
        startTime,
        new Date(2023, 7, 11, 22, 42, 0)
      );

      expect(res.nextLongBreak).toEqual(
        new Date(2023, 7, 12, 0, 10, 0) // Should start at 12:10AM
      );
    });
  });
});
