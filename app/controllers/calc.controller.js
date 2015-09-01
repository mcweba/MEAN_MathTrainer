
exports.create = function(req, res) {
    res.json({ message: 'calcset received' });
};

exports.get = function(req, res) {
    var data = [];
    data.push({creator: 'Fritz', created: new Date(), diff_level: 1, score: 99, duration: 240, lastExec: new Date()});
    data.push({creator: 'Hans', created: new Date(), diff_level: 3, score: 55, duration: 600, lastExec: new Date()});
    data.push({creator: 'Kurt', created: new Date(), diff_level: 2, score: 66, duration: 90, lastExec: new Date()});
    res.json(data);
};