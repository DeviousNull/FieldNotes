
Template.layout.helpers({
    //Return all level 0 categories
    'categories': function(){
        return Categories.find({parentID: 0})
    }
});


