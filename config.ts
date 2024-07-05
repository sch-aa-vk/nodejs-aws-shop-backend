import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env") });

interface ENV {
  CDK_DEFAULT_ACCOUNT: string;
  CDK_DEFAULT_REGION: string;
  PRODUCTS_TABLE_NAME: string;
  STOCKS_TABLE_NAME: string;
  IMPORTS_BUCKET_NAME: string;
  CATALOG_BATCH_PROCESS_QUEUE_URL: string;
}

const getConfig = (): ENV => {
  return {
    CDK_DEFAULT_ACCOUNT: String(process.env.CDK_DEFAULT_ACCOUNT),
    CDK_DEFAULT_REGION: String(process.env.CDK_DEFAULT_REGION),
    PRODUCTS_TABLE_NAME: String(process.env.PRODUCTS_TABLE_NAME),
    STOCKS_TABLE_NAME: String(process.env.STOCKS_TABLE_NAME),
    IMPORTS_BUCKET_NAME: String(process.env.IMPORTS_BUCKET_NAME),
    CATALOG_BATCH_PROCESS_QUEUE_URL: String(process.env.CATALOG_BATCH_PROCESS_QUEUE_URL),
  };
};

const config = getConfig();

export default config;