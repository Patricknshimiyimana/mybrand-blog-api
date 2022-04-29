const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const helmet = require('helmet');
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const queryRoutes = require('./routes/query');
const swaggerFile = require("./swagger_output.json");

dotenv.config();

const app = express();

const PATH = "./images/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, PATH));
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    req.body.imageUrl = fileName;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});

app.use(cors());
app.use(helmet());

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(upload.single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/query', queryRoutes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect( process.env.MONGODB_URI )
  .then(result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => console.log(err));
