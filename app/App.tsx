"use client";
/* eslint-disable */
import { useState, useEffect } from "react";

const SUPABASE_URL = "https://tubmkeowugsrngspckyk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Ym1rZW93dWdzcm5nc3Bja3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzY0NTMsImV4cCI6MjA5NTY1MjQ1M30.V759F71RtxDtTFd7qS_RXShbbuFzVxI8AgNMJ9SJZPg";
const ADMIN_PASSWORD = "okc2026";
const hdrs = { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY };

async function dbGet(table: string, params = "") {
  try {
    const res = await fetch(SUPABASE_URL + "/rest/v1/" + table + "?" + params, { headers: hdrs });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
async function dbInsert(table: string, data: object) {
  try {
    const res = await fetch(SUPABASE_URL + "/rest/v1/" + table, { method: "POST", headers: { ...hdrs, "Prefer": "return=representation" }, body: JSON.stringify(data) });
    return res.json();
  } catch { return null; }
}
async function dbUpdate(table: string, id: number, data: object) {
  try { await fetch(SUPABASE_URL + "/rest/v1/" + table + "?id=eq." + id, { method: "PATCH", headers: hdrs, body: JSON.stringify(data) }); } catch {}
}
async function dbDelete(table: string, id: number) {
  try { await fetch(SUPABASE_URL + "/rest/v1/" + table + "?id=eq." + id, { method: "DELETE", headers: hdrs }); } catch {}
}

type Ratings = { kafa: number; ambijent: number; usluga: number; cena: number; internet: number; muzika: number; };

type Cafe = {
  id: number; name: string; address: string; score: number;
  category: string[]; tags: string[]; price_range: string; hours: string;
  instagram: string; description: string; must_try: string; best_time: string;
  image: string; gallery: string[]; ratings: Ratings;
};

type Comment = { id: number; cafe_id: number; name: string; email: string; text: string; score: number; created_at: string; };

type FormState = {
  name: string; address: string; score: number; hours: string; instagram: string;
  description: string; must_try: string; best_time: string; price_range: string;
  image: string; gallery1: string; gallery2: string; gallery3: string;
  category: string[]; tags: string[]; ratings: Ratings;
};

const defaultRatings: Ratings = { kafa: 7.0, ambijent: 7.0, usluga: 7.0, cena: 7.0, internet: 7.0, muzika: 7.0 };

const emptyForm: FormState = {
  name: "", address: "", score: 7.0, hours: "", instagram: "", description: "",
  must_try: "", best_time: "", price_range: "1-500 din", image: "",
  gallery1: "", gallery2: "", gallery3: "",
  category: ["kafa"], tags: ["cozy"],
  ratings: { ...defaultRatings }
};

const filters = ["Sve", "kafa", "brunch", "desert", "date place", "work friendly", "nightlife", "shopping"];
const ALL_CATS = ["kafa","brunch","desert","date place","work friendly","nightlife","shopping"];
const ALL_TAGS = ["cozy","minimal","luxury","aesthetic","study spot","chill","sport","neighborhood","classic","quick stop"];

// ── ADMIN FIELD (outside AdminPanel to prevent remount on keystroke) ──
const AdminField = ({
  label, field, value, onChange, type = "text", placeholder = "", darkMode, borderCol
}: {
  label: string; field: string; value: string | number;
  onChange: (f: string, v: string | number) => void;
  type?: string; placeholder?: string; darkMode: boolean; borderCol: string;
}) => (
  <div style={{ marginBottom: "14px" }}>
    <label style={{ fontSize: "11px", color: darkMode ? "#6b6055" : "#9a8878", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(field, type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
      style={{ width: "100%", padding: "12px 14px", background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: "1px solid " + borderCol, borderRadius: "12px", color: "inherit", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
    />
  </div>
);

// ── SCORE RING ────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 80 }: { score: number; size?: number }) => {
  const r = size / 2 - 6; const circ = 2 * Math.PI * r; const pct = (score / 10) * circ;
  const color = score >= 8.5 ? "#d4a853" : score >= 7 ? "#c8b89a" : "#8a7968";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={pct + " " + circ} strokeLinecap="round" style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}/>
    </svg>
  );
};

// ── RATING BAR ────────────────────────────────────────────────────
const RatingBar = ({ label, value }: { label: string; value: number }) => (
  <div style={{ marginBottom: "10px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
      <span style={{ fontSize: "12px", color: "#a09585", textTransform: "capitalize", letterSpacing: "0.5px" }}>{label}</span>
      <span style={{ fontSize: "12px", color: "#d4a853", fontWeight: "600" }}>{value}</span>
    </div>
    <div style={{ height: "3px", background: "rgba(255,255,255,0.07)", borderRadius: "99px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: (value * 10) + "%", background: "linear-gradient(90deg, #8a6a3a, #d4a853)", borderRadius: "99px", transition: "width 1s cubic-bezier(.4,0,.2,1)" }}/>
    </div>
  </div>
);

// ── HERO CAROUSEL ─────────────────────────────────────────────────
const HeroCarousel = ({ cafes, darkMode }: { cafes: Cafe[]; darkMode: boolean }) => {
  const [idx, setIdx] = useState(0);
  const images = cafes.slice(0, 4).map(c => ({ img: c.image, name: c.name, score: c.score }));
  useEffect(() => {
    if (!images.length) return;
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images.length]);
  if (!images.length) return null;
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "32px", overflow: "hidden" }}>
      {images.map((item, i) => (
        <div key={i} onClick={() => setIdx(i)} style={{ flexShrink: 0, width: i === idx ? "140px" : "56px", height: "80px", borderRadius: "14px", overflow: "hidden", cursor: "pointer", position: "relative", transition: "width 0.5s cubic-bezier(.4,0,.2,1)", border: i === idx ? "1.5px solid rgba(212,168,83,0.6)" : "1.5px solid transparent" }}>
          <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          <div style={{ position: "absolute", inset: 0, background: i === idx ? "linear-gradient(to top, rgba(12,11,9,0.7) 0%, transparent 60%)" : "rgba(12,11,9,0.4)" }}/>
          {i === idx && (
            <div style={{ position: "absolute", bottom: "6px", left: "8px", right: "8px" }}>
              <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
              <p style={{ margin: 0, fontSize: "9px", color: "#d4a853" }}>{item.score}/10</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── LOCATION LIST ─────────────────────────────────────────────────
const LocationList = ({ cafes, onSelect, darkMode }: { cafes: Cafe[]; onSelect: (c: Cafe) => void; darkMode: boolean }) => {
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const borderCol = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const subtleText = darkMode ? "#6b6055" : "#9a8878";
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {[...cafes].sort((a, b) => b.score - a.score).map((c, i) => (
        <div key={c.id} style={{ background: cardBg, border: "1px solid " + borderCol, borderRadius: "20px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", minHeight: "100px" }}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
              {i === 0 && <div style={{ position: "absolute", top: "6px", left: "6px", background: "#d4a853", color: "#0c0b09", borderRadius: "99px", padding: "2px 7px", fontSize: "9px", fontWeight: "800" }}>TOP</div>}
            </div>
            <div style={{ padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>{c.name}</h3>
                <span style={{ color: "#d4a853", fontWeight: "700", fontSize: "16px" }}>{c.score}</span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: "11px", color: subtleText }}>{"📍 " + c.address}</p>
              <p style={{ margin: "0 0 10px", fontSize: "11px", color: subtleText }}>{"🕐 " + c.hours}</p>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => onSelect(c)} style={{ background: "linear-gradient(135deg, #d4a853, #b8893a)", border: "none", color: "#0c0b09", borderRadius: "99px", padding: "5px 14px", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>Recenzija</button>
                <a href={"https://www.google.com/maps/search/" + encodeURIComponent(c.name + " " + c.address + " Cacak")} target="_blank" rel="noreferrer" style={{ background: cardBg, border: "1px solid " + borderCol, color: subtleText, borderRadius: "99px", padding: "5px 14px", fontSize: "11px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Maps</a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── ADMIN PANEL ───────────────────────────────────────────────────
const AdminPanel = ({ cafes, onClose, onRefresh, darkMode }: { cafes: Cafe[]; onClose: () => void; onRefresh: () => void; darkMode: boolean }) => {
  const [tab, setTab] = useState<"list" | "add">("list");
  const [form, setForm] = useState<FormState>({ ...emptyForm, ratings: { ...defaultRatings } });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const bg = darkMode ? { background: "#0c0b09", color: "#f0ece4" } : { background: "#f7f3ee", color: "#1a1510" };
  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const borderCol = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const subtleText = darkMode ? "#6b6055" : "#9a8878";
  const lbl: React.CSSProperties = { fontSize: "11px", color: subtleText, letterSpacing: "1px", textTransform: "uppercase" as const, marginBottom: "6px", display: "block" };
  const inp: React.CSSProperties = { width: "100%", padding: "12px 14px", background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: "1px solid " + borderCol, borderRadius: "12px", color: "inherit", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  const setField = (field: string, val: string | number) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = async () => {
    if (!form.name || !form.address || !form.image) { alert("Popuni naziv, adresu i sliku!"); return; }
    setSaving(true);
    const gallery = [form.gallery1, form.gallery2, form.gallery3].filter(Boolean);
    const payload = {
      name: form.name, address: form.address, score: form.score, hours: form.hours,
      instagram: form.instagram, description: form.description, must_try: form.must_try,
      best_time: form.best_time, price_range: form.price_range, image: form.image,
      gallery: gallery.length ? gallery : [form.image],
      category: form.category, tags: form.tags, ratings: form.ratings
    };
    if (editId !== null) { await dbUpdate("cafes", editId, payload); }
    else { await dbInsert("cafes", payload); }
    await onRefresh();
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); setTab("list"); setForm({ ...emptyForm, ratings: { ...defaultRatings } }); setEditId(null); }, 1200);
  };

  const handleEdit = (c: Cafe) => {
    const r = c.ratings && typeof c.ratings === "object" ? c.ratings : {};
    const safeRatings: Ratings = {
      kafa: (r as any).kafa ?? 7.0,
      ambijent: (r as any).ambijent ?? 7.0,
      usluga: (r as any).usluga ?? 7.0,
      cena: (r as any).cena ?? 7.0,
      internet: (r as any).internet ?? 7.0,
      muzika: (r as any).muzika ?? 7.0,
    };
    setForm({
      name: c.name, address: c.address, score: c.score, hours: c.hours,
      instagram: c.instagram, description: c.description, must_try: c.must_try,
      best_time: c.best_time, price_range: c.price_range, image: c.image,
      gallery1: c.gallery[0] || "", gallery2: c.gallery[1] || "", gallery3: c.gallery[2] || "",
      category: c.category || ["kafa"], tags: c.tags || ["cozy"],
      ratings: safeRatings
    });
    setEditId(c.id); setTab("add");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Obrisati ovaj lokal?")) return;
    await dbDelete("cafes", id);
    await onRefresh();
  };

  const toggleCat = (cat: string) => setForm(f => ({ ...f, category: f.category.includes(cat) ? f.category.filter(x => x !== cat) : [...f.category, cat] }));
  const toggleTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(x => x !== tag) : [...f.tags, tag] }));
  const setRating = (key: string, val: number) => setForm(f => ({ ...f, ratings: { ...f.ratings, [key]: val } }));

  return (
    <div style={{ ...bg, minHeight: "100vh", fontFamily: "'Georgia', serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)", background: darkMode ? "rgba(12,11,9,0.95)" : "rgba(247,243,238,0.95)", borderBottom: "1px solid " + borderCol, padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={onClose} style={{ background: cardBg, border: "1px solid " + borderCol, color: "inherit", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px" }}>&#8592;</button>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", flex: 1 }}>Admin Panel</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["list", "add"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); if (t === "add") { setForm({ ...emptyForm, ratings: { ...defaultRatings } }); setEditId(null); } }} style={{ padding: "7px 16px", background: tab === t ? "linear-gradient(135deg, #d4a853, #b8893a)" : cardBg, border: "1px solid " + (tab === t ? "transparent" : borderCol), color: tab === t ? "#0c0b09" : "inherit", borderRadius: "99px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", fontWeight: tab === t ? "700" : "400" }}>
              {t === "list" ? "Lokali" : "Dodaj"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
        {tab === "list" && (
          <div>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: subtleText }}>Ukupno: {cafes.length} lokala</p>
            <div style={{ display: "grid", gap: "10px" }}>
              {[...cafes].sort((a, b) => b.score - a.score).map(c => (
                <div key={c.id} style={{ background: cardBg, border: "1px solid " + borderCol, borderRadius: "16px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <img src={c.image} alt={c.name} style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 2px", fontWeight: "700", fontSize: "14px" }}>{c.name}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: subtleText }}>{c.address}</p>
                  </div>
                  <span style={{ color: "#d4a853", fontWeight: "700", fontSize: "16px", flexShrink: 0 }}>{c.score}</span>
                  <button onClick={() => handleEdit(c)} style={{ background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.25)", color: "#d4a853", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(c.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", color: "#ff6060", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", cursor: "pointer" }}>Del</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "add" && (
          <div>
            <h3 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "400" }}>{editId ? "Izmeni lokal" : "Novi lokal"}</h3>
            <AdminField label="Naziv *" field="name" value={form.name} onChange={setField} placeholder="npr. Kafic Sunce" darkMode={darkMode} borderCol={borderCol}/>
            <AdminField label="Adresa *" field="address" value={form.address} onChange={setField} placeholder="npr. Cara Dusana 12" darkMode={darkMode} borderCol={borderCol}/>
            <AdminField label="Ukupna ocena (1-10) *" field="score" value={form.score} onChange={setField} type="number" placeholder="7.5" darkMode={darkMode} borderCol={borderCol}/>
            <AdminField label="Radno vreme" field="hours" value={form.hours} onChange={setField} placeholder="08:00 - 22:00" darkMode={darkMode} borderCol={borderCol}/>
            <AdminField label="Instagram" field="instagram" value={form.instagram} onChange={setField} placeholder="@naziv_kafea" darkMode={darkMode} borderCol={borderCol}/>
            <AdminField label="Cenovni rang" field="price_range" value={form.price_range} onChange={setField} placeholder="1-500 din" darkMode={darkMode} borderCol={borderCol}/>
            <div style={{ marginBottom: "14px" }}>
              <label style={lbl}>Opis</label>
              <textarea value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Kratki opis lokala..." style={{ ...inp, minHeight: "80px", resize: "vertical" as const }}/>
            </div>
            <AdminField label="Sta probati" field="must_try" value={form.must_try} onChange={setField} placeholder="npr. Cappuccino" darkMode={darkMode} borderCol={borderCol}/>
            <AdminField label="Najbolje vreme" field="best_time" value={form.best_time} onChange={setField} placeholder="npr. Jutro, 9-11h" darkMode={darkMode} borderCol={borderCol}/>

            <div style={{ padding: "16px", background: "rgba(212,168,83,0.06)", border: "1px solid rgba(212,168,83,0.15)", borderRadius: "14px", marginBottom: "14px" }}>
              <label style={{ ...lbl, color: "#d4a853" }}>Slike (URL)</label>
              <AdminField label="Glavna slika *" field="image" value={form.image} onChange={setField} placeholder="https://..." darkMode={darkMode} borderCol={borderCol}/>
              <AdminField label="Galerija 1" field="gallery1" value={form.gallery1} onChange={setField} placeholder="https://..." darkMode={darkMode} borderCol={borderCol}/>
              <AdminField label="Galerija 2" field="gallery2" value={form.gallery2} onChange={setField} placeholder="https://..." darkMode={darkMode} borderCol={borderCol}/>
              <AdminField label="Galerija 3" field="gallery3" value={form.gallery3} onChange={setField} placeholder="https://..." darkMode={darkMode} borderCol={borderCol}/>
            </div>

            <div style={{ padding: "16px", background: "rgba(212,168,83,0.06)", border: "1px solid rgba(212,168,83,0.15)", borderRadius: "14px", marginBottom: "14px" }}>
              <label style={{ ...lbl, color: "#d4a853" }}>Ocene po kategorijama</label>
              {(Object.keys(defaultRatings) as Array<keyof Ratings>).map(k => (
                <div key={k} style={{ marginBottom: "10px" }}>
                  <label style={{ ...lbl, textTransform: "capitalize" }}>{k}: <span style={{ color: "#d4a853" }}>{form.ratings[k]}</span></label>
                  <input type="range" min="1" max="10" step="0.1" value={form.ratings[k]} onChange={e => setRating(k, parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#d4a853" }}/>
                </div>
              ))}
            </div>

            <div style={{ padding: "16px", background: "rgba(212,168,83,0.06)", border: "1px solid rgba(212,168,83,0.15)", borderRadius: "14px", marginBottom: "20px" }}>
              <label style={{ ...lbl, color: "#d4a853" }}>Kategorije</label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                {ALL_CATS.map(cat => (
                  <button key={cat} onClick={() => toggleCat(cat)} style={{ padding: "6px 12px", background: form.category.includes(cat) ? "linear-gradient(135deg, #d4a853, #b8893a)" : cardBg, border: "1px solid " + (form.category.includes(cat) ? "transparent" : borderCol), color: form.category.includes(cat) ? "#0c0b09" : "inherit", borderRadius: "99px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>{cat}</button>
                ))}
              </div>
              <label style={{ ...lbl, color: "#d4a853" }}>Tagovi</label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {ALL_TAGS.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "6px 12px", background: form.tags.includes(tag) ? "rgba(212,168,83,0.2)" : cardBg, border: "1px solid " + (form.tags.includes(tag) ? "rgba(212,168,83,0.5)" : borderCol), color: form.tags.includes(tag) ? "#d4a853" : "inherit", borderRadius: "99px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>{tag}</button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "16px", background: saved ? "linear-gradient(135deg,#4caf50,#2e7d32)" : "linear-gradient(135deg,#d4a853,#b8893a)", border: "none", color: "#0c0b09", borderRadius: "14px", fontSize: "16px", fontWeight: "700", cursor: saving ? "wait" : "pointer", fontFamily: "inherit" }}>
              {saving ? "Cuvam..." : saved ? "Sacuvano!" : editId ? "Sacuvaj izmene" : "Dodaj lokal"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── COMMENTS ─────────────────────────────────────────────────────
const CommentsSection = ({ cafeId, darkMode }: { cafeId: number; darkMode: boolean }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState({ name: "", email: "", text: "", score: 8 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const borderCol = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const subtleText = darkMode ? "#6b6055" : "#9a8878";
  const inp: React.CSSProperties = { width: "100%", padding: "12px 14px", background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: "1px solid " + borderCol, borderRadius: "12px", color: "inherit", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  useEffect(() => {
    setLoading(true);
    dbGet("comments", "cafe_id=eq." + cafeId + "&order=created_at.desc").then(data => { setComments(data || []); setLoading(false); });
  }, [cafeId]);

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim()) { setError("Unesite ime i prezime."); return; }
    if (!form.email.includes("@")) { setError("Unesite ispravnu email adresu."); return; }
    if (!form.text.trim()) { setError("Unesite komentar."); return; }
    setSubmitting(true);
    await dbInsert("comments", { cafe_id: cafeId, name: form.name, email: form.email, text: form.text, score: form.score });
    const updated = await dbGet("comments", "cafe_id=eq." + cafeId + "&order=created_at.desc");
    setComments(updated || []);
    setSubmitting(false); setSubmitted(true);
    setForm({ name: "", email: "", text: "", score: 8 });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <h3 style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: darkMode ? "#6b6055" : "#9a8878", marginBottom: "16px" }}>Komentari ({comments.length})</h3>
      <div style={{ padding: "20px", background: cardBg, borderRadius: "20px", border: "1px solid " + borderCol, marginBottom: "16px" }}>
        <p style={{ margin: "0 0 14px", fontSize: "13px", color: darkMode ? "#6b6055" : "#9a8878" }}>Ostavi komentar</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <input placeholder="Ime i prezime" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp}/>
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp}/>
        </div>
        <textarea placeholder="Tvoj komentar..." value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} style={{ ...inp, minHeight: "70px", resize: "vertical" as const, marginBottom: "10px" }}/>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <span style={{ fontSize: "12px", color: subtleText, flexShrink: 0 }}>Ocena:</span>
          <input type="range" min="1" max="10" step="0.5" value={form.score} onChange={e => setForm(f => ({ ...f, score: parseFloat(e.target.value) }))} style={{ flex: 1, accentColor: "#d4a853" }}/>
          <span style={{ color: "#d4a853", fontWeight: "700", minWidth: "40px", fontSize: "14px" }}>{form.score}/10</span>
        </div>
        {error && <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#ff6060" }}>{error}</p>}
        <button onClick={handleSubmit} disabled={submitting} style={{ width: "100%", padding: "12px", background: submitted ? "linear-gradient(135deg,#4caf50,#2e7d32)" : "linear-gradient(135deg,#d4a853,#b8893a)", border: "none", color: "#0c0b09", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: submitting ? "wait" : "pointer", fontFamily: "inherit" }}>
          {submitting ? "Saljem..." : submitted ? "Objavljeno!" : "Objavi komentar"}
        </button>
      </div>
      {loading ? (
        <div style={{ padding: "20px", textAlign: "center", color: subtleText, fontSize: "13px" }}>Ucitavam...</div>
      ) : comments.length === 0 ? (
        <div style={{ padding: "24px", background: cardBg, borderRadius: "16px", border: "1px solid " + borderCol, textAlign: "center" }}>
          <p style={{ margin: 0, color: subtleText, fontSize: "13px" }}>Nema komentara. Budi prvi!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "10px" }}>
          {comments.map(comment => (
            <div key={comment.id} style={{ padding: "16px", background: cardBg, borderRadius: "16px", border: "1px solid " + borderCol }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontWeight: "700", fontSize: "14px" }}>{comment.name}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: subtleText }}>{new Date(comment.created_at).toLocaleDateString("sr-RS")}</p>
                </div>
                <span style={{ background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.3)", color: "#d4a853", borderRadius: "99px", padding: "3px 10px", fontSize: "12px", fontWeight: "700", alignSelf: "flex-start" }}>{comment.score}/10</span>
              </div>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, color: darkMode ? "#c8b89a" : "#4a3828" }}>{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────
export default function App() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("home");
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [activeFilter, setActiveFilter] = useState("Sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [savedCafes, setSavedCafes] = useState<number[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminPrompt, setAdminPrompt] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState(false);

  const loadCafes = async () => {
    setLoading(true);
    const data = await dbGet("cafes", "order=score.desc");
    setCafes(data || []);
    setLoading(false);
  };

  useEffect(() => { loadCafes(); }, []);

  const filtered = cafes.filter(c => {
    const matchFilter = activeFilter === "Sve" || (c.category && c.category.includes(activeFilter));
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchFilter && matchSearch;
  });
  const sorted = [...filtered].sort((a, b) => b.score - a.score);
  const toggleSave = (id: number) => setSavedCafes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const bg = darkMode ? { background: "#0c0b09", color: "#f0ece4" } : { background: "#f7f3ee", color: "#1a1510" };
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const borderCol = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const subtleText = darkMode ? "#6b6055" : "#9a8878";

  const handleAdminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) { setAdminMode(true); setAdminPrompt(false); setAdminPass(""); setAdminError(false); }
    else setAdminError(true);
  };

  if (adminMode) return <AdminPanel cafes={cafes} onClose={() => { setAdminMode(false); loadCafes(); }} onRefresh={loadCafes} darkMode={darkMode}/>;

  // ── DETAIL PAGE ──────────────────────────────────────────────
  if (page === "detail" && selectedCafe) {
    const c = selectedCafe;
    const safeRatings: Ratings = {
      kafa: (c.ratings as any)?.kafa ?? 0,
      ambijent: (c.ratings as any)?.ambijent ?? 0,
      usluga: (c.ratings as any)?.usluga ?? 0,
      cena: (c.ratings as any)?.cena ?? 0,
      internet: (c.ratings as any)?.internet ?? 0,
      muzika: (c.ratings as any)?.muzika ?? 0,
    };
    return (
      <div style={{ ...bg, minHeight: "100vh", fontFamily: "'Georgia', serif" }}>
        <div style={{ position: "relative", height: "55vh", overflow: "hidden" }}>
          <img src={c.gallery && c.gallery[galleryIdx] ? c.gallery[galleryIdx] : c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(12,11,9,0.3) 0%, rgba(12,11,9,0.9) 100%)" }}/>
          <button onClick={() => { setPage("home"); setGalleryIdx(0); }} style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(12,11,9,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)", color: "#f0ece4", borderRadius: "50px", padding: "8px 18px", fontSize: "13px", cursor: "pointer" }}>Nazad</button>
          <button onClick={() => toggleSave(c.id)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(12,11,9,0.6)", backdropFilter: "blur(12px)", border: "1px solid " + (savedCafes.includes(c.id) ? "#d4a853" : "rgba(255,255,255,0.15)"), color: savedCafes.includes(c.id) ? "#d4a853" : "#f0ece4", borderRadius: "50%", width: "42px", height: "42px", fontSize: "18px", cursor: "pointer" }}>{savedCafes.includes(c.id) ? "♥" : "♡"}</button>
          <div style={{ position: "absolute", bottom: "28px", left: "24px", right: "24px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              {c.tags && c.tags.map(t => <span key={t} style={{ background: "rgba(212,168,83,0.2)", border: "1px solid rgba(212,168,83,0.4)", color: "#d4a853", borderRadius: "99px", padding: "3px 10px", fontSize: "11px" }}>{t}</span>)}
            </div>
            <h1 style={{ fontSize: "clamp(28px,8vw,42px)", fontWeight: "400", margin: "0 0 4px", letterSpacing: "-1px" }}>{c.name}</h1>
            <p style={{ margin: 0, color: "rgba(240,236,228,0.6)", fontSize: "14px" }}>{"📍 " + c.address}</p>
          </div>
        </div>
        {c.gallery && c.gallery.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", padding: "16px 0 4px" }}>
            {c.gallery.map((_: string, i: number) => <button key={i} onClick={() => setGalleryIdx(i)} style={{ width: i === galleryIdx ? "24px" : "6px", height: "6px", borderRadius: "99px", border: "none", background: i === galleryIdx ? "#d4a853" : borderCol, cursor: "pointer", transition: "all 0.3s", padding: 0 }}/>)}
          </div>
        )}
        <div style={{ padding: "20px 24px", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px", padding: "20px", background: cardBg, borderRadius: "20px", border: "1px solid " + borderCol }}>
            <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
              <ScoreRing score={c.score} size={80}/>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "20px", fontWeight: "700", color: "#d4a853", lineHeight: 1 }}>{c.score}</span>
                <span style={{ fontSize: "9px", color: subtleText }}>/ 10</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: subtleText, letterSpacing: "1px", textTransform: "uppercase" }}>Ukupna ocena</p>
              <p style={{ margin: "0 0 8px", fontSize: "13px" }}>{c.description}</p>
              <span style={{ fontSize: "12px", color: subtleText }}>{c.price_range + " · " + c.hours}</span>
            </div>
          </div>
          {c.ratings && (
            <div style={{ padding: "20px", background: cardBg, borderRadius: "20px", border: "1px solid " + borderCol, marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: subtleText }}>Ocene po kategorijama</h3>
              {(Object.keys(safeRatings) as Array<keyof Ratings>).map(k => <RatingBar key={k} label={k} value={safeRatings[k]}/>)}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            <div style={{ padding: "16px", background: cardBg, borderRadius: "16px", border: "1px solid " + borderCol }}>
              <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#d4a853", letterSpacing: "1px", textTransform: "uppercase" }}>Sta probati</p>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.4 }}>{c.must_try}</p>
            </div>
            <div style={{ padding: "16px", background: cardBg, borderRadius: "16px", border: "1px solid " + borderCol }}>
              <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#d4a853", letterSpacing: "1px", textTransform: "uppercase" }}>Najbolje vreme</p>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.4 }}>{c.best_time}</p>
            </div>
          </div>
          {c.instagram ? (
            <a href={"https://instagram.com/" + c.instagram.replace("@","")} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "linear-gradient(135deg,rgba(212,168,83,0.12),rgba(212,168,83,0.04))", borderRadius: "16px", border: "1px solid rgba(212,168,83,0.25)", textDecoration: "none", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "22px" }}>📸</span>
                <div><p style={{ margin: "0 0 2px", fontSize: "12px", color: subtleText }}>Instagram</p><p style={{ margin: 0, color: "#d4a853", fontSize: "14px", fontWeight: "600" }}>{c.instagram}</p></div>
              </div>
              <span style={{ color: "#d4a853", fontSize: "18px" }}>→</span>
            </a>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", background: cardBg, borderRadius: "16px", border: "1px solid " + borderCol, marginBottom: "12px" }}>
              <span style={{ fontSize: "22px" }}>📸</span><p style={{ margin: 0, fontSize: "13px", color: subtleText }}>Nema Instagram profila</p>
            </div>
          )}
          <a href={"https://www.google.com/maps/search/" + encodeURIComponent(c.name + " " + c.address + " Cacak")} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: cardBg, borderRadius: "16px", border: "1px solid " + borderCol, textDecoration: "none", color: "inherit", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "22px" }}>🗺️</span>
              <div><p style={{ margin: "0 0 2px", fontSize: "12px", color: subtleText }}>Lokacija</p><p style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>{c.address}</p></div>
            </div>
            <span style={{ color: "#d4a853", fontSize: "18px" }}>→</span>
          </a>
          <CommentsSection cafeId={c.id} darkMode={darkMode}/>
          <h3 style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: subtleText, margin: "24px 0 12px" }}>Slicni lokali</h3>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {cafes.filter(x => x.id !== c.id).slice(0,3).map(sim => (
              <button key={sim.id} onClick={() => { setSelectedCafe(sim); setGalleryIdx(0); window.scrollTo(0,0); }} style={{ flexShrink: 0, width: "140px", background: cardBg, border: "1px solid " + borderCol, borderRadius: "16px", overflow: "hidden", cursor: "pointer", textAlign: "left", color: "inherit" }}>
                <img src={sim.image} alt={sim.name} style={{ width: "100%", height: "80px", objectFit: "cover" }}/>
                <div style={{ padding: "10px" }}><p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "600" }}>{sim.name}</p><p style={{ margin: 0, fontSize: "12px", color: "#d4a853" }}>{sim.score}/10</p></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── HOME PAGE ─────────────────────────────────────────────────
  return (
    <div style={{ ...bg, minHeight: "100vh", fontFamily: "'Georgia', serif", overflowX: "hidden" }}>
      {adminPrompt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: darkMode ? "#1a1510" : "#fff", border: "1px solid " + borderCol, borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "320px" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "20px", fontWeight: "400" }}>Admin pristup</h3>
            <input type="password" placeholder="Lozinka..." value={adminPass} onChange={e => { setAdminPass(e.target.value); setAdminError(false); }} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} style={{ width: "100%", padding: "14px 16px", background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: "1px solid " + (adminError ? "#ff6060" : borderCol), borderRadius: "12px", color: "inherit", fontSize: "15px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: "8px" }}/>
            {adminError && <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#ff6060" }}>Pogresna lozinka</p>}
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button onClick={() => { setAdminPrompt(false); setAdminPass(""); setAdminError(false); }} style={{ flex: 1, padding: "12px", background: cardBg, border: "1px solid " + borderCol, color: "inherit", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit" }}>Odustani</button>
              <button onClick={handleAdminLogin} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg,#d4a853,#b8893a)", border: "none", color: "#0c0b09", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>Ulaz</button>
            </div>
          </div>
        </div>
      )}

      <nav style={{ position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)", zIndex: 100, backdropFilter: "blur(20px)", background: darkMode ? "rgba(12,11,9,0.8)" : "rgba(247,243,238,0.85)", border: "1px solid " + borderCol, borderRadius: "99px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", width: "calc(100% - 48px)", maxWidth: "560px", boxSizing: "border-box" }}>
        <span style={{ fontSize: "18px", cursor: "pointer", userSelect: "none" }} onDoubleClick={() => setAdminPrompt(true)}>☕</span>
        <span style={{ flex: 1, fontWeight: "600", fontSize: "13px", letterSpacing: "-0.3px" }}>Ocenjivanje Kafica Cacak</span>
        <button onClick={() => setShowMap(!showMap)} style={{ background: "none", border: "none", color: showMap ? "#d4a853" : subtleText, cursor: "pointer", fontSize: "18px" }}>📍</button>
        <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", color: subtleText, cursor: "pointer", fontSize: "16px" }}>{darkMode ? "☀️" : "🌙"}</button>
        <a href="https://instagram.com/ocenjivanje.kafica.cacak" target="_blank" rel="noreferrer" style={{ background: "linear-gradient(135deg,#d4a853,#8a6a3a)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", color: "#fff", textDecoration: "none", fontWeight: "600" }}>IG</a>
      </nav>

      <div style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "60px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: darkMode ? "radial-gradient(ellipse at 70% 20%, rgba(138,105,58,0.25) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(212,168,83,0.12) 0%, transparent 50%), #0c0b09" : "radial-gradient(ellipse at 70% 20%, rgba(212,168,83,0.3) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(138,105,58,0.15) 0%, transparent 50%), #f7f3ee" }}/>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(" + (darkMode?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.02)") + " 1px,transparent 1px),linear-gradient(90deg," + (darkMode?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.02)") + " 1px,transparent 1px)", backgroundSize: "40px 40px" }}/>
        <div style={{ position: "absolute", top: "15%", right: "10%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(30px)" }}/>
        <div style={{ position: "relative", padding: "0 24px", paddingTop: "100px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: "99px", padding: "6px 14px", fontSize: "11px", color: "#d4a853", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "20px" }}>
            Cacak Coffee Guide
          </div>
          <h1 style={{ fontSize: "clamp(36px,11vw,72px)", fontWeight: "400", lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 12px", maxWidth: "480px" }}>
            Najbolji<br/>
            <span style={{ background: "linear-gradient(135deg,#d4a853,#f0d090,#8a6a3a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>coffee guide</span><br/>
            u Cacku!
          </h1>
          <p style={{ color: subtleText, fontSize: "15px", lineHeight: 1.6, margin: "0 0 24px", maxWidth: "340px" }}>Autenticne recenzije kafica, brunch mesta i lokacija koje vredi posetiti u Cacku.</p>
          <HeroCarousel cafes={cafes} darkMode={darkMode}/>
          <div style={{ position: "relative", marginBottom: "20px", maxWidth: "480px" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: subtleText }}>🔍</span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Trazi kafic..." style={{ width: "100%", padding: "16px 16px 16px 46px", background: darkMode?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)", border: "1px solid " + borderCol, borderRadius: "16px", color: "inherit", fontSize: "15px", outline: "none", backdropFilter: "blur(10px)", boxSizing: "border-box", fontFamily: "inherit" }}/>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("lokali")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "linear-gradient(135deg,#d4a853,#b8893a)", color: "#0c0b09", border: "none", borderRadius: "14px", padding: "14px 28px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>Istraziti lokale</button>
            <button onClick={() => setShowMap(!showMap)} style={{ background: darkMode?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)", border: "1px solid " + (showMap?"#d4a853":borderCol), color: showMap?"#d4a853":"inherit", borderRadius: "14px", padding: "14px 28px", fontSize: "15px", cursor: "pointer", fontFamily: "inherit" }}>Lokacije</button>
          </div>
          <div style={{ display: "flex", gap: "28px", marginTop: "40px" }}>
            {[[String(cafes.length), "Lokala"], ["100+", "Recenzija"], ["4.8", "Rating"]].map(([n, l]) => (
              <div key={l}><p style={{ margin: "0 0 2px", fontSize: "22px", fontWeight: "700", color: "#d4a853", letterSpacing: "-1px" }}>{n}</p><p style={{ margin: 0, fontSize: "11px", color: subtleText, letterSpacing: "1px", textTransform: "uppercase" }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      {showMap && (
        <div style={{ padding: "0 24px 32px" }}>
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "400" }}>Svi lokali u Cacku</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: subtleText }}>Klikni Maps za navigaciju</p>
          </div>
          <LocationList cafes={cafes} onSelect={c => { setSelectedCafe(c); setPage("detail"); setShowMap(false); }} darkMode={darkMode}/>
        </div>
      )}

      <div style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px)", background: darkMode?"rgba(12,11,9,0.9)":"rgba(247,243,238,0.9)", borderBottom: "1px solid " + borderCol, padding: "0 24px" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "14px 0", scrollbarWidth: "none" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ flexShrink: 0, padding: "8px 16px", background: activeFilter===f?"linear-gradient(135deg,#d4a853,#b8893a)":cardBg, border: "1px solid " + (activeFilter===f?"transparent":borderCol), color: activeFilter===f?"#0c0b09":"inherit", borderRadius: "99px", fontSize: "13px", cursor: "pointer", fontWeight: activeFilter===f?"700":"400", fontFamily: "inherit", whiteSpace: "nowrap" }}>{f}</button>
          ))}
        </div>
      </div>

      {sorted.length > 0 && (
        <div style={{ margin: "32px 24px 0", padding: "20px", background: "linear-gradient(135deg,rgba(212,168,83,0.12),rgba(138,105,58,0.06))", border: "1px solid rgba(212,168,83,0.2)", borderRadius: "20px" }}>
          <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#d4a853", letterSpacing: "2px", textTransform: "uppercase" }}>Ovog meseca</p>
          <p style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "600" }}>Top ocenjeni: <span style={{ color: "#d4a853" }}>{sorted[0].name + " " + sorted[0].score + "/10"}</span></p>
          <button onClick={() => { setSelectedCafe(sorted[0]); setPage("detail"); }} style={{ background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.3)", color: "#d4a853", borderRadius: "99px", padding: "7px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>Pogledaj recenziju</button>
        </div>
      )}

      <div id="lokali" style={{ padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "400", letterSpacing: "-0.5px" }}>Svi lokali</h2>
          <span style={{ fontSize: "12px", color: subtleText }}>{sorted.length + " mesta"}</span>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: subtleText }}>
            <p style={{ fontSize: "32px", margin: "0 0 12px" }}>☕</p>
            <p style={{ fontSize: "14px" }}>Ucitavam lokale...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: subtleText }}>
            <p style={{ fontSize: "32px", margin: "0 0 12px" }}>🔍</p>
            <p style={{ fontSize: "14px" }}>Nema rezultata.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {sorted.map((c, i) => (
              <button key={c.id} onClick={() => { setSelectedCafe(c); setPage("detail"); }} style={{ background: cardBg, border: "1px solid " + borderCol, borderRadius: "20px", overflow: "hidden", cursor: "pointer", textAlign: "left", color: "inherit", display: "grid", gridTemplateColumns: "130px 1fr", minHeight: "140px", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow=darkMode?"0 12px 40px rgba(212,168,83,0.12)":"0 12px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=""; (e.currentTarget as HTMLButtonElement).style.boxShadow=""; }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                  {i===0 && <div style={{ position: "absolute", top: "8px", left: "8px", background: "#d4a853", color: "#0c0b09", borderRadius: "99px", padding: "3px 8px", fontSize: "10px", fontWeight: "800" }}>TOP</div>}
                  <button onClick={e => { e.stopPropagation(); toggleSave(c.id); }} style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(12,11,9,0.6)", border: "none", color: savedCafes.includes(c.id)?"#d4a853":"#fff", borderRadius: "50%", width: "28px", height: "28px", fontSize: "13px", cursor: "pointer" }}>{savedCafes.includes(c.id)?"♥":"♡"}</button>
                </div>
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "600", letterSpacing: "-0.3px" }}>{c.name}</h3>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "8px" }}>
                      <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#d4a853", lineHeight: 1 }}>{c.score}</p>
                      <p style={{ margin: 0, fontSize: "9px", color: subtleText }}>/ 10</p>
                    </div>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: "12px", color: subtleText }}>{"📍 " + c.address}</p>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "8px" }}>
                    {c.tags && c.tags.slice(0,2).map(t => <span key={t} style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", color: "#d4a853", borderRadius: "99px", padding: "2px 8px", fontSize: "10px" }}>{t}</span>)}
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: subtleText, lineHeight: 1.4 }}>{c.description ? c.description.slice(0,70) + "..." : ""}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {cafes.filter(c => c.score >= 8).length > 0 && (
        <div style={{ margin: "0 24px 32px", padding: "24px", background: darkMode?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.02)", border: "1px solid " + borderCol, borderRadius: "24px" }}>
          <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#d4a853", letterSpacing: "2px", textTransform: "uppercase" }}>Hidden gems</p>
          <h3 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "400" }}>Mesta koja vredi otkriti</h3>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
            {cafes.filter(c => c.score >= 8).map(c => (
              <button key={c.id} onClick={() => { setSelectedCafe(c); setPage("detail"); }} style={{ flexShrink: 0, width: "160px", background: cardBg, border: "1px solid " + borderCol, borderRadius: "16px", overflow: "hidden", cursor: "pointer", textAlign: "left", color: "inherit" }}>
                <img src={c.image} alt={c.name} style={{ width: "100%", height: "100px", objectFit: "cover" }}/>
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600" }}>{c.name}</p>
                  <p style={{ margin: "0 0 4px", fontSize: "11px", color: subtleText }}>{c.address}</p>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#d4a853" }}>{c.score + "/10"}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ margin: "0 24px 32px", padding: "28px 24px", background: "linear-gradient(135deg,rgba(212,168,83,0.15),rgba(138,105,58,0.08))", border: "1px solid rgba(212,168,83,0.25)", borderRadius: "24px", textAlign: "center" }}>
        <p style={{ margin: "0 0 8px", fontSize: "32px" }}>📸</p>
        <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "400" }}>Prati nas na Instagramu</h3>
        <p style={{ margin: "0 0 20px", color: subtleText, fontSize: "14px" }}>Svakodnevne recenzije i price iz kafica Cacka.</p>
        <a href="https://instagram.com/ocenjivanje.kafica.cacak" target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "linear-gradient(135deg,#d4a853,#b8893a)", color: "#0c0b09", borderRadius: "14px", padding: "13px 28px", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>@ocenjivanje.kafica.cacak</a>
      </div>

      <footer style={{ padding: "24px", borderTop: "1px solid " + borderCol, textAlign: "center" }}>
        <p style={{ margin: "0 0 4px", fontSize: "18px" }}>☕</p>
        <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "600" }}>Ocenjivanje Kafica Cacak</p>
        <p style={{ margin: 0, fontSize: "12px", color: subtleText }}>Autentican coffee guide za ljude koji cene kvalitet</p>
        <p style={{ margin: "12px 0 0", fontSize: "11px", color: subtleText }}>2026 · Made with love in Cacak</p>
      </footer>
    </div>
  );
}
