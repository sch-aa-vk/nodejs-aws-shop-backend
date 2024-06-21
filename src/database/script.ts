require('dotenv').config();
const { DynamoDB, config } = require('aws-sdk');
const { DATABASE, STOCKS } = require('./index');

config.update({ region: process.env.CDK_DEFAULT_REGION });

const dynamodb = new DynamoDB.DocumentClient();

async function fillProductsTable() {
  try {
    for (const item of DATABASE) {
      await dynamodb.put({
        TableName: String(process.env.PRODUCTS_TABLE_NAME),
        Item: item,
      }).promise();

      console.log(`Inserted item with id: ${item.id}`)
    }

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

async function fillStocksTable() {
  try {
    for (const item of STOCKS) {
      await dynamodb.put({
        TableName: String(process.env.STOCKS_TABLE_NAME),
        Item: item,
      }).promise();

      console.log(`Inserted stock for product with id: ${item.product_id}`)
    }

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}
