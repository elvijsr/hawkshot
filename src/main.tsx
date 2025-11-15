  import React from "react";
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "@fontsource/zalando-sans-expanded/600.css";
  import "./styles/globals.css";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  