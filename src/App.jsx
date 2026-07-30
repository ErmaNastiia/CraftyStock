import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { StateProvider } from "./StateContext";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import ImportPrompt from "./components/ImportPrompt";
import Login from "./pages/Login";
import Threads from "./pages/Threads";
import ThreadDetail from "./pages/ThreadDetail";
import Beads from "./pages/Beads";
import BeadDetail from "./pages/BeadDetail";
import Converter from "./pages/Converter";
import Storage from "./pages/Storage";
import Settings from "./pages/Settings";
import { IconThread } from "./components/ui/icons";

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

function Gate() {
  const { user, initializing, firebaseReady } = useAuth();

  if (!firebaseReady) return <Login />;

  if (initializing) {
    return (
      <div className="boot-screen">
        <IconThread size={26} strokeWidth={1.6} className="boot-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <StateProvider uid={user.uid}>
      <div style={{ height: "100vh", overflow: "hidden", display: "flex" }}>
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/threads" replace />} />
            <Route path="/login" element={<Navigate to="/threads" replace />} />
            <Route path="/threads" element={<Threads />} />
            <Route path="/threads/:id" element={<ThreadDetail />} />
            <Route path="/beads" element={<Beads />} />
            <Route path="/beads/:id" element={<BeadDetail />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/color" element={<Navigate to="/converter" replace />} />
            <Route path="/storage" element={<Storage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/threads" replace />} />
          </Routes>
        </div>
      </div>
      <Toast />
      <ImportPrompt />
    </StateProvider>
  );
}
