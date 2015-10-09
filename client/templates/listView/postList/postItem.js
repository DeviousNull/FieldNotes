Template.postItem.helpers({
    //Return the username of a another user
    'getUserName': function(userID) {
        var user = Meteor.users.findOne(userID)
        if (!user) {
            return "UID:" + userID;
        }
        return user.username;
    },
    'top_summary': function() {
        //return Summaries.find({postID: this._id}, {sort: {quality_rating: -1}, limit: 1});
        return Summaries.findOne({postID: this._id});
    },
    'community_quality_rating': function() {
        var all_ratings = Post_quality_ratings.find({
            'postID': Template.instance().data._id,
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

    'up_pressed': function() {
        var rating = Post_influence_ratings.findOne({
            'userID': Meteor.user()._id,
            'postID': this._id,
        });

        if (!rating) {
            return false;
        } else {
            return rating.isUpvote;
        }
    },

    'down_pressed': function() {
        var rating = Post_influence_ratings.findOne({
            'userID': Meteor.user()._id,
            'postID': this._id,
        });

        if (!rating) {
            return false;
        } else {
            return !rating.isUpvote;
        }
    },

    'influence': function() {
        var upvotes = Post_influence_ratings.find({
            'postID': this._id,
            'isUpvote': true,
        }).count();

        var downvotes = Post_influence_ratings.find({
            'postID': this._id,
            'isUpvote': false,
        }).count();

        return (upvotes - downvotes);
    }
});

Template.postItem.events({
    'click #upvote-button': function(e) {
        var rating = Post_influence_ratings.findOne({
            'userID': Meteor.user()._id,
            'postID': this._id,
        });

        if (rating) {
            if (rating.isUpvote) {
                Post_influence_ratings.remove(rating._id);
            } else {
                Post_influence_ratings.update(rating._id, {
                    '$set': {
                        'isUpvote': true,
                    }
                });
            }
        } else {
            Post_influence_ratings.insert({
                'userID': Meteor.user()._id,
                'postID': this._id,
                'isUpvote': true,
            });
        }
    },

    'click #downvote-button': function(e) {
        var rating = Post_influence_ratings.findOne({
            'userID': Meteor.user()._id,
            'postID': this._id,
        });

        if (rating) {
            if (rating.isUpvote) {
                Post_influence_ratings.update(rating._id, {
                    '$set': {
                        'isUpvote': false,
                    }
                });
            } else {
                Post_influence_ratings.remove(rating._id);
            }
        } else {
            Post_influence_ratings.insert({
                'userID': Meteor.user()._id,
                'postID': this._id,
                'isUpvote': false,
            });
        }
    },

});
