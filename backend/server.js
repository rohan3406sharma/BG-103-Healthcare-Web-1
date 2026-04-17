const express = require('express');
const cors = require('cors');
const { seedInitialData } = require('./models/db');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// Main Router
app.use('/api', routes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await seedInitialData();
  console.log(`Server running on http://localhost:${PORT}`);
});
