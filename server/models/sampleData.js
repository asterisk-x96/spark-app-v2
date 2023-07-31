const mongoose = require('mongoose');

const sampleDataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const SampleData = mongoose.model('SampleData', sampleDataSchema);

module.exports = SampleData;