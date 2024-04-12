import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './router/index';
import { ConfigProvider } from 'antd';
import ZH from 'antd/locale/zh_CN'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={ZH}>
    <App />
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
