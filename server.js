// Import dependencies - required modules
const express = require("express");
const dotenv = require("dotenv");// put above mongoose
const mongoose = require("mongoose");
const Fruit = require("./models/fruit.js");// Import the Fruit model from fruit.js

// Initialize Express
const app = express();

// Load environment variables
dotenv.config(); // Loads evironment variables from .env file

// Connect to MongoDB using the connection string from .env - (can do an eventListener)
mongoose.connect(process.env.MONGODB_URI);//needs to be below dot.env

// Log connection status to the terminal on start 
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on('error', (error) => {
    console.log(`An error connecting to MongoDb has occurred: ${error}`)
})
//try/catch best practice for errors

//middleware

//body parser middleware: this function reads the request body
//and decodes it into req.body so we can access form data
app.use(express.urlencoded({ extended: false }))



// *** ROUTES ***

// Landing Page GET -  (index.ejs)
app.get("/", async (req, res) => {
  res.render("index.ejs"); // Renders the landing page
});

// Form page GET - form for adding a new fruit/new.ejs
app.get('/fruits/new', (req, res) => {
    //never add a trailing slash with render (the / before fruits folder)
  res.render('fruits/new.ejs');
});

// POST /fruits - recieve form submissions
app.post("/fruits", async (req, res) => {
    // if (req.body.isReadyToEat === "on") {//this is a string
    //   req.body.isReadyToEat = true;//we need to change it to a boolean
    // } else {
    //   req.body.isReadyToEat = false;
    // }
    req.body.isReadyToEat = !!req.body.isReadyToEat//(double exclamation marks (!!) are a shortcut to convert any value into a strict true or false. )
    //create the data in our database
    await Fruit.create(req.body);
    res.redirect("/fruits");
  });

//index of fruits route for fruits
app.get('/fruits', async(req, res) => {
    const allFruits = await Fruit.find({})
    res.render('fruits/index.ejs', {fruits: allFruits})
})
//UPDATE*add new fruit

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log("Making a CRUD-y Salad on Port 3000");
});