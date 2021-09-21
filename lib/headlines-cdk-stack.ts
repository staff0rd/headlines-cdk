import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';

export class HeadlinesCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'headlines-cdk-bucket');
    new NodejsFunction(this, 'headlines-cdk-parseFeed', {
      // memorySize: 1024,
      // timeout: cdk.Duration.seconds(5),
      // runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handle',
      entry: path.join(__dirname, `/../src/parseFeed.ts`),
    });
  }
}
