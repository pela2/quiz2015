var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var authorController = require('../controllers/authorController');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz 2015' });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
router.get('/author', authorController.creditos);

module.exports = router;
