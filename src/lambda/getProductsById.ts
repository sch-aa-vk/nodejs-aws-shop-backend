import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { DATABASE } from "../database/index";
import { createNotFoundResponse, createSuccessResponse } from "../utils/response";

exports.handler = async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters as APIGatewayProxyEventPathParameters;

  if (!productId) {
    return createNotFoundResponse({ message: 'No product id provided' });
  }
  
  if (!DATABASE || DATABASE.length === 0) {
    return createNotFoundResponse({ message: 'Products not found' });
  }

  if (isNaN(Number(productId))) {
    return createNotFoundResponse({ message: 'Invalid product id' });
  }

  const product = DATABASE.find((product) => product.id === Number(productId));

  if (product) {
    return createSuccessResponse({ product });
  }

  return createNotFoundResponse({ message: 'Product not found' });
};