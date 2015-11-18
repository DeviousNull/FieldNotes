
Template.layout.helpers({
    
    'categories': function(){
    	//Return all level 0 categories
    //    return Categories.find({parentID: 0})
    return Categories.find();
    }

});

Template.layout.events({
	'keypress #siteTitle': function(e){
        if(e.which === 13) {
    		$('#siteTitle').attr('contenteditable', 'false');
  			var newTitle = $('#siteTitle').html();
  			alert("New Title: "+newTitle);
  			/*
			Update Site Title with newTitle whereever stored
  			*/
        }
    },
});
