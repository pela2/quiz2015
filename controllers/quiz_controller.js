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
		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
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
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta", indice: "Indice" }
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz	);
	quiz.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz
					.save({fields: ["pregunta", "respuesta", "indice"]})
					.then(function(){res.redirect('/quizes')});
			}
		}
	).catch(function(error){next(error)});
};

exports.edit = function(req, res) {
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.indice = req.body.quiz.indice;

	req.quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz
					.save({fields: ["pregunta", "respuesta", "indice"]})
					.then(function(){res.redirect('/quizes')});
			}
		}
	);
};

exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error) {next(error)});
};