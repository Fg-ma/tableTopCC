import { createRoot } from "react-dom/client";
import Main from "./src/Main";
import "../public/css/share.css";
import "./src/css/index.css";

const root = document.getElementById("root");
if (root) createRoot(root).render(<Main />);
