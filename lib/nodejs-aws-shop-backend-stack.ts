import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class NodejsAwsShopBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const customFunction = new lambda.Function(this, 'FunctionID', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('src/lambda'),
      handler: 'lambda.handler',
    });

    const api = new apigateway.LambdaRestApi(this, 'ApiGatewayID', {
      handler: customFunction,
      proxy: false,
    });
        
    const resource = api.root.addResource('lamdbaPath');
    resource.addMethod('GET');
  }
}