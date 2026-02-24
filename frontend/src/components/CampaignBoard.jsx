import { useState } from "react";

export default function CampaignBoard({ content, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      marginTop: 24, padding: 24,
      background: "white", borderRadius: 10,
      border: "1px solid #e8e8e8",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16
      }}>
        <span style={{ fontWeight: 600, fontSize: 16 }}>🎯 Your Campaign</span>
        {!loading && (
          <button
            onClick={handleCopy}
            style={{
              padding: "6px 14px", fontSize: 14,
              border: "1px solid #ddd", borderRadius: 6,
              cursor: "pointer", background: copied ? "#e8f5e9" : "white",
              color: copied ? "#2e7d32" : "#333"
            }}
          >
            {copied ? "✅ Copied!" : "📋 Copy All"}
          </button>
        )}
      </div>

      <pre style={{
        whiteSpace: "pre-wrap",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 15, lineHeight: 1.7, margin: 0
      }}>
        {content}
        {loading && (
          <span style={{
            display: "inline-block", width: 2, height: "1em",
            background: "#4285f4", marginLeft: 2,
            animation: "blink 1s step-end infinite",
            verticalAlign: "text-bottom"
          }} />
        )}
      </pre>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}