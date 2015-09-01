var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var config 	   = require('./config');
var path 	   = require('path');
var userCtrl = require('./app/controllers/user.controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.use(morgan('dev'));

// hack to check whether we're on openshift or local
if(process.env.OPENSHIFT_NODEJS_IP){
	mongoose.connect(config.databaseProd);
} else {
	mongoose.connect(config.database);
}

userCtrl.createAdmin();

app.use(express.static(__dirname + '/public'));

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port, config.ipaddress, function(){
	console.log('%s: Server started on %s:%d', Date(Date.now() ), config.ipaddress, config.port);
});