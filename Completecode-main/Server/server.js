const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
require("dotenv").config();


const app = express();

const port = 5000;

// Use middleware to parse incoming JSON requests
// app.use(bodyParser.json());
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Enable cookies and authentication headers if needed
}));

// Import the newproject route
const newProjectRouteCML5480 = require('./Routes/CML5480/NewprojectCML5480');
const Loremir96gc1 = require('./Routes/Ir96rgigc1');
const usersRoute = require("./Routes/routes/usersRoute");


// Define a route
app.get('/', (req, res) => {
  res.send('Hello, this is your Node.js server!');
});

// Use the newproject route middleware for the '/newproject' path
app.use('/newprojectCML5480', newProjectRouteCML5480);
app.use('/ir96gc1',Loremir96gc1 );
app.use("/users", usersRoute);


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
