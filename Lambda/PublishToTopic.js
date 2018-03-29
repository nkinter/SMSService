const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.VE_DYNAMO_KEY,
    secretAccessKey: process.env.VE_DYNAMO_SECRET,
    region: "us-east-1"
});

exports.handler = (event, context, callback) => {

    const sns = new AWS.SNS();
    console.log("Seriously?" + event.Topic_ARN)
    sns.publish({
        Message: event.MessageContent,
        MessageAttributes: {
          'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: 'Promotional'  // Can also use transactional
            }
        },
        TopicArn: event.Topic_ARN
    }, function (err, data) {
        if (err) {
            console.log(err.stack);
            callback({ "Message": "Error Sending Message!", "Date": new Date(), err });
        } else {
            callback(null,{ "Message": "Push Message Sent!", "Date": new Date(), data });
        }
    });


};