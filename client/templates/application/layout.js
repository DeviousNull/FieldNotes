
Template.layout.helpers({
    
    'categories': function(){
    	//Return all level 0 categories
    //    return Categories.find({parentID: 0})
    return Categories.find();
    }

});



