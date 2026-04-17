"use client";
import { useEffect, useState } from "react";
import { Globe, Building2, Star, Clock } from "lucide-react";
import { C } from "@/constants/colors";

type Stats = {
  total: number;
  approved: number;
  pending: number;
  featured: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, approved: 0, pending: 0, featured: 0 });

  useEffect(() => {
    fetch("/api/admin/portal")
      .then((r) => r.json())
      .then((properties: { portalApproved: boolean; portalActive: boolean; portalFeatured: boolean }[]) => {
        setStats({
          total: properties.length,
          approved: properties.filter((p) => p.portalApproved).length,
          pending: properties.filter((p) => p.portalActive && !p.portalApproved).length,
          featured: properties.filter((p) => p.portalFeatured).length,
        });
      });
  }, []);

  const cards = [
    { label: "Total Propriedades", value: stats.total, icon: Building2, color: "#60A5FA" },
    { label: "Aprovadas", value: stats.approved, icon: Globe, color: "#34D399" },
    { label: "Pendentes", value: stats.pending, icon: Clock, color: "#FBBF23" },
    { label: "Destaques", value: stats.featured, icon: Star, color: "#F472B6" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: C.g400, margin: "4px 0 0" }}>Visão geral do portal público</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: C.g400, fontWeight: 500 }}>{card.label}</span>
              <card.icon size={20} color={card.color} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.white }}>{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
