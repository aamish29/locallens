import { useState } from "react";
import CampaignInput from "./components/CampaignInput";
import CampaignBoard from "./components/CampaignBoard";
import ContextBadge from "./components/ContextBadge";
import "./App.css";

export default function App() {
  const [campaign, setCampaign] = useState("");
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = (description) => {
    setCampaign("");
    setContext(null);
    setError(null);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const wsUrl = import.meta.env.VITE_BACKEND_WS_URL;
        const ws = new WebSocket(`${wsUrl}/api/campaign/stream`);

        ws.onopen = () => {
          ws.send(JSON.stringify({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            description
          }));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "context") {
            setContext(data.content);
          } else if (data.type === "text") {
            setCampaign(prev => prev + data.content);
          } else if (data.type === "done") {
            setLoading(false);
            ws.close();
          } else if (data.type === "error") {
            setError(data.content);
            setLoading(false);
            ws.close();
          }
        };

        ws.onerror = () => {
          setError("Connection failed. Is the backend running?");
          setLoading(false);
        };
      },
      () => {
        setError("Location access denied. Please enable location in your browser and try again.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="app-container">
      <header>
        <h1>🔍 LocalLens</h1>
        <p className="subtitle">
          Hyperlocal marketing campaigns, generated for this exact moment.
        </p>
      </header>

      <CampaignInput onGenerate={handleGenerate} loading={loading} />

      {error && (
        <div className="error-banner">⚠️ {error}</div>
      )}

      {context && <ContextBadge context={context} />}
      {campaign && <CampaignBoard content={campaign} loading={loading} />}
    </div>
  );
}