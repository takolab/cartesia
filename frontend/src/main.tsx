import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ant Design
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';

// (optional) your own global CSS
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
