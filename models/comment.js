module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Comment',
		{ texto: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg: "-> Falta Comentario"}}
			},
		  publicado: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
			}
		},
		{ classMethods:{
			countUnpublishedComments: function(){
				//return this.count({where: ["publicado = ?", false]});
				return this.aggregate('QuizId', 'count', { distinct: false })
			},
			countPublishedComments: function(){
				//return this.count({where: ["publicado = ?", true]});
				return this.aggregate('QuizId', 'count', { distinct: true })
			}
		}}						
	);
}			
