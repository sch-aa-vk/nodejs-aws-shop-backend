import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb } from "../database/dynamodbClient";
import { createErrorResponse, createSuccessResponse } from "../utils/response";

export const handler = async () => {
  try {
    const { Items: products } = await dynamodb.send(new ScanCommand({
      TableName: String(process.env.PRODUCTS_TABLE_NAME),
    }));

    const { Items: stocks } = await dynamodb.send(new ScanCommand({
      TableName: String(process.env.STOCKS_TABLE_NAME),
    }));

    if (!products || !stocks) {
      throw new Error('Error fetching data');
    }

    const database = products.map((product) => {
      const stock = stocks.find((stock) => stock.product_id === product.id);
      return {
        ...product,
        count: stock?.count || 0,
      };
    });

    return createSuccessResponse(database);
  } catch (error) {
    console.error('Error inserting data:', error);

    return createErrorResponse({ message: 'Error fetching data' });
  }
};