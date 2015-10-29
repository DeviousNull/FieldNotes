Template.submitSummary.events({
    /**
    * Handles submit button clicks for submitSummary.html
    *
    * Used when submiting a new summary for a post
    *
    * @param {e} button click event.
    */
    'click input[name=submitSummaryButton]': function(e) {
        //Insert the new summary
        var summary = {
            userID: Meteor.user()._id,
            postID: this._id,
            text: Template.instance().$('textarea[name=summary]').val(),
            isOfficialAbstract: Template.instance().$('input[name=is-official-abstract]').is(":checked"),
            upvoteUserIDArray: [],
            downvoteUserIDArray: [],
        };

        Summaries.insert(summary);
        
        //Redirect to the postpage  
        Router.go('postPage', this);
    }
});
