import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './index.css';
const root = document.getElementById('root');
if (root) {
    createRoot(root).render(_jsx(BrowserRouter, { children: _jsx(App, {}) }));
}
