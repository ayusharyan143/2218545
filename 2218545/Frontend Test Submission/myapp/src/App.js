// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <h2>URL Shortener</h2>
        <nav>
          <Link to="/">Shorten URLs</Link> | <Link to="/stats">View Stats</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
