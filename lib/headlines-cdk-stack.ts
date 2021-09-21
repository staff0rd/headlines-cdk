import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";
import { Rule, Schedule } from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";

export class HeadlinesCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "headlines-cdk-bucket");
    const handler = new NodejsFunction(this, "headlines-cdk-parseFeed", {
      handler: "handle",
      entry: path.join(__dirname, `/../src/parseFeed.ts`),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    bucket.grantReadWrite(handler);

    const eventTarget = new targets.LambdaFunction(handler);
    new Rule(this, "headless-cdk-schedule", {
      schedule: Schedule.rate(cdk.Duration.hours(1)),
      targets: [eventTarget],
    });
  }
}
