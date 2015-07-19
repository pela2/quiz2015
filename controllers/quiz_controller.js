var models = require('../models/models.js');
var url = require('url');

//GET /quizes/:id
exports.index = function(req, res){
	var url_parts = url.parse(req.url,true);
    var search = "%";
    if( url_parts.query!=null && url_parts.query.search !=null ) {
    	search = url_parts.query.search.replace(" ","%");
		search = "%"+search+"%";
		console.log("search --> "+search);
	} 
	models.Quiz.findAll( { where: ["pregunta like ?", search]} ).then(function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes});
	})
};

//AUTOLOAD - factoriza el codigo si la ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
            where: {
                id: Number(quizId)
            }
        }).then(function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			};
		}
	).catch(function(error){ next(error);});
};


//GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};