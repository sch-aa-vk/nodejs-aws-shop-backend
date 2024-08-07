import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from 'constructs';
import config from '../config';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const basicAuthorizerFunctionArn = cdk.Fn.importValue('BasicAuthorizerFunctionArn');
    const basicAuthorizerLambda = lambda.Function.fromFunctionArn(this, 'ImportedAuthorizerFunction', basicAuthorizerFunctionArn);

    const basicAuthorizer = new apigateway.TokenAuthorizer(this, 'BasicAuthorizer', {
      handler: basicAuthorizerLambda,
    });

    const api = new apigateway.RestApi(this, 'nodejs-aws-shop-import-stack-api', {
      restApiName: 'Node.js AWS Shop API',
      description: 'The AWS CDK Import stack for the Node.js AWS Shop Backend API',
    });

    const s3Bucket = new s3.Bucket(this, "nodejs-aws-shop-backend-bucket", {
      bucketName: 'nodejs-aws-shop-backend-bucket',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.DELETE],
          allowedHeaders: ['*'],
        }
      ]
    });

    const catalogItemsQueue = sqs.Queue.fromQueueArn(
      this,
      "CatalogItemsQueue",
      cdk.Fn.importValue("CatalogItemsQueueArn")
    );

    const s3Policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:PutObject', 's3:GetObject', 's3:ListBucket', 's3:DeleteObject', 's3:CopyObject'],
      resources: ['*'],
    });

    const s3Event = new S3EventSource(s3Bucket, {
      events: [s3.EventType.OBJECT_CREATED],
      filters: [{ prefix: 'uploaded/' }],
    });

    const sqsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sqs:SendMessage'],
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

    const importFileParserLambda = new lambda.Function(this, 'importFileParser', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('import-service'),
      handler: 'lambda/importFileParser.handler',
      functionName: 'nodejs-aws-shop-import-stack-importFileParser',
      environment: {
        IMPORTS_BUCKET_NAME: config.IMPORTS_BUCKET_NAME,
        CATALOG_BATCH_PROCESS_QUEUE_URL: catalogItemsQueue.queueUrl,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });

    const imports = api.root.addResource('import');
    imports.addMethod('GET', new apigateway.LambdaIntegration(importProductsFileLambda), {
      requestParameters: {
        'method.request.querystring.name': true,
      },
      authorizer: basicAuthorizer,
    });

    importFileParserLambda.addEventSource(s3Event);

    importProductsFileLambda.addToRolePolicy(s3Policy);
    importFileParserLambda.addToRolePolicy(s3Policy);

    importFileParserLambda.addToRolePolicy(sqsPolicy);
  }
}