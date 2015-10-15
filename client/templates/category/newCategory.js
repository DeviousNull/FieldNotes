Template.newCategory.onCreated(function () {
    // Used to keep track of rows.
    this.numLabels = new ReactiveVar(0);
});

Template.newCategory.helpers({
    //getArray is used to create the correct number of rows in the new category page
    //the returned object of index are used to differentiate each HTML element
    'getArray': function() {
        var labelArray = [];

        var length = Template.instance().numLabels.get();
        for (var i = 0; i < length; i++) {
            labelArray.push({ 'index': i});
        }

        return labelArray;
    }
});

Template.newCategory.events({
    

    //Submit button for new category
    'click button[name=createCategoryButton]': function(e) {
        //Validation flag
        var validated = true;

        //Map function for each element that is required.
        Template.instance().$('.required').map(function(index, object){
            //If any element doesn't have a value, we should fail validation
            if(this.value === '')
                validated = false;
        })

        //If everything passed validation
        if (!validated) {
            alert("Please fill out all required fields");
            return;
        }

        //update data
        var category = {
            category_name: Template.instance().$('[name=category_name]').val()

        };

        //update
        category._id = Categories.insert(category);
      
       

        //Route back to the list of categories to see you newly created category
        Router.go('categories');
    }
});
