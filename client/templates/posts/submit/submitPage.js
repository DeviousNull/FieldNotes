Template.submitPage.onCreated(function() {
    this.previewData = new ReactiveVar;
    this.selectedCategory = new ReactiveVar;
});

Template.submitPage.events({
    'click .submitButton': function(e) {
        var validated = true;

        Template.instance().$('.required').map(function(index, object) {
            if (this.value === '') {
                validated = false;
            }
        });
        
        if (!Template.instance().selectedCategory.get()) {
            validated = false;
        }

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
            categoryID: Template.instance().selectedCategory.get()._id,
            definedTermIDArray : [], //TODO(James): actually fill this array
            usedTermIDArray : [] //TODO(James): actually fill this array
        };

        post._id = Posts.insert(post);

        //Insert the new summary
        var summary = {
            userID: Meteor.user()._id,
            postID: post._id,
            text: Template.instance().$('[name=summary]').val(),
            isOfficialAbstract: Template.instance().$('input[name=is-official-abstract]').is(":checked"),
        };

        Summaries.insert(summary);

        //Find any terms that already exist
        var terms_defined = Template.instance().$('[name=terms_used]');
        var terms_used = Template.instance().$('[name=terms_defined]');

        //Redirect to the postpage
        Router.go('postPage',post);
    },

    'click .dropdown-menu li a': function(e) {
        Template.instance().selectedCategory.set(this);
    },

    'input [name=summary], change [name=summary], paste [name=summary], keyup [name=summary], mouseup [name=summary]': function(e) {
        var converter = new Showdown.converter();
        var text = Template.instance().find("textarea[name=summary]").value;
        Template.instance().previewData.set(converter.makeHtml(text));
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
    
    'selectedCategory': function() {
        var cat = Template.instance().selectedCategory.get();
        if (cat) {
            return cat.category_name;
        } else {
            return 'Select a Category';
        }
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
