"use client";
import { useState } from "react";
import { LogIn, Eye, EyeOff, Shield } from "lucide-react";
import { C, Admin } from "@/constants/colors";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Erro de conexão");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${Admin.darker} 0%, ${C.dark} 50%, #0A1628 100%)`,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 40,
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Shield size={28} color={C.dark} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, margin: 0 }}>
            Hospeda Bem
          </h1>
          <p style={{ fontSize: 14, color: C.g400, marginTop: 4 }}>
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.g400, marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hospedabem.com"
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                fontSize: 14,
                color: C.white,
                background: "rgba(255,255,255,0.06)",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.gold)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.g400, marginBottom: 6 }}>
              Senha
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "10px 42px 10px 14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: C.white,
                  background: "rgba(255,255,255,0.06)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.gold)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: C.g400,
                }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(220,38,38,0.15)",
                border: "1px solid rgba(220,38,38,0.3)",
                borderRadius: 8,
                color: "#FCA5A5",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 0",
              background: loading ? C.g700 : `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
              color: loading ? C.g400 : C.dark,
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <LogIn size={18} />
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
