#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NodejsAwsShopBackendStack } from './stack';
import config from '../config';

const app = new cdk.App();
new NodejsAwsShopBackendStack(app, 'NodejsAwsShopBackendStack', {
  env: { account: config.CDK_DEFAULT_ACCOUNT, region: config.CDK_DEFAULT_REGION },
  stackName: 'NodejsAwsShopBackendStack',
  description: 'The AWS CDK stack for the Node.js AWS Shop Backend',
  tags: {
    project: 'nodejs-aws-shop',
    stack: 'backend',
  },
});