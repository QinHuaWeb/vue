var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//加载json数据
var apiData = require('../mock/data.json')
//注册路由
router.get('/seller', function (req, res) {
  res.json({
    code: 0,   //0代表正确数据
    data: apiData.seller
  })
})
router.get('/goods', function (req, res) {
  res.json({
    code: 0,
    data: apiData.goods
  })
})
router.get('/ratings', function (req, res) {
  res.json({
    code: 0,
    data: apiData.ratings
  })
})

module.exports = router;
