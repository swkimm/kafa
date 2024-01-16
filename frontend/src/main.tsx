import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import App from './App.tsx'
import './styles/app.css'
import './styles/ckeditor-reset.css'
import './styles/font.css'

const isDevMode = import.meta.env.MODE !== 'development'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <RecoilRoot>
    {isDevMode ? (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ) : (
      <App />
    )}
  </RecoilRoot>
)
