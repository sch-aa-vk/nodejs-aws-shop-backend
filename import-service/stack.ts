import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import config from '../config';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'nodejs-aws-shop-import-stack-api', {
      restApiName: 'Node.js AWS Shop API',
      description: 'The AWS CDK Import stack for the Node.js AWS Shop Backend API',
    });

    const s3Policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:ListBucket'],
      resources: ['*'],
    });

    const importProductsFileLambda = new lambda.Function(this, 'importProductsFile', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('import-service'),
      handler: 'lambda/importProductsFile.handler',
      functionName: 'nodejs-aws-shop-import-stack-importProductsFile',
      environment: {
        IMPORTS_BUCKET_NAME: config.IMPORTS_BUCKET_NAME,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });

    importProductsFileLambda.addToRolePolicy(s3Policy);

    const imports = api.root.addResource('imports');
    imports.addMethod('GET', new apigateway.LambdaIntegration(importProductsFileLambda));
  }
}