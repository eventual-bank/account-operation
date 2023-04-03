import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const sqsClient = new SQSClient({ region: "us-east-1" });

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "account";

async function retrieveBalance(account) {
  console.log ("retrieveBalance account: ", account)

  try {
    const body = await dynamo.send(
      new GetCommand ({
        TableName: tableName,
        Key: {
          account_id: account
        }
      })
    );
    
    console.log ("retrieveBalance body: ", body)
  } catch (e) {
    console.log ("Exception: ", e)
  }
}

async function processOperation(body) {
  console.log("processOperation body: ", body, " type: ", typeof body);
  const obj = JSON.parse(body);

  console.log ("processOperation obj: ", obj)
  const from = obj.from;
  const from_balance = await retrieveBalance(from)
}

export const handler = async (event) => {
  for (const record of event.Records) {
    const { body } = record;
    await processOperation(body)
  }

  const headers = {
    "Content-Type": "application/json",
  };

  const statusCode = 200;

  const body = JSON.stringify("operations were successful");

  return {
    statusCode,
    body,
    headers
  }
};