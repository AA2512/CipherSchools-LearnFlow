const express = require("express");
const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
const { ensureAuth } = require("../middleware/auth");

const router = express.Router();

const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: "ap-south-1",
  accessKeyId: "AKIASY7P4RMDZD6C6BZT",
  secretAccessKey: "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",
});

router.get("/video", (req, res) => {
  console.log("Here");
  const range = req.headers.range;
  const params = {
    Bucket: "my-video-bucket-123",
    Key: "Placewit - WebD English (2023-02-26 11_16 GMT 5_30).mp4",
  };

  s3.headObject(params, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    const fileSize = data.ContentLength;
    console.log(fileSize);

    const chunkSize = 1 * 1e6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, fileSize - 1);
    const contentLength = end - start + 1;

    const readStream = s3
      .getObject({
        ...params,
        Range: `bytes=${start}-${end}`,
      })
      .createReadStream();
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    });

    readStream.pipe(res);
  });
});

router.get("/", ensureAuth, async (req, res) => {
  const contentType = req.query.contentType;
  const user = req.user;
  console.log(contentType);
  const fileName =
    user.googleID +
    "/" +
    req.query.fileName.split(".")[0] +
    uuid() +
    "." +
    contentType.split("/")[1];

  console.log(fileName);

  const url = await s3.getSignedUrl("putObject", {
    Bucket: "my-video-bucket-123",
    ContentType: contentType,
    Key: fileName,
  });

  res.json({
    url,
    key: fileName,
  });
});

module.exports = router;
