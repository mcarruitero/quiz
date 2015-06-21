var models = require('../models/models.js');

exports.load = function(req,res,next,quizId){
	models.Quiz.findById(quizId).then(
		function(quiz){
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
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs',{quizes: quizes});
	}).catch(function(error) { next(error);})		
};	

exports.show = function(req,res){
	//models.Quiz.findAll().then(function(quiz){
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
		//res.render('quizes/question',{pregunta: quiz[0].pregunta});	
		//res.render('quizes/show',{quiz: quiz});	
		res.render('quizes/show',{quiz: req.quiz});
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
				{quiz: req.quiz, respuesta: resultado});	
			//res.render('quizes/answer',
			//	{quiz: quiz, respuesta: 'Correcto'});
		//}else{
		//	res.render('quizes/answer',
		//		{quiz: quiz, respuesta: 'Incorrecto'});
		//}
	//})	
};