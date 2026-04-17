import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080F1C" }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: "32px 40px" }}>
        {children}
      </main>
    </div>
  );
}
