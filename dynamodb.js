let AWS = require('aws-sdk');
var dynamo = require('dynamodb');
dynamo.AWS.config.update(
    {accessKeyId: 'AKIA2NLCIXIFFZPZ5EJE', secretAccessKey: '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', region: "ap-south-1"});