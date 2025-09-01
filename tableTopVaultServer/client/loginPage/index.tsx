import { createRoot } from "react-dom/client";
import "../public/css/share.css";
import "./src/css/index.css";
import Main from "./src/Main";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<Main />);
}
