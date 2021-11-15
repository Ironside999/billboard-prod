const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  apiVersion: process.env.ARVAN_API_VERSION,
  accessKeyId: process.env.ARVAN_ACCESS_KEY_ID,
  secretAccessKey: process.env.ARVAN_SECRET_KEY,
  endpoint: process.env.ARVAN_END_POINT,
});

const deleteSingleObject = ({ Bucket, Key }) => {
  s3.deleteObject({ Bucket, Key }, function (err, data) {
    if (err) throw err;
  });
};

const deleteMultipleObjects = ({ Bucket, Objects }) => {
  let params = {
    Bucket,
    Delete: {
      Objects,
      Quiet: false,
    },
  };

  s3.deleteObjects(params, function (err, data) {
    if (err) throw err;
    else return data;
  });
};

module.exports = {
  deleteSingleObject,
  deleteMultipleObjects,
};
