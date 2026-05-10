import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./context/UserContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </AuthProvider>
);