const express = require('express');
const AppError = require('../../appError/appError');
const userAuth = require('../../middleware/userAuth');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  apiVersion: process.env.ARVAN_API_VERSION,
  accessKeyId: process.env.ARVAN_ACCESS_KEY_ID,
  secretAccessKey: process.env.ARVAN_SECRET_KEY,
  endpoint: process.env.ARVAN_END_POINT,
});

const router = new express.Router();

router.post('/api/upload/image', userAuth, async (req, res, next) => {
  if (!req.body.name || !req.body.type)
    return next(new AppError('File does not have name or type', 400));

  let key = `${req.user.id}-${uuidv4()}-${req.body.name}`;

  let params = {
    Key: key,
    ContentType: req.body.type,
    Expires: 10000,
    Bucket: process.env.BILLBOARD_BUCKET,
  };

  s3.getSignedUrl('putObject', params, (err, url) =>
    err ? res.status(400).send(err) : res.send({ key, url })
  );
});

router.get('/api/list/bucket', userAuth, async (req, res) => {
  s3.listBuckets((err, data) => {
    if (err) return res.send(err);

    res.send(data);
  });
});

router.post('/api/set/bucket/policy', userAuth, async (req, res) => {
  let params = {
    Bucket: process.env.BILLBOARD_BUCKET,
    Policy:
      '{"Version": "2012-10-17", "Statement": [{ "Sid": "id-1","Effect": "Allow","Principal": "*", "Action": [ "s3:PutObject","s3:GetObject"], "Resource": ["arn:aws:s3:::bilboard/*" ] } ]}',
  };

  s3.putBucketPolicy(params, (err, data) => {
    if (err) return res.status(400).send(err);

    res.send(data);
  });
});

router.post('/api/set/bucket/cors', userAuth, async (req, res) => {
  let params = {
    Bucket: process.env.BILLBOARD_BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['PUT', 'GET', 'POST'],
          AllowedOrigins: ['*'],
        },
      ],
    },
  };
  s3.putBucketCors(params, function (err, data) {
    if (err) res.status(400).send(err);
    else res.send(data);
  });
});

router.get('/api/get/bucket/policy', userAuth, async (req, res) => {
  let params = {
    Bucket: process.env.BILLBOARD_BUCKET,
  };

  s3.getBucketPolicy(params, (err, data) => {
    if (err) return res.send(err);

    res.send(data);
  });
});

router.get('/api/get/bucket/cors', userAuth, async (req, res) => {
  let params = {
    Bucket: process.env.BILLBOARD_BUCKET,
  };

  s3.getBucketCors(params, (err, data) => {
    if (err) return res.send(err);

    res.send(data);
  });
});

module.exports = router;
