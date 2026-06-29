import { useState, useEffect, useRef, useCallback } from "react";

const YEARS = 5;

function computeSeries(priceDecline, usageGrowth) {
  const price = [], usage = [], spend = [];
  for (let i = 0; i <= YEARS; i++) {
    const p = Math.pow(1 - priceDecline, i);
    const u = Math.pow(1 + usageGrowth, i);
    price.push(p);
    usage.push(u);
    spend.push(p * u);
  }
  return { price, usage, spend };
}

const PRESETS = [
  { name: "🔥 Today's reality",  desc: "−50% price, +200% usage → bills rise",       price: 50, usage: 200 },
  { name: "⚖️ Near equilibrium", desc: "−75% price, +100% usage → nearly flat",       price: 75, usage: 100 },
  { name: "💸 Deflationary win", desc: "−90% price, +50% usage → costs collapse",     price: 90, usage: 50  },
  { name: "🤖 Agent explosion",  desc: "−30% price, +600% usage → budgets blow",      price: 30, usage: 600 },
  { name: "🧊 Stagnation",       desc: "−50% price, flat usage → steady savings",     price: 50, usage: 0   },
];

function MiniChart({ data, color, label, sublabel, dashed, containerWidth }) {
  const canvasRef = useRef(null);

  const draw = useCallback((w) => {
    const canvas = canvasRef.current;
    if (!canvas || w <= 0) return;
    const H = 110;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = H * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, H);

    const pad = { top: 8, right: 48, bottom: 24, left: 40 };
    const cw = w - pad.left - pad.right;
    const ch = H - pad.top - pad.bottom;

    const maxV = Math.max(...data, 1.05);
    const minV = Math.min(...data, 0);
    const range = maxV - minV || 1;

    const xOf = i => pad.left + (i / YEARS) * cw;
    const yOf = v => pad.top + ch - ((v - minV) / range) * ch;

    // Grid lines (3)
    for (let g = 0; g <= 2; g++) {
      const v = minV + (g / 2) * (maxV - minV);
      const y = yOf(v);
      ctx.strokeStyle = "#1f2230";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
      ctx.fillStyle = "#555";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(v.toFixed(1) + "×", pad.left - 5, y + 3);
    }

    // Baseline at 1×
    const y1 = yOf(1);
    if (y1 >= pad.top && y1 <= pad.top + ch) {
      ctx.strokeStyle = "#2a2d3a";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(pad.left, y1); ctx.lineTo(pad.left + cw, y1); ctx.stroke();
      ctx.setLineDash([]);
    }

    // X labels
    ctx.fillStyle = "#444";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    for (let i = 0; i <= YEARS; i++) {
      ctx.fillText("Y" + i, xOf(i), H - pad.bottom + 13);
    }

    // Area fill
    ctx.beginPath();
    data.forEach((v, i) => i === 0 ? ctx.moveTo(xOf(i), yOf(v)) : ctx.lineTo(xOf(i), yOf(v)));
    ctx.lineTo(xOf(YEARS), yOf(minV));
    ctx.lineTo(xOf(0), yOf(minV));
    ctx.closePath();
    ctx.fillStyle = color + "18";
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash(dashed ? [6, 4] : []);
    data.forEach((v, i) => i === 0 ? ctx.moveTo(xOf(i), yOf(v)) : ctx.lineTo(xOf(i), yOf(v)));
    ctx.stroke();
    ctx.setLineDash([]);

    // End dot + label
    const lx = xOf(YEARS), ly = yOf(data[YEARS]);
    ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(data[YEARS].toFixed(2) + "×", lx + 7, ly + 4);
  }, [data, color, dashed]);

  useEffect(() => { if (containerWidth > 0) draw(containerWidth); }, [containerWidth, draw]);

  return (
    <div style={{ background: "#1a1d26", borderRadius: 8, padding: "10px 12px", border: "1px solid #2a2d3a" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color }}>
          <span style={{ display: "inline-block", width: 10, height: 3, background: dashed ? "transparent" : color, borderTop: dashed ? `2px dashed ${color}` : "none", borderRadius: 2, marginRight: 6, verticalAlign: "middle" }} />
          {label}
        </div>
        <div style={{ fontSize: 10, color: "#555" }}>{sublabel}</div>
      </div>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}

function Verdict({ priceDecline, usageGrowth }) {
  const { spend, price } = computeSeries(priceDecline, usageGrowth);
  const finalSpend = spend[YEARS];
  const finalPrice = price[YEARS];
  const pricePct = (finalPrice * 100).toFixed(0);

  let budgetColor = "#f0c040", budgetText;
  if (finalSpend > 1.5) {
    budgetColor = "#e05c5c";
    budgetText = `Total spend is ${finalSpend.toFixed(1)}× higher after ${YEARS} years. CFOs are screaming.`;
  } else if (finalSpend < 0.7) {
    budgetColor = "#4ecb71";
    budgetText = `Total spend falls to ${(finalSpend * 100).toFixed(0)}% of today after ${YEARS} years. Buyers win.`;
  } else {
    budgetText = `Total spend is roughly flat at ${finalSpend.toFixed(2)}× — efficiency and demand cancel out.`;
  }

  let moatText;
  if (priceDecline >= 0.6) {
    moatText = `Price drops to ${pricePct}% of today — commodity inference has no defensible margin. Providers must compete on volume, data, or vertical integration.`;
  } else if (priceDecline >= 0.3) {
    moatText = `Price drops to ${pricePct}% of today. Some margin remains, but differentiation on quality and reliability becomes critical.`;
  } else {
    moatText = `Price only falls to ${pricePct}% of today. Either efficiency gains are slow, or providers have pricing power via lock-in.`;
  }

  return (
    <div style={{ background: "#0f1117", borderRadius: 8, padding: "10px 14px", border: "1px solid #2a2d3a", fontSize: 12, lineHeight: 1.7, color: "#ccc" }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555", marginBottom: 5 }}>Verdict</div>
      <span style={{ color: budgetColor, fontWeight: 600 }}>Budget: </span>{budgetText}
      {"  "}
      <span style={{ color: "#777", fontWeight: 600 }}>Moat: </span>{moatText}
    </div>
  );
}

function DataTable({ price, usage, spend }) {
  const cols = [
    { label: "Price per token", data: price, color: "#e05c5c" },
    { label: "Token volume",    data: usage, color: "#4ea8de" },
    { label: "Total spend",     data: spend, color: "#f0c040" },
  ];
  return (
    <div style={{ background: "#1a1d26", borderRadius: 8, border: "1px solid #2a2d3a", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "#0f1117" }}>
            <th style={{ padding: "10px 14px", textAlign: "left", color: "#555", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #2a2d3a" }}>Year</th>
            {cols.map(c => (
              <th key={c.label} style={{ padding: "10px 14px", textAlign: "right", color: c.color, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #2a2d3a" }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: YEARS + 1 }, (_, i) => (
            <tr key={i} style={{ borderBottom: i < YEARS ? "1px solid #12151e" : "none" }}>
              <td style={{ padding: "9px 14px", color: "#666", fontWeight: 600 }}>Y{i}</td>
              {cols.map(c => {
                const v = c.data[i];
                const color = c.label === "Total spend"
                  ? v > 1.5 ? "#e05c5c" : v < 0.7 ? "#4ecb71" : "#f0c040"
                  : c.color;
                return (
                  <td key={c.label} style={{ padding: "9px 14px", textAlign: "right", color, fontFamily: "monospace", fontWeight: c.label === "Total spend" ? 700 : 400 }}>
                    {v.toFixed(2)}×
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [priceDecline, setPriceDecline] = useState(0.5);
  const [usageGrowth, setUsageGrowth] = useState(2.0);
  const [view, setView] = useState("charts");
  const chartColRef = useRef(null);
  const [chartW, setChartW] = useState(0);

  useEffect(() => {
    const el = chartColRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width - 32; // subtract padding
      if (w > 0) setChartW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { price, usage, spend } = computeSeries(priceDecline, usageGrowth);

  const activePreset = PRESETS.find(p =>
    p.price === Math.round(priceDecline * 100) &&
    p.usage === Math.round(usageGrowth * 100)
  );

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#e0e0e0", display: "flex", justifyContent: "center" }}>
    <div style={{ width: "100%", maxWidth: 680, padding: 20 }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 4 }}>The Token Paradox Explorer</div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>Total spend = price per token × volume. The first two are inputs; the third is the verdict.</div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 14 }}>

        {/* Controls */}
        <div style={{ background: "#1a1d26", borderRadius: 10, padding: 16, border: "1px solid #2a2d3a", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555", marginBottom: 10 }}>📉 Price per token (annual % decline)</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#bbb" }}>Rate of decline</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e05c5c" }}>−{Math.round(priceDecline * 100)}%/yr</span>
            </div>
            <input type="range" min={0} max={90} step={5} value={Math.round(priceDecline * 100)}
              onChange={e => setPriceDecline(e.target.value / 100)}
              style={{ width: "100%", accentColor: "#e05c5c" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#444", marginTop: 2 }}>
              <span>No change</span><span>−90%/yr</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555", marginBottom: 10 }}>📈 Token usage (annual % growth)</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#bbb" }}>Rate of growth</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#4ea8de" }}>+{Math.round(usageGrowth * 100)}%/yr</span>
            </div>
            <input type="range" min={0} max={1000} step={25} value={Math.round(usageGrowth * 100)}
              onChange={e => setUsageGrowth(e.target.value / 100)}
              style={{ width: "100%", accentColor: "#4ea8de" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#444", marginTop: 2 }}>
              <span>Flat</span><span>10× per year</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555", marginBottom: 8 }}>🗓 Scenarios</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {PRESETS.map(p => (
                <button key={p.name}
                  onClick={() => { setPriceDecline(p.price / 100); setUsageGrowth(p.usage / 100); }}
                  style={{
                    background: activePreset?.name === p.name ? "#1a2235" : "#12151e",
                    border: `1px solid ${activePreset?.name === p.name ? "#4ea8de" : "#2a2d3a"}`,
                    borderRadius: 6, padding: "7px 10px", cursor: "pointer", textAlign: "left", color: "inherit"
                  }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#ddd" }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Charts / Table column */}
        <div ref={chartColRef} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["charts", "table"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "5px 12px", borderRadius: 5, cursor: "pointer",
                border: `1px solid ${view === v ? "#4ea8de" : "#2a2d3a"}`,
                background: view === v ? "#1a2235" : "#12151e",
                color: view === v ? "#4ea8de" : "#555",
                fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                {v === "charts" ? "▲ Charts" : "≡ Table"}
              </button>
            ))}
          </div>
          {view === "charts" ? (
            <>
              <MiniChart data={usage}  color="#4ea8de" label="Token volume"    sublabel="how much is being used"           dashed={false} containerWidth={chartW} />
              <MiniChart data={price}  color="#e05c5c" label="Price per token" sublabel="cost to produce each token"       dashed={false} containerWidth={chartW} />
              <MiniChart data={spend}  color="#f0c040" label="Total spend"     sublabel="volume × price — the bottom line" dashed={true}  containerWidth={chartW} />
            </>
          ) : (
            <DataTable price={price} usage={usage} spend={spend} />
          )}
          <Verdict priceDecline={priceDecline} usageGrowth={usageGrowth} />
        </div>
      </div>
    </div>
    </div>
  );
}
