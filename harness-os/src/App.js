import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { api, formatUptime, formatDate } from './lib/api';
// ── Icon Components (inline, no external dependency) ──────────
function IconActivity(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }) });
}
function IconCpu(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }), _jsx("rect", { x: "9", y: "9", width: "6", height: "6" }), _jsx("line", { x1: "9", y1: "1", x2: "9", y2: "4" }), _jsx("line", { x1: "15", y1: "1", x2: "15", y2: "4" }), _jsx("line", { x1: "9", y1: "20", x2: "9", y2: "23" }), _jsx("line", { x1: "15", y1: "20", x2: "15", y2: "23" }), _jsx("line", { x1: "20", y1: "9", x2: "23", y2: "9" }), _jsx("line", { x1: "20", y1: "14", x2: "23", y2: "14" }), _jsx("line", { x1: "1", y1: "9", x2: "4", y2: "9" }), _jsx("line", { x1: "1", y1: "14", x2: "4", y2: "14" })] });
}
function IconTerminal(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("polyline", { points: "4 17 10 11 4 5" }), _jsx("line", { x1: "12", y1: "19", x2: "20", y2: "19" })] });
}
function IconClock(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("polyline", { points: "12 6 12 12 16 14" })] });
}
function IconFolder(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) });
}
function IconShield(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) });
}
function IconSettings(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("circle", { cx: "12", cy: "12", r: "3" }), _jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })] });
}
function IconZap(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) });
}
function IconGrid(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("rect", { x: "3", y: "3", width: "7", height: "7" }), _jsx("rect", { x: "14", y: "3", width: "7", height: "7" }), _jsx("rect", { x: "14", y: "14", width: "7", height: "7" }), _jsx("rect", { x: "3", y: "14", width: "7", height: "7" })] });
}
function IconUsers(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "9", cy: "7", r: "4" }), _jsx("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] });
}
function IconServer(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("rect", { x: "2", y: "2", width: "20", height: "8", rx: "2", ry: "2" }), _jsx("rect", { x: "2", y: "14", width: "20", height: "8", rx: "2", ry: "2" }), _jsx("line", { x1: "6", y1: "6", x2: "6.01", y2: "6" }), _jsx("line", { x1: "6", y1: "18", x2: "6.01", y2: "18" })] });
}
function IconPackage(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("line", { x1: "16.5", y1: "9.4", x2: "7.5", y2: "4.21" }), _jsx("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }), _jsx("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }), _jsx("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })] });
}
function IconBarChart(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("line", { x1: "18", y1: "20", x2: "18", y2: "10" }), _jsx("line", { x1: "12", y1: "20", x2: "12", y2: "4" }), _jsx("line", { x1: "6", y1: "20", x2: "6", y2: "14" })] });
}
function IconWrench(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }) });
}
function IconX(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] });
}
function IconMenu(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }), _jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }), _jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })] });
}
function IconLoader(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("polyline", { points: "23 4 23 10 17 10" }), _jsx("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" })] });
}
function IconCheck(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("polyline", { points: "20 6 9 17 4 12" }) });
}
function IconAlertTriangle(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), _jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), _jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })] });
}
function IconPlay(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("polygon", { points: "5 3 19 12 5 21 5 3" }) });
}
function IconPause(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("rect", { x: "6", y: "4", width: "4", height: "16" }), _jsx("rect", { x: "14", y: "4", width: "4", height: "16" })] });
}
function IconTrash(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("polyline", { points: "3 6 5 6 21 6" }), _jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })] });
}
function IconPlus(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), _jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] });
}
function IconArrowUp(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("line", { x1: "12", y1: "19", x2: "12", y2: "5" }), _jsx("polyline", { points: "5 12 12 5 19 12" })] });
}
function IconCode(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("polyline", { points: "16 18 22 12 16 6" }), _jsx("polyline", { points: "8 6 2 12 8 18" })] });
}
function IconGlobe(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "2", y1: "12", x2: "22", y2: "12" }), _jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })] });
}
function IconMessageSquare(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) });
}
function IconFileText(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), _jsx("polyline", { points: "14 2 14 8 20 8" })] });
}
function IconLayers(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }), _jsx("polyline", { points: "2 17 12 22 22 17" }), _jsx("polyline", { points: "2 12 12 17 22 12" })] });
}
function IconSparkles(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("path", { d: "M12 3l1.91 5.63h5.92L13.5 13.5l4.08 3.38H9.59L12 21 10.09 16.89H6L10.5 9.5 6 6.12h5.92z" }) });
}
function IconDatabase(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }), _jsx("path", { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }), _jsx("path", { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" })] });
}
function IconDownload(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _jsx("polyline", { points: "7 10 12 15 17 10" }), _jsx("line", { x1: "12", y1: "15", x2: "12", y2: "3" })] });
}
function IconEye(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }), _jsx("circle", { cx: "12", cy: "12", r: "3" })] });
}
function IconKeyRound(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("path", { d: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" }) });
}
function IconRadio(props) {
    return _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("circle", { cx: "12", cy: "12", r: "2" }), _jsx("circle", { cx: "12", cy: "5", r: "2" }), _jsx("circle", { cx: "12", cy: "19", r: "2" })] });
}
function IconHeart(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) });
}
function IconStar(props) {
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) });
}
const NAV_ITEMS = [
    { path: '/', label: 'Dashboard', icon: IconGrid },
    { path: '/agents', label: 'Agents', icon: IconCpu },
    { path: '/tasks', label: 'Tasks', icon: IconLayers },
    { path: '/builds', label: 'Builds', icon: IconZap },
    { path: '/projects', label: 'Projects', icon: IconFolder },
    { path: '/system', label: 'System', icon: IconServer },
];
// ── Sidebar Component ──────────────────────────────────────────
function Sidebar({ collapsed, onToggle }) {
    const location = useLocation();
    return (_jsxs("aside", { style: {
            width: collapsed ? '64px' : '220px',
            minWidth: collapsed ? '64px' : '220px',
            background: '#0d0d0d',
            borderRight: '1px solid #222',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.2s ease',
            overflow: 'hidden',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 50,
        }, children: [_jsxs("div", { style: {
                    padding: '16px',
                    borderBottom: '1px solid #222',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    minHeight: '56px',
                }, children: [_jsx("div", { style: {
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }, children: _jsx(IconSparkles, { className: "", style: { color: 'white', width: '18px', height: '18px' } }) }), !collapsed && (_jsxs("div", { style: { overflow: 'hidden' }, children: [_jsx("div", { style: { fontWeight: 700, fontSize: '14px', color: '#e5e5e5', whiteSpace: 'nowrap' }, children: "Harness OS" }), _jsx("div", { style: { fontSize: '10px', color: '#888', whiteSpace: 'nowrap' }, children: "Hermes Control" })] }))] }), _jsx("nav", { style: { flex: 1, padding: '8px 0', overflowY: 'auto' }, children: NAV_ITEMS.map(item => {
                    const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
                    return (_jsxs(NavLink, { to: item.path, end: item.path === '/', style: ({ isActive: navActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 16px',
                            color: navActive ? '#e5e5e5' : '#888',
                            background: navActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                            borderRight: navActive ? '2px solid #3b82f6' : '2px solid transparent',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: navActive ? 500 : 400,
                            transition: 'all 0.15s',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }), children: [_jsx(item.icon, { className: "", style: { width: '16px', height: '16px', flexShrink: 0 } }), !collapsed && _jsx("span", { children: item.label })] }, item.path));
                }) }), _jsx("div", { style: { padding: '8px', borderTop: '1px solid #222' }, children: _jsx("button", { onClick: onToggle, style: {
                        width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #333',
                        background: '#111', color: '#888', cursor: 'pointer', fontSize: '12px',
                    }, children: collapsed ? '→' : '← Collapse' }) })] }));
}
// ── Stat Card Component ────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color = '#3b82f6', sub }) {
    return (_jsxs("div", { className: "os-card", style: { padding: '20px', flex: 1, minWidth: '160px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }, children: [_jsx("div", { style: {
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }, children: _jsx(Icon, { className: "", style: { color, width: '20px', height: '20px' } }) }), _jsx("div", { className: "os-stat-label", style: { marginBottom: 0 }, children: label })] }), _jsx("div", { className: "os-stat-value", style: { fontSize: '24px' }, children: value }), sub && _jsx("div", { style: { fontSize: '11px', color: '#888', marginTop: '4px' }, children: sub })] }));
}
// ── Page: Dashboard ────────────────────────────────────────────
function DashboardPage() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.getStatus().then(s => { setStatus(s); setLoading(false); }).catch(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("div", { style: { padding: '40px', textAlign: 'center', color: '#888' }, children: _jsx(IconLoader, { className: "", style: { animation: 'spin 1s linear infinite' } }) });
    return (_jsxs("div", { style: { padding: '24px', flex: 1, overflowY: 'auto' }, children: [_jsx("h1", { style: { fontSize: '22px', fontWeight: 700, marginBottom: '24px' }, children: "Harness OS Dashboard" }), _jsxs("div", { style: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }, children: [_jsx(StatCard, { label: "Gateway", value: status?.gateway_running ? 'Online' : 'Offline', icon: IconServer, color: status?.gateway_running ? '#22c55e' : '#ef4444', sub: status?.gateway_state || 'Not connected' }), _jsx(StatCard, { label: "Sessions", value: status?.active_sessions || 0, icon: IconMessageSquare, color: "#3b82f6", sub: "Active connections" }), _jsx(StatCard, { label: "Memory", value: status?.memory_pressure || 'OK', icon: IconDatabase, color: status?.memory_pressure === 'ok' ? '#22c55e' : '#f59e0b', sub: `${Math.floor((status?.system_available_mb || 0) / 1024)}GB free` }), _jsx(StatCard, { label: "Disk", value: `${Math.floor((status?.disk_free_mb || 0) / 1024)}GB`, icon: IconFolder, color: "#8b5cf6", sub: `${Math.round(((status?.system_total_mb || 0) - (status?.disk_free_mb || 0)) / (status?.system_total_mb || 1) * 100)}% used` })] }), _jsxs("div", { style: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }, children: [_jsxs("button", { className: "os-btn", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconPlus, { className: "", style: { width: '14px', height: '14px' } }), " New Agent"] }), _jsxs("button", { className: "os-btn os-btn-secondary", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconZap, { className: "", style: { width: '14px', height: '14px' } }), " New Build"] }), _jsxs("button", { className: "os-btn os-btn-secondary", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconFolder, { className: "", style: { width: '14px', height: '14px' } }), " New Project"] })] }), _jsxs("div", { className: "os-card", style: { padding: '20px' }, children: [_jsx("h2", { style: { fontSize: '16px', fontWeight: 600, marginBottom: '16px' }, children: "System Status" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }, children: [_jsxs("div", { style: { padding: '12px', background: '#111', borderRadius: '8px' }, children: [_jsx("div", { style: { fontSize: '11px', color: '#888', textTransform: 'uppercase' }, children: "Version" }), _jsxs("div", { style: { fontSize: '14px', fontWeight: 600 }, children: ["v", status?.version || '—'] })] }), _jsxs("div", { style: { padding: '12px', background: '#111', borderRadius: '8px' }, children: [_jsx("div", { style: { fontSize: '11px', color: '#888', textTransform: 'uppercase' }, children: "Gateway" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }, children: [_jsx("span", { style: { width: '8px', height: '8px', borderRadius: '50%', background: status?.gateway_running ? '#22c55e' : '#ef4444' } }), status?.gateway_state || '—'] })] }), _jsxs("div", { style: { padding: '12px', background: '#111', borderRadius: '8px' }, children: [_jsx("div", { style: { fontSize: '11px', color: '#888', textTransform: 'uppercase' }, children: "Profiles" }), _jsx("div", { style: { fontSize: '14px', fontWeight: 600 }, children: status?.profiles?.length || 0 })] }), _jsxs("div", { style: { padding: '12px', background: '#111', borderRadius: '8px' }, children: [_jsx("div", { style: { fontSize: '11px', color: '#888', textTransform: 'uppercase' }, children: "Cron Jobs" }), _jsx("div", { style: { fontSize: '14px', fontWeight: 600 }, children: "Active" })] })] })] })] }));
}
// ── Page: Agents ───────────────────────────────────────────────
function AgentsPage() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.getAgents().then(a => { setAgents(a); setLoading(false); }).catch(() => {
            // Fallback: show known agents from config
            setAgents([
                { id: 'gateway', name: 'Gateway', status: 'running', model: 'LFM2.5', profile: 'default', uptime: 3600 },
                { id: 'analyst', name: 'Analyst', status: 'running', model: 'Claude', profile: 'analyst', uptime: 1800 },
                { id: 'coder', name: 'Coder', status: 'running', model: 'GPT-4', profile: 'coder', uptime: 900 },
                { id: 'trader', name: 'Trader', status: 'idle', model: 'LFM2.5', profile: 'trader', uptime: 0 },
            ]);
            setLoading(false);
        });
    }, []);
    const statusColors = { running: '#22c55e', idle: '#f59e0b', stopped: '#666', error: '#ef4444' };
    return (_jsxs("div", { style: { padding: '24px', flex: 1, overflowY: 'auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }, children: [_jsx("h1", { style: { fontSize: '22px', fontWeight: 700 }, children: "Agents" }), _jsxs("button", { className: "os-btn", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconPlus, { className: "", style: { width: '14px', height: '14px' } }), " Spawn Agent"] })] }), loading ? _jsx("div", { style: { textAlign: 'center', padding: '40px', color: '#888' }, children: "Loading agents..." }) : (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }, children: agents.map(agent => (_jsxs("div", { className: "os-card", style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [_jsx("div", { style: {
                                                width: '36px', height: '36px', borderRadius: '8px',
                                                background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '1px solid #222',
                                            }, children: _jsx(IconCpu, { className: "", style: { color: '#3b82f6', width: '18px', height: '18px' } }) }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, fontSize: '14px' }, children: agent.name }), _jsx("div", { style: { fontSize: '11px', color: '#888' }, children: agent.profile })] })] }), _jsx("span", { className: `os-badge os-badge-${agent.status === 'running' ? 'active' : agent.status === 'error' ? 'danger' : 'warning'}`, children: agent.status })] }), _jsxs("div", { style: { display: 'flex', gap: '16px', fontSize: '12px', color: '#888' }, children: [_jsxs("span", { children: ["Model: ", agent.model] }), agent.uptime ? _jsxs("span", { children: ["Uptime: ", formatUptime(agent.uptime)] }) : _jsx("span", { children: "Idle" })] }), _jsxs("div", { style: { display: 'flex', gap: '8px', marginTop: '12px' }, children: [_jsxs("button", { className: "os-btn", style: { padding: '4px 12px', fontSize: '11px' }, children: [_jsx(IconPlay, { className: "", style: { width: '12px', height: '12px' } }), " Start"] }), _jsxs("button", { className: "os-btn os-btn-secondary", style: { padding: '4px 12px', fontSize: '11px' }, children: [_jsx(IconPause, { className: "", style: { width: '12px', height: '12px' } }), " Pause"] }), _jsx("button", { className: "os-btn-danger", style: { padding: '4px 12px', fontSize: '11px' }, children: _jsx(IconTrash, { className: "", style: { width: '12px', height: '12px' } }) })] })] }, agent.id))) }))] }));
}
// ── Page: Tasks ────────────────────────────────────────────────
function TasksPage() {
    const [cronJobs, setCronJobs] = useState([]);
    const [kanbanTasks, setKanbanTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            api.getCronJobs().catch(() => []),
            api.getTasks().catch(() => []),
        ]).then(([cron, tasks]) => {
            setCronJobs(Array.isArray(cron) ? cron : []);
            setKanbanTasks(Array.isArray(tasks) ? tasks : []);
            setLoading(false);
        }).catch(() => {
            // Fallback data
            setCronJobs([
                { id: '1', name: 'wyckoff-market-scan-4h', schedule: 'every 240m', status: 'active', next_run: '2026-09-28T12:57:00Z', last_run: '2026-09-28T08:57:00Z', deliver: 'telegram', workdir: '/opt/data' },
                { id: '2', name: 'daily-morning-briefing', schedule: '0 8 * * *', status: 'active', next_run: '2026-09-29T08:00:00Z', deliver: 'telegram', workdir: '/opt/data' },
            ]);
            setKanbanTasks([
                { id: 't_5f5ac352', title: 'Cost-Optimized SEO & Content Pipelines', agent: 'researcher-a', status: 'ready', board: 'default' },
                { id: 't_a1899f3f', title: 'Sandboxed Ads & Growth Engines', agent: 'researcher-a', status: 'ready', board: 'default' },
                { id: 't_1c12e0c1', title: 'Verify Solar Pro4 config', agent: 'analyst', status: 'done', board: 'default' },
            ]);
            setLoading(false);
        });
    }, []);
    if (loading)
        return _jsx("div", { style: { padding: '40px', textAlign: 'center', color: '#888' }, children: "Loading tasks..." });
    return (_jsxs("div", { style: { padding: '24px', flex: 1, overflowY: 'auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }, children: [_jsx("h1", { style: { fontSize: '22px', fontWeight: 700 }, children: "Tasks & Automation" }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsxs("button", { className: "os-btn", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconPlus, { className: "", style: { width: '14px', height: '14px' } }), " New Cron Job"] }), _jsxs("button", { className: "os-btn os-btn-secondary", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconPlus, { className: "", style: { width: '14px', height: '14px' } }), " New Task"] })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }, children: [_jsxs("div", { className: "os-card", style: { padding: '20px' }, children: [_jsxs("h2", { style: { fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconClock, { className: "", style: { color: '#f59e0b', width: '18px', height: '18px' } }), " Scheduled Jobs"] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [cronJobs.map(job => (_jsxs("div", { style: {
                                            padding: '12px', background: '#111', borderRadius: '8px',
                                            border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '13px', fontWeight: 600 }, children: job.name }), _jsxs("div", { style: { fontSize: '11px', color: '#888', marginTop: '2px' }, children: [job.schedule, " \u00B7 ", job.deliver] })] }), _jsx("span", { className: `os-badge os-badge-${job.status === 'active' ? 'active' : 'warning'}`, children: job.status })] }, job.id))), cronJobs.length === 0 && _jsx("div", { style: { padding: '20px', textAlign: 'center', color: '#555', fontSize: '13px' }, children: "No scheduled jobs" })] })] }), _jsxs("div", { className: "os-card", style: { padding: '20px' }, children: [_jsxs("h2", { style: { fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconLayers, { className: "", style: { color: '#8b5cf6', width: '18px', height: '18px' } }), " Task Board"] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [kanbanTasks.map(task => (_jsxs("div", { style: {
                                            padding: '12px', background: '#111', borderRadius: '8px',
                                            border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '13px', fontWeight: 600 }, children: task.title }), _jsxs("div", { style: { fontSize: '11px', color: '#888', marginTop: '2px' }, children: ["Agent: ", task.agent] })] }), _jsx("span", { className: `os-badge os-badge-${task.status === 'done' ? 'active' : task.status === 'running' ? 'warning' : 'info'}`, children: task.status })] }, task.id))), kanbanTasks.length === 0 && _jsx("div", { style: { padding: '20px', textAlign: 'center', color: '#555', fontSize: '13px' }, children: "No tasks" })] })] })] })] }));
}
// ── Page: Builds ───────────────────────────────────────────────
function BuildsPage() {
    const [builds, setBuilds] = useState([
        { id: '1', name: 'web-app', project: 'dominic-builds', status: 'success', started_at: '2026-09-28T10:00:00Z', finished_at: '2026-09-28T10:05:00Z' },
        { id: '2', name: 'api-server', project: 'dominic-builds', status: 'building', started_at: '2026-09-28T11:30:00Z' },
        { id: '3', name: 'dashboard', project: 'dark-history', status: 'pending', started_at: null },
    ]);
    const statusColors = { pending: '#888', building: '#3b82f6', success: '#22c55e', failed: '#ef4444' };
    return (_jsxs("div", { style: { padding: '24px', flex: 1, overflowY: 'auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }, children: [_jsx("h1", { style: { fontSize: '22px', fontWeight: 700 }, children: "Builds" }), _jsxs("button", { className: "os-btn", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconZap, { className: "", style: { width: '14px', height: '14px' } }), " New Build"] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }, children: builds.map(build => (_jsxs("div", { className: "os-card", style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, fontSize: '14px' }, children: build.name }), _jsx("div", { style: { fontSize: '11px', color: '#888' }, children: build.project })] }), _jsxs("span", { className: `os-badge os-badge-${build.status === 'success' ? 'active' : build.status === 'building' ? 'warning' : build.status === 'failed' ? 'danger' : 'info'}`, children: [build.status === 'building' && _jsx(IconLoader, { className: "", style: { width: '10px', height: '10px', marginRight: '4px', animation: 'spin 1s linear infinite' } }), build.status] })] }), _jsxs("div", { style: { fontSize: '12px', color: '#888', marginBottom: '12px' }, children: [build.started_at ? `Started: ${formatDate(build.started_at)}` : 'Queued', build.finished_at ? ` → Finished: ${formatDate(build.finished_at)}` : ''] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsxs("button", { className: "os-btn", style: { padding: '4px 12px', fontSize: '11px' }, children: [_jsx(IconPlay, { className: "", style: { width: '12px', height: '12px' } }), " Run"] }), _jsx("button", { className: "os-btn os-btn-secondary", style: { padding: '4px 12px', fontSize: '11px' }, children: "Logs" })] })] }, build.id))) })] }));
}
// ── Page: Projects ─────────────────────────────────────────────
function ProjectsPage() {
    const [projects] = useState([
        { id: 'dominic-builds', name: 'Dominic Builds', description: 'Build portfolio projects', folders: ['/opt/data/projects/dominic-builds'], active: true },
        { id: 'dark-history', name: 'Dark History', description: 'YouTube channel infrastructure', folders: ['/opt/data/projects/dark-history'], active: true },
        { id: 'trading-system', name: 'Trading System', description: 'Wyckoff & BTC trading bots', folders: ['/opt/data/projects/trading-system'], active: false },
    ]);
    return (_jsxs("div", { style: { padding: '24px', flex: 1, overflowY: 'auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }, children: [_jsx("h1", { style: { fontSize: '22px', fontWeight: 700 }, children: "Projects" }), _jsxs("button", { className: "os-btn", style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(IconPlus, { className: "", style: { width: '14px', height: '14px' } }), " New Project"] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }, children: projects.map(project => (_jsxs("div", { className: "os-card", style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [_jsx("div", { style: {
                                                width: '36px', height: '36px', borderRadius: '8px',
                                                background: project.active ? '#1a1a1a' : '#0d0d0d',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '1px solid #222',
                                            }, children: _jsx(IconFolder, { className: "", style: { color: project.active ? '#3b82f6' : '#555', width: '18px', height: '18px' } }) }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, fontSize: '14px' }, children: project.name }), _jsxs("div", { style: { fontSize: '11px', color: '#888' }, children: [project.folders.length, " folder(s)"] })] })] }), _jsx("span", { className: `os-badge ${project.active ? 'os-badge-active' : 'os-badge-info'}`, children: project.active ? 'Active' : 'Parked' })] }), _jsx("div", { style: { fontSize: '13px', color: '#888', marginBottom: '16px' }, children: project.description }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { className: "os-btn", style: { padding: '4px 12px', fontSize: '11px' }, children: "Open" }), _jsx("button", { className: "os-btn os-btn-secondary", style: { padding: '4px 12px', fontSize: '11px' }, children: "Configure" }), _jsx("button", { className: "os-btn os-btn-secondary", style: { padding: '4px 12px', fontSize: '11px' }, children: "Build" })] })] }, project.id))) })] }));
}
// ── Page: System ───────────────────────────────────────────────
function SystemPage() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.getStatus().then(s => { setStatus(s); setLoading(false); }).catch(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("div", { style: { padding: '40px', textAlign: 'center', color: '#888' }, children: "Loading system info..." });
    return (_jsxs("div", { style: { padding: '24px', flex: 1, overflowY: 'auto' }, children: [_jsx("h1", { style: { fontSize: '22px', fontWeight: 700, marginBottom: '24px' }, children: "System" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }, children: [_jsxs("div", { className: "os-card", style: { padding: '20px' }, children: [_jsx("h2", { style: { fontSize: '16px', fontWeight: 600, marginBottom: '16px' }, children: "System Info" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: [
                                    ['Version', `v${status?.version || '—'}`],
                                    ['Release Date', status?.release_date || '—'],
                                    ['Config Version', `${status?.config_version || '—'}`],
                                    ['Gateway State', status?.gateway_state || '—'],
                                    ['Gateway Platforms', status?.gateway_platforms ? Object.keys(status.gateway_platforms).length : 0],
                                    ['Active Profiles', status?.profiles?.length || 0],
                                    ['Active Sessions', status?.active_sessions || 0],
                                    ['Memory Pressure', status?.memory_pressure || 'OK'],
                                    ['Disk Free', `${Math.floor((status?.disk_free_mb || 0) / 1024)}GB`],
                                    ['Disk Total', `${Math.floor((status?.system_total_mb || 0) / 1024)}GB`],
                                    ['Can Update', status?.can_update_hermes ? 'Yes' : 'Current'],
                                    ['Install ID', status?.install_id || '—'],
                                ].map(([label, value]) => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }, children: [_jsx("span", { style: { fontSize: '13px', color: '#888' }, children: label }), _jsx("span", { style: { fontSize: '13px', fontWeight: 600 }, children: String(value) })] }, label))) })] }), _jsxs("div", { className: "os-card", style: { padding: '20px' }, children: [_jsx("h2", { style: { fontSize: '16px', fontWeight: 600, marginBottom: '16px' }, children: "Quick Commands" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [
                                    { label: 'Restart Gateway', icon: IconServer, action: () => window.location.reload() },
                                    { label: 'Check Updates', icon: IconArrowUp, action: () => { } },
                                    { label: 'Run hermes doctor', icon: IconWrench, action: () => { } },
                                    { label: 'View Logs', icon: IconFileText, action: () => { } },
                                    { label: 'Backup Hermes', icon: IconDownload, action: () => { } },
                                    { label: 'Spawn Agent', icon: IconTerminal, action: () => { } },
                                ].map(({ label, icon: Icon, action }) => (_jsxs("button", { onClick: action, style: {
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 14px', background: '#111', border: '1px solid #222',
                                        borderRadius: '6px', color: '#e5e5e5', cursor: 'pointer', fontSize: '13px',
                                        textAlign: 'left', width: '100%',
                                    }, children: [_jsx(Icon, { className: "", style: { color: '#3b82f6', width: '16px', height: '16px' } }), label] }, label))) })] })] })] }));
}
// ── Main App Component ─────────────────────────────────────────
export function App() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [status, setStatus] = useState(null);
    useEffect(() => {
        api.getStatus().then(s => setStatus(s)).catch(() => { });
        const interval = setInterval(() => {
            api.getStatus().then(s => setStatus(s)).catch(() => { });
        }, 30000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { style: { display: 'flex', height: '100vh', overflow: 'hidden' }, children: [_jsx(Sidebar, { collapsed: sidebarCollapsed, onToggle: () => setSidebarCollapsed(!sidebarCollapsed) }), _jsxs("main", { style: {
                    marginLeft: sidebarCollapsed ? '64px' : '220px',
                    flex: 1,
                    background: '#0a0a0a',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    transition: 'margin-left 0.2s ease',
                }, children: [_jsxs("header", { style: {
                            height: '56px', borderBottom: '1px solid #222',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0 24px', background: '#0d0d0d', flexShrink: 0,
                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsx("h1", { style: { fontSize: '16px', fontWeight: 700 }, children: "Harness OS" }), _jsx("span", { className: "os-badge os-badge-active", children: status?.gateway_running ? 'Online' : 'Offline' })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#888' }, children: [_jsxs("span", { children: ["v", status?.version || '—'] }), _jsx("span", { style: { color: '#333' }, children: "|" }), _jsx("span", { children: "Hermes" })] })] }), _jsx(Suspense, { fallback: _jsx("div", { style: { padding: '40px', textAlign: 'center', color: '#888' }, children: "Loading..." }), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/agents", element: _jsx(AgentsPage, {}) }), _jsx(Route, { path: "/tasks", element: _jsx(TasksPage, {}) }), _jsx(Route, { path: "/builds", element: _jsx(BuildsPage, {}) }), _jsx(Route, { path: "/projects", element: _jsx(ProjectsPage, {}) }), _jsx(Route, { path: "/system", element: _jsx(SystemPage, {}) })] }) })] })] }));
}
