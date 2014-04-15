var app = app || {};

app.LibraryView = Backbone.View.extend({
    el: '#books',

    events:{
      'click #add':'addBook'
    },

    initialize: function() {
        this.collection = new app.Library();
        //this.collection.fetch({reset: true});
        //this.render();

        this.listenTo( this.collection, 'add', this.renderBook);
        this.listenTo( this.collection, 'reset', this.render);
        this.collection.fetch({reset: true});
    },

    // render library by rendering each book in its collection
    render: function() {
        this.collection.each(function( item ) {
            this.renderBook( item );
        }, this );
    },

    // render a book by creating a BookView and appending the
    // element it renders to the library's element
    renderBook: function( item ) {
        var bookView = new app.BookView({
            model: item
        });
        console.log('check 20131017' + bookView.render().el.id);
        this.$el.append( bookView.render().el );
    },

    addBook: function(e){
      e.preventDefault();
      console.log('--- add a Book ---');
      var formData = {};

      $('#addBook div' ).children( 'input' ).each( function( i, el ) {
			if( $( el ).val() != "" )
			{

				if( el.id === 'keywords' ) {
					formData[ el.id ] = [];
					_.each( $( el ).val().split( ' ' ), function( keyword ) {
						formData[ el.id ].push({ 'keyword': keyword });
					});
				} else if( el.id === 'releaseDate' ) {
					formData[ el.id ] = $( '#releaseDate' ).datepicker( 'getDate' ).getTime();
				} else if( el.id === 'coverImage'){
          var image_name = $(el).val().slice(12);
          var image_path = 'img/';
          //console.log(image_path.concat(image_name));
          formData[el.id] = image_path.concat(image_name);
        } else {
          console.log(el.id);
          console.log($(el).val());
					formData[ el.id ] = $( el ).val();
				}
			}
		}); 
      console.log('20131017 formData:' + JSON.stringify(formData));
      //this.collection.add(new app.Book(formData));
      this.collection.create( formData );
    }
});
