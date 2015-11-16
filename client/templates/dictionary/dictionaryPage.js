Template.dictionaryPage.onCreated(function() {
    this.editMode = new ReactiveVar(false);
});

Template.dictionaryPage.helpers({
    //Return all terms for this dictionary
    'terms': function() {
        //Return the terms
        return Terms.find({'dictionaryID': this._id}, { 'reactive': false });
    },

    'editMode': function() {
        return Template.instance().editMode.get();
    },
});

Template.dictionaryPage.events({
    //Click event for the edit terms button
   "click button[name=editTermsButton]": function(event) {
        Template.instance().editMode.set(true);
    },

    //Click event for delete term
    'click button[name=deleteTermButton]': function(e) {
        if (confirm("Are you sure you want to delete this term?")) {
            var termID = this._id;
            Tracker.autorun(function (computation) {
                //TODO(James): This fails when a post references the term. Find out what should be done in that case.
                var valSub = Meteor.subscribe('getLabelValuesFromTermID', termID);
                var defSub = Meteor.subscribe('getDefinitionsFromTermID', termID);
                if (!valSub.ready() || !defSub.ready()) {
                    return;
                }
                Term_label_values.find({ termID: termID }).forEach(function(val) {
                    Term_label_values.remove({_id: val._id });
                });
                Definitions.find({ termID: termID }).forEach(function(def) {
                    Definitions.remove({_id: def._id });
                });
                Terms.remove(termID);
                computation.stop();
            });
        }
    },

    'click button[name=saveChangesButton]': function(e) {
        Template.instance().editMode.set(false);

        if (this.name !== Template.instance().$('[id=name]').val()) {
            //Update
            Dictionaries.update(this._id, {
                $set : {
                    name : Template.instance().$('[id=name]').val(),
                }
            });
        }
    }
});
