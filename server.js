const express = require('express');
const connectDB = require('./config/database.js');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require("connect-mongo");
const path = require('path'); // Import path for resolving directory paths
require("dotenv").config();

const app = express();
connectDB()
// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views')); // Adjust the path as needed

// Middleware
app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
const dbString = process.env.DB_URL;

app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 86400000 },
    store: MongoStore.create({ mongoUrl: dbString, }),
    resave: false,
    saveUninitialized: true,
    //store: new MemoryStore({ checkPeriod: 86400000 }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Define routes (assuming routes are in a separate file)
const routes = require('./routes/index');
app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
