const User = require('./models/userModel');

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to handle user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by their email in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check your email and password.' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password. Please check your email and password.' });
    }

    // If the email and password are valid, generate a JWT token
    const authToken = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

    // Return the authentication token to the client
    res.json({ token: authToken });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = router;