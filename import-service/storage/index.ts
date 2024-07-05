import { S3 } from 'aws-sdk';

export const s3Client = new S3({ region: String(process.env.CDK_DEFAULT_REGION) });