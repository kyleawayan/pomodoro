import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function Login() {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on('toggl', (arg) => {
      if (arg === true) {
        setAuthenticated(true);
        navigate('/timer');
      }
    });
    // Check if autnenticated at initial load
    window.electron.ipcRenderer.sendMessage('toggl', ['checkAuth']);

    return removeListener;
  }, []);

  const handleLogin = (apiKey: string) => {
    window.electron.ipcRenderer.sendMessage('toggl', ['startSession', apiKey]);
  };

  return (
    <div>
      {!authenticated && (
        <div>
          <h1>Not authenticated</h1>
          <ApiKeyInput onSubmit={handleLogin} />
        </div>
      )}
    </div>
  );
}
