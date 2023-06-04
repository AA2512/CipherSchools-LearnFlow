const express = require("express");
const { v4: uuid } = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { ensureAuth } = require("../middleware/auth");

const router = express.Router();

const publicS3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: String(process.env.TRAINITY_AWS_S3_PUBLIC_ACCESS_KEY),
    secretAccessKey: String(process.env.TRAINITY_AWS_S3_SECRET_ACCESS_KEY),
  },
});

const privateS3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: String(
      process.env.TRAINITY_PROTECTED_AWS_S3_PUBLIC_ACCESS_KEY
    ),
    secretAccessKey: String(
      process.env.TRAINITY_PROTECTED_AWS_S3_SECRET_ACCESS_KEY
    ),
  },
});

router.get("/get/preSignedUrl", async (req, res) => {
  const contentType = req.query.contentType;
  const type = req.query.uploadType;
  const bucketType = req.query.bucket || "public";
  const fileName =
    type +
    "/" +
    req.query.fileName.split(".")[0] +
    "-" +
    uuid() +
    "." +
    contentType.split("/")[1];

  if (bucketType === "protected") {
    const command = new PutObjectCommand({
      Bucket: "trainity-protected-bucket",
      Key: fileName,
      ContentType: contentType,
    });

    console.log(command);

    const url = await getSignedUrl(privateS3, command, {
      expiresIn: 7200,
    });
    return res.json({
      url,
      key: fileName,
    });
  }

  const command = new PutObjectCommand({
    Bucket: "trainity-public-bucket",
    Key: fileName,
    ContentType: contentType,
  });

  const url = await getSignedUrl(publicS3, command, { expiresIn: 3600 });
  return res.json({
    url,
    key: fileName,
  });
});

module.exports = router;
