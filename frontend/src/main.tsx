import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import { store } from './app/store'
import './styles/app.css'
import './styles/ckeditor-reset.css'

const isDevMode = import.meta.env.MODE === 'development'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  isDevMode ? (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  ) : (
    <Provider store={store}>
      <App />
    </Provider>
  )
)
