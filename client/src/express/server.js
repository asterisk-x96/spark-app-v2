const express = require('express');
const mongoose = require('mongoose');
const uri = "mongodb+srv://thaoptt:<password>@spark.annevtg.mongodb.net/?retryWrites=true&w=majority";


const app = express();
const port = 3000;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});