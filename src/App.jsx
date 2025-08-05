import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import HomePage from "@/pages/HomePage";
import CreateStoryPage from "@/pages/CreateStoryPage";
import StoriesPage from "@/pages/StoriesPage";
import SettingsPage from "@/pages/SettingsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-background to-surface">
        <Header />
        
        <main className="flex-1">
          <Routes>
<Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateStoryPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;