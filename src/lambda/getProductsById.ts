import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { DATABASE } from "../database/index";
import { createErrorResponse, createNotFoundResponse, createSuccessResponse } from "../utils/response";
import { ProductType } from "../utils/types";

export const handler = async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters as APIGatewayProxyEventPathParameters;

  if (!productId || isNaN(Number(productId))) {
    return createErrorResponse({ message: 'Invalid product id' });
  }

  const product: ProductType | undefined = DATABASE.find((product) => product.id === Number(productId));

  if (!product) {
    return createNotFoundResponse({ message: 'Product not found' });
  }

  return createSuccessResponse({ product });
};