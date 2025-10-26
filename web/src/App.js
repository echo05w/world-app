import { useEffect, useState } from "react";

const API = "http://localhost:3000";

export default function App() {
  // ✅ Hooks must be inside the component:
  const [countries, setCountries] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // smaller payload from upstream
const res = await fetch(`${API}/countries?fields=name,cca2,region,flags`);

        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();
        setCountries(data);
        setStatus("ready");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }
    load();
  }, []);

  if (status === "loading") return <p>Loading…</p>;
  if (status === "error") return <p style={{ color: "red" }}>Failed to load</p>;

  // client-side filtering
  const shown = countries
    .filter((c) => (region ? c.region === region : true))
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <main style={{ padding: 16 }}>
      <h1>🌍 Countries</h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <input
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 220,
          }}
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="">All regions</option>
          <option>Africa</option>
          <option>Americas</option>
          <option>Asia</option>
          <option>Europe</option>
          <option>Oceania</option>
          <option>Antarctic</option>
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {shown.map((c) => (
          <article
            key={c.cca2}
            style={{
              background: "#fff",
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,.1)",
            }}
          >
            {c.flagPng && (
              <img
                src={c.flagPng}
                alt={c.name}
                style={{ width: "100%", borderRadius: 8 }}
              />
            )}
            <h3 style={{ margin: "8px 0" }}>{c.name}</h3>
            <small>{c.region}</small>
          </article>
        ))}
      </div>
    </main>
  );
}
