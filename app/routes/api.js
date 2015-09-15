var userCtrl = require('../../app/controllers/user.controller');
var calcCtrl = require('../../app/controllers/calc.controller');
var statisticsCtrl = require('../../app/controllers/statistics.controller');
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
		.get(calcCtrl.get)
		.delete(calcCtrl.delete);

	apiRouter.route('/calcsets/solve')
		.post(calcSolveCtrl.solve);

	apiRouter.route('/calcsetsolves')
		.get(statisticsCtrl.calculationSetSolveList);

	apiRouter.route('/calcsetsolves/:calcsetsolve_id')
		.get(statisticsCtrl.calculationSetSolveDetail);

	return apiRouter;
};