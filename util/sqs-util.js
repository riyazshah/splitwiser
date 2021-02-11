// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var queueURL = process.env.sqsUrl;

/**
 * Calls SQS and retrieves the next message from the queue
 */
async function getSqsMessage() {
    var params = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: queueURL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 1
    };
    var message;
    await sqs.receiveMessage(params, function(err, data) {
        if (err) {
            console.log("Receive Error", err);
        } else if (data.Messages) {
            message = data.Messages[0]
        } else {
            console.log("No messages found.");
        }
    }).promise();
    return message
}

/**
 * Calls SQS and deletes the given message
 * @param {*} messageHandle - handle of message to be deleted
 */
async function deleteSqsMessage(messageHandle) {
    var params = {
        QueueUrl: queueURL,
        ReceiptHandle: messageHandle
    };

    await sqs.deleteMessage(params, function(err, data) {
        if (err) {
            console.log("Error deleting message", err);
        } 
    }).promise();
}

export { getSqsMessage, deleteSqsMessage }