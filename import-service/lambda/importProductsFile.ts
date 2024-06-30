import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { s3Client } from "../storage";
import { createErrorResponse, createNotFoundResponse, createSuccessResponse } from "../utils/response";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log('Incomig request:', event);

  try {
    const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
    
    if (!queryParams || !queryParams.name) {
      return createNotFoundResponse({ message: 'Missing name parameter' });
    }

    const name = queryParams.name;

    const signedUrl = s3Client.getSignedUrl('putObject', {
      Bucket: String(process.env.IMPORTS_BUCKET_NAME),
      Key: `uploaded/${name}`,
      ContentType: 'text/csv',
      Expires: 60,
    });

    return createSuccessResponse(signedUrl);
  } catch (error) {
    console.error('Error inserting data:', error);

    return createErrorResponse(error);
  }
};  