import React from "react";
import Board from "./components/Board";
import "./styles.css";

function App() {
  return (
    <div>

      <h1 className="app-title">
        Realtime Collaborative Kanban Board
      </h1>

      <Board />

    </div>
  );
}

export default App;