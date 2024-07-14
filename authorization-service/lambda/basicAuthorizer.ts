import { APIGatewayProxyEvent, Callback, Context } from "aws-lambda";

interface CustomAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  authorizationToken?: string;
  methodArn: string;
}

export const handler = async (event: CustomAPIGatewayProxyEvent, context: Context, callback: Callback) => {
  if (!event.authorizationToken) {
    callback('Unauthorized');
    return;
  }

  const token = event.authorizationToken.split(' ')[1];
  const buffer = Buffer.from(token, 'base64');
  const [username, password] = buffer.toString('utf-8').split(':');

  if (password !== process.env[username]) {
    callback('Access denied');
    return;
  }

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: event.methodArn,
      },
    ],
  };

  callback(null, {
    principalId: username,
    policyDocument,
  });
};
