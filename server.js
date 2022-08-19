const express = require("express"),
  multer = require("multer"),
  fs = require("fs"),
  uploadData = require("./upload");
app = express();
require("dotenv").config();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

app.post("/api/single", upload.single("media"), async (req, res) => {
  console.log(process.env.MY_PINATA_API_KEY);
  const result = await uploadData.uploadToPinata(
    process.env.MY_PINATA_API_KEY,
    process.env.MY_PINATA_SECRET_KEY,
    req.file.originalname
  );
  console.log("result", result);
  return res.send("singel file uploaded successfully");
});

const port = process.env.PORT || 8000;
app.listen(port, console.log(`running on port ${port}`));
