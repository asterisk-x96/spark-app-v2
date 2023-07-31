const express = require('express');
const authRoutes = require('../routes/authRoutes');

const app = express();
const port = 3000;

// Middleware and other setup
app.use(express.json());

// Routes
app.use(api, authRoutes);

// Other routes and middleware
// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});