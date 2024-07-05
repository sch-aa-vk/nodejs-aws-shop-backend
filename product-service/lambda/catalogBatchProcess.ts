import { SQSEvent } from "aws-lambda";
import { createErrorResponse, createNotFoundResponse, createSuccessResponse } from "../utils/response";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb } from "../database/dynamodbClient";

export const handler = async (event: SQSEvent) => {
  console.log('Incomig request:', event);

  try {
    const body = JSON.parse(event.Records[0].body);

    if (!('price' in body) || !('description' in body) || !('title' in body) || !('count' in body)) {
      return createNotFoundResponse({ message: 'Missing required filed. Please insert followinf data: price, title, description, count' });
    }

    if (typeof body.price !== 'number' && isNaN(body.price)) {
      return createNotFoundResponse({ message: 'Price must be a number' });
    }

    if (+body.price <= 0) {
      return createNotFoundResponse({ message: 'Price must be greater than 0' });
    }

    if (typeof body.count !== 'number' && isNaN(body.count)) {
      return createNotFoundResponse({ message: 'Count must be a number' });
    }

    if (+body.count <= 0) {
      return createNotFoundResponse({ message: 'Count must be greater than 0' });
    }

    if (typeof body.title !== 'string' || body.title.length < 1) {
      return createNotFoundResponse({ message: 'Title must be a string' });
    }

    if (typeof body.description !== 'string' || body.description.length < 1) {
      return createNotFoundResponse({ message: 'Description must be a string' });
    }

    const productId = crypto.randomUUID();

    await dynamodb.send(new PutCommand({
      TableName: String(process.env.PRODUCTS_TABLE_NAME),
      Item: {
        title: body.title,
        description: body.description,
        price: +body.price,
        id: productId,
      },
    }));

    await dynamodb.send(new PutCommand({
      TableName: String(process.env.STOCKS_TABLE_NAME),
      Item: {
        count: +body.count,
        product_id: productId,
      },
    }));

    return createSuccessResponse({ message: 'Product created', id: productId });
  } catch (error) {
    console.error('Error inserting data:', error);

    return createErrorResponse({ message: 'Error inserting data' });
  }
};  