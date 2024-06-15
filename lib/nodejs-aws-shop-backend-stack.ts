import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

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

    const api = new apigateway.RestApi(this, 'ApiGatewayID');

    const productsResource = this.createLambdaWithResource('getProductsList', 'src/lambda', 'products', HttpMethodEnum.GET, api.root);
    this.createLambdaWithResource('getProductById', 'src/lambda', '{productId}', HttpMethodEnum.GET, productsResource);
  }

  private createLambdaWithResource(functionId: string, handler: string, resourcePath: string, method: HttpMethod, api: cdk.aws_apigateway.Resource | cdk.aws_apigateway.IResource) {
    const fn = new lambda.Function(this, functionId, {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('src/lambda'),
      handler: `${functionId}.handler`,
    });

    const resource = api.addResource(resourcePath);
    resource.addMethod(method, new apigateway.LambdaIntegration(fn));

    return resource;
  }
}