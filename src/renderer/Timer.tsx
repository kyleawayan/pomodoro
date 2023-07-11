import React, { useEffect, useState } from 'react';
import { PomodoroInfo } from 'main/pomodoro';

export default function Timer() {
  const [pomodroInfo, setPomodoroInfo] = useState<PomodoroInfo | null>(null);

  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on('pomodoro', (arg) => {
      setPomodoroInfo(arg as PomodoroInfo);
    });

    return removeListener;
  });

  return pomodroInfo ? (
    <div>{JSON.stringify(pomodroInfo)}</div>
  ) : (
    <div>Loading...</div>
  );
}
