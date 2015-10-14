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
        if (!Meteor.user()) {
            return false
        }

        return (this.upvoteUserIDArray.indexOf(Meteor.user()._id) !== -1);
    },

    'down_pressed': function() {
        if (!Meteor.user()) {
            return false
        }

        return (this.downvoteUserIDArray.indexOf(Meteor.user()._id) !== -1);
    },

    'influence': function() {
        return (this.upvoteUserIDArray.length - this.downvoteUserIDArray.length);
    }
});

Template.postItem.events({
    'click #upvote-button': function(e) {
        if (!Meteor.user()) {
            return;
        }

        Posts.update(this._id, {
            '$pull': {
                'downvoteUserIDArray': Meteor.user()._id,
            },
            '$addToSet': {
                'upvoteUserIDArray': Meteor.user()._id,
            }
        });
    },

    'click #downvote-button': function(e) {
        if (!Meteor.user()) {
            return;
        }

        Posts.update(this._id, {
            '$pull': {
                'upvoteUserIDArray': Meteor.user()._id,
            },
            '$addToSet': {
                'downvoteUserIDArray': Meteor.user()._id,
            }
        });
    },

});
