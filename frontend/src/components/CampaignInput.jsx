import { useState } from "react";

export default function CampaignInput({ onGenerate, loading }) {
  const [description, setDescription] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.metaKey) onGenerate(description);
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <textarea
        rows={4}
        style={{
          width: "100%", padding: 16, fontSize: 16,
          borderRadius: 10, border: "1px solid #ddd",
          resize: "vertical", outline: "none",
          fontFamily: "inherit", lineHeight: 1.5
        }}
        placeholder={`Describe your business and what you want to promote today...\n\ne.g. "Coffee shop on Main St, want to push our lavender latte this morning"`}
        value={description}
        onChange={e => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
        Tip: Press Cmd + Enter to generate
      </p>
      <button
        onClick={() => onGenerate(description)}
        disabled={loading || !description.trim()}
        style={{
          marginTop: 10, padding: "14px 0", fontSize: 16,
          fontWeight: 600,
          background: loading || !description.trim() ? "#ccc" : "#4285f4",
          color: "white", border: "none", borderRadius: 10,
          cursor: loading || !description.trim() ? "not-allowed" : "pointer",
          width: "100%", transition: "background 0.2s"
        }}
      >
        {loading ? "⏳ Generating your campaign..." : "✨ Generate My Campaign"}
      </button>
    </div>
  );
}