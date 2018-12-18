var express = require('express');
var router = express.Router();

router.post('/channel', function(req, res, next) {
  res.json('Welcome To React');
});

module.exports = router;
