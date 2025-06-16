import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "./App.css";
import App from './App.jsx'

import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import WordChainGame from './WordChainGame.jsx';

Amplify.configure(awsExports);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <WordChainGame />
  </StrictMode>,
)
