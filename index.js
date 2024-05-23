const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv=require('dotenv')
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
app.use(bodyParser.urlencoded({ extended: false }));
dotenv.config()
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

app.get("/download", async (req, res) => {
  try {
    const key =process.env.objectkey
    const command = new GetObjectCommand({
      Bucket: "netthreads",
      Key: key,
    });
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${key}"`);
    const s3Stream = (await s3.send(command)).Body
    s3Stream.pipe(res);
   
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching data from S3");
  }
});
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
