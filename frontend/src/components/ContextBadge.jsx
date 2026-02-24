export default function ContextBadge({ context }) {
  const { weather, nearby_places } = context;
  return (
    <div style={{
      marginTop: 24, padding: 16,
      background: "#f0f7ff", borderRadius: 10,
      border: "1px solid #c8deff"
    }}>
      <p style={{ fontWeight: 600, marginBottom: 8 }}>📍 LocalLens detected your context</p>
      <p style={{ margin: "0 0 4px", fontSize: 15 }}>
        🌦️ {weather.condition}, {weather.temp_c}°C
        {weather.is_raining ? " · Raining right now" : ""}
      </p>
      {nearby_places.length > 0 && (
        <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
          🏘️ Nearby: {nearby_places.map(p => p.name).join(" · ")}
        </p>
      )}
    </div>
  );
}