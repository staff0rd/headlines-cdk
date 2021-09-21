import { ScheduledHandler } from "aws-lambda";
import Parser from "rss-parser";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const handle: ScheduledHandler = async () => {
  const feed = await parseFeed();
  await persist(feed);
};

const parseFeed = async () => {
  const feed = await new Parser().parseURL(
    "http://feeds.bbci.co.uk/news/world/rss.xml"
  );
  console.log(`Retrieved ${feed.items.length} items from ${feed.title}`);
  return feed;
};

const persist = async (body: any) => {
  const date = new Date();
  const key = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDay()}/${date.getHours()}${date.getMinutes()}.json`;
  await new S3Client({ region: process.env.AWS_REGION }).send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(body, null, 2),
    })
  );
  console.log(`Saved ${key}`);
};
