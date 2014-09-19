var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Hello Single Page Application' });
});

router.get('/shape/api', function(req, res) {
   var q = req.query;

   setTimeout(function () {
      res.json({ name: q.name, value: q.time});
   }, q.time || 1000);

});


module.exports = router;
