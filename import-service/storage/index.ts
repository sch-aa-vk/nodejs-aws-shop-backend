import { S3Client } from "@aws-sdk/client-s3";

export const S3 = new S3Client({ region: String(process.env.CDK_DEFAULT_REGION) });