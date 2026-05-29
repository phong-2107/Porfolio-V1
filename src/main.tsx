import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remote debugging logger
const sendLog = (type: string, message: any) => {
  fetch('http://localhost:3002/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, message: String(message) })
  }).catch(() => {});
};

window.onerror = (message, source, lineno, colno, error) => {
  sendLog('ERROR', `Uncaught Exception: ${message} at ${source}:${lineno}:${colno}`);
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  sendLog('REJECTION', `Unhandled Promise Rejection: ${event.reason}`);
});

const originalConsoleError = console.error;
console.error = (...args) => {
  sendLog('CONSOLE_ERROR', args.join(' '));
  originalConsoleError.apply(console, args);
};

const originalConsoleLog = console.log;
console.log = (...args) => {
  sendLog('CONSOLE_LOG', args.join(' '));
  originalConsoleLog.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
