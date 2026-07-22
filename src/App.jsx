import { Navigate, Route, Routes } from 'react-router-dom';
import { StateProvider } from './StateContext';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Threads from './pages/Threads';
import ThreadDetail from './pages/ThreadDetail';
import Beads from './pages/Beads';
import BeadDetail from './pages/BeadDetail';
import Converter from './pages/Converter';
import ColorMatch from './pages/ColorMatch';
import Storage from './pages/Storage';
import Settings from './pages/Settings';

export default function App() {
  return (
    <StateProvider>
      <div style={{ height: '100vh', overflow: 'hidden', display: 'flex' }}>
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/threads" replace />} />
            <Route path="/threads" element={<Threads />} />
            <Route path="/threads/:id" element={<ThreadDetail />} />
            <Route path="/beads" element={<Beads />} />
            <Route path="/beads/:id" element={<BeadDetail />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/color" element={<ColorMatch />} />
            <Route path="/storage" element={<Storage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/threads" replace />} />
          </Routes>
        </div>
      </div>
      <Toast />
    </StateProvider>
  );
}
