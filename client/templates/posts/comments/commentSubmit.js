Template.commentSubmit.events({
    //Submit form for creating a comment
    'click [name=submitComment]': function(e, template) {
        var $body = template.$('textarea[name=body]');

        Meteor.call('add-post-comment', template.data._id, $body.val());

        //Reset the comment box
        $body.val('');
    }
});
