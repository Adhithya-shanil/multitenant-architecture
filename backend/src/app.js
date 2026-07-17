const express = require('express');
const cors = require('cors');
const storesRouter = require('./routes/stores.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/stores', storesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
