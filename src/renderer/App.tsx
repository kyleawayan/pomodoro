import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { FormEvent, useEffect, useState } from 'react';

function ApiKeyInput({ onSubmit }: { onSubmit: (apiKey: string) => void }) {
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(apiKeyInput);
  };

  return (
    <form>
      <input
        type="text"
        value={apiKeyInput}
        onChange={(e) => setApiKeyInput(e.target.value)}
      />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
}

function Hello() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on('toggl', (arg) => {
      console.log(arg);
      if (arg === true) {
        setAuthenticated(true);
      }
    });
    // Check if autnenticated at initial load
    window.electron.ipcRenderer.sendMessage('toggl', ['checkAuth']);

    return removeListener;
  }, []);

  const handleLogin = (apiKey: string) => {
    window.electron.ipcRenderer.sendMessage('toggl', ['startSession', apiKey]);
  };

  const getCurrentTimeEntry = () => {
    window.electron.ipcRenderer.sendMessage('toggl', ['getCurrentTimeEntry']);
  };

  return (
    <div>
      {authenticated ? (
        <div>
          <h1>Authenticated</h1>
          <button onClick={getCurrentTimeEntry}>Get current time entry</button>
        </div>
      ) : (
        <div>
          <h1>Not authenticated</h1>
          <ApiKeyInput onSubmit={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
