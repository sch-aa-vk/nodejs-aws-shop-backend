import { APIGatewayProxyEvent } from "aws-lambda";
import { createErrorResponse, createNotFoundResponse, createSuccessResponse } from "../utils/response";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb } from "../database/dynamodbClient";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log('Incomig request:', event);

  try {
    const body = event.body;

    if (!body) {
      return createNotFoundResponse({ message: 'Missing event body' });
    }

    const item = JSON.parse(body);

    if (!('price' in item) || !('description' in item) || !('title' in item)) {
      return createNotFoundResponse({ message: 'Missing required filed. Please insert followinf data: price, title, description' });
    }

    const { $metadata: { httpStatusCode } } = await dynamodb.send(new PutCommand({
      TableName: String(process.env.PRODUCTS_TABLE_NAME),
      Item: {
        ...item,
        id: crypto.randomUUID(),
      },
    }));

    if (httpStatusCode !== 200) {
      throw new Error('Status code is not 200');
    }

    return createSuccessResponse({ message: 'Product created' });
  } catch (error) {
    console.error('Error inserting data:', error);

    return createErrorResponse({ message: 'Error inserting data' });
  }
};  