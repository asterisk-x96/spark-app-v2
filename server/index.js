const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// models
const SampleData = require('./models/sampleData');
const User = require('./models/userModel');
const Goal = require('./models/goalModel')

const app = express();
const server = http.createServer(app);
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

// API route to handle user login from front-end
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
      id: user._id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      email: user.email,
      fund: user.fund,
      password: user.password
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

// API route to get user fund based on user id
app.get('/api/user-fund/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userFund = user.fund;
    return res.json({ fund: userFund });
  } catch (error) {
    console.error('Error fetching user fund:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// API route to add money to user's fund
app.post('/api/update-fund/:userId', express.json(), async (req, res) => {
  const { userId, addedAmount } = req.body;

  console.log(userId, addedAmount);
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  console.log(user);

  user.fund += addedAmount;
  await user.save();
  res.json({ message: 'Fund added successfully', userFund: user.fund });
});

// API route to create new goal
app.post('/api/create-goal', async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      selectedCategory,
      buddy,
      currentUser, // Assuming you have a way to get the current user ID
      isPenaltyEnabled,
      dailyPenalty,
      fund,
      isCompleted
    } = req.body;

    // Create a new goal instance using the Goal model
    const newGoal = new Goal({
      title,
      description,
      due_date: dueDate,
      category: selectedCategory,
      buddy,
      creator: currentUser,
      penalty_enabled: isPenaltyEnabled,
      daily_penalty: dailyPenalty,
      created_date: new Date().toISOString(),
      fund,
      isCompleted
    });

    // Save the new goal to the database
    await newGoal.save();

    res.json({ message: 'Goal created successfully', goal: newGoal });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API route to get goals based on user ID
app.get('/api/get-goals/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const goals = await Goal.find({ $or: [{ creator: userId }, { buddy: userId }] });

    res.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to get goal details based on goal ID
app.get('/api/get-goal-details/:goalId', async (req, res) => {
  try {
    const goalId = req.params.goalId;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ goal });
  } catch (error) {
    console.error('Error fetching goal details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// API to search for user by name, username or email
app.get('/api/search-users', async (req, res) => {
  const searchQuery = req.query.q;
  
  try {
    const results = await User.find({
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } },
      ],
    });

    res.json({ results });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// API to update user profile
app.put('/api/update-user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const {
    firstName,
    lastName,
    bio,
    email,
    profilePicture
  } = req.body;

  try {
    // Fetch the user based on the provided userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile fields
    user.first_name = firstName;
    user.last_name = lastName;
    user.bio = bio;
    user.email = email;
    user.avatar = profilePicture;

    // Save the updated user to the database
    await user.save();

    // Respond with the updated user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API route to update user password
app.post('/update-password/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Find the user by userId
    const user = await User.findOne({ _id: userId });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided current password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the new hashed password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



