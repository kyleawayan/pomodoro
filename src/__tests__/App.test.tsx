import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

// Mock .ogg imports
jest.mock('../../assets/sounds/rest.ogg', () => '');
jest.mock('../../assets/sounds/focus.ogg', () => '');

describe('App', () => {
  // create a fake ipcRenderer
  const fakeIpcRenderer = {
    sendMessage: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
  };

  // Mock the window.electron.ipcRenderer
  beforeAll(() => {
    window.electron = {
      ipcRenderer: fakeIpcRenderer,
    };
  });

  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
