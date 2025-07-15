import express from 'express';
import fs from 'fs';
import cors from 'cors';
import shortid from 'shortid';
import { log } from '../Logging Middleware/log.js'; 
const app = express();

app.use(cors());
app.use(express.json());

const dbFile = './shortUrls.json';
let shortUrls = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile)) : {};


function saveDB() {
  fs.writeFileSync(dbFile, JSON.stringify(shortUrls, null, 2));
}


app.post('/shorturls', async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    await log('backend', 'error', 'controller', 'Invalid URL format');
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const code = shortcode || shortid.generate();

  if (shortUrls[code]) {
    await log('backend', 'error', 'handler', 'Shortcode already exists');
    return res.status(409).json({ error: 'Shortcode already exists' });
  }

  const createdAt = new Date();
  const expiresAt = new Date(Date.now() + validity * 60 * 1000);

  shortUrls[code] = {
    url,
    createdAt,
    expiresAt,
    clickStats: [],
  };

  saveDB();
  await log('backend', 'info', 'controller', `Short URL created for ${code}`);

  return res.status(201).json({
    shortLink: `http:
    //localhost:5000/${code}`,
    expiry: expiresAt.toISOString(),
  });
});


app.get('/shorturls/:code', async (req, res) => {
  const { code } = req.params;
  const data = shortUrls[code];

  if (!data) {
    await log('backend', 'error', 'handler', 'Shortcode not found');
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  return res.json({
    originalUrl: data.url,
    createdAt: data.createdAt,
    expiry: data.expiresAt,
    totalClicks: data.clickStats.length,
    clicks: data.clickStats,
  });
});


app.get('/:code', async (req, res) => {
  const { code } = req.params;
  const data = shortUrls[code];

  if (!data) {
    await log('backend', 'error', 'handler', 'Shortcode not found');
    return res.status(404).send('Not Found');
  }

  if (new Date() > new Date(data.expiresAt)) {
    await log('backend', 'error', 'controller', 'Shortcode expired');
    return res.status(410).send('Link Expired');
  }

  
  data.clickStats.push({
    timestamp: new Date().toISOString(),
    referrer: req.get('Referer') || 'direct',
    location: req.ip,
  });

  saveDB();
  await log('backend', 'info', 'controller', `Redirected ${code}`);

  return res.redirect(data.url);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http:
    //localhost:${PORT}`);
});
