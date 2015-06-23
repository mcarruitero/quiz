var models = require('../models/models.js');

exports.load = function(req,res,next,quizId){
//	models.Quiz.findById(quizId).then(
	models.Quiz.find({
		where: { id: Number(quizId)},
		include: [{ model: models.Comment}]
		})
		.then(function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{ 
				next(new Error('No existe quizid=' + quizid));
			}	
		}
	).catch(function(error) { next(error);});
};

exports.index = function(req,res){
	if (req.query.search) {
		var search = '%' + req.query.search.replace(/\s/g,"%") + '%';

		models.Quiz.findAll(
			{where: ["pregunta like ?", search],	// Filtrar
			 order: [['pregunta', 'ASC']]}			// Ordenar
			).then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
			//res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error);});
	}else{		
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes, errors: []});
		}).catch(function(error) { next(error);})		
	}	
};	

exports.show = function(req,res){
	//models.Quiz.findAll().then(function(quiz){
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
		//res.render('quizes/question',{pregunta: quiz[0].pregunta});	
		//res.render('quizes/show',{quiz: quiz});	
		res.render('quizes/show',{quiz: req.quiz, errors: []});
	//})
};

exports.answer = function(req,res){
	//models.Quiz.findAll().then(function(quiz){
	//models.Quiz.findById(req.params.quizId).then(function(quiz){	
		//if(req.query.respuesta===quiz[0].respuesta){
		var resultado = 'Incorrecto';	
		if(req.query.respuesta===req.quiz.respuesta){	
			resultado = 'Correcto';
		}
		res.render('quizes/answer',
				{quiz: req.quiz, respuesta: resultado, errors: []});	
			//res.render('quizes/answer',
			//	{quiz: quiz, respuesta: 'Correcto'});
		//}else{
		//	res.render('quizes/answer',
		//		{quiz: quiz, respuesta: 'Incorrecto'});
		//}
	//})	
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz 
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new',{quiz: quiz, errors: err.errors});
			} else {
				quiz
				.save({fields: ['pregunta', 'respuesta', 'tema']})
				.then(function(){res.redirect('/quizes');})
			}
		}
	);
//	quiz	
//	.save({fields: ['pregunta', 'respuesta']})
//	.then(function(){res.redirect('/quizes');})
};

exports.edit = function(req, res) {
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
		
	req.quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/edit',{quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz
				.save({fields: ['pregunta', 'respuesta', 'tema']})
				.then(function(){res.redirect('/quizes');})
			}
		}
	);
};	

exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch( function(error){next(error)});
};