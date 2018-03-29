const lambdaLocal = require('lambda-local');

const body_payload = {
    "PhoneNumber": "14102598221"
    ,"MessageContent": "This is a big success."
};

lambdaLocal.execute({
    event: body_payload,
    lambdaPath: __dirname + '/Lambda/SendSingleSMS.js',
    timeoutMs: 3000
}).then(function(done) {
    console.log(done);
}).catch(function(err) {
    console.log(err);
});