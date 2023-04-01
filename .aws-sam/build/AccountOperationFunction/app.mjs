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
    const data = await dynamo.send(
      new GetCommand ({
        TableName: tableName,
        Key: {
          id: account
        }
      })
    );

    console.log ("retrieveBalance data: ", data)
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
  event.Records.forEach(async record => {
    const { body } = record;
    await processOperation(body)
  });
  return {};
};