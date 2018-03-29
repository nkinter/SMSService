const lambdaLocal = require('lambda-local');

const body_payload = {
    "Topic_ARN": "arn:aws:sns:us-east-1:270551849714:MyFirstCompany"
    ,"MessageContent": "I'm testing that we both get this message because we are subscribed to the same topic."
};

lambdaLocal.execute({
    event: body_payload,
    lambdaPath: __dirname + '/Lambda/PublishToTopic.js',
    timeoutMs: 3000
}).then(function(done) {
    console.log(done);
}).catch(function(err) {
    console.log(err);
});