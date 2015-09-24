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

    'summary_quality_rating': function() {
        var all_ratings = Summary_ratings.find({
            'summaryID': Template.instance().data._id,
        });

        if (all_ratings.count() == 0) {
            return -1;
        }

        var total = 0;
        all_ratings.forEach(function(current) {
            total += current.rating;
        });

        return (total / all_ratings.count());
    },

});
