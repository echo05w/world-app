// 1) imports
import express from "express";
import cors from "cors";

// 2) create app
const app = express();
const PORT = process.env.PORT || 3000;

// 3) middleware
app.use(cors());
app.use(express.json());

// 4) routes
app.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get("/countries", async (req, res) => {
  try {
    const { fields, region } = req.query;

    // Build upstream URL: only add ?fields=... if user provided it
    const upstreamUrl = fields
      ? `https://restcountries.com/v3.1/all?fields=${encodeURIComponent(fields)}`
      : `https://restcountries.com/v3.1/all`;

    const response = await fetch(upstreamUrl);
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: true, message: text });
    }

    const raw = await response.json();

    // If fields not provided, shape a minimal, consistent response
    const base = fields
      ? raw
      : raw.map((c) => ({
          name: c?.name?.common,
          cca2: c?.cca2,
          region: c?.region,
          flags: c?.flags,
          flagPng: c?.flags?.png,
        }));

    // Optional region filter (?region=Asia)
    const filtered = region ? base.filter((c) => c?.region === region) : base;

    res.json(filtered);
  } catch (e) {
    console.error("Countries error:", e);
    res.status(500).json({ error: true, message: e.message });
  }
});

// 5) start server
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
