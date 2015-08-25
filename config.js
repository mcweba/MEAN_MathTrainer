module.exports = {
	'port': process.env.PORT || 8080,
	'ipaddress': process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	'database': 'mongodb://localhost/mathtrainer_db',
	'secret': 'djs3rT3oi3diooOAFW124R3aad4be53A2e10kSW1'
};