Template.postPage.onCreated(function() {
    // flag for toggling summaries
    this.showAllSummaries = new ReactiveVar(false);
    // flag for toggling edit mode
    this.editMode = new ReactiveVar(false);
    // flag for mode to add a new tag
    this.addTagMode = new ReactiveVar(false);
});

Template.postPage.events({
    //Click event for showing all summaries
    "click .summary-button": function(event, template) {
        //Update the reactive flag
        var sas = Template.instance().showAllSummaries;
        sas.set(!sas.get());
    },

    //Click event for the edit post button
    "click .editPostButton": function(event) {
        // Enable edit mode
        Template.instance().editMode.set(true);
    },

    //Click event for saving changes to a post
    'click .savePostButton': function(e) {
        // Disable edit mode
        Template.instance().editMode.set(false);

        //Update data. For fields that aren't updated, grab their old value
        var update = {
            'doi': Template.instance().$('[id=doi]').val(),
            'author': Template.instance().$('[id=author]').val(),
            'publisher': Template.instance().$('[id=publisher]').val(),
            'publish_date': Template.instance().$('[id=publish_date]').val(),
        };

        Meteor.call('update-post', Template.instance().data._id, update);
    },

    'click #user-rating': function(e) {
        var qratings = Template.instance().data.quality_ratings;

        if (Meteor.user()._id in qratings && qratings[Meteor.user()._id] === Template.instance().$('#user-rating').data('userrating')) {
            Meteor.call('set-post-quality-rating', Template.instance().data._id, -1);
        } else {
            Meteor.call('set-post-quality-rating', Template.instance().data._id, Template.instance().$('#user-rating').data('userrating'));
        }
    },

    'click #remove_tag': function(e) {
        if (!confirm("Are you sure you want to remove the '" + e.target.attributes['tag'].value + "' tag from this paper?")) {
            return;
        }

        Meteor.call('remove-tag-from-paper', Template.instance().data._id, e.target.attributes['tag'].value);
    },

    'click #add_tag': function(e) {
        Template.instance().addTagMode.set(true);
    },

    'click #cancel_tag': function(e) {
        Template.instance().addTagMode.set(false);
    },

    'click #submit_tag': function(e) {
        var new_tag = Template.instance().$('#tag_input').val();

        if (Template.instance().data.tags.indexOf(new_tag) !== -1) {
            alert("This paper already has that tag.");
            return;
        }

        if (new_tag) {
            Meteor.call('add-tag-to-paper', Template.instance().data._id, new_tag);
        }

        Template.instance().addTagMode.set(false);
    },
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

Template.postPage.helpers({
    'findUser': function(_userID) {
        return Meteor.users.findOne(_userID).username;
    },

    'allSummaries': function() {
        var summaries = [];

        this.summaries.forEach(function(summary) {
            var copy = {
                'postID': Template.instance().data._id,
                'userID': summary.userID,
                'isOfficialAbstract': summary.isOfficialAbstract,
                'createdAt': summary.createdAt,
                'text': summary.text,
                'ratings': summary.ratings,
            };

            summaries.push(copy);
        });

        return summaries;
    },
    
    'topSummary': function() {
        var summaries = this.summaries;

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

    'comments': function() {
        var comments = [];

        Template.instance().data.comments.forEach(function(comment) {
            var copy = {
              'postID': Template.instance().data._id,
              'userID': comment.userID,
              'createdAt': comment.createdAt,
              'text': comment.text,
              'ratings': comment.ratings,
            };
            comments.push(copy);
        });

        return comments;
    },

    //Return all the terms used in this paper
    'terms_used': function() {
        return Terms.find({_id: {$in: this.usedTermIDArray}});
    },

    //Return all terms defined in this paper
    'terms_defined': function() {
        return Terms.find({_id: {$in: this.definedTermIDArray}});
    },

    'showAllSummaries': function() {
        return Template.instance().showAllSummaries.get();
    },

    'editMode': function() {
        return Template.instance().editMode.get();
    },
    
    'community_quality_rating': function() {
        var qratings = Template.instance().data.quality_ratings;

        var total = 0;
        var count = 0;

        for (var prop in qratings) {
            total += qratings[prop];
            count++;
        }

        if (count > 0) {
            return (total / count);
        } else {
            return -1;
        }
    },

    'user_quality_rating': function() {
        if (!Meteor.userId()) {
            return -1;
        } else {
            var qratings = Template.instance().data.quality_ratings;

            if (Meteor.user()._id in qratings) {
                return qratings[Meteor.user()._id];
            } else {
                return -1;
            }
        }
    },

    'tags': function() {
        return Template.instance().data.tags;
    },

    'tag_to_object': function() {
        return {
            'tag': this,
        };
    },

    'add_tag_mode': function() {
        return Template.instance().addTagMode.get();
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
