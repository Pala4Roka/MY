import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ObjectDetailPage from "@/pages/ObjectDetailPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/object/:objectId" element={<ObjectDetailPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
