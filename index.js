// Initialise the app as an express app
const express = require("express");
const app = express();

// Import all dependencies and dev-dependencies
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const path = require("path");
const multer = require("multer");

// Import all routes
const AuthRoute = require("./routes/auth");
const UsersRoute = require("./routes/users");
const PostsRoute = require("./routes/posts");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected to the backend successfully");
  })
  .catch((err) => console.log(err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Image Upload with multer
app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
  } else {
    try {
      console.log(req.file.filename);
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      return console.error(error);
    }
  }
});

app.use("/api/auth", AuthRoute);
app.use("/api/users", UsersRoute);
app.use("/api/posts", PostsRoute);

// Start the backend server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend server is listening at port ${PORT}`);
});
