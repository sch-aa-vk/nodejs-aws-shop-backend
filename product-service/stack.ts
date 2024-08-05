import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import config from '../config';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'nodejs-aws-shop-product-stack-api', {
      restApiName: 'Node.js AWS Shop API',
      description: 'The AWS CDK Product stack for the Node.js AWS Shop Backend API',
    });

    const catalogItemsQueue = new sqs.Queue(this, 'CatalogItemsQueue', {
      queueName: 'nodejs-aws-shop-product-stack-catalogItemsQueue',
    });

    const createProductTopic = new sns.Topic(this, 'CreateProductTopic', {
      topicName: 'nodejs-aws-shop-product-stack-createProductTopic',
    });

    const dynamodbPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:Scan', 'dynamodb:PutItem', 'dynamodb:GetItem'],
      resources: ['*'],
    });

    const sqsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sqs:ReceiveMessage'],
      resources: ['*'],
    });

    const snsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sns:Publish'],
      resources: ['*'],
    });

    const getProductsListLambda = new lambda.Function(this, 'getProductsList', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('product-service'),
      handler: 'lambda/getProductsList.handler',
      functionName: 'nodejs-aws-shop-product-stack-getProductsList',
      environment: {
        PRODUCTS_TABLE_NAME: config.PRODUCTS_TABLE_NAME,
        STOCKS_TABLE_NAME: config.STOCKS_TABLE_NAME,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });

    const getProductsByIdLambda = new lambda.Function(this, 'getProductsById', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('product-service'),
      handler: 'lambda/getProductsById.handler',
      functionName: 'nodejs-aws-shop-product-stack-getProductsById',
      environment: {
        PRODUCTS_TABLE_NAME: config.PRODUCTS_TABLE_NAME,
        STOCKS_TABLE_NAME: config.STOCKS_TABLE_NAME,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });

    const createProductLambda = new lambda.Function(this, 'createProduct', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('product-service'),
      handler: 'lambda/createProduct.handler',
      functionName: 'nodejs-aws-shop-product-stack-createProduct',
      environment: {
        PRODUCTS_TABLE_NAME: config.PRODUCTS_TABLE_NAME,
        STOCKS_TABLE_NAME: config.STOCKS_TABLE_NAME,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });

    const catalogBatchProcessLambda = new lambda.Function(this, 'catalogBatchProcess', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('product-service'),
      handler: 'lambda/catalogBatchProcess.handler',
      functionName: 'nodejs-aws-shop-product-stack-catalogBatchProcess',
      environment: {
        PRODUCTS_TABLE_NAME: config.PRODUCTS_TABLE_NAME,
        STOCKS_TABLE_NAME: config.STOCKS_TABLE_NAME,
        SNS_TOPIC_ARN: createProductTopic.topicArn,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });
    
    getProductsListLambda.addToRolePolicy(dynamodbPolicy);
    getProductsByIdLambda.addToRolePolicy(dynamodbPolicy);
    createProductLambda.addToRolePolicy(dynamodbPolicy);
    catalogBatchProcessLambda.addToRolePolicy(dynamodbPolicy);

    catalogBatchProcessLambda.addToRolePolicy(sqsPolicy);
    catalogBatchProcessLambda.addToRolePolicy(snsPolicy);

    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsListLambda));
    products.addResource('{productId}').addMethod('GET', new apigateway.LambdaIntegration(getProductsByIdLambda));
    products.addMethod('POST', new apigateway.LambdaIntegration(createProductLambda));

    catalogBatchProcessLambda.addEventSource(new lambdaEventSources.SqsEventSource(catalogItemsQueue, {
      batchSize: 5
    }));

    createProductTopic.addSubscription(new subs.EmailSubscription(config.MY_EMAIL, {
      filterPolicy: {
        count: sns.SubscriptionFilter.stringFilter({
          allowlist: ['more than 100']
        }),
      },
    }));

    new cdk.CfnOutput(this, "CatalogItemsQueueArn", {
      value: catalogItemsQueue.queueArn,
      exportName: "CatalogItemsQueueArn",
    });
  }
}