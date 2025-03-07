// models/fruit.js - Blueprint for each item in the database

const mongoose = require('mongoose'); // Import Mongoose to interact with MongoDB

// Define the structure (schema) for a fruit document
const fruitSchema = new mongoose.Schema({
  name: String, // Name of the fruit (text)
  isReadyToEat: Boolean, // True or False (whether the fruit is ready to eat)
});

// Create a model based on the schema
// This model allows us to create, read, update, and delete fruits in the database
const Fruit = mongoose.model("Fruit", fruitSchema); 

// Export the model so other files can use it
module.exports = Fruit;