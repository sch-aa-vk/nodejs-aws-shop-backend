import { DATABASE } from "../database";
import { createSuccessResponse } from "../utils/response";

export const handler = async () => {
  return createSuccessResponse(DATABASE);
};