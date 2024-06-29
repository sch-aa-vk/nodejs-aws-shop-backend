const config = require("../../config");
const { PutItemCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { DATABASE, STOCKS } = require('./index');
const { dynamodb } = require('./dynamodbClient');

async function fillProductsTable() {
  try {
    for (const item of DATABASE) {
      await dynamodb.send(new PutItemCommand({
        TableName: config.PRODUCTS_TABLE_NAME,
        Item: item,
      }));

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
      await dynamodb.send(new PutItemCommand({
        TableName: config.STOCKS_TABLE_NAME,
        Item: item,
      }));

      console.log(`Inserted stock for product with id: ${item.product_id}`)
    }

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}
