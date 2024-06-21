import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import config from '../config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
enum HttpMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export class NodejsAwsShopBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'nodejs-aws-shop-api', {
      restApiName: 'Node.js AWS Shop API',
      description: 'The AWS CDK stack for the Node.js AWS Shop Backend API',
    });

    const productsResource = this.createLambdaWithResource('getProductsList', 'products', HttpMethodEnum.GET, api.root);
    this.createLambdaWithResource('getProductsById', '{productId}', HttpMethodEnum.GET, productsResource);
  }

  private createLambdaWithResource(functionId: string, resourcePath: string, method: HttpMethod, api: cdk.aws_apigateway.Resource | cdk.aws_apigateway.IResource) {
    const fn = new lambda.Function(this, functionId, {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('src'),
      handler: `lambda/${functionId}.handler`,
      functionName: `nodejs-aws-shop-${functionId}`,
      environment: {
        PRODUCTS_TABLE_NAME: config.PRODUCTS_TABLE_NAME,
        STOCKS_TABLE_NAME: config.STOCKS_TABLE_NAME,
        CDK_DEFAULT_REGION: config.CDK_DEFAULT_REGION,
      }
    });
    
    fn.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:Scan', 'dynamodb:PutItem', 'dynamodb:GetItem'],
      resources: ['*'],
    }));

    const resource = api.addResource(resourcePath);
    resource.addMethod(method, new apigateway.LambdaIntegration(fn));

    return resource;
  }
}