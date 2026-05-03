import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";

export default function Home() {
  return (
    <MobileLayout>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100svh",
          paddingBottom: "80px",
          gap: "12px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Social Hub
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          Foundation ready. Halaman segera dibuat.
        </p>
      </main>

      <BottomNav chatUnread />
    </MobileLayout>
  );
}
