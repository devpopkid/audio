import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/download', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    let videoId;

    if (query.includes('youtube.com') || query.includes('youtu.be')) {
      videoId = query.includes('v=') ? query.split('v=')[1].split('&')[0] : query.split('/').pop();
    } else {
      const ytSearch = await axios.get(`https://noobs-api.top/yt/search?query=${encodeURIComponent(query)}`);
      videoId = ytSearch.data?.result?.videos?.[0]?.videoId;
    }

    const dlRes = await axios.get(`https://noobs-api.top/dipto/ytDl3?link=${videoId}&format=mp3`);
    const dlData = dlRes.data;

    res.json({
      downloadLink: dlData.downloadLink,
      title: dlData.title,
      videoId
    });

  } catch (err) {
    console.error('API ERROR:', err.message);
    res.status(500).json({ error: 'Failed to fetch download.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Popkid GLE server running on http://localhost:${PORT}`);
});
