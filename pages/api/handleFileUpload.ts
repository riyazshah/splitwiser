import aws from 'aws-sdk';

export default async function handler(req, res) {
  aws.config.update({
    region: 'us-east-1',
  });
  const s3 = new aws.S3();
  const post = await s3.createPresignedPost({
    Bucket: "splitwiserstack-splitwiseruploadbucket51fd079b-18trqtddfvf0v",
    Fields: {
      key: req.query.file,
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });

  res.status(200).json(post);
}