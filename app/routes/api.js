var userCtrl = require('../../app/controllers/user.controller');
var calcCtrl = require('../../app/controllers/calc.controller');
var calcSolveCtrl = require('../../app/controllers/calc.solve.controller');

module.exports = function(app, express) {

	var apiRouter = express.Router();

	apiRouter.post('/authenticate', userCtrl.authenticate);

	apiRouter.use(userCtrl.verifyToken);

	apiRouter.route('/users')
		.post(userCtrl.create)
		.get(userCtrl.list);

	apiRouter.route('/users/:user_id')
		.get(userCtrl.get)
		.put(userCtrl.update)
		.delete(userCtrl.delete);

	apiRouter.get('/currentUserInfo', userCtrl.currentUserInfo);

	apiRouter.route('/calcsets')
		.post(calcCtrl.create)
		.get(calcCtrl.list);

	apiRouter.route('/calcsets/:calcset_id')
		.get(calcCtrl.get);

	apiRouter.route('/calcsets/solve')
		.post(calcSolveCtrl.solve);

	return apiRouter;
};