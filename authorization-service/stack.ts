import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import config from '../config';

export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const basicAuthorizerLambda = new lambda.Function(this, 'basicAuthorizer', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('authorization-service'),
      handler: 'lambda/basicAuthorizer.handler',
      functionName: 'nodejs-aws-shop-import-stack-basicAuthorizer',
      environment: {
        sch_aa_vk: config.AUTHORIZATION_PASSWORD,
      }
    });

    new cdk.CfnOutput(this, 'BasicAuthorizerFunctionArn', {
      value: basicAuthorizerLambda.functionArn,
      exportName: 'BasicAuthorizerFunctionArn',
    });
  }
}