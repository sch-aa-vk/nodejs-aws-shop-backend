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

    if (!('price' in item) || !('description' in item) || !('title' in item) || !('count' in item)) {
      return createNotFoundResponse({ message: 'Missing required filed. Please insert followinf data: price, title, description, count' });
    }

    if (typeof item.price !== 'number') {
      return createNotFoundResponse({ message: 'Price must be a number' });
    }

    if (item.price <= 0) {
      return createNotFoundResponse({ message: 'Price must be greater than 0' });
    }

    if (typeof item.count !== 'number') {
      return createNotFoundResponse({ message: 'Count must be a number' });
    }

    if (item.count <= 0) {
      return createNotFoundResponse({ message: 'Count must be greater than 0' });
    }

    if (typeof item.title !== 'string' || item.title.length < 1) {
      return createNotFoundResponse({ message: 'Title must be a string' });
    }

    if (typeof item.description !== 'string' || item.description.length < 1) {
      return createNotFoundResponse({ message: 'Description must be a string' });
    }

    const productId = crypto.randomUUID();
    
    await dynamodb.send(new PutCommand({
      TableName: String(process.env.PRODUCTS_TABLE_NAME),
      Item: {
        title: item.title,
        description: item.description,
        price: item.price,
        id: productId,
      },
    }));

    await dynamodb.send(new PutCommand({
      TableName: String(process.env.STOCKS_TABLE_NAME),
      Item: {
        count: item.count,
        product_id: productId,
      },
    }));

    return createSuccessResponse({ message: 'Product created', id: productId });
  } catch (error) {
    console.error('Error inserting data:', error);

    return createErrorResponse({ message: 'Error inserting data' });
  }
};  