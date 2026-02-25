import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { checkIn } from "../Api";

export default function CheckIn() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      rememberLastUsedCamera: false,
      videoConstraints: {
        facingMode: "user",
      },
    });

    scanner.render(
      (decodedText) => {
        scanner.clear();
        handleCheckIn(decodedText);
      },
      () => {},
    );

    return () => scanner.clear();
  }, []);

  const handleCheckIn = async (token) => {
    setLoading(true);
    const payload = {
      user_id: "22001",
      device_id: "device-1",
      course_id: "IF101",
      session_id: "S1",
      qr_token: token,
    };

    try {
      const response = await checkIn(payload);
      setResult(response);
    } catch {
      setResult({ ok: false, error: "Gagal terhubung ke server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Injeksi CSS Global untuk merapikan elemen bawaan html5-qrcode */}
      <style>{`
        #reader { border: none !important; }
        #reader__dashboard { padding: 10px !important; }
        #reader__camera_selection { 
          width: 100%; 
          padding: 8px; 
          border-radius: 8px; 
          margin-bottom: 10px; 
          border: 1px solid #ddd;
        }
        #reader img { display: none; } /* Sembunyikan icon sampah */
        #reader video { 
          border-radius: 12px !important; 
          object-fit: cover !important;
          transform: scaleX(-1); /* Efek Mirror untuk Kamera Depan */
        }
        button { cursor: pointer; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Presensi Digital</h2>
          <p style={styles.subtitle}>Gunakan kamera depan untuk scan</p>
        </div>

        <div style={styles.scannerWrapper}>
          <div id="reader" style={styles.scanner}></div>
        </div>

        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner}></div>
            <p>Memproses...</p>
          </div>
        )}

        {result && (
          <div
            style={{
              ...styles.resultBox,
              backgroundColor: result.ok ? "#ecfdf5" : "#fef2f2",
              borderColor: result.ok ? "#10b981" : "#ef4444",
            }}
          >
            <div style={styles.resultIcon}>{result.ok ? "✅" : "❌"}</div>
            <div style={styles.resultText}>
              <strong style={{ display: "block", fontSize: "1.1rem" }}>
                {result.ok ? "Berhasil!" : "Gagal!"}
              </strong>
              <span style={styles.resultDetail}>
                {result.ok ? `ID: ${result.data.presence_id}` : result.error}
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={styles.retryButton}
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    padding: "20px",
    paddingTop: "40px",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "28px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
  },
  header: { marginBottom: "20px" },
  title: { margin: 0, fontSize: "1.4rem", color: "#111827", fontWeight: "800" },
  subtitle: { margin: "4px 0 0", fontSize: "0.85rem", color: "#6b7280" },
  scannerWrapper: {
    overflow: "hidden",
    borderRadius: "20px",
    backgroundColor: "#000", // Background hitam saat kamera loading
    aspectRatio: "1 / 1",
    position: "relative",
  },
  scanner: { width: "100%" },
  loadingOverlay: { marginTop: "20px", color: "#4f46e5" },
  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
    margin: "0 auto 8px",
    animation: "spin 0.8s linear infinite",
  },
  resultBox: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "18px",
    border: "2px solid",
    textAlign: "center",
  },
  resultIcon: { fontSize: "2rem", marginBottom: "8px" },
  resultText: { marginBottom: "12px" },
  resultDetail: { fontSize: "0.85rem", opacity: 0.8 },
  retryButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#1f2937",
    color: "#fff",
    fontWeight: "700",
    fontSize: "0.9rem",
  },
};
