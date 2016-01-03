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
        var summaries = Template.instance().data.summaries;

        var top_summary = false;
        var top_rating = Number.NEGATIVE_INFINITY;

        summaries.forEach(function(summary) {
            var rating = 0;
            for (var prop in summary.ratings) {
                rating += summary.ratings[prop];
            }

            if (rating > top_rating) {
                top_summary = summary;
                top_rating = rating;
            }
        });

        var copy = {
            'postID': Template.instance().data._id,
            'userID': top_summary.userID,
            'isOfficialAbstract': top_summary.isOfficialAbstract,
            'createdAt': top_summary.createdAt,
            'text': top_summary.text,
            'ratings': top_summary.ratings,
        };

        return copy;
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

        return (Meteor.user()._id in this.influence_ratings && this.influence_ratings[Meteor.user()._id] === 1);
    },

    'down_pressed': function() {
        if (!Meteor.user()) {
            return false
        }

        return (Meteor.user()._id in this.influence_ratings && this.influence_ratings[Meteor.user()._id] === -1);
    },

    'influence': function() {
        var influence = 0;

        for (var prop in this.influence_ratings) {
            influence += this.influence_ratings[prop];
        }

        return influence;
    }
});

Template.postItem.events({
    'click #upvote-button': function(e) {
        if (!Meteor.user()) {
            return;
        }

        var vote;
        if (Meteor.user()._id in this.influence_ratings && this.influence_ratings[Meteor.user()._id] === 1) {
            vote = 0;
        } else {
            vote = 1;
        }

        Meteor.call('set-post-influence-rating', Template.instance().data._id, vote);
    },

    'click #downvote-button': function(e) {
        if (!Meteor.user()) {
            return;
        }

        var vote;
        if (Meteor.user()._id in this.influence_ratings && this.influence_ratings[Meteor.user()._id] === -1) {
            vote = 0;
        } else {
            vote = -1;
        }

        Meteor.call('set-post-influence-rating', Template.instance().data._id, vote);
    },

});
