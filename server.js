// ********** IMPORT DEPENDENCIES **********
const express = require("express"); // Import Express framework
const dotenv = require("dotenv"); // Import dotenv for environment variables
const mongoose = require("mongoose"); // Import Mongoose to interact with MongoDB
const Fruit = require("./models/fruit.js"); // Import the Fruit model from fruit.js

// ********** INITIALIZE EXPRESS **********
const app = express(); // Create an instance of Express

// ********** LOAD ENVIRONMENT VARIABLES **********
dotenv.config(); // Loads environment variables from .env file

// ********** CONNECT TO MONGODB **********
mongoose.connect(process.env.MONGODB_URI); // Connects to MongoDB

// Event listeners for database connection status
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on("error", (error) => {
  console.log(`An error connecting to MongoDB has occurred: ${error}`);
});
// Using try/catch for best error handling practice

// ********** MIDDLEWARE **********
// Body parser middleware: Reads form data and makes it accessible in req.body
app.use(express.urlencoded({ extended: false }));

// ********** ROUTES **********

// 🏠 LANDING PAGE ROUTE (GET) - Renders the homepage
app.get("/", async (req, res) => {
  res.render("index.ejs"); // Loads index.ejs file as the homepage
});

// ➕ NEW FRUIT FORM ROUTE (GET) - Displays a form to add a new fruit
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs"); // Loads the form page for adding a fruit
});

// ✅ CREATE FRUIT ROUTE (POST) - Processes form submission & adds fruit to the database
app.post("/fruits", async (req, res) => {
  // Convert form checkbox value into a boolean (true/false)
  req.body.isReadyToEat = !!req.body.isReadyToEat;
  
  // Create new fruit entry in the database
  await Fruit.create(req.body);
  
  // Redirect to the index page to display all fruits
  res.redirect("/fruits");
});

// 📜 INDEX OF FRUITS ROUTE (GET) - Displays a list of all fruits
app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find({}); // Fetches all fruits from the database
  res.render("fruits/index.ejs", { fruits: allFruits }); // Renders the index page
});

// 🔍 SHOW FRUIT ROUTE (GET) - Displays details of a single fruit
app.get("/fruits/:fruitId", async (req, res) => {
    try {
        const foundFruit = await Fruit.findById(req.params.fruitId);
        if (!foundFruit) {
            return res.status(404).send("Fruit not found");
        }
        res.render("fruits/show.ejs", { fruit: foundFruit });
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid Fruit ID");
    }
});

// ********** START SERVER **********
app.listen(3000, () => {
  console.log("Making a CRUD-y Salad on Port 3000"); // Server is running
});