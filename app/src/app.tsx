import React from "react";
import "./style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login"

function App() {
  return (
    <Router>
      <Login></Login>
    </Router>
  );
}

export default App;
