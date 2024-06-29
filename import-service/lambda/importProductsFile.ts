import { APIGatewayProxyEvent } from "aws-lambda";
import { S3 } from "../storage";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createErrorResponse, createSuccessResponse } from "../utils/response";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log('Incomig request:', event);

  try {
    const response = await S3.send(new ListObjectsV2Command({
      Bucket: String(process.env.IMPORTS_BUCKET_NAME),
      Prefix: 'uploaded/',
    }));

    return createSuccessResponse(response.Contents);
  } catch (error) {
    console.error('Error inserting data:', error);
    return createErrorResponse(error);
  }
};  