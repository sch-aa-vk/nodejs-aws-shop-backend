import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { createErrorResponse, createNotFoundResponse, createSuccessResponse } from "../utils/response";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb } from "../database/dynamodbClient";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log('Incomig request:', event);

  try {
    const { productId } = event.pathParameters as APIGatewayProxyEventPathParameters;

    if (!productId) {
      return createErrorResponse({ message: 'Invalid product id' });
    }

    const { Item: product } = await dynamodb.send(new GetCommand({
      TableName: String(process.env.PRODUCTS_TABLE_NAME),
      Key: {
        id: productId,
      },
    }));

    const { Item: stock } = await dynamodb.send(new GetCommand({
      TableName: String(process.env.STOCKS_TABLE_NAME),
      Key: {
        product_id: productId,
      },
    }));

    if (!product) {
      return createNotFoundResponse({ message: 'Product not found' });
    }

    const productWithStock = {
      ...product,
      count: stock?.count || 0,
    }

    return createSuccessResponse(productWithStock);
  } catch (error) {
    console.error('Error fetching data:', error);

    return createErrorResponse({ message: 'Error fetching data' });
  }
};