Template.newTerm.onCreated(function() {
    this.previewData = new ReactiveVar;
    this.selectedCategory = new ReactiveVar;
});

Template.newTerm.helpers({
    'getLabels': function() {
        return Adminlabels.find({'dictionaryID': this._id});
    },
    'categories': function() {
        return Categories.find();
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

Template.newTerm.events({
    // Click event for submit button
    'click button[name=submitButton]': function(e) {
        // Insert new term
        var term = {
            term_name: Template.instance().$('[name=term_name]').val(),
            dictionaryID: this._id
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
        Cates.insert({
            termID: term._id,
            userID: Meteor.user()._id,
            text: Template.instance().$('[name=cate]').val(),
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
        Template.instance().selectedCategory.set(this);
    },
});




