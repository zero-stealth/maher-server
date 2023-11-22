const express = require("express");
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const morgan = require("morgan");
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db");
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');


const app = express();
const PORT = process.env.PORT

connectDB();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(helmet());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_URL }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, 
  },
}));

app.use(morgan('dev'));

app.use("/auth", authRoute);
app.use("/data", adminRoute);

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'app', 'index.html');
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
