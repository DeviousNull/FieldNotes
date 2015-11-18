Template.termPage.onCreated(function() {
    this.showAllDefinitions = new ReactiveVar(false);
    this.showAllCates = new ReactiveVar(false);
    this.editMode = new ReactiveVar(false);
    this.addTagsMode = new ReactiveVar(false);
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
    'topCate' : function() {
        return Cates.findOne({'termID': this._id}, {'sort': {'quality_rating': -1}});
    },
      'tagss': function() {
        return Term_tags.find({ 'termID': Template.instance().data._id });
    },

    'add_tags_mode': function() {
        return Template.instance().addTagsMode.get();
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
    'click button[name=showTopDefinition]': function(e){
        Template.instance().showAllDefinitions.set(false);
    },
    'click button[name=showAllCates]': function(e){
        Template.instance().showAllCates.set(true);
    },
    'click button[name=showTopAllCate]': function(e){
        Template.instance().showAllCates.set(true);
    },

    'click #remove_tags': function(e) {
        if (!confirm("Are you sure you want to remove the '" + e.target.attributes['tags'].value + "' category from this paper?")) {
            return;
        }

        Term_tags.remove(e.target.attributes['tags_id'].value);
    },

    'click #add_tags': function(e) {
        Template.instance().addTagsMode.set(true);
    },

    'click #cancel_tags': function(e) {
        Template.instance().addTagsMode.set(false);
    },

    'click #submit_tags': function(e) {
        var new_tags = Template.instance().$('#tags_input').val();

        var existing_tags = Term_tags.findOne({
            'termID': Template.instance().data._id,
            'tags': new_tags,
        });

        if (existing_tags) {
            alert("This paper already has that category.");
            return;
        }

        if (new_tags) {
            Term_tags.insert({
                'termID': Template.instance().data._id,
                'tags': new_tags,
            });
        }

        Template.instance().addTagsMode.set(false);
    },
    
});
