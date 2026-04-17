"use client";
import { useEffect, useState } from "react";
import { Globe, Check, X, Star, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { C } from "@/constants/colors";
import CustomModal, { useModal } from "@/components/ui/CustomModal";

type PortalProperty = {
  id: number;
  name: string;
  type: string;
  city: string;
  state: string;
  source: string;
  portalApproved: boolean;
  portalActive: boolean;
  portalFeatured: boolean;
  tenantName: string;
};

type FormData = {
  name: string;
  type: string;
  city: string;
  state: string;
  country: string;
  description: string;
  price: number;
  oldPrice: number;
  score: number;
  scoreLabel: string;
  reviews: number;
  giftback: number;
  superhost: boolean;
  verified: boolean;
  images: string;
  amenities: string;
};

const EMPTY_FORM: FormData = {
  name: "", type: "Pousada", city: "capitolio", state: "MG", country: "Brasil",
  description: "", price: 0, oldPrice: 0, score: 0, scoreLabel: "Novo",
  reviews: 0, giftback: 0, superhost: false, verified: false,
  images: "", amenities: "",
};

const PROPERTY_TYPES = ["Pousada", "Hotel", "Chalé", "Casa", "Flat", "Resort"];
const CITIES = [
  { value: "capitolio", label: "Capitólio" },
  { value: "gramado", label: "Gramado" },
  { value: "bonito", label: "Bonito" },
  { value: "tiradentes", label: "Tiradentes" },
  { value: "monte-verde", label: "Monte Verde" },
  { value: "campos-do-jordao", label: "Campos do Jordão" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)",
  color: C.white, fontSize: 14, outline: "none",
};
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: C.g300, marginBottom: 4, display: "block" };
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none" as const };

export default function PortalPage() {
  const [properties, setProperties] = useState<PortalProperty[]>([]);
  const [tab, setTab] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const { modal, showAlert, showConfirm, closeModal } = useModal();

  function load() {
    const params = new URLSearchParams();
    if (tab) params.set("status", tab);
    if (sourceFilter) params.set("source", sourceFilter);
    const qs = params.toString();
    fetch(`/api/admin/portal${qs ? `?${qs}` : ""}`).then((r) => r.json()).then(setProperties);
  }

  useEffect(() => { load(); }, [tab, sourceFilter]);

  async function handleUpdate(id: number, data: Record<string, boolean>) {
    await fetch(`/api/admin/portal/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  async function openEdit(id: number) {
    const res = await fetch(`/api/admin/portal/${id}`);
    if (!res.ok) return;
    const p = await res.json();
    setEditingId(id);
    setForm({
      name: p.name || "",
      type: p.type || "Pousada",
      city: p.city || "",
      state: p.state || "MG",
      country: p.country || "Brasil",
      description: p.description || "",
      price: p.price || 0,
      oldPrice: p.oldPrice || 0,
      score: p.score || 0,
      scoreLabel: p.scoreLabel || "Novo",
      reviews: p.reviews || 0,
      giftback: p.giftback || 0,
      superhost: p.superhost || false,
      verified: p.verified || false,
      images: typeof p.images === "string" ? p.images : JSON.stringify(p.images || []),
      amenities: typeof p.amenities === "string" ? p.amenities : JSON.stringify(p.amenities || []),
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return showAlert("error", "Erro", "Nome é obrigatório");
    if (!form.city.trim()) return showAlert("error", "Erro", "Cidade é obrigatória");

    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice) || null,
      score: Number(form.score),
      reviews: Number(form.reviews),
      giftback: Number(form.giftback),
    };

    const url = editingId ? `/api/admin/portal/${editingId}` : "/api/admin/portal";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      showAlert("success", "Sucesso", editingId ? "Propriedade atualizada!" : "Propriedade criada!");
      setShowForm(false);
      load();
    } else {
      const err = await res.json();
      showAlert("error", "Erro", err.error || "Falha ao salvar");
    }
  }

  function handleDelete(id: number, name: string) {
    showConfirm("Excluir propriedade", `Deseja excluir "${name}"? Esta ação não pode ser desfeita.`, async () => {
      closeModal();
      const res = await fetch(`/api/admin/portal/${id}`, { method: "DELETE" });
      if (res.ok) {
        showAlert("success", "Excluída", "Propriedade removida com sucesso");
        load();
      } else {
        const err = await res.json();
        showAlert("error", "Erro", err.error || "Falha ao excluir");
      }
    });
  }

  function updateForm(key: keyof FormData, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const tabs = [
    { value: "", label: "Todas" },
    { value: "approved", label: "Aprovadas" },
    { value: "pending", label: "Pendentes" },
    { value: "rejected", label: "Rejeitadas" },
  ];

  const sourceTabs = [
    { value: "", label: "Todas origens" },
    { value: "pms", label: "PMS" },
    { value: "portal", label: "Portal" },
  ];

  if (showForm) {
    return (
      <div>
        <button onClick={() => setShowForm(false)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.g400, cursor: "pointer", fontSize: 13, marginBottom: 16 }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 24 }}>
          {editingId ? "Editar Propriedade" : "Nova Propriedade (Portal)"}
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 800 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Nome *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Nome da propriedade" />
          </div>
          <div>
            <label style={labelStyle}>Tipo</label>
            <select style={selectStyle} value={form.type} onChange={(e) => updateForm("type", e.target.value)}>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Cidade *</label>
            <select style={selectStyle} value={form.city} onChange={(e) => updateForm("city", e.target.value)}>
              {CITIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Estado</label>
            <input style={inputStyle} value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>País</label>
            <input style={inputStyle} value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Preço (R$)</label>
            <input type="number" style={inputStyle} value={form.price} onChange={(e) => updateForm("price", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Preço antigo (R$)</label>
            <input type="number" style={inputStyle} value={form.oldPrice} onChange={(e) => updateForm("oldPrice", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Nota (0-10)</label>
            <input type="number" step="0.1" min="0" max="10" style={inputStyle} value={form.score} onChange={(e) => updateForm("score", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Classificação</label>
            <select style={selectStyle} value={form.scoreLabel} onChange={(e) => updateForm("scoreLabel", e.target.value)}>
              {["Novo", "Bom", "Muito bom", "Ótimo", "Excelente", "Excepcional"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Avaliações</label>
            <input type="number" style={inputStyle} value={form.reviews} onChange={(e) => updateForm("reviews", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Giftback (%)</label>
            <input type="number" style={inputStyle} value={form.giftback} onChange={(e) => updateForm("giftback", e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", gridColumn: "1 / -1" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: C.g300, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={form.superhost} onChange={(e) => updateForm("superhost", e.target.checked)} /> Superhost
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: C.g300, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={form.verified} onChange={(e) => updateForm("verified", e.target.checked)} /> Verificada
            </label>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Descrição</label>
            <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Descrição da propriedade..." />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Imagens (JSON array de URLs)</label>
            <textarea style={{ ...inputStyle, minHeight: 60, fontFamily: "monospace", fontSize: 12 }} value={form.images} onChange={(e) => updateForm("images", e.target.value)} placeholder='["https://...jpg", "https://...jpg"]' />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Comodidades (JSON array)</label>
            <textarea style={{ ...inputStyle, minHeight: 60, fontFamily: "monospace", fontSize: 12 }} value={form.amenities} onChange={(e) => updateForm("amenities", e.target.value)} placeholder='["Wi-Fi", "Piscina", "Estacionamento"]' />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "wait" : "pointer", background: C.gold, color: "#000" }}>
            <Check size={16} /> {saving ? "Salvando..." : editingId ? "Atualizar" : "Criar Propriedade"}
          </button>
          <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: C.g400, cursor: "pointer" }}>
            Cancelar
          </button>
        </div>

        <CustomModal show={modal.show} type={modal.type} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={closeModal} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: 0 }}>
            <Globe size={24} style={{ verticalAlign: "middle", marginRight: 8 }} />
            Propriedades
          </h1>
          <p style={{ fontSize: 14, color: C.g400, margin: "4px 0 0" }}>
            Gerencie as propriedades do portal público
          </p>
        </div>
        <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: C.gold, color: "#000" }}>
          <Plus size={16} /> Nova Propriedade
        </button>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {tabs.map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", background: tab === t.value ? "rgba(251,191,35,0.15)" : "rgba(255,255,255,0.04)", color: tab === t.value ? C.gold : C.g400 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {sourceTabs.map((s) => (
          <button key={s.value} onClick={() => setSourceFilter(s.value)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", background: sourceFilter === s.value ? "rgba(59,130,246,0.15)" : "transparent", color: sourceFilter === s.value ? "#60A5FA" : C.g500 }}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Propriedade", "Tipo", "Cidade", "Origem", "Status", "Destaque", "Ações"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: C.g500, borderBottom: "1px solid rgba(255,255,255,0.06)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "14px 16px", color: C.white, fontSize: 14, fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: "14px 16px", color: C.g400, fontSize: 13 }}>{p.type}</td>
                <td style={{ padding: "14px 16px", color: C.g400, fontSize: 13 }}>{p.city}/{p.state}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 12, background: p.source === "portal" ? "rgba(59,130,246,0.15)" : "rgba(139,92,246,0.15)", color: p.source === "portal" ? "#60A5FA" : "#A78BFA" }}>
                    {p.source === "portal" ? "Portal" : "PMS"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {p.portalApproved ? (
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#34D399", background: "rgba(16,185,129,0.15)", padding: "3px 10px", borderRadius: 20 }}>Aprovada</span>
                  ) : p.portalActive ? (
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#FBBF23", background: "rgba(251,191,35,0.15)", padding: "3px 10px", borderRadius: 20 }}>Pendente</span>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", background: "rgba(107,114,128,0.15)", padding: "3px 10px", borderRadius: 20 }}>Inativa</span>
                  )}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button onClick={() => handleUpdate(p.id, { portalFeatured: !p.portalFeatured })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <Star size={18} color={p.portalFeatured ? C.gold : C.g500} fill={p.portalFeatured ? C.gold : "none"} />
                  </button>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {!p.portalApproved && (
                      <button onClick={() => handleUpdate(p.id, { portalApproved: true, portalActive: true })} title="Aprovar" style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", background: "rgba(16,185,129,0.15)", color: "#34D399" }}>
                        <Check size={14} />
                      </button>
                    )}
                    {p.portalApproved && (
                      <button onClick={() => handleUpdate(p.id, { portalApproved: false, portalActive: false })} title="Rejeitar" style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.15)", color: "#FCA5A5" }}>
                        <X size={14} />
                      </button>
                    )}
                    {p.source === "portal" && (
                      <>
                        <button onClick={() => openEdit(p.id)} title="Editar" style={{ display: "flex", alignItems: "center", padding: "5px 10px", borderRadius: 6, fontSize: 12, border: "none", cursor: "pointer", background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} title="Excluir" style={{ display: "flex", alignItems: "center", padding: "5px 10px", borderRadius: 6, fontSize: 12, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.15)", color: "#FCA5A5" }}>
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 40, textAlign: "center", color: C.g500 }}>
                  Nenhuma propriedade encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CustomModal show={modal.show} type={modal.type} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={closeModal} />
    </div>
  );
}
