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
        var updatedPost = {
            $set : {
                'doi': Template.instance().$('[id=doi]').val(),
                'author': Template.instance().$('[id=author]').val(),
                'publisher': Template.instance().$('[id=publisher]').val(),
                'publish_date': Template.instance().$('[id=publish_date]').val(),
                'modifiedAt': moment(),
            }
        };

        //Update
        Posts.update(this._id, updatedPost);
    },

    'click #user-rating': function(e) {
        var qratings = Template.instance().data.quality_ratings;
        var user_rating = -1;
        for (var i = 0; i < qratings.length; i++) {
            if (qratings[i].userID === Meteor.userId()) {
                user_rating = qratings[i].rating;
                break;
            }
        }

        if (user_rating === Template.instance().$('#user-rating').data('userrating')) {
            Meteor.call('set-post-quality-rating', Template.instance().data._id, -1);
        } else {
            Meteor.call('set-post-quality-rating', Template.instance().data._id, Template.instance().$('#user-rating').data('userrating'));
        }
    },

    'click #remove_tag': function(e) {
        if (!confirm("Are you sure you want to remove the '" + e.target.attributes['tag'].value + "' tag from this paper?")) {
            return;
        }

        Post_tags.remove(e.target.attributes['tag_id'].value);
    },

    'click #add_tag': function(e) {
        Template.instance().addTagMode.set(true);
    },

    'click #cancel_tag': function(e) {
        Template.instance().addTagMode.set(false);
    },

    'click #submit_tag': function(e) {
        var new_tag = Template.instance().$('#tag_input').val();

        var existing_tag = Post_tags.findOne({
            'postID': Template.instance().data._id,
            'tag': new_tag,
        });

        if (existing_tag) {
            alert("This paper already has that tag.");
            return;
        }

        if (new_tag) {
            Post_tags.insert({
                'postID': Template.instance().data._id,
                'tag': new_tag,
            });
        }

        Template.instance().addTagMode.set(false);
    },
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

Template.postPage.helpers({
    'findUser': function(_userID) {
        return Meteor.users.findOne(_userID).username;
    },

    'allSummaries': function() {
        return Summaries.find({postID: this._id});
    },
    
    'topSummary': function() {
        return Summaries.find({postID: this._id}, {sort: {quality_rating: -1}, limit: 1});
    },

    'comments': function() {
        return Comments.find({postID: this._id});
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

        for (var i = 0; i < qratings.length; i++) {
            total += qratings[i].rating;
        }

        return (total / qratings.length);
    },

    'user_quality_rating': function() {
        if (!Meteor.userId()) {
            return -1;
        } else {
            var qratings = Template.instance().data.quality_ratings;

            for (var i = 0; i < qratings.length; i++) {
                if (qratings[i].userID === Meteor.userId()) {
                    return qratings[i].rating;
                }
            }
        }
    },

    'tags': function() {
        return Post_tags.find({ 'postID': Template.instance().data._id });
    },

    'add_tag_mode': function() {
        return Template.instance().addTagMode.get();
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
