var app = app || {};

app.Book = Backbone.Model.extend({
	defaults: {
		//coverImage: 'img/placeholder.png',
                coverImage: 'testcoverImage',
		title: 'No titile',
		author: 'Unknown',
		releaseData: 'Unknown',
		keywords: 'Node'
	},
        
        idAttribute: '_id' 
});
