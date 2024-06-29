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

    if (typeof item.price !== 'number') {
      return createNotFoundResponse({ message: 'Price must be a number' });
    }

    if (item.price <= 0) {
      return createNotFoundResponse({ message: 'Price must be greater than 0' });
    }

    if (typeof item.title !== 'string' || item.title.length < 1) {
      return createNotFoundResponse({ message: 'Title must be a string' });
    }

    if (typeof item.description !== 'string' || item.description.length < 1) {
      return createNotFoundResponse({ message: 'Description must be a string' });
    }

    const productId = crypto.randomUUID();
    const { $metadata: { httpStatusCode } } = await dynamodb.send(new PutCommand({
      TableName: String(process.env.PRODUCTS_TABLE_NAME),
      Item: {
        ...item,
        id: productId,
      },
    }));

    if (httpStatusCode !== 200) {
      throw new Error('Status code is not 200');
    }

    return createSuccessResponse({ message: 'Product created', id: productId });
  } catch (error) {
    console.error('Error inserting data:', error);

    return createErrorResponse({ message: 'Error inserting data' });
  }
};  