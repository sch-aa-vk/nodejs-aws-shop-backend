import { DATABASE } from "../database";
import { createSuccessResponse } from "../utils/response";

exports.handler = async () => {
  return createSuccessResponse({ products: DATABASE });
};