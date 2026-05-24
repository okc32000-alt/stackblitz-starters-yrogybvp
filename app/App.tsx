import { useState, useEffect, useRef } from "react";

const cafes = [
  {
    id: 1,
    name: "Intermezzo",
    address: "Bogićevićeva 10",
    score: 8.9,
    category: ["kafa", "date place"],
    tags: ["cozy", "chill", "aesthetic"],
    priceRange: "1-500 din",
    hours: "07:30 - 23:30",
    instagram: "@intermezzo_cacak",
    description: "Najlepši ambijent u Čačku. Mesto koje spaja modernu estetiku sa toplinom. Savršeno za dejt ili radni sastanak kao i nocni zivot!",
    mustTry: "Mala do pola i toceno, topla preporuka!",
    bestTime: "Subota vece, 21-23h",
    image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEYMwZ0F5eZ9TZz1qp6MyHaI8UYjwoOJXWs3BKCTZVuaYlKDiciWxnWMCS6nx3G2alTdzsrpElS5ZSTAoa5j47Wq7eItIZC1-NAB0GyUGPxtdD3BH91wXpEJLVkXXfLzpaVuBEDjg=s680-w680-h510-rw",
    gallery: [
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAE0ecwUSnPSIy7WKnJd0SJX2stGJ3eyEzxvYSpx_p6KDgp_QVRubxpEafngl0E0dmYnhOmcjWwXuOPqRcH6OXTON7886LVNIAjAdNfXSuhdQ2v6FmxfJPWQ6H_IaBcWPKcRw0aU=s680-w680-h510-rw",
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFqTwq-QSdATUPccckjF9mTxVeKTJHEUOZmo8rJJ_a0O71u3LcSLmm-twe4aPpRgaFCEjmK-8XUJ8kt7-DJIrg2J_R0BezJpbGneNU-WUxFIexqRl1hal3y2PBk-TzbfXTRkTtQ=s680-w680-h510-rw",
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFIJpp_GsYeMb3iS1AaQLtvgsnnVy3nQA-NQBSjikRM9gURIjHtjYkbnOuS-55zOLLJghXDpdIn1dBoWWfA6S1uq1gWRFSeHGwah9GA_rh_Ik3DP-uiq5AOwZ44eot1BrYeycob=s680-w680-h510-rw",
    ],
    ratings: { kafa: 9.0, ambijent: 9.0, usluga: 9.1, cena: 8.0, internet: 8.5, muzika: 9.0 },
  },
  {
    id: 2,
    name: "Aber",
    address: "Železnička 5",
    score: 8.7,
    category: ["kafa", "work friendly"],
    tags: ["minimal", "study spot", "cozy"],
    priceRange: "1-500 din",
    hours: "08:00 - 22:00",
    instagram: "@aber_cacak",
    description: "Specialty coffee destinacija broj jedan. Baristi su majstori svog zanata, a atmosfera je savršena za rad i opuštanje.",
    mustTry: "Kraci espresso kao i Matcha",
    bestTime: "Svako doba dana!",
    image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFEQFNbrXucJqbU86m4MaGA0lwwaNvuWwRNVdIdkUyA1YeL7gmOAKMGzlaM-4--rX9NOgDU9eajSvuQ-eFDxU75FvsNhnPGCn33X9R4QS8Nd-VDhmV3-YMxnGXCdhUIEnrpgnJNlSr2lC0=s680-w680-h510-rw",
    gallery: [
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGOE081mYPAzQUXX8429jr80kJ3bTT8LsPuZasMsWZk5a3UboKy57ey7pxWoo7iBnYwsgv4pb3FHdvqaKdqnUqyQfIt-41gwgn7Wot03yQaYdggeQmxtMeFHt7TL6GKnFE6ySKE6tLxXKR4=s680-w680-h510-rw",
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAE8a8D-rVve3f-qltJIJw9Hi31e7S5pyIGgIwVMTAS7wTuhpht8CoAjty_fZYUMGdomQel5F3Mh6U2OTfGa1pMclU1kF1xnwTQRtwRpXUozajGqNABzUyB2CQkdp5jNfEcaNNq_fCjj1aX-=s680-w680-h510-rw",
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGeStpov9kR59Mf6vC1P54HTFoM062jCPhNh6dXJmO9aSderMYkgGwxn-TD-7Xm9EAAzRhkEL7bf1VvZdzXZSgpAscjEmxZw5cmILU5WoDp3LTWuRbuGgkYiSnqTu-GA7oUmORbBw=s680-w680-h510-rw",
    ],
    ratings: { kafa: 10.0, ambijent: 7.0, usluga: 9.0, cena: 7.5, internet: 9.0, muzika: 8.2 },
  },
  {
    id: 3,
    name: "Cafe Jena",
    address: "Ljubićska 50",
    score: 7.6,
    category: ["kafa", "desert"],
    tags: ["cozy", "aesthetic"],
    priceRange: "1-500 din",
    hours: "07:00 - 00:00",
    instagram: "@cafe_jena_cacak",
    description: "Omiljeno mesto kvarta. Topla atmosfera i odlična muzika čine ga idealnim za jutarnji kao i večernji ritual.",
    mustTry: "Cappuccino",
    bestTime: "Poslepodne, 15-17h",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrmsTswYCIPCH0PI2hodX9bQeZLoEgai8D9w&s",
    gallery: [
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHwyKUtyhxrzGnBVQW_s3_UEUW708E5EQUD_lfM_5FI3fVB7EhrWVaLEuzeuzotEQhzwMVdMvOoByikA9C9CZJyImSc2yPxNef1Y71CSm9Bwg7LaZFMjv9gB-AKHAChpu_f4wU=s680-w680-h510-rw",
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGticQ2j-uEmImwkOsdRhueUc598-txc3u6zj0Qn8WVV3Tc1J3IEuIaBHo-KHdU-l36nbCCeaRFk1UICk4yKy8Kkafu9vHolho54Dn5wKVkcVt6gZhmVjq5h0P821zOZsCWefWB=s680-w680-h510-rw",
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEEsrD5jw88XvpjgZU1teJ8KLoCSSuqdUl-f_lYeRkHIY6fP8a8EmeEkPDEHEDpq-DCoWU5hMRZyLouKQVAFSKfZ5II-ukYYxOCd6fUPOyHPkaKfWbkMQIEIMmtfbwQaP6LatIA=s680-w680-h510-rw",
    ],
    ratings: { kafa: 6.7, ambijent: 9.0, usluga: 7.8, cena: 8.0, internet: 7.0, muzika: 7.5 },
  },
  {
    id: 4,
    name: "Coffee Box",
    address: "Bulevar Vuka Karadžića 92",
    score: 6.7,
    category: ["kafa"],
    tags: ["minimal", "quick stop"],
    priceRange: "1-500 din",
    hours: "08:00 - 21:00",
    instagram: "@coffeeboxcacak",
    description: "Brz i pristupačan. Odlična opcija za takeaway kafu dok si u prolazu. Jednostavno ali pouzdano.",
    mustTry: "Filter kafa to-go",
    bestTime: "Jutro, 7-9h",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_vrZ7p4x7mlkMngkjVD6TwGsuqolwMvtqA&s",
    gallery: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNX31cIbmFnHY4LdBNn2L-ih4hzgyec2wGhQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkdq8ILeZxi1B7C-kCmzlgrHrwZVzXbFGIIQ&s",
      "https://static.where-e.com/Bosnia_And_Herzegovina/Vlasenica/Srebrenica/Coffeebox_58ef154232ab207e80a485374dcae8ab.jpg",
    ],
    ratings: { kafa: 7.0, ambijent: 7.0, usluga: 7.0, cena: 9.0, internet: 6.0, muzika: 6.5 },
  },
];

const filters = ["Sve", "kafa", "brunch", "desert", "date place", "work friendly", "nightlife", "shopping"];

const ScoreRing = ({ score, size = 80 }: { score: number; size?: number }) => {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const pct = (score / 10) * circ;
  const color = score >= 8.5 ? "#d4a853" : score >= 7 ? "#c8b89a" : "#8a7968";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={`${pct} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
};

const RatingBar = ({ label, value }) => (
  <div style={{ marginBottom: "10px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
      <span style={{ fontSize: "12px", color: "#a09585", textTransform: "capitalize", letterSpacing: "0.5px" }}>{label}</span>
      <span style={{ fontSize: "12px", color: "#d4a853", fontWeight: "600" }}>{value}</span>
    </div>
    <div style={{ height: "3px", background: "rgba(255,255,255,0.07)", borderRadius: "99px", overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${value * 10}%`,
        background: "linear-gradient(90deg, #8a6a3a, #d4a853)",
        borderRadius: "99px",
        transition: "width 1s cubic-bezier(.4,0,.2,1)"
      }}/>
    </div>
  </div>
);

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [savedCafes, setSavedCafes] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = cafes.filter(c => {
    const matchFilter = activeFilter === "Sve" || c.category.includes(activeFilter);
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => b.score - a.score);

  const toggleSave = (id) => setSavedCafes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const bg = darkMode
    ? { background: "#0c0b09", color: "#f0ece4" }
    : { background: "#f7f3ee", color: "#1a1510" };

  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const borderCol = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const subtleText = darkMode ? "#6b6055" : "#9a8878";

  // ── CAFE DETAIL PAGE ──────────────────────────────────────────────
  if (page === "detail" && selectedCafe) {
    const c = selectedCafe;
    return (
      <div style={{ ...bg, minHeight: "100vh", fontFamily: "'Georgia', serif" }}>
        {/* Hero */}
        <div style={{ position: "relative", height: "55vh", overflow: "hidden" }}>
          <img src={c.gallery[galleryIdx]} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.5s" }}/>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(12,11,9,0.3) 0%, rgba(12,11,9,0.9) 100%)" }}/>
          {/* Back */}
          <button onClick={() => { setPage("home"); setGalleryIdx(0); }} style={{
            position: "absolute", top: "20px", left: "20px",
            background: "rgba(12,11,9,0.6)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)", color: "#f0ece4",
            borderRadius: "50px", padding: "8px 18px", fontSize: "13px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px"
          }}>← Nazad</button>
          {/* Save */}
          <button onClick={() => toggleSave(c.id)} style={{
            position: "absolute", top: "20px", right: "20px",
            background: "rgba(12,11,9,0.6)", backdropFilter: "blur(12px)",
            border: `1px solid ${savedCafes.includes(c.id) ? "#d4a853" : "rgba(255,255,255,0.15)"}`,
            color: savedCafes.includes(c.id) ? "#d4a853" : "#f0ece4",
            borderRadius: "50%", width: "42px", height: "42px", fontSize: "18px", cursor: "pointer"
          }}>{savedCafes.includes(c.id) ? "♥" : "♡"}</button>
          {/* Title overlay */}
          <div style={{ position: "absolute", bottom: "28px", left: "24px", right: "24px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              {c.tags.map(t => (
                <span key={t} style={{ background: "rgba(212,168,83,0.2)", border: "1px solid rgba(212,168,83,0.4)", color: "#d4a853", borderRadius: "99px", padding: "3px 10px", fontSize: "11px", letterSpacing: "0.5px" }}>{t}</span>
              ))}
            </div>
            <h1 style={{ fontSize: "clamp(28px,8vw,42px)", fontWeight: "400", margin: "0 0 4px", letterSpacing: "-1px" }}>{c.name}</h1>
            <p style={{ margin: 0, color: "rgba(240,236,228,0.6)", fontSize: "14px" }}>📍 {c.address}</p>
          </div>
        </div>

        {/* Gallery dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", padding: "16px 0 4px" }}>
          {c.gallery.map((_, i) => (
            <button key={i} onClick={() => setGalleryIdx(i)} style={{
              width: i === galleryIdx ? "24px" : "6px", height: "6px",
              borderRadius: "99px", border: "none",
              background: i === galleryIdx ? "#d4a853" : borderCol,
              cursor: "pointer", transition: "all 0.3s", padding: 0
            }}/>
          ))}
        </div>

        <div style={{ padding: "20px 24px", maxWidth: "600px", margin: "0 auto" }}>
          {/* Score */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px", padding: "20px", background: cardBg, borderRadius: "20px", border: `1px solid ${borderCol}` }}>
            <div style={{ position: "relative", width: "80px", height: "80px" }}>
              <ScoreRing score={c.score} size={80}/>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "20px", fontWeight: "700", color: "#d4a853", lineHeight: 1 }}>{c.score}</span>
                <span style={{ fontSize: "9px", color: subtleText, letterSpacing: "0.5px" }}>/ 10</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: subtleText, letterSpacing: "1px", textTransform: "uppercase" }}>Ukupna ocena</p>
              <p style={{ margin: "0 0 8px", fontSize: "13px" }}>{c.description}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: subtleText }}>{c.priceRange} · {c.hours}</span>
              </div>
            </div>
          </div>

          {/* Rating bars */}
          <div style={{ padding: "20px", background: cardBg, borderRadius: "20px", border: `1px solid ${borderCol}`, marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: subtleText }}>Ocene po kategorijama</h3>
            {Object.entries(c.ratings).map(([k, v]) => <RatingBar key={k} label={k} value={v}/>)}
          </div>

          {/* Must try */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            <div style={{ padding: "16px", background: cardBg, borderRadius: "16px", border: `1px solid ${borderCol}` }}>
              <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#d4a853", letterSpacing: "1px", textTransform: "uppercase" }}>☕ Šta probati</p>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.4 }}>{c.mustTry}</p>
            </div>
            <div style={{ padding: "16px", background: cardBg, borderRadius: "16px", border: `1px solid ${borderCol}` }}>
              <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#d4a853", letterSpacing: "1px", textTransform: "uppercase" }}>🕐 Najbolje vreme</p>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.4 }}>{c.bestTime}</p>
            </div>
          </div>

          {/* Instagram */}
          <a href={`https://instagram.com/${c.instagram.replace("@", "")}`} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "linear-gradient(135deg, rgba(212,168,83,0.12), rgba(212,168,83,0.04))", borderRadius: "16px", border: "1px solid rgba(212,168,83,0.25)", textDecoration: "none", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "22px" }}>📸</span>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "12px", color: subtleText, letterSpacing: "0.5px" }}>Instagram</p>
                <p style={{ margin: 0, color: "#d4a853", fontSize: "14px", fontWeight: "600" }}>{c.instagram}</p>
              </div>
            </div>
            <span style={{ color: "#d4a853", fontSize: "18px" }}>→</span>
          </a>

          {/* Similar */}
          <h3 style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: subtleText, marginBottom: "12px" }}>Slični lokali</h3>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {cafes.filter(x => x.id !== c.id).slice(0,3).map(sim => (
              <button key={sim.id} onClick={() => { setSelectedCafe(sim); setGalleryIdx(0); }} style={{
                flexShrink: 0, width: "140px", background: cardBg, border: `1px solid ${borderCol}`,
                borderRadius: "16px", overflow: "hidden", cursor: "pointer", textAlign: "left",
                color: "inherit"
              }}>
                <img src={sim.image} alt={sim.name} style={{ width: "100%", height: "80px", objectFit: "cover" }}/>
                <div style={{ padding: "10px" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "600" }}>{sim.name}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#d4a853" }}>{sim.score}/10</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── MAP VIEW ──────────────────────────────────────────────────────
  if (showMap) {
    return (
      <div style={{ ...bg, minHeight: "100vh", fontFamily: "'Georgia', serif" }}>
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => setShowMap(false)} style={{ background: cardBg, border: `1px solid ${borderCol}`, color: "inherit", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontSize: "18px" }}>←</button>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "400" }}>Mapa lokala</h2>
        </div>
        <div style={{ margin: "0 24px", background: "linear-gradient(135deg, rgba(212,168,83,0.1), rgba(138,105,58,0.1))", border: `1px solid ${borderCol}`, borderRadius: "24px", overflow: "hidden", padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗺️</div>
          <p style={{ color: subtleText, fontSize: "14px", marginBottom: "20px" }}>Interaktivna mapa zahteva Google Maps API ključ. U produkciji ovde prikaži sve lokale sa custom pinovima na mapi Čačka.</p>
          <div style={{ display: "grid", gap: "12px" }}>
            {cafes.map(c => (
              <button key={c.id} onClick={() => { setSelectedCafe(c); setShowMap(false); setPage("detail"); }} style={{
                display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px",
                background: cardBg, border: `1px solid ${borderCol}`, borderRadius: "14px",
                cursor: "pointer", textAlign: "left", color: "inherit"
              }}>
                <span style={{ fontSize: "20px" }}>📍</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 2px", fontWeight: "600", fontSize: "15px" }}>{c.name}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: subtleText }}>{c.address}</p>
                </div>
                <span style={{ color: "#d4a853", fontWeight: "700" }}>{c.score}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── HOME PAGE ─────────────────────────────────────────────────────
  return (
    <div style={{ ...bg, minHeight: "100vh", fontFamily: "'Georgia', serif", overflowX: "hidden" }}>

      {/* Floating Navbar */}
      <nav style={{
        position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
        zIndex: 100, backdropFilter: "blur(20px)",
        background: darkMode ? "rgba(12,11,9,0.8)" : "rgba(247,243,238,0.85)",
        border: `1px solid ${borderCol}`, borderRadius: "99px",
        padding: "10px 20px", display: "flex", alignItems: "center", gap: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)", width: "calc(100% - 48px)", maxWidth: "560px",
        boxSizing: "border-box"
      }}>
        <span style={{ fontSize: "18px" }}>☕</span>
        <span style={{ flex: 1, fontWeight: "600", fontSize: "14px", letterSpacing: "-0.3px" }}>PROFESIONALNO Ocenjivanje Kafica Cacak</span>
        <button onClick={() => setShowMap(true)} style={{ background: "none", border: "none", color: subtleText, cursor: "pointer", fontSize: "18px" }}>🗺️</button>
        <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", color: subtleText, cursor: "pointer", fontSize: "16px" }}>{darkMode ? "☀️" : "🌙"}</button>
        <a href="https://instagram.com/ocenjivanje.kafica.cacak" target="_blank" rel="noreferrer" style={{ background: "linear-gradient(135deg, #d4a853, #8a6a3a)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", color: "#fff", textDecoration: "none", fontWeight: "600", letterSpacing: "0.3px" }}>IG</a>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "60px", overflow: "hidden" }}>
        {/* Background */}
        <div style={{ position: "absolute", inset: 0, background: darkMode
          ? "radial-gradient(ellipse at 70% 20%, rgba(138,105,58,0.25) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(212,168,83,0.12) 0%, transparent 50%), #0c0b09"
          : "radial-gradient(ellipse at 70% 20%, rgba(212,168,83,0.3) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(138,105,58,0.15) 0%, transparent 50%), #f7f3ee"
        }}/>
        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"} 1px, transparent 1px)`, backgroundSize: "40px 40px" }}/>

        {/* Floating orbs */}
        <div style={{ position: "absolute", top: "15%", right: "10%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(30px)" }}/>
        <div style={{ position: "absolute", bottom: "25%", left: "-5%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(138,105,58,0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)" }}/>

        <div style={{ position: "relative", padding: "0 24px", paddingTop: "100px" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: "99px", padding: "6px 14px", fontSize: "11px", color: "#d4a853", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "20px" }}>
            <span>✦</span> Čačak Coffee Guide
          </div>

          <h1 style={{ fontSize: "clamp(36px,11vw,72px)", fontWeight: "400", lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 16px", maxWidth: "480px" }}>
            Najbolji<br/>
            <span style={{ background: "linear-gradient(135deg, #d4a853, #f0d090, #8a6a3a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>coffee guide</span><br/>
            u Cacku!
          </h1>

          <p style={{ color: subtleText, fontSize: "16px", lineHeight: 1.6, margin: "0 0 32px", maxWidth: "340px" }}>
            Autentične recenzije kafića, brunch mesta i lokacija koje vredi posetiti u Čačku.
          </p>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: "20px", maxWidth: "480px" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: subtleText }}>🔍</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Traži "cozy kafić" ili "brunch"…'
              style={{
                width: "100%", padding: "16px 16px 16px 46px",
                background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                border: `1px solid ${borderCol}`, borderRadius: "16px",
                color: "inherit", fontSize: "15px", outline: "none",
                backdropFilter: "blur(10px)", boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("lokali")?.scrollIntoView({ behavior: "smooth" })} style={{
              background: "linear-gradient(135deg, #d4a853, #b8893a)", color: "#0c0b09",
              border: "none", borderRadius: "14px", padding: "14px 28px",
              fontSize: "15px", fontWeight: "700", cursor: "pointer",
              letterSpacing: "-0.3px", fontFamily: "inherit"
            }}>Istraži lokale →</button>
            <button onClick={() => setShowMap(true)} style={{
              background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${borderCol}`, color: "inherit",
              borderRadius: "14px", padding: "14px 28px",
              fontSize: "15px", cursor: "pointer", fontFamily: "inherit"
            }}>🗺️ Mapa</button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "28px", marginTop: "40px" }}>
            {[["4", "Lokala"], ["100+", "Recenzija"], ["4.8★", "App rating"]].map(([n, l]) => (
              <div key={l}>
                <p style={{ margin: "0 0 2px", fontSize: "22px", fontWeight: "700", color: "#d4a853", letterSpacing: "-1px" }}>{n}</p>
                <p style={{ margin: 0, fontSize: "11px", color: subtleText, letterSpacing: "1px", textTransform: "uppercase" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ position: "sticky", top: "0", zIndex: 50, backdropFilter: "blur(20px)", background: darkMode ? "rgba(12,11,9,0.9)" : "rgba(247,243,238,0.9)", borderBottom: `1px solid ${borderCol}`, padding: "0 24px" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "14px 0", scrollbarWidth: "none" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              flexShrink: 0, padding: "8px 16px",
              background: activeFilter === f ? "linear-gradient(135deg, #d4a853, #b8893a)" : cardBg,
              border: `1px solid ${activeFilter === f ? "transparent" : borderCol}`,
              color: activeFilter === f ? "#0c0b09" : "inherit",
              borderRadius: "99px", fontSize: "13px", cursor: "pointer",
              fontWeight: activeFilter === f ? "700" : "400",
              fontFamily: "inherit", whiteSpace: "nowrap"
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Top Rated Banner */}
      <div style={{ margin: "32px 24px 0", padding: "20px", background: "linear-gradient(135deg, rgba(212,168,83,0.12), rgba(138,105,58,0.06))", border: "1px solid rgba(212,168,83,0.2)", borderRadius: "20px" }}>
        <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#d4a853", letterSpacing: "2px", textTransform: "uppercase" }}>✦ Ovog meseca</p>
        <p style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "600" }}>Top ocenjeni: <span style={{ color: "#d4a853" }}>Intermezzo 8.9/10</span></p>
        <button onClick={() => { setSelectedCafe(cafes[0]); setPage("detail"); }} style={{ background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.3)", color: "#d4a853", borderRadius: "99px", padding: "7px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>Pogledaj recenziju →</button>
      </div>

      {/* Lokali grid */}
      <div id="lokali" style={{ padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "400", letterSpacing: "-0.5px" }}>Svi lokali</h2>
          <span style={{ fontSize: "12px", color: subtleText }}>{sorted.length} mesta</span>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {sorted.map((c, i) => (
            <button key={c.id} onClick={() => { setSelectedCafe(c); setPage("detail"); }} style={{
              background: cardBg, border: `1px solid ${borderCol}`, borderRadius: "20px",
              overflow: "hidden", cursor: "pointer", textAlign: "left", color: "inherit",
              display: "grid", gridTemplateColumns: "130px 1fr", minHeight: "140px",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = darkMode ? "0 12px 40px rgba(212,168,83,0.12)" : "0 12px 40px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                {i === 0 && <div style={{ position: "absolute", top: "8px", left: "8px", background: "#d4a853", color: "#0c0b09", borderRadius: "99px", padding: "3px 8px", fontSize: "10px", fontWeight: "800", letterSpacing: "0.5px" }}>TOP</div>}
                <button onClick={e => { e.stopPropagation(); toggleSave(c.id); }} style={{
                  position: "absolute", bottom: "8px", right: "8px",
                  background: "rgba(12,11,9,0.6)", border: "none",
                  color: savedCafes.includes(c.id) ? "#d4a853" : "#fff",
                  borderRadius: "50%", width: "28px", height: "28px", fontSize: "13px", cursor: "pointer"
                }}>{savedCafes.includes(c.id) ? "♥" : "♡"}</button>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "600", letterSpacing: "-0.3px" }}>{c.name}</h3>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "8px" }}>
                    <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#d4a853", lineHeight: 1 }}>{c.score}</p>
                    <p style={{ margin: 0, fontSize: "9px", color: subtleText }}>/ 10</p>
                  </div>
                </div>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: subtleText }}>📍 {c.address}</p>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "8px" }}>
                  {c.tags.slice(0,2).map(t => (
                    <span key={t} style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", color: "#d4a853", borderRadius: "99px", padding: "2px 8px", fontSize: "10px" }}>{t}</span>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: subtleText, lineHeight: 1.4 }}>{c.description.slice(0, 70)}…</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hidden Gems */}
      <div style={{ margin: "0 24px 32px", padding: "24px", background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${borderCol}`, borderRadius: "24px" }}>
        <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#d4a853", letterSpacing: "2px", textTransform: "uppercase" }}>💎 Hidden gems</p>
        <h3 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "400" }}>Mesta koja vredi otkriti</h3>
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
          {cafes.filter(c => c.score >= 8).map(c => (
            <button key={c.id} onClick={() => { setSelectedCafe(c); setPage("detail"); }} style={{
              flexShrink: 0, width: "160px", background: cardBg, border: `1px solid ${borderCol}`,
              borderRadius: "16px", overflow: "hidden", cursor: "pointer", textAlign: "left", color: "inherit"
            }}>
              <img src={c.image} alt={c.name} style={{ width: "100%", height: "100px", objectFit: "cover" }}/>
              <div style={{ padding: "10px 12px" }}>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600" }}>{c.name}</p>
                <p style={{ margin: "0 0 4px", fontSize: "11px", color: subtleText }}>{c.address}</p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#d4a853" }}>{c.score}/10</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instagram CTA */}
      <div style={{ margin: "0 24px 32px", padding: "28px 24px", background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(138,105,58,0.08))", border: "1px solid rgba(212,168,83,0.25)", borderRadius: "24px", textAlign: "center" }}>
        <p style={{ margin: "0 0 8px", fontSize: "32px" }}>📸</p>
        <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "400" }}>Prati nas na Instagramu</h3>
        <p style={{ margin: "0 0 20px", color: subtleText, fontSize: "14px" }}>Svakodnevne recenzije, estetske fotke i priče iz kafića Čačka.</p>
        <a href="https://instagram.com/ocenjivanje.kafica.cacak" target="_blank" rel="noreferrer" style={{
          display: "inline-block", background: "linear-gradient(135deg, #d4a853, #b8893a)",
          color: "#0c0b09", borderRadius: "14px", padding: "13px 28px",
          fontSize: "14px", fontWeight: "700", textDecoration: "none", letterSpacing: "-0.3px"
        }}>@ocenjivanje.kafica.cacak →</a>
      </div>

      {/* Footer */}
      <footer style={{ padding: "24px", borderTop: `1px solid ${borderCol}`, textAlign: "center" }}>
        <p style={{ margin: "0 0 4px", fontSize: "18px" }}>☕</p>
        <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "600" }}>Ocenjivanje Kafica Čačak</p>
        <p style={{ margin: 0, fontSize: "12px", color: subtleText }}>Autentičan coffee guide za ljude koji cene kvalitet</p>
        <p style={{ margin: "12px 0 0", fontSize: "11px", color: subtleText }}>© 2026 · Made with ☕ in Čačak</p>
      </footer>
    </div>
  );
}
