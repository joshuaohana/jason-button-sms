var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var sns = new AWS.SNS();

exports.handler = function(event) {
  let intro;
  if (event.isUrgent) {
    intro = "**URGENT** from ";
  }
  else {
    intro = 'Message from ';
  }
  const outro = '\n' + event.phone + '\n' + event.email;

  var params = {
    Message: intro + event.name + ':\n' + event.message + outro,
    MessageStructure: 'string',
    PhoneNumber: '+16787778626'
  };

  sns.publish(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
  });
};


