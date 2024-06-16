import { DATABASE } from "../database";
import { createNotFoundResponse, createSuccessResponse } from "../utils/response";

exports.handler = async () => {
  if (DATABASE && DATABASE.length > 0) {
    return createSuccessResponse({ products: DATABASE });
  }

  return createNotFoundResponse({ message: 'Products not found' });
};