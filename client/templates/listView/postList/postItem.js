Template.postItem.helpers({
    //Return the username of a another user
    'getUserName': function(userID) {
        var user = Meteor.users.findOne(userID)
        if (!user) {
            return "UID:" + userID;
        }
        return user.username;
    },

    'markdownedText': function(text) {
        var converter = new Showdown.converter();

        //return text with reinstated underscores in place of <em> & </em>
        return converter.makeHtml(text).replace(/<em>|<\/em>/g,"_");
    },

    'top_summary': function() {
        return Summaries.findOne({postID: this._id});
    },

    'community_quality_rating': function() {
        var qratings = Template.instance().data.quality_ratings;

        var total = 0;

        for (var i = 0; i < qratings.length; i++) {
            total += qratings[i].rating;
        }

        return (total / qratings.length);
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
