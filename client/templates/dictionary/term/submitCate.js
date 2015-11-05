Template.submitCate.onCreated(function() {
    this.previewData = new ReactiveVar("");
});

Template.submitCate.events({
    'click button[name=submitButton]': function(e) {
        //Insert the new category
        Cates.insert({
            termID: this._id,
            userID: Meteor.user()._id,
            text: Template.instance().$('[name=cate]').val(),
            quality_rating: 0,
            numRaters: 0
        });

        // Redirect to the term page
        Router.go('termPage', this);
    },

    'input [name=cate], change [name=cate], paste [name=cate], keyup [name=cate], mouseup [name=cate]': function(e) {
        var converter = new Showdown.converter();
        var text = Template.instance().find("textarea[name=cate]").value;
        Template.instance().previewData.set(converter.makeHtml(text));
    },
});

Template.submitCate.helpers({
    'preview_data': function() {
        return Template.instance().previewData.get();
    }
});