// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ChatStreamPage from "./pages/ChatStreamPage";
import ChatPage from "./pages/ChatPage"; // tu page sin stream

export default function App() {
  return (
    <>
      <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/" style={{ marginRight: 12 }}>Chat (normal)</Link>
        <Link to="/stream">Chat (stream)</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/stream" element={<ChatStreamPage />} />
      </Routes>
    </>
  );
}