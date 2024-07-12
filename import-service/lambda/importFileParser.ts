import { S3Event } from "aws-lambda";
import { SQS } from 'aws-sdk';
import { s3Client } from "../storage";
import { createErrorResponse, createNotFoundResponse, createSuccessResponse } from "../utils/response";
import * as csv from "csv-parser";

const sqs = new SQS({ region: String(process.env.CDK_DEFAULT_REGION) });

export const handler = async (event: S3Event) => {
  console.log('Incomig request:', event);

  try {
    for (const record of event.Records) {
      console.log('Record:', record);

      if (!record.s3.object.key || !record.s3.bucket.name) {
        return createNotFoundResponse({ message: 'Missing key or bucket name' });
      }

      const fileKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

      const s3Stream = s3Client.getObject({
        Bucket: record.s3.bucket.name,
        Key: fileKey,
      }).createReadStream();

      const csvParser = new Promise((resolve, reject) => {
        s3Stream
          .pipe(csv())
          .on('data', async (data: any) => {
            await sqs.sendMessage({
              QueueUrl: String(process.env.CATALOG_BATCH_PROCESS_QUEUE_URL),
              MessageBody: JSON.stringify(data),
            }).promise();
          })
          .on('end', async () => {
            console.log('CSV parsing completed');

            await s3Client.copyObject({
              Bucket: String(process.env.IMPORTS_BUCKET_NAME),
              CopySource: `${String(process.env.IMPORTS_BUCKET_NAME)}/${fileKey}`,
              Key: fileKey.replace('uploaded/', 'parsed/'),
            }).promise();

            await s3Client.deleteObject({
              Bucket: String(process.env.IMPORTS_BUCKET_NAME),
              Key: fileKey,
            }).promise();

            console.log(`Moved file from 'uploaded' to 'parsed' folder`);

            resolve('CSV parsing completed');
          })
          .on('error', (error: any) => {
            console.error('Error parsing CSV:', error);
            reject(error);
          });
      });

      await csvParser;
    }

    return createSuccessResponse('CSV parsing completed');
  } catch (error) {
    console.error('Error inserting data:', error);

    return createErrorResponse(error);
  }
};  