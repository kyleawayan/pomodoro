import React, { useEffect, useState } from 'react';
import { PomodoroInfo } from 'main/pomodoro';
import restSoundFile from '../../assets/sounds/rest.ogg';
import focusSoundFile from '../../assets/sounds/focus.ogg';

const eventTypeToFriendlyName = {
  pomodoro: 'Work',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
  idle: 'Not running',
};

const restSound = new Audio(restSoundFile);
const focusSound = new Audio(focusSoundFile);

export default function Timer() {
  const [pomodroInfo, setPomodoroInfo] = useState<PomodoroInfo | null>(null);

  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on('pomodoro', (arg) => {
      setPomodoroInfo(arg as PomodoroInfo);
    });

    return removeListener;
  });

  useEffect(() => {
    if (!pomodroInfo) {
      return;
    }

    switch (pomodroInfo.currentEvent.type) {
      case 'pomodoro':
        focusSound.play();
        break;
      case 'shortBreak':
        restSound.play();
        break;
      case 'longBreak':
        restSound.play();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomodroInfo?.currentEvent.type]);

  if (!pomodroInfo) {
    return <div>Loading...</div>;
  }

  const idle = pomodroInfo.currentEvent.type === 'idle';

  // Get minutes until next event
  // Pad zeros and make it so below one minute is 01
  // Also if were idle, show "id"
  const minutes = idle
    ? 'id'
    : Math.ceil(
        (pomodroInfo.currentEvent.endTime.valueOf() - Date.now()) / 1000 / 60
      )
        .toString()
        .padStart(2, '0');

  const endTimeString = pomodroInfo.currentEvent.endTime.toLocaleTimeString(
    'en-US',
    {
      hour: 'numeric',
      minute: 'numeric',
    }
  );

  const currentEvent = eventTypeToFriendlyName[pomodroInfo.currentEvent.type];

  return (
    <div className="absolute bottom-0 m-24">
      <div className="relative mb-8 h-[128px] w-[209px]">
        <div className="font-lcd text-9xl absolute text-gray-900">88</div>
        <div className="font-lcd text-9xl absolute">{minutes}</div>
      </div>
      <div className="text-3xl">{currentEvent}</div>
      <div>until {endTimeString}</div>
    </div>
  );
}
