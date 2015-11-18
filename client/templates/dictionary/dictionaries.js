Template.dictionaries.helpers({
    //Return all the dictionaries
    'dictionaries': function(){
        return Dictionaries.find({}, { 'reactive': false });
    }
});

Template.dictionaries.events({

    //Click on the edit button 
   "click .editDictionariesButton": function(event) {

        //Save our button
        $editableButton = $('.editDictionariesButton');

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
            $editableButton.html('Remove Dictionary <span class="glyphicon glyphicon-pencil"></span>');
        }

    }, 

    //Click on the delete dictionary button
    'click .deleteDictionary': function(e){
        if(confirm("Are you sure you want to delete this dictionary?")){
            var dictID = this._id;
            Tracker.autorun(function (computation) {
                var termSub = Meteor.subscribe('getTermsFromDictionaryID', dictID);
                var labelSub = Meteor.subscribe('getAdminlabelsFromDictionaryID', dictID);
                var valSub = Meteor.subscribe('getLabelValuesFromDictionaryID', dictID);
                var defSub = Meteor.subscribe('getDefinitionsFromDictionaryID', dictID);
                if (!termSub.ready() || !labelSub.ready() || !valSub.ready() || !defSub.ready()) {
                    return;
                }
                Terms.find({dictionaryID: dictID}).forEach(function(term) {
                    Term_label_values.find({ termID: term._id }).forEach(function(val) {
                        Term_label_values.remove(val._id);
                    });
                    Definitions.find({ termID: term._id }).forEach(function(def) {
                        Definitions.remove(def._id);
                    });
                Terms.remove(term._id);
                });
                Adminlabels.find({dictionaryID: dictID}).forEach(function(label) {
                    Adminlabels.remove(label._id);
                });
                Dictionaries.remove(dictID);
                computation.stop();
            });
        }
    }
});
