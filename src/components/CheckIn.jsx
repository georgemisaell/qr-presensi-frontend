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
      // Menambahkan konfigurasi kamera depan
      videoConstraints: {
        facingMode: "user", // "user" untuk kamera depan, "environment" untuk kamera belakang
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
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Presensi Digital</h2>
          <p style={styles.subtitle}>Arahkan kamera ke QR Code</p>
        </div>

        {/* Scanner Container */}
        <div style={styles.scannerWrapper}>
          <div id="reader" style={styles.scanner}></div>
        </div>

        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner}></div>
            <p>Memverifikasi data...</p>
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
              <strong>
                {result.ok ? "Presensi Berhasil" : "Presensi Gagal"}
              </strong>
              <p style={styles.resultDetail}>
                {result.ok ? `ID: ${result.data.presence_id}` : result.error}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={styles.retryButton}
            >
              Scan Ulang
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
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    color: "#1f2937",
    fontWeight: "700",
  },
  subtitle: {
    margin: "5px 0 0",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  scannerWrapper: {
    overflow: "hidden",
    borderRadius: "16px",
    border: "2px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  scanner: {
    width: "100%",
  },
  loadingOverlay: {
    marginTop: "20px",
    color: "#4f46e5",
    fontWeight: "600",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
    margin: "0 auto 10px",
    animation: "spin 1s linear infinite",
  },
  resultBox: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  resultIcon: {
    fontSize: "2rem",
  },
  resultText: {
    color: "#111827",
  },
  resultDetail: {
    margin: "5px 0 0",
    fontSize: "0.85rem",
    opacity: 0.8,
  },
  retryButton: {
    marginTop: "10px",
    padding: "10px 20px",
    borderRadius: "12px",
    border: "none",
    background: "#1f2937",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
};
