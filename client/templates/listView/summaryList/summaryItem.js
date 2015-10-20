Template.summaryItem.helpers({
    //Return the title of a post for the summaryItems
    'title': function(_summaryID){
        var summary = Summaries.findOne({_id: _summaryID});
        if (!summary) {
            return "SID:" + _summaryID;
        }

        var post = Posts.findOne({_id: summary.postID});
        if (!post) {
            return "PID:" + summary.postID;
        }

        return post.title;
    },

    'markdownedText': function(text) {
        var converter = new Showdown.converter();

        //return text with reinstated underscores in place of <em> & </em>
        return converter.makeHtml(text).replace(/<em>|<\/em>/g,"_");
    },

    //Return the username from a user id
    'userName': function(userID){
        var user = Meteor.users.findOne(userID)
        if (!user) {
            return "UID:" + userID;
        }
        return user.username;
    },

    'postLinkData': function() {
        var summary = Summaries.findOne({_id: this._id});
        return {_id: summary.postID};
    },

    'influence': function() {
        return (this.upvoteUserIDArray.length - this.downvoteUserIDArray.length);
    }

});
