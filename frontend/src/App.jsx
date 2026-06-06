// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth.jsx";
import AppLayout from "./components/AppLayout.jsx";

import Login       from "./pages/Login.jsx";
import Register    from "./pages/Register.jsx";
import Dashboard   from "./pages/Dashboard.jsx";
import Home        from "./pages/Home.jsx";
import Upload      from "./pages/Upload.jsx";
import Search      from "./pages/Search.jsx";
import Processing  from "./pages/Processing.jsx";
import DocumentView from "./pages/DocumentView.jsx";

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AppLayout>                                {/* ← wraps everything */}
        <Routes>

          {/* Public Routes */}
          <Route path="/"         element={<Home/>} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          

          {/* Protected Routes */}
          <Route path="/dashboard"      element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/home"           element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/upload"         element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/search"         element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path="/processing/:jobId" element={<PrivateRoute><Processing /></PrivateRoute>} />
          <Route path="/document/:id"   element={<PrivateRoute><DocumentView /></PrivateRoute>} />

        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;