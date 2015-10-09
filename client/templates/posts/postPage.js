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
        var user_rating = Post_quality_ratings.findOne({
            'userID': Meteor.userId(),
            'postID': Template.instance().data._id
        });

        if (!user_rating) {
            Post_quality_ratings.insert({
                'userID': Meteor.userId(),
                'postID': Template.instance().data._id,
                'rating': Template.instance().$('#user-rating').data('userrating'),
            });
        } else if (user_rating.rating != Template.instance().$('#user-rating').data('userrating')) {
            Post_quality_ratings.update(user_rating._id, {
                '$set': {
                    'rating': Template.instance().$('#user-rating').data('userrating'),
                }
            });
        } else {
            Post_quality_ratings.remove(user_rating._id);
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
      'click #uvote-button': function(e) {
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

    'click #dvote-button': function(e) {
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

    'user_quality_rating': function() {
        if (!Meteor.userId()) {
            return -1;
        } else {
            var user_rating = Post_quality_ratings.findOne({
                'userID': Meteor.userId(),
                'postID': Template.instance().data._id,
            });
            if (user_rating) {
                return user_rating.rating;
            } else {
                return -1;
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
