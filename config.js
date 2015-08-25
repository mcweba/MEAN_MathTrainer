module.exports = {
	'port': process.env.PORT || 8080,
	'ipaddress': process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	'database': 'mongodb://localhost/mathtrainer_db',
	'databaseProd': 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME,
	'secret': 'djs3rT3oi3diooOAFW124R3aad4be53A2e10kSW1'
};