const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// models
const SampleData = require('./models/sampleData');
const User = require('./models/userModel');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = 'mongodb+srv://thaoptt:Aa12345678@spark.annevtg.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// API route to handle the sample data from the front-end
app.post('/api/sample-data', async (req, res) => {
  const sampleData = req.body;
  console.log('Sample data received from the front-end:', sampleData);

  try {
    // Save the sample data to MongoDB
    const newSampleData = new SampleData(sampleData);
    await newSampleData.save();

    console.log('Sample data saved to MongoDB');

    // Send a response to the front-end
    res.json({ message: 'Sample data received and processed successfully!' });
  } catch (error) {
    console.error('Error saving sample data to MongoDB:', error);
    res.status(500).json({ error: 'An error occurred while saving the data.' });
  }
});

// API route to handle the user registration data from the front-end
app.post('/api/user', async (req, res) => {
  const user = req.body;
  console.log('User data received from the front-end:', user);

  try {
    // Save the sample data to MongoDB
    const newUser = new User(user);
    await newUser.save();

    console.log('User data saved to MongoDB');

    // Send a response to the front-end
    res.json({ 
      firstName: user.first_name, 
      lastName: user.last_name 
    });

  } catch (error) {
    console.error('Error saving user data to MongoDB:', error);
    res.status(500).json({ error: 'An error occurred while saving the user.' });
  }
});

// API route to check if the email already exists in the database
app.get('/api/user/check-email/:email', async (req, res) => {
  const { email } = req.params;

  console.log(email);

  try {
    const existingUser = await User.findOne({ email });

    // If a user with the given email exists, return a response indicating it exists
    if (existingUser) {
      return res.json({ exists: true });
    }

    // If the email does not exist, return a response indicating it doesn't exist
    res.json({ exists: false });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'An error occurred while checking the email.' });
  }
});

//API route to handle user login from front-end
app.post('/api/login', async (req, res) => {
  const  { email, password } = req.body;
  console.log(email);
  console.log(password);

  try {
    const user = await User.findOne({ email});

    if (!user) {
      return res.status(403).json({ message: 'User not found. Please check your email.' });
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

// API route to get user's data like first name, last name etc. based on email on login
app.get('/api/user-data/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Fetch the user data based on the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user data
    res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      // Include other user-related information here if available
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to search for users based on the query parameter
app.get('/api/users', async (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query parameter is required.' });
  }

  try {
    // Perform the Mongoose query to find users with names matching the search query
    const filteredUsers = await User.find({ name: { $regex: new RegExp(searchQuery, 'i') } });

    res.json(filteredUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



