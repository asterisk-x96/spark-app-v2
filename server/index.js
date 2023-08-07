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

// API route to get user's data based on email
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
      id: user._id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
      password: user.password,
      avatar: user.avatar,
      friends: user.friends,
      fund: user.fund,
      // Include other user-related information here if available
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API route to get user's data based on user's id
app.get('/api/user-details/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user data based on the provided userId
    const user = await User.findOne({ _id: userId }); // Use _id field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user data
    res.status(200).json({
      id: _id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
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

// API route to render other user's profile page
app.get('/api/user-profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch the user profile data from the database based on the username
    const userProfile = await User.findOne({ username });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Do not include the user's hashed password in the response
    userProfile.password = undefined;

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Respond with the user profile data
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API route to get user's friends based on user ID
app.get('/api/get-friends/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user based on the provided userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's friends array
    res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.error('Error fetching user friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API route to add the user id from the userProfile to the friends field of the current logged-in user
app.put('/api/update-friends/:userId', async (req, res) => {
  const { userId } = req.params;
  const { friends } = req.body; // Updated friends array from the request body

  try {
    // Fetch the current logged-in user based on the provided userId
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    // Update the user's friends with the updated friends array
    currentUser.friends = friends;

    // Save the updated current user to the database
    await currentUser.save();

    // Respond with the updated current user data
    res.status(200).json(currentUser);
  } catch (error) {
    console.error('Error updating friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



