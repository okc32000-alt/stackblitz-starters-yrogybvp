"use client";
/* eslint-disable */
import { useState, useEffect } from "react";

// Tip Ratings
type Ratings = {
  kafa: number;
  ambijent: number;
  usluga: number;
  cena: number;
  internet: number;
  muzika: number;
};

// Tip Cafe
type Cafe = {
  id: number;
  name: string;
  address: string;
  score: number;
  category: string[];
  tags: string[];
  price_range: string;
  hours: string;
  instagram: string;
  description: string;
  must_try: string;
  best_time: string;
  image: string;
  gallery: string[];
  ratings: Ratings;
};

// Supabase konfiguracija
const SUPABASE_URL = "https://tubmkeowugsrngspckyk.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Ym1rZW93dWdzcm5nc3Bja3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzY0NTMsImV4cCI6MjA5NTY1MjQ1M30.V759F71RtxDtTFd7qS_RXShbbuFzVxI8AgNMJ9SJZPg";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: "Bearer " + SUPABASE_KEY,
};

// Funkcije za bazu
async function dbGet(table: string, params = "") {
  try {
    const res = await fetch(SUPABASE_URL + "/rest/v1/" + table + "?" + params, { headers });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function dbInsert(table: string, data: object) {
  try {
    const res = await fetch(SUPABASE_URL + "/rest/v1/" + table, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return null;
  }
}

async function dbUpdate(table: string, id: number, data: object) {
  try {
    await fetch(SUPABASE_URL + "/rest/v1/" + table + "?id=eq." + id, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
  } catch {}
}

async function dbDelete(table: string, id: number) {
  try {
    await fetch(SUPABASE_URL + "/rest/v1/" + table + "?id=eq." + id, {
      method: "DELETE",
      headers,
    });
  } catch {}
}

// Default ratings
const defaultRatings: Ratings = {
  kafa: 7.0,
  ambijent: 7.0,
  usluga: 7.0,
  cena: 7.0,
  internet: 7.0,
  muzika: 7.0,
};

// Prazan form za unos
const emptyForm = {
  name: "",
  address: "",
  score: 7.0,
  hours: "",
  instagram: "",
  description: "",
  must_try: "",
  best_time: "",
  price_range: "1-500 din",
  image: "",
  gallery1: "",
  gallery2: "",
  gallery3: "",
  category: ["kafa"] as string[],
  tags: ["cozy"] as string[],
  ratings: { ...defaultRatings },
} as const;

// Funkcija za konverziju
function convertCafeToForm(c: Cafe): typeof emptyForm {
  return {
    name: c.name,
    address: c.address,
    score: c.score,
    hours: c.hours,
    instagram: c.instagram,
    description: c.description,
    must_try: c.must_try,
    best_time: c.best_time,
    price_range: c.price_range,
    image: c.image,
    gallery1: c.gallery[0] || "",
    gallery2: c.gallery[1] || "",
    gallery3: c.gallery[2] || "",
    category: [...c.category],
    tags: [...c.tags],
    ratings: { ...c.ratings },
  };
}

export default function App() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [tab, setTab] = useState<string>("list");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState<{ name: string; email: string; text: string; score: number }>({ name: "", email: "", text: "", score: 5 });
  const [showComments, setShowComments] = useState<number | null>(null);

  // Fetch podaci
  useEffect(() => {
    fetchCafes();
    fetchComments();
  }, []);

  async function fetchCafes() {
    const data = await dbGet("cafes");
    setCafes(data);
  }

  async function fetchComments() {
    const data = await dbGet("comments");
    setComments(data);
  }

  // Funkcija za izmenu
  const handleEdit = (c: Cafe) => {
    setForm(convertCafeToForm(c));
    setEditId(c.id);
    setTab("add");
  };

  // Funkcija za unos ili izmenu
  const handleSave = async () => {
    if (editId !== null) {
      await dbUpdate("cafes", editId, { ...form });
    } else {
      await dbInsert("cafes", { ...form });
    }
    await fetchCafes();
    setTab("list");
  };

  // Funkcija za brisanje
  const handleDelete = async (id: number) => {
    await dbDelete("cafes", id);
    await fetchCafes();
  };

  // Funkcija za dodavanje komentara
  const handleAddComment = async (cafe_id: number) => {
    const data = { ...commentForm, cafe_id, created_at: new Date().toISOString() };
    await dbInsert("comments", data);
    await fetchComments();
    setCommentForm({ name: "", email: "", text: "", score: 5 });
    setShowComments(cafe_id);
  };

  // UI
  return (
    <div style={{ padding: "20px" }}>
      <h1>Cafes App</h1>
      {tab === "list" && (
        <div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setTab("add"); }}>Dodaj novi kafić</button>
          <ul>
            {cafes.map((c) => (
              <li key={c.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                <h2>{c.name}</h2>
                <img src={c.image} alt={c.name} style={{ width: "200px" }} />
                <p>Address: {c.address}</p>
                <p>Score: {c.score}</p>
                <p>Category: {c.category.join(", ")}</p>
                <button onClick={() => handleEdit(c)}>Izmeni</button>
                <button onClick={() => handleDelete(c.id)}>Obriši</button>
                <button onClick={() => setShowComments(showComments === c.id ? null : c.id)}>
                  {showComments === c.id ? "Sakrij komentare" : "Prikaži komentare"}
                </button>
                {showComments === c.id && (
                  <div style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>
                    <h3>Komentari</h3>
                    {comments.filter((com) => com.cafe_id === c.id).map((com) => (
                      <div key={com.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "5px" }}>
                        <strong>{com.name}</strong> ({com.score}/10): {com.text}
                      </div>
                    ))}
                    <div>
                      <input
                        type="text"
                        placeholder="Ime"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                      />
                      <textarea
                        placeholder="Komentar"
                        value={commentForm.text}
                        onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                      />
                      <br />
                      <label>Ocena: </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={commentForm.score}
                        onChange={(e) => setCommentForm({ ...commentForm, score: Number(e.target.value) })}
                      />
                      <button onClick={() => handleAddComment(c.id)}>Dodaj komentar</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "add" && (
        <div>
          <h2>{editId ? "Izmeni" : "Dodaj novi kafić"}</h2>
          {/* Forma za unos */}
          <div>
            <label>Naziv: </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label>Adresa: </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label>Ocena: </label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.score}
              onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Radno vreme: </label>
            <input
              type="text"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
            />
          </div>
          <div>
            <label>Instagram: </label>
            <input
              type="text"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            />
          </div>
          <div>
            <label>Opis: </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label>Must try: </label>
            <input
              type="text"
              value={form.must_try}
              onChange={(e) => setForm({ ...form, must_try: e.target.value })}
            />
          </div>
          <div>
            <label>Best time: </label>
            <input
              type="text"
              value={form.best_time}
              onChange={(e) => setForm({ ...form, best_time: e.target.value })}
            />
          </div>
          <div>
            <label>Cena: </label>
            <select
              value={form.price_range}
              onChange={(e) => setForm({ ...form, price_range: e.target.value })}
            >
              <option>1-500 din</option>
              <option>501-1000 din</option>
              <option>1001-2000 din</option>
              <option>2001+ din</option>
            </select>
          </div>
          <div>
            <label>Slika URL: </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>
          <div>
            <label>Galerija 1 URL: </label>
            <input
              type="text"
              value={form.gallery1}
              onChange={(e) => setForm({ ...form, gallery1: e.target.value })}
            />
          </div>
          <div>
            <label>Galerija 2 URL: </label>
            <input
              type="text"
              value={form.gallery2}
              onChange={(e) => setForm({ ...form, gallery2: e.target.value })}
            />
          </div>
          <div>
            <label>Galerija 3 URL: </label>
            <input
              type="text"
              value={form.gallery3}
              onChange={(e) => setForm({ ...form, gallery3: e.target.value })}
            />
          </div>
          <div>
            <label>Kategorije: </label>
            <input
              type="text"
              placeholder="Razdvojene zarezom"
              onBlur={(e) => setForm({ ...form, category: e.target.value.split(",").map((c) => c.trim()) })}
            />
            <div>Trenutne kategorije: {form.category.join(", ")}</div>
          </div>
          <div>
            <label>Tagovi: </label>
            <input
              type="text"
              placeholder="Razdvojene zarezom"
              onBlur={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()) })}
            />
            <div>Trenutni tagovi: {form.tags.join(", ")}</div>
          </div>

          {/* Ocene */}
          <div>
            <h3>Ocene</h3>
            {Object.keys(form.ratings).map((key) => (
              <div key={key}>
                <label>{key}: </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={(form.ratings as any)[key]}
                  onChange={(e) =>
                    setForm({ ...form, ratings: { ...form.ratings, [key]: Number(e.target.value) } })
                  }
                />
              </div>
            ))}
          </div>

          <button onClick={handleSave}>{editId ? "Sačuvaj izmene" : "Dodaj"}</button>
          <button onClick={() => { setForm(emptyForm); setTab("list"); }}>Otkaži</button>
        </div>
      )}
    </div>
  );
}

// Tip za komentare
type Comment = {
  id: number;
  cafe_id: number;
  name: string;
  email: string;
  text: string;
  score: number;
  created_at: string;
};
