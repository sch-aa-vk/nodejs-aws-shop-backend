import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { DATABASE } from "../database/index";
import { createErrorResponse, createNotFoundResponse, createSuccessResponse } from "../utils/response";

exports.handler = async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters as APIGatewayProxyEventPathParameters;

  if (!productId || isNaN(Number(productId))) {
    return createErrorResponse({ message: 'Invalid product id' });
  }

  const product = DATABASE.find((product) => product.id === Number(productId));

  if (!product) {
    return createNotFoundResponse({ message: 'Product not found' });
  }

  return createSuccessResponse({ product });
};