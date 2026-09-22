import { useState, useEffect } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { EmployeesPage } from "./features/employees/pages/EmployeesPage";
import { DevicesPage } from "./features/devices/pages/DevicesPage";
import { TOKEN_STORAGE_KEY } from "./api/client";
import "./App.css";

type ActiveTab = "employees" | "devices";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem(TOKEN_STORAGE_KEY);
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("employees");
  const [isExpiredSession, setIsExpiredSession] = useState<boolean>(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      setIsAuthenticated(false);
      setIsExpiredSession(true);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsExpiredSession(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setIsAuthenticated(false);
    setIsExpiredSession(false);
  };

  const currentUsername = (() => {
    try {
      const raw = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (!raw) return "admin";
      const parsed = JSON.parse(raw);
      return parsed.username || "admin";
    } catch {
      return "admin";
    }
  })();

  return (
    <>
      {isAuthenticated && (
        <header
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--code-bg)",
            padding: "10px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🐇</span>
              <strong style={{ fontSize: "16px", color: "var(--text-h)" }}>
                GoodRabbit
              </strong>
            </div>

            {/* Barra de pestañas de navegación */}
            <nav style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("employees")}
                style={{
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: activeTab === "employees" ? 600 : 400,
                  background:
                    activeTab === "employees" ? "var(--bg)" : "transparent",
                  color:
                    activeTab === "employees" ? "var(--text-h)" : "var(--text)",
                  border:
                    activeTab === "employees"
                      ? "1px solid var(--border)"
                      : "1px solid transparent",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                👥 Empleados
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("devices")}
                style={{
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: activeTab === "devices" ? 600 : 400,
                  background:
                    activeTab === "devices" ? "var(--bg)" : "transparent",
                  color:
                    activeTab === "devices" ? "var(--text-h)" : "var(--text)",
                  border:
                    activeTab === "devices"
                      ? "1px solid var(--border)"
                      : "1px solid transparent",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                📟 Dispositivos
              </button>
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text)" }}>
              Usuario:{" "}
              <strong style={{ color: "var(--text-h)" }}>
                {currentUsername}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </header>
      )}

      <section
        id="center"
        style={{ padding: isAuthenticated ? "16px 0" : undefined }}
      >
        {!isAuthenticated ? (
          <>
            <div className="hero">
              <img
                src={heroImg}
                className="base"
                width="170"
                height="179"
                alt=""
              />
              <img src={reactLogo} className="framework" alt="React logo" />
              <img src={viteLogo} className="vite" alt="Vite logo" />
            </div>

            <LoginPage
              onSuccess={handleLoginSuccess}
              isExpired={isExpiredSession}
            />
          </>
        ) : activeTab === "employees" ? (
          <EmployeesPage onLogout={handleLogout} />
        ) : (
          <DevicesPage />
        )}
      </section>

      <div className="ticks"></div>
    </>
  );
}

export default App;
