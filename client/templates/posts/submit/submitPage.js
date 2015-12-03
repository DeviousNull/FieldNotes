Template.submitPage.onCreated(function() {
    this.previewData = new ReactiveVar;
    this.doiFieldStatus = new ReactiveVar("empty");
});


Template.submitPage.events({
    'click .submitButton': function(e) {
        var validated = true;

        Template.instance().$('.required').map(function(index, object) {
            if (this.value === '') {
                validated = false;
            }
        });

        if (!validated) {

            alert("Please fill in all required fields.");
            return;
        }
        //Insert the new post
        var post = {
            userID: Meteor.user()._id,
            createdAt: moment(),
            modifiedAt: moment(),
            title: Template.instance().$('[name=title]').val(),
            pop_rating: 0,
            quality_rating: 0,
            numRaters : 0,
            doi: Template.instance().$('[name=doi]').val(),
            author: Template.instance().$('[name=author]').val(),
            publish_date: Template.instance().$('[name=publish_date]').val(),
            publisher: Template.instance().$('[name=publisher]').val(),
            categoryID: Template.instance().$('[name=cate]').val(),
            definedTermIDArray : [], //TODO(James): actually fill this array
            usedTermIDArray : [], //TODO(James): actually fill this array
            upvoteUserIDArray: [],
            downvoteUserIDArray: [],
        };

        post._id = Posts.insert(post);

        //Insert the new summary
        var summary = {
            userID: Meteor.user()._id,
            postID: post._id,
            text: Template.instance().$('[name=summary]').val(),
            isOfficialAbstract: Template.instance().$('input[name=is-official-abstract]').is(":checked"),
            upvoteUserIDArray: [],
            downvoteUserIDArray: [],
            quality_ratings : [],
        };

        Summaries.insert(summary);

        //Find any terms that already exist
        var terms_defined = Template.instance().$('[name=terms_used]');
        var terms_used = Template.instance().$('[name=terms_defined]');

        //Redirect to the postpage
        Router.go('postPage',post);
    },


    'input [name=summary], change [name=summary], paste [name=summary], keyup [name=summary], mouseup [name=summary]': function(e) {
        var converter = new Showdown.converter();
        var text = Template.instance().find("textarea[name=summary]").value;
        Template.instance().previewData.set(converter.makeHtml(text));
    },

    'blur [name=doi]': function(e) {
        var doi = Template.instance().find("input[name=doi]").value;

        if (!doi) {
            Template.instance().doiFieldStatus.set("empty");
        } else {
            var status = Template.instance().doiFieldStatus;
            status.set("checking");
            Meteor.call('validate-doi', doi, function(error, result) {
                if (error || !result) {
                    status.set("invalid");
                } else {
                    status.set("valid");
                }
            });
        }
    },

});

Template.submitPage.helpers({
    
    'submitPageCategoryOptions': function() {
        return Categories.find({parentID: 0});
    },

    'categories': function() {
        return Categories.find();
    },

    'preview_data': function() {
        return Template.instance().previewData.get();
    },
    
    'categories': function(){
        return Categories.find().fetch().map(function(it){ return it.category_name; });
    },

    'doi_validation_check': function(status) {
        return (Template.instance().doiFieldStatus.get() === status);
    },
});
Template.submitPage.rendered = function() {
  Meteor.typeahead.inject();
};
Template.addTerm.onCreated(function() {
    this.previewDates = new ReactiveVar;
    this.selectedDictionary = new ReactiveVar;

});
Template.addTerm.helpers({
    'addTermDictionaryOptions': function() {
        return Dictionaries.find({parentID: 0});
    },
    'dictionaries': function() {
        return Dictionaries.find();
    },
    'getLabels': function() {
        return Adminlabels.find({'dictionaryID': this._id});
    },
    'preview_datas': function() {
        return Template.instance().previewDates.get();
    },
     'selectedDictionary': function() {
        var cat = Template.instance().selectedDictionary.get();
        if (cat) {
            return cat.name;
        } else {
            return 'Select a Dictionary';
        }
    },
});

Template.addTerm.events({

    // Click event for submit button
    'click button[name=addButton]': function(e) {

        var validated = true;

        Template.instance().$('.required').map(function(index, object) {
            if (this.value === '') {
                validated = false;
            }
        });
        
        if (!Template.instance().selectedDictionary.get()) {
            validated = false;
        }

        if (!validated) {
            
            alert("Please fill in all required fields.");
            return;
        }
        // Insert new term
          var term = {

            term_name: Template.instance().$('[name=term_name]').val(),
            dictionaryID: Template.instance().selectedDictionary.get()._id
        };
        term._id = Terms.insert(term);

        // Insert new definition
        Definitions.insert({
            termID: term._id,
            userID: Meteor.user()._id,
            text: Template.instance().$('[name=definition]').val(),
            quality_rating : 0,
            numRaters : 0,
        });

        // For every element with the name labelValue, insert new label value
        Template.instance().$('[name="labelValue"]').each(function() {
            Term_label_values.insert({
                termID: term._id,
                adminlabelsID: $(this).attr("label_id"),
                value: $(this).val(),
            });
        });

         // Route to the dictionary page and send it the data
        Router.go('dictionaryPage', this);
    },

    'click .dropdown-menu li a': function(e) {
        Template.instance().selectedDictionary.set(this);
        },
       
});




//Returns the data for the autocomplete search function
Template.search.helpers({
    'terms': function(){
        return Terms.find().fetch().map(function(it){ return it.term_name; });
    }
});

//Tell iron:router to wait until the template is rendered to inject data
//otherwise the autocomplete typeahead won't work
Template.search.rendered = function() {
  Meteor.typeahead.inject();
};
