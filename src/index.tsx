import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./components/App/App";
import { RoomProvider } from "./context/RoomContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RoomProvider>
        <App />
      </RoomProvider>
    </BrowserRouter>
  </React.StrictMode>
);
