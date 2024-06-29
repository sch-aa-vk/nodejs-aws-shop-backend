import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import config from '../config';

export class NodejsAwsShopBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'nodejs-aws-shop-api', {
      restApiName: 'Node.js AWS Shop API',
      description: 'The AWS CDK stack for the Node.js AWS Shop Backend API',
    });

    const dynamodbPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:Scan', 'dynamodb:PutItem', 'dynamodb:GetItem'],
      resources: ['*'],
    });

    const getProductsListLambda = new lambda.Function(this, 'getProductsList', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('src'),
      handler: `lambda/getProductsList.handler`,
      functionName: `nodejs-aws-shop-getProductsList`,
      environment: {
        PRODUCTS_TABLE_NAME: config.PRODUCTS_TABLE_NAME,
        STOCKS_TABLE_NAME: config.STOCKS_TABLE_NAME,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });

    const getProductsByIdLambda = new lambda.Function(this, 'getProductsById', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('src'),
      handler: `lambda/getProductsById.handler`,
      functionName: `nodejs-aws-shop-getProductsById`,
      environment: {
        PRODUCTS_TABLE_NAME: config.PRODUCTS_TABLE_NAME,
        STOCKS_TABLE_NAME: config.STOCKS_TABLE_NAME,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });

    const createProductLambda = new lambda.Function(this, 'createProduct', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('src'),
      handler: `lambda/createProduct.handler`,
      functionName: `nodejs-aws-shop-createProduct`,
      environment: {
        PRODUCTS_TABLE_NAME: config.PRODUCTS_TABLE_NAME,
        STOCKS_TABLE_NAME: config.STOCKS_TABLE_NAME,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });
    
    getProductsListLambda.addToRolePolicy(dynamodbPolicy);
    getProductsByIdLambda.addToRolePolicy(dynamodbPolicy);
    createProductLambda.addToRolePolicy(dynamodbPolicy);

    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsListLambda));
    products.addResource('{productId}').addMethod('GET', new apigateway.LambdaIntegration(getProductsByIdLambda));
    products.addMethod('POST', new apigateway.LambdaIntegration(createProductLambda));
  }
}