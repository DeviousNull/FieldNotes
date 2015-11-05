Template.termPage.onCreated(function() {
    this.showAllDefinitions = new ReactiveVar(false);
    this.showAllCates = new ReactiveVar(false);
    this.editMode = new ReactiveVar(false);
});

Template.termPage.helpers({
    'editMode' : function() {
        return Template.instance().editMode.get();
    },

    'showAllDefinitions' : function() {
        return Template.instance().showAllDefinitions.get();
    },
    'showAllCates' : function() {
        return Template.instance().showAllCates.get();
    },

    //Return the admin labels for a dictionary
    'labels' : function() {
        return Adminlabels.find({'dictionaryID': this.dictionaryID});
    },

    //Return the correct value for a label
    'labelDescription' : function() {
        var _labelID = this._id;
        var _termID = Template.parentData(1)._id;

        //Get the label value
        var value = Term_label_values.findOne({ 'termID': _termID, 'adminlabelsID': _labelID });

        if (!value) {
            console.log("WARN: No value found for term/label combination:", _termID, _labelID);
            return "";
        }

        return value.value;
    },

    //Find all definitions for this term's id
    'allDefinitions' : function() {
        return Definitions.find({'termID': this._id});
    },
    'allCates' : function() {
        return Cates.find({'termID': this._id});
    },

    'topDefinition' : function() {
        return Definitions.findOne({'termID': this._id}, {'sort': {'quality_rating': -1}});
    },
    'topDefinition' : function() {
        return Cates.findOne({'termID': this._id}, {'sort': {'quality_rating': -1}});
    },
});

Template.termPage.events({
    //Click event for editing a term page
    'click button[name=editTermButton]': function(e){
        Template.instance().editMode.set(true);
    },

    'click button[name=saveChangesButton]': function(e){
        Template.instance().editMode.set(false);

        var termID = this._id;

        //update the term from terms
        var updateTermData = {
            $set : {
                'term_name': Template.instance().$('[name=term_name]').val(),
            }
        }

        Terms.update(this._id, updateTermData);

        var labelsID = [];

        Template.instance().$('[name=adminLabelID]').each(function(){
            labelsID.push($(this).val());
        });

        //update the terms_label_values collection
        Template.instance().$('[name="labelValue"]').each(function(index){
            //updated term_label_value data
            var updateValueData = {
                $set : {
                    'termID' : termID,
                    'adminlabelsID' : labelsID[index],
                    'value' : $(this).val()
                }
            };

            var id = Term_label_values.findOne({'adminlabelsID': labelsID[index], 'termID': termID})._id;
            Term_label_values.update(id, updateValueData);
        });
    },

    'click button[name=showAllDefinitions]': function(e){
        Template.instance().showAllDefinitions.set(true);
    },
    'click button[name=showAllCates]': function(e){
        Template.instance().showAllCates.set(true);
    },

    'click button[name=showTopDefinition]': function(e){
        Template.instance().showAllDefinitions.set(false);
    },
    'click button[name=showTopCate]': function(e){
        Template.instance().showAllCates.set(false);
    },
});
