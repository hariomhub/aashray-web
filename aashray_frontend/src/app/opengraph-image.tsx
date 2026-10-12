import { ImageResponse } from "next/og";

export const alt = "Aashray Infotech - AI Products for a Safer Digital Planet";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #071E3D 0%, #0B2B55 60%, #1A4278 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "16px",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "36px",
              color: "#0B2B55",
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              Aashray Infotech
            </span>
            <span
              style={{
                fontSize: "18px",
                color: "#38BDF8",
                fontWeight: 600,
              }}
            >
              AI Products for a Safer Digital Planet
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#FFFFFF",
              letterSpacing: "-1px",
            }}
          >
            On-Premise AI Compliance & DPDP Act Readiness
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#CBD5E1",
              lineHeight: 1.4,
            }}
          >
            0 bytes leave your network. Automated privacy assessments, invisible
            watermarking, TPRM & DPO solutions.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              padding: "10px 24px",
              borderRadius: "999px",
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              color: "#38BDF8",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            DPDP Act 2023 Ready
          </div>
          <div
            style={{
              padding: "10px 24px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#F1F5F9",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            100% On-Premise AI
          </div>
          <div
            style={{
              padding: "10px 24px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#F1F5F9",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Designed & Engineered in India
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
