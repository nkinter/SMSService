const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.VE_DYNAMO_KEY,
    secretAccessKey: process.env.VE_DYNAMO_SECRET,
    region: "us-east-1"
});

exports.handler = (event, context, callback) => {
    // Create the SNS service object
    const sns = new AWS.SNS();
    // Create the DynamoDB service object
    const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

    sns.publish({
        Message: event.MessageContent,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
              DataType: 'String',
              StringValue: 'mySenderID'
          }
          ,'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: 'Promotional'  // Can also use transactional
          }
        },
        PhoneNumber: event.PhoneNumber
    }, function (err, data) {
        if (err) {
            console.log(err.stack);
            callback({ "Message": "Error Sending Message!", "Date": new Date(), err });
        } else {
            let params = {
                TableName: 'rdn-sms-attempts',
                Item: {
                    'messageid' : {S: data.MessageId},
                    'date' : {S: new Date().toDateString()},
                }
            };
            // Call DynamoDB to add the item to the table
            ddb.putItem(params, function(err, data) {
                if (err) {
                    console.log("Error", err);
                    callback(null,{ "Message": "Push Message Sent!", "Date": new Date(), "LogSuccess": false, data });
                } else {
                    console.log("Success", data);
                    callback(null,{ "Message": "Push Message Sent!", "Date": new Date(), "LogSuccess": true, data });
                }
            });
        }
    });
};