#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NodejsAwsShopBackendStack } from './stack';

const app = new cdk.App();
new NodejsAwsShopBackendStack(app, 'NodejsAwsShopBackendStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  stackName: 'NodejsAwsShopBackendStack',
  description: 'The AWS CDK stack for the Node.js AWS Shop Backend',
  tags: {
    project: 'nodejs-aws-shop',
    stack: 'backend',
  },
});