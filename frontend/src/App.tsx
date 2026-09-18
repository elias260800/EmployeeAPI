import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { EmployeesPage } from "./features/employees/pages/EmployeesPage";
import { TOKEN_STORAGE_KEY } from "./api/client";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem(TOKEN_STORAGE_KEY);
  });

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        {isAuthenticated ? (
          <EmployeesPage onLogout={handleLogout} />
        ) : (
          <LoginPage onSuccess={() => setIsAuthenticated(true)} />
        )}
      </section>

      <div className="ticks"></div>
    </>
  );
}

export default App;
