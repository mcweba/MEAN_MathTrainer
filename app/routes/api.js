module.exports = function(app, express) {

	var apiRouter = express.Router();

	apiRouter.get('/test', function(req, res) {
	  	res.json({ 
	  		success: true, 
	  		message: 'This is a test json response' 
		});
	});

	return apiRouter;
};