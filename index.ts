#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductServiceStack } from './product-service/stack';
import { ImportServiceStack } from './import-service/stack';
import config from './config';

const app = new cdk.App();

new ProductServiceStack(app,  'ProductServiceStack', {
  env: { account: config.CDK_DEFAULT_ACCOUNT, region: config.CDK_DEFAULT_REGION },
  stackName:  'ProductServiceStack',
  description: 'The AWS CDK Product Service stack for the Node.js AWS Shop Backend',
  tags: {
    project: 'nodejs-aws-shop',
    stack: 'backend',
  },
});

new ImportServiceStack(app,  'ImportServiceStack', {
  env: { account: config.CDK_DEFAULT_ACCOUNT, region: config.CDK_DEFAULT_REGION },
  stackName:  'ImportServiceStack',
  description: 'The AWS CDK Import Service stack for the Node.js AWS Shop Backend',
  tags: {
    project: 'nodejs-aws-shop',
    stack: 'backend',
  },
});