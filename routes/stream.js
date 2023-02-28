const express = require("express");
const AWS = require("aws-sdk");
const Post = require("../models/Post");

const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: "ap-south-1",
  accessKeyId: "AKIASY7P4RMDZD6C6BZT",
  secretAccessKey: "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",
});

const router = express.Router();

router.get("/video/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.redirect("/error");
  const range = req.headers.range;
  const params = {
    Bucket: "my-video-bucket-123",
    Key: post.videoKey.split(
      "https://my-video-bucket-123.s3.ap-south-1.amazonaws.com/"
    )[1],
  };

  s3.headObject(params, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    const fileSize = data.ContentLength;

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

module.exports = router;
