import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { StateProvider } from "./StateContext";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import ImportPrompt from "./components/ImportPrompt";
import Login from "./pages/Login";
import { IconThread } from "./components/ui/icons";

// Lazy-loaded on purpose: these pages (and only these) pull in
// catalogData.js + the DMC↔Gamma mapping JSON, ~350KB of static reference
// data that never changes. Splitting them into their own chunk means the
// login screen loads without waiting for any of it — the catalog chunk only
// downloads once someone actually signs in and lands on a page that needs it.
const Threads = lazy(() => import("./pages/Threads"));
const ThreadDetail = lazy(() => import("./pages/ThreadDetail"));
const Beads = lazy(() => import("./pages/Beads"));
const BeadDetail = lazy(() => import("./pages/BeadDetail"));
const Converter = lazy(() => import("./pages/Converter"));
const Storage = lazy(() => import("./pages/Storage"));
const Settings = lazy(() => import("./pages/Settings"));

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

function BootScreen() {
  return (
    <div className="boot-screen">
      <IconThread size={26} strokeWidth={1.6} className="boot-spin" />
    </div>
  );
}

function Gate() {
  const { user, initializing, firebaseReady } = useAuth();

  if (!firebaseReady) return <Login />;

  if (initializing) return <BootScreen />;

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
          <Suspense fallback={<BootScreen />}>
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
          </Suspense>
        </div>
      </div>
      <Toast />
      <ImportPrompt />
    </StateProvider>
  );
}
