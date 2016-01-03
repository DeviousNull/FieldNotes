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
        Meteor.call('add-post-summary', Template.instance().data._id, Template.instance().$('textarea[name=summary]').val(), Template.instance().$('input[name=is-official-abstract]').is(":checked"));
        
        //Redirect to the postpage  
        Router.go('postPage', this);
    }
});
