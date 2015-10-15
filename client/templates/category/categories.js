Template.categories.helpers({
    //Return all the categories
    'categories': function(){
        return Categories.find();
    }
});

Template.categories.events({

    //Click on the edit button 
   "click .editCategoriesButton": function(event) {

        //Save our button
        $editableButton = $('.editCategoriesButton');

        //Toggle the edit class. Removes 'edit' if present, Appends 'edit' if absent
        $editableButton.toggleClass('edit');

        //If the button has class edit: Remove
        if($editableButton.hasClass('edit')){

            //Make everything with the name editableInputField visible
            $('[name=editableInputField').removeAttr('hidden');

            //Change the look of the edit button
            $editableButton.removeClass('btn-warning')
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');
            
        } else {
            //Make everything with the name editableInputField hidden
            $('[name=editableInputField]').attr('hidden','true');

            //Change the look of the edit button
            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Remove Category <span class="glyphicon glyphicon-pencil"></span>');
        }

    }, 


    'click .deleteCategory': function(e){
        if(confirm("Are you sure you want to delete this category?")){
            var cateID = this._id;
            Tracker.autorun(function (computation) {
            

               Categories.remove(cateID);
                computation.stop();
            });
        }
    }
});
