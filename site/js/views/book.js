var app = app || {};

app.BookView = Backbone.View.extend({
    tagName: 'div',
    className: 'bookContainer',

    events: {
       'click .delete': 'deleteBook'
    },

    template: _.template($('#bookTemplate').html()),

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        console.log('$el.html():'+ this.el);
        this.$el.html( this.template( this.model.toJSON() ) );

        return this;
    },

    deleteBook: function(){
    	console.log("check delete");
    	
    	this.model.destroy();

    	this.remove();
    }
});
