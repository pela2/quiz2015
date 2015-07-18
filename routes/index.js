var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var authorController = require('../controllers/authorController');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz 2015' });
});

//Autload de comandos con quizId
router.param('quizId', quizController.load);

//Definicion de rutas de quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/author', authorController.creditos);

module.exports = router;
