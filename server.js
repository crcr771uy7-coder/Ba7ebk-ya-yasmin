import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
const isProd = process.env.NODE_ENV === "production";
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const dataDir = path.join(__dirname, "data");
const dbFilePath = path.join(dataDir, "db.json");
const defaultDb = {
  messages: [
    {
      id: "msg-1",
      sender: "mohamed",
      text: "\u0648\u062D\u0634\u062A\u064A\u0646\u064A \u0623\u0648\u064A \u064A\u0627 \u064A\u0627\u0633\u0645\u064A\u0646\u060C \u0631\u0628\u0646\u0627 \u064A\u062E\u0644\u064A\u0643\u064A \u0644\u064A\u0627 \u0648\u062A\u0641\u0636\u0644\u064A \u062F\u0627\u064A\u0645\u064B\u0627 \u0633\u0631 \u0636\u062D\u0643\u062A\u064A \u2764\uFE0F",
      timestamp: "\u0627\u0644\u064A\u0648\u0645\u060C 10:30 \u0645"
    },
    {
      id: "msg-2",
      sender: "yasmine",
      text: "\u0648\u0625\u0646\u062A \u0643\u0645\u0627\u0646 \u064A\u0627 \u0645\u062D\u0645\u062F\u060C \u0645\u0641\u064A\u0634 \u0641\u064A \u0627\u0644\u062F\u0646\u064A\u0627 \u0643\u0644\u0647\u0627 \u062D\u062F \u0632\u064A\u0643 \u0648\u0644\u0627 \u0641\u064A \u063A\u0644\u0627\u0648\u062A\u0643 \u0639\u0646\u062F\u064A \u{1F338}",
      timestamp: "\u0627\u0644\u064A\u0648\u0645\u060C 10:32 \u0645"
    }
  ],
  memories: [
    {
      id: "mem-1",
      date: "2026-10-11",
      title: "\u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0644\u064A \u0637\u0631\u064A\u0642\u0646\u0627 \u0627\u062A\u0642\u0627\u0628\u0644 \u0641\u064A\u0647 \u{1F48D}",
      author: "\u0645\u062D\u0645\u062F \u0648\u064A\u0627\u0633\u0645\u064A\u0646",
      body: "\u0623\u062C\u0645\u0644 \u0635\u062F\u0641\u0629 \u0641\u064A \u062A\u0627\u0631\u064A\u062E \u062D\u064A\u0627\u062A\u0646\u0627\u060C \u0644\u0645\u0627 \u0628\u062F\u0623\u062A \u062D\u0643\u0627\u064A\u062A\u0646\u0627 \u0648\u0623\u062F\u0631\u0643\u0646\u0627 \u0625\u0646 \u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u0644\u064A \u062C\u0627\u064A\u0629 \u0643\u0644\u0647\u0627 \u0647\u062A\u0643\u0648\u0646 \u0623\u062C\u0645\u0644 \u0648\u0625\u062D\u0646\u0627 \u0633\u0648\u0627.",
      image: ""
    },
    {
      id: "mem-2",
      date: "2026-01-08",
      title: "\u0627\u062D\u062A\u0641\u0627\u0644\u0646\u0627 \u0628\u0639\u064A\u062F \u0645\u064A\u0644\u0627\u062F \u064A\u0627\u0633\u0645\u064A\u0646 \u{1F338}",
      author: "\u0645\u062D\u0645\u062F",
      body: "\u064A\u0648\u0645 \u0645\u0645\u064A\u0632 \u0623\u0648\u064A\u060C \u0641\u0631\u062D\u062A\u0647\u0627 \u0641\u064A \u0627\u0644\u064A\u0648\u0645 \u062F\u0647 \u0643\u0627\u0646\u062A \u0643\u0641\u064A\u0644\u0629 \u062A\u0645\u0644\u0649 \u0642\u0644\u0628\u064A \u0646\u0648\u0631 \u0648\u0641\u0631\u062D\u0629 \u0645\u062A\u062A\u0648\u0635\u0641\u0634.",
      image: ""
    },
    {
      id: "mem-3",
      date: "2026-11-28",
      title: "\u0639\u064A\u062F \u0645\u064A\u0644\u0627\u062F \u0645\u062D\u0645\u062F \u0648\u0623\u0648\u0644 \u0647\u062F\u064A\u0629 \u062D\u0644\u0648\u0629 \u{1F451}",
      author: "\u064A\u0627\u0633\u0645\u064A\u0646",
      body: "\u0623\u0648\u0644 \u0645\u0631\u0629 \u0623\u062D\u0633 \u0625\u0646 \u0639\u064A\u062F \u0645\u064A\u0644\u0627\u062F \u0634\u062E\u0635 \u062A\u0627\u0646\u064A \u0647\u0648 \u0639\u064A\u062F\u064A \u0623\u0646\u0627 \u0643\u0645\u0627\u0646\u060C \u0631\u0628\u0646\u0627 \u064A\u062D\u0641\u0638\u0643 \u0644\u064A\u0627 \u064A\u0627 \u0623\u063A\u0644\u0649 \u0627\u0644\u0646\u0627\u0633.",
      image: ""
    }
  ],
  dreams: [
    { id: "d-1", title: "\u0646\u0633\u0627\u0641\u0631 \u0628\u0627\u0631\u064A\u0633 \u0648\u0646\u0634\u0648\u0641 \u0628\u0631\u062C \u0625\u064A\u0641\u0644 \u0648\u0625\u062D\u0646\u0627 \u0645\u0627\u0633\u0643\u064A\u0646 \u0625\u064A\u062F \u0628\u0639\u0636 \u{1F5FC}", desc: "\u0646\u062A\u0645\u0634\u0649 \u0639\u0644\u0649 \u0646\u0647\u0631 \u0627\u0644\u0633\u064A\u0646 \u0648\u0646\u0627\u0643\u0644 \u0643\u0631\u0648\u0627\u0633\u0648\u0646 \u0648\u0646\u062A\u0635\u0648\u0631 \u0623\u062D\u0644\u0649 \u0635\u0648\u0631.", author: "\u0645\u062D\u0645\u062F \u0648\u064A\u0627\u0633\u0645\u064A\u0646", completed: false },
    { id: "d-2", title: "\u0646\u0639\u0645\u0644 \u0628\u064A\u062A \u062C\u0645\u064A\u0644 \u062F\u0627\u0641\u064A \u0641\u064A\u0647 \u0631\u0643\u0646 \u0644\u0644\u0642\u0647\u0648\u0629 \u0648\u0642\u0637\u0629 \u0634\u0642\u064A\u0629 \u{1F3E1}\u{1F431}", desc: "\u0645\u0643\u0627\u0646 \u062E\u0627\u0635 \u0628\u064A\u0646\u0627 \u0645\u0627\u0644\u064A\u0627\u0646 \u062D\u0628 \u0648\u0647\u062F\u0648\u0621 \u0648\u0623\u0644\u0648\u0627\u0646 \u0645\u0628\u0647\u062C\u0629.", author: "\u064A\u0627\u0633\u0645\u064A\u0646", completed: false },
    { id: "d-3", title: "\u0646\u0639\u0645\u0644 \u0623\u0644\u0628\u0648\u0645 \u0635\u0648\u0631 \u0645\u0637\u0628\u0648\u0639 \u0643\u0628\u064A\u0631 \u0644\u0643\u0644 \u0645\u0643\u0627\u0646 \u0646\u0632\u0648\u0631\u0647 \u{1F4F8}", desc: "\u0646\u0643\u062A\u0628 \u062A\u062D\u062A \u0643\u0644 \u0635\u0648\u0631\u0629 \u062D\u0643\u0627\u064A\u062A\u0647\u0627 \u0648\u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0644\u064A \u0627\u062A\u0635\u0648\u0631\u062A \u0641\u064A\u0647.", author: "\u0645\u062D\u0645\u062F", completed: true },
    { id: "d-4", title: "\u0646\u062D\u0642\u0642 \u0623\u0639\u0644\u0649 \u0627\u0644\u062F\u0631\u062C\u0627\u062A \u0648\u0646\u062A\u0641\u0648\u0642 \u0641\u064A \u062F\u0631\u0627\u0633\u062A\u0646\u0627 \u0648\u0646\u0641\u0631\u062D \u0623\u0647\u0627\u0644\u064A\u0646\u0627 \u{1F393}", desc: "\u0646\u0634\u062C\u0639 \u0628\u0639\u0636 \u0639\u0644\u0649 \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629 \u0648\u0646\u0648\u0635\u0644 \u0644\u0643\u0644 \u0647\u062F\u0641 \u0628\u0646\u062D\u0644\u0645 \u0628\u064A\u0647.", author: "\u0645\u062D\u0645\u062F \u0648\u064A\u0627\u0633\u0645\u064A\u0646", completed: false },
    { id: "d-5", title: "\u0646\u0631\u0648\u062D \u0631\u062D\u0644\u0629 \u0644\u0644\u0628\u062D\u0631 \u0648\u0646\u062A\u0641\u0631\u062C \u0639\u0644\u0649 \u0627\u0644\u063A\u0631\u0648\u0628 \u0633\u0648\u0627 \u{1F305}", desc: "\u0646\u0633\u0645\u0639 \u0635\u0648\u062A \u0627\u0644\u0645\u0648\u062C \u0648\u0646\u062A\u0643\u0644\u0645 \u0641\u064A \u0643\u0644 \u062D\u0627\u062C\u0629 \u0641\u064A \u0647\u062F\u0648\u0621.", author: "\u0645\u062D\u0645\u062F \u0648\u064A\u0627\u0633\u0645\u064A\u0646", completed: true }
  ],
  quizAnswers: {
    mohamed: {},
    yasmine: {}
  },
  quizHighScore: {
    score: 0,
    holder: ""
  },
  photos: [],
  lastUpdated: Date.now()
};
function readDb() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dbFilePath)) {
      fs.writeFileSync(dbFilePath, JSON.stringify(defaultDb, null, 2), "utf-8");
      return defaultDb;
    }
    const raw = fs.readFileSync(dbFilePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json:", err);
    return defaultDb;
  }
}
function writeDb(data) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    data.lastUpdated = Date.now();
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing db.json:", err);
    return false;
  }
}
app.get("/healthz", (_req, res) => {
  res.status(200).send("OK");
});
app.get("/api/sync", (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    data: db,
    serverTime: Date.now()
  });
});
app.get("/api/messages", (_req, res) => {
  const db = readDb();
  res.json({ success: true, messages: db.messages || [] });
});
app.post("/api/messages", (req, res) => {
  const { sender, text, timestamp } = req.body;
  if (!text || !sender) {
    return res.status(400).json({ success: false, error: "text and sender required" });
  }
  const db = readDb();
  const newMsg = {
    id: "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
    sender,
    text: String(text).trim(),
    timestamp: timestamp || (/* @__PURE__ */ new Date()).toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" })
  };
  db.messages = db.messages || [];
  db.messages.push(newMsg);
  writeDb(db);
  res.json({ success: true, message: newMsg, allMessages: db.messages });
});
app.put("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const db = readDb();
  db.messages = db.messages || [];
  const msg = db.messages.find((m) => m.id === id);
  if (!msg) {
    return res.status(404).json({ success: false, error: "Message not found" });
  }
  msg.text = String(text || "").trim();
  writeDb(db);
  res.json({ success: true, allMessages: db.messages });
});
app.delete("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.messages = (db.messages || []).filter((m) => m.id !== id);
  writeDb(db);
  res.json({ success: true, allMessages: db.messages });
});
app.get("/api/dreams", (_req, res) => {
  const db = readDb();
  res.json({ success: true, dreams: db.dreams || [] });
});
app.post("/api/dreams", (req, res) => {
  const { title, author, desc, completed } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: "Title required" });
  }
  const db = readDb();
  const newDream = {
    id: "dream-" + Date.now(),
    title: String(title).trim(),
    author: author || "\u0645\u062D\u0645\u062F \u0648\u064A\u0627\u0633\u0645\u064A\u0646",
    desc: desc || "",
    completed: Boolean(completed)
  };
  db.dreams = db.dreams || [];
  db.dreams.push(newDream);
  writeDb(db);
  res.json({ success: true, dream: newDream, allDreams: db.dreams });
});
app.patch("/api/dreams/:id/toggle", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.dreams = db.dreams || [];
  const d = db.dreams.find((x) => x.id === id);
  if (!d) {
    return res.status(404).json({ success: false, error: "Dream not found" });
  }
  d.completed = !d.completed;
  writeDb(db);
  res.json({ success: true, dream: d, allDreams: db.dreams });
});
app.put("/api/dreams/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, desc, completed } = req.body;
  const db = readDb();
  db.dreams = db.dreams || [];
  const d = db.dreams.find((x) => x.id === id);
  if (!d) {
    return res.status(404).json({ success: false, error: "Dream not found" });
  }
  if (title !== void 0) d.title = String(title).trim();
  if (author !== void 0) d.author = author;
  if (desc !== void 0) d.desc = desc;
  if (completed !== void 0) d.completed = Boolean(completed);
  writeDb(db);
  res.json({ success: true, allDreams: db.dreams });
});
app.delete("/api/dreams/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.dreams = (db.dreams || []).filter((x) => x.id !== id);
  writeDb(db);
  res.json({ success: true, allDreams: db.dreams });
});
app.get("/api/memories", (_req, res) => {
  const db = readDb();
  res.json({ success: true, memories: db.memories || [] });
});
app.post("/api/memories", (req, res) => {
  const { title, date, author, body, image } = req.body;
  if (!title || !body) {
    return res.status(400).json({ success: false, error: "Title and body required" });
  }
  const db = readDb();
  const newMem = {
    id: "mem-" + Date.now(),
    date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    title: String(title).trim(),
    author: author || "\u0645\u062D\u0645\u062F \u0648\u064A\u0627\u0633\u0645\u064A\u0646",
    body: String(body).trim(),
    image: image || ""
  };
  db.memories = db.memories || [];
  db.memories.unshift(newMem);
  writeDb(db);
  res.json({ success: true, memory: newMem, allMemories: db.memories });
});
app.put("/api/memories/:id", (req, res) => {
  const { id } = req.params;
  const { title, date, author, body, image } = req.body;
  const db = readDb();
  db.memories = db.memories || [];
  const mem = db.memories.find((m) => m.id === id);
  if (!mem) {
    return res.status(404).json({ success: false, error: "Memory not found" });
  }
  if (title !== void 0) mem.title = String(title).trim();
  if (date !== void 0) mem.date = date;
  if (author !== void 0) mem.author = author;
  if (body !== void 0) mem.body = String(body).trim();
  if (image !== void 0) mem.image = image;
  writeDb(db);
  res.json({ success: true, allMemories: db.memories });
});
app.delete("/api/memories/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.memories = (db.memories || []).filter((m) => m.id !== id);
  writeDb(db);
  res.json({ success: true, allMemories: db.memories });
});
app.get("/api/quiz-answers", (_req, res) => {
  const db = readDb();
  res.json({
    success: true,
    quizAnswers: db.quizAnswers || { mohamed: {}, yasmine: {} },
    quizHighScore: db.quizHighScore || { score: 0, holder: "" }
  });
});
app.post("/api/quiz-answers", (req, res) => {
  const { player, answers } = req.body;
  if (!player || !answers || player !== "mohamed" && player !== "yasmine") {
    return res.status(400).json({ success: false, error: "Valid player and answers required" });
  }
  const db = readDb();
  db.quizAnswers = db.quizAnswers || { mohamed: {}, yasmine: {} };
  db.quizAnswers[player] = { ...db.quizAnswers[player], ...answers };
  writeDb(db);
  res.json({ success: true, quizAnswers: db.quizAnswers });
});
app.post("/api/quiz-score", (req, res) => {
  const { score, holder } = req.body;
  const db = readDb();
  const currentHigh = db.quizHighScore?.score || 0;
  if (Number(score) > currentHigh) {
    db.quizHighScore = {
      score: Number(score),
      holder: holder || ""
    };
    writeDb(db);
  }
  res.json({ success: true, quizHighScore: db.quizHighScore });
});
app.get("/api/photos", (_req, res) => {
  const db = readDb();
  res.json({ success: true, photos: db.photos || [] });
});
app.post("/api/photos", (req, res) => {
  const { id, title, date, data } = req.body;
  if (!data) {
    return res.status(400).json({ success: false, error: "Photo data required" });
  }
  const db = readDb();
  const newPhoto = {
    id: id || "photo-" + Date.now(),
    title: title || "\u0635\u0648\u0631\u0629 \u0645\u0646 \u0639\u0627\u0644\u0645\u0646\u0627 \u2764\uFE0F",
    date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    data
  };
  db.photos = db.photos || [];
  db.photos.unshift(newPhoto);
  writeDb(db);
  res.json({ success: true, photo: newPhoto, allPhotos: db.photos });
});
app.delete("/api/photos/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.photos = (db.photos || []).filter((p) => p.id !== id);
  writeDb(db);
  res.json({ success: true, allPhotos: db.photos });
});
async function setupFrontend() {
  if (!isProd) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"), (err) => {
        if (err) {
          res.sendFile(path.join(__dirname, "index.html"));
        }
      });
    });
  }
  app.listen(port, "0.0.0.0", () => {
    console.log(`\u{1F680} Mohamed & Yasmine Server running on http://0.0.0.0:${port} [${isProd ? "production" : "development"}]`);
  });
}
setupFrontend().catch((err) => {
  console.error("Failed to start server:", err);
});
