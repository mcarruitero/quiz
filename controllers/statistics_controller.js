var models = require('../models/models.js');

var statistics = {
	quizes: 0,
	comments: 0,
	unpublishedComments: 0,
	publishedComments: 0,
	commentsbyQuestionAverage:0.0
};

var errors = [];

exports.calculateStatistcs = function(req, res, next)
{
	models.Quiz.count()
	.then(function(numQuestions){
		statistics.quizes = numQuestions;
		return models.Comment.count();
	})
	.then(function(numComments){
		statistics.comments = numComments;
		return models.Comment.countPublishedComments();
	})
	.then(function(numPublishedComments){
		statistics.publishedComments = numPublishedComments;
		//return models.Comment.countPublishedComments();
	})
	.catch(function (err) { 
		errors.push (err);})
	.finally (function() {
		next();
	});

/*	var countQuizes = models.Quiz.count().then(function(numQuestions){
		statistics.quizes = numQuestions;
	});
	var countComments = models.Comment.count().then(function(numComments){
		statistics.comments = numComments;
	});

	var countPublishedComments = models.Comment.countPublishedComments().then(function(numPublishedComments){
		statistics.publishedComments = numPublishedComments;
	});

	var countUnpublishedComments = models.Comment.countUnpublishedComments().then(function(numUnpublishedComments){
		statistics.unpublishedComments = statistics.quizes - statistics.publishedComments;
	});
	
*/	
/*	
	Q.all([countQuizes, countComments, countUnpublishedComments, countPublishedComments]).then(function(){
		console.log(statistics.numComments);
	*/	
/*		if(statistics.comments > 0 && statistics.quizes > 0)
		{
			statistics.commentsbyQuestionAverage = statistics.comments / statistics.quizes;
		}
		next();
*/
	/*	
	}).catch(function(error){
		next(error);
	});	
*/	
};

exports.statistics = function(req, res, next)
{
	res.render('quizes/statistics', {statistics: statistics, errors: []});
};