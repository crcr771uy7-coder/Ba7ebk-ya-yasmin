import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Support JSON body up to 25MB for base64 photo sync
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// CORS headers for flexibility
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Database file path: persisted on disk in data/db.json
const dataDir = path.join(__dirname, 'data');
const dbFilePath = path.join(dataDir, 'db.json');

const defaultDb = {
  messages: [
    {
      id: "msg-1",
      sender: "mohamed",
      text: "وحشتيني أوي يا ياسمين، ربنا يخليكي ليا وتفضلي دايمًا سر ضحكتي ❤️",
      timestamp: "اليوم، 10:30 م"
    },
    {
      id: "msg-2",
      sender: "yasmine",
      text: "وإنت كمان يا محمد، مفيش في الدنيا كلها حد زيك ولا في غلاوتك عندي 🌸",
      timestamp: "اليوم، 10:32 م"
    }
  ],
  memories: [
    {
      id: "mem-1",
      date: "2026-10-11",
      title: "اليوم اللي طريقنا اتقابل فيه 💍",
      author: "محمد وياسمين",
      body: "أجمل صدفة في تاريخ حياتنا، لما بدأت حكايتنا وأدركنا إن الأيام اللي جاية كلها هتكون أجمل وإحنا سوا.",
      image: ""
    },
    {
      id: "mem-2",
      date: "2026-01-08",
      title: "احتفالنا بعيد ميلاد ياسمين 🌸",
      author: "محمد",
      body: "يوم مميز أوي، فرحتها في اليوم ده كانت كفيلة تملى قلبي نور وفرحة متتوصفش.",
      image: ""
    },
    {
      id: "mem-3",
      date: "2026-11-28",
      title: "عيد ميلاد محمد وأول هدية حلوة 👑",
      author: "ياسمين",
      body: "أول مرة أحس إن عيد ميلاد شخص تاني هو عيدي أنا كمان، ربنا يحفظك ليا يا أغلى الناس.",
      image: ""
    }
  ],
  dreams: [
    { id: "d-1", title: "نسافر باريس ونشوف برج إيفل وإحنا ماسكين إيد بعض 🗼", desc: "نتمشى على نهر السين وناكل كرواسون ونتصور أحلى صور.", author: "محمد وياسمين", completed: false },
    { id: "d-2", title: "نعمل بيت جميل دافي فيه ركن للقهوة وقطة شقية 🏡🐱", desc: "مكان خاص بينا ماليان حب وهدوء وألوان مبهجة.", author: "ياسمين", completed: false },
    { id: "d-3", title: "نعمل ألبوم صور مطبوع كبير لكل مكان نزوره 📸", desc: "نكتب تحت كل صورة حكايتها واليوم اللي اتصورت فيه.", author: "محمد", completed: true },
    { id: "d-4", title: "نحقق أعلى الدرجات ونتفوق في دراستنا ونفرح أهالينا 🎓", desc: "نشجع بعض على المذاكرة ونوصل لكل هدف بنحلم بيه.", author: "محمد وياسمين", completed: false },
    { id: "d-5", title: "نروح رحلة للبحر ونتفرج على الغروب سوا 🌅", desc: "نسمع صوت الموج ونتكلم في كل حاجة في هدوء.", author: "محمد وياسمين", completed: true }
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
      fs.writeFileSync(dbFilePath, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const raw = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return defaultDb;
  }
}

function writeDb(data: typeof defaultDb) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    data.lastUpdated = Date.now();
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 🔄 REST API Endpoints for Full Cross-Device Synchronization
// -------------------------------------------------------------

// 1. Health check
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// 2. Full Sync (GET /api/sync)
app.get('/api/sync', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    data: db,
    serverTime: Date.now()
  });
});

// 3. Mutual Messages API
app.get('/api/messages', (_req, res) => {
  const db = readDb();
  res.json({ success: true, messages: db.messages || [] });
});

app.post('/api/messages', (req, res) => {
  const { sender, text, timestamp } = req.body;
  if (!text || !sender) {
    return res.status(400).json({ success: false, error: 'text and sender required' });
  }

  const db = readDb();
  const newMsg = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    sender,
    text: String(text).trim(),
    timestamp: timestamp || new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })
  };

  db.messages = db.messages || [];
  db.messages.push(newMsg);
  writeDb(db);

  res.json({ success: true, message: newMsg, allMessages: db.messages });
});

app.put('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const db = readDb();
  db.messages = db.messages || [];
  const msg = db.messages.find((m: any) => m.id === id);
  if (!msg) {
    return res.status(404).json({ success: false, error: 'Message not found' });
  }
  msg.text = String(text || '').trim();
  writeDb(db);
  res.json({ success: true, allMessages: db.messages });
});

app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.messages = (db.messages || []).filter((m: any) => m.id !== id);
  writeDb(db);
  res.json({ success: true, allMessages: db.messages });
});

// 4. Dreams & Progress API
app.get('/api/dreams', (_req, res) => {
  const db = readDb();
  res.json({ success: true, dreams: db.dreams || [] });
});

app.post('/api/dreams', (req, res) => {
  const { title, author, desc, completed } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: 'Title required' });
  }
  const db = readDb();
  const newDream = {
    id: 'dream-' + Date.now(),
    title: String(title).trim(),
    author: author || 'محمد وياسمين',
    desc: desc || '',
    completed: Boolean(completed)
  };
  db.dreams = db.dreams || [];
  db.dreams.push(newDream);
  writeDb(db);
  res.json({ success: true, dream: newDream, allDreams: db.dreams });
});

app.patch('/api/dreams/:id/toggle', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.dreams = db.dreams || [];
  const d = db.dreams.find((x: any) => x.id === id);
  if (!d) {
    return res.status(404).json({ success: false, error: 'Dream not found' });
  }
  d.completed = !d.completed;
  writeDb(db);
  res.json({ success: true, dream: d, allDreams: db.dreams });
});

app.put('/api/dreams/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, desc, completed } = req.body;
  const db = readDb();
  db.dreams = db.dreams || [];
  const d = db.dreams.find((x: any) => x.id === id);
  if (!d) {
    return res.status(404).json({ success: false, error: 'Dream not found' });
  }
  if (title !== undefined) d.title = String(title).trim();
  if (author !== undefined) d.author = author;
  if (desc !== undefined) d.desc = desc;
  if (completed !== undefined) d.completed = Boolean(completed);
  writeDb(db);
  res.json({ success: true, allDreams: db.dreams });
});

app.delete('/api/dreams/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.dreams = (db.dreams || []).filter((x: any) => x.id !== id);
  writeDb(db);
  res.json({ success: true, allDreams: db.dreams });
});

// 5. Memories API
app.get('/api/memories', (_req, res) => {
  const db = readDb();
  res.json({ success: true, memories: db.memories || [] });
});

app.post('/api/memories', (req, res) => {
  const { title, date, author, body, image } = req.body;
  if (!title || !body) {
    return res.status(400).json({ success: false, error: 'Title and body required' });
  }
  const db = readDb();
  const newMem = {
    id: 'mem-' + Date.now(),
    date: date || new Date().toISOString().split('T')[0],
    title: String(title).trim(),
    author: author || 'محمد وياسمين',
    body: String(body).trim(),
    image: image || ''
  };
  db.memories = db.memories || [];
  db.memories.unshift(newMem);
  writeDb(db);
  res.json({ success: true, memory: newMem, allMemories: db.memories });
});

app.put('/api/memories/:id', (req, res) => {
  const { id } = req.params;
  const { title, date, author, body, image } = req.body;
  const db = readDb();
  db.memories = db.memories || [];
  const mem = db.memories.find((m: any) => m.id === id);
  if (!mem) {
    return res.status(404).json({ success: false, error: 'Memory not found' });
  }
  if (title !== undefined) mem.title = String(title).trim();
  if (date !== undefined) mem.date = date;
  if (author !== undefined) mem.author = author;
  if (body !== undefined) mem.body = String(body).trim();
  if (image !== undefined) mem.image = image;
  writeDb(db);
  res.json({ success: true, allMemories: db.memories });
});

app.delete('/api/memories/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.memories = (db.memories || []).filter((m: any) => m.id !== id);
  writeDb(db);
  res.json({ success: true, allMemories: db.memories });
});

// 6. Quiz Answers & High Score API
app.get('/api/quiz-answers', (_req, res) => {
  const db = readDb();
  res.json({
    success: true,
    quizAnswers: db.quizAnswers || { mohamed: {}, yasmine: {} },
    quizHighScore: db.quizHighScore || { score: 0, holder: '' }
  });
});

app.post('/api/quiz-answers', (req, res) => {
  const { player, answers } = req.body;
  if (!player || !answers || (player !== 'mohamed' && player !== 'yasmine')) {
    return res.status(400).json({ success: false, error: 'Valid player and answers required' });
  }
  const db = readDb();
  db.quizAnswers = db.quizAnswers || { mohamed: {}, yasmine: {} };
  db.quizAnswers[player] = { ...db.quizAnswers[player], ...answers };
  writeDb(db);
  res.json({ success: true, quizAnswers: db.quizAnswers });
});

app.post('/api/quiz-score', (req, res) => {
  const { score, holder } = req.body;
  const db = readDb();
  const currentHigh = db.quizHighScore?.score || 0;
  if (Number(score) > currentHigh) {
    db.quizHighScore = {
      score: Number(score),
      holder: holder || ''
    };
    writeDb(db);
  }
  res.json({ success: true, quizHighScore: db.quizHighScore });
});

// 7. Photos API
app.get('/api/photos', (_req, res) => {
  const db = readDb();
  res.json({ success: true, photos: db.photos || [] });
});

app.post('/api/photos', (req, res) => {
  const { id, title, date, data } = req.body;
  if (!data) {
    return res.status(400).json({ success: false, error: 'Photo data required' });
  }
  const db = readDb();
  const newPhoto = {
    id: id || 'photo-' + Date.now(),
    title: title || 'صورة من عالمنا ❤️',
    date: date || new Date().toISOString().split('T')[0],
    data
  };
  db.photos = db.photos || [];
  db.photos.unshift(newPhoto);
  writeDb(db);
  res.json({ success: true, photo: newPhoto, allPhotos: db.photos });
});

app.delete('/api/photos/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.photos = (db.photos || []).filter((p: any) => p.id !== id);
  writeDb(db);
  res.json({ success: true, allPhotos: db.photos });
});

// -------------------------------------------------------------
// 🌐 Static / Vite Frontend Serving
// -------------------------------------------------------------
async function setupFrontend() {
  if (!isProd) {
    // In dev: mount vite.middlewares to handle HMR, CSS, and TS seamlessly
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve the built dist directory
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          res.sendFile(path.join(__dirname, 'index.html'));
        }
      });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Mohamed & Yasmine Server running on http://0.0.0.0:${port} [${isProd ? 'production' : 'development'}]`);
  });
}

setupFrontend().catch((err) => {
  console.error('Failed to start server:', err);
});
