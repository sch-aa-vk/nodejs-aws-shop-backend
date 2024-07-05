import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: String(process.env.CDK_DEFAULT_REGION),
});
export const dynamodb = DynamoDBDocumentClient.from(client);

