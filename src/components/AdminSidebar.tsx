"use client";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Globe, Settings, LogOut, Shield,
} from "lucide-react";
import { C, Admin } from "@/constants/colors";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/portal", label: "Propriedades", icon: Globe },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin-login";
  }

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: Admin.darker,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={20} color={C.dark} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>Hospeda Bem</div>
          <div style={{ fontSize: 11, color: C.g500 }}>Admin Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <a
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? C.gold : C.g400,
                background: active ? "rgba(251,191,35,0.08)" : "transparent",
                textDecoration: "none",
                marginBottom: 4,
                transition: "all 0.15s",
              }}
            >
              <Icon size={18} />
              {label}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 14,
            color: C.g400,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
