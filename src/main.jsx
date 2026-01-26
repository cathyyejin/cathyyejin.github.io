import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initKakao } from './kakao';

// Initialize Kakao SDK when app starts
const apiKey =
  import.meta.env.VITE_KAKAO_JS_KEY || import.meta.env.VITE_KAKAO_API_KEY;
if (apiKey) {
  initKakao(apiKey).catch((error) => {
    console.error('Failed to initialize Kakao SDK:', error);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
