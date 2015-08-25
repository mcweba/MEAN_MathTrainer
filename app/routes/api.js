var userCtrl = require('../../app/controllers/user.controller');

module.exports = function(app, express) {

	var apiRouter = express.Router();

	apiRouter.post('/sample', userCtrl.sample);
	apiRouter.post('/authenticate', userCtrl.authenticate);

	apiRouter.use(userCtrl.verifyToken);

	apiRouter.route('/users')
		.post(userCtrl.create)
		.get(userCtrl.list);

	apiRouter.route('/users/:user_id')
		.get(userCtrl.get)
		.put(userCtrl.update)
		.delete(userCtrl.delete);

	return apiRouter;
};