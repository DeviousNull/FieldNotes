Template.commentItem.helpers({
    //Return a username from a user id
    'username': function() {
        return Meteor.users.findOne({_id : this.userID}).username;
    },

    'upPressed': function() {
        return (Meteor.user()._id in this.ratings && this.ratings[Meteor.user()._id] === 1);
    },

    'downPressed': function() {
        return (Meteor.user()._id in this.ratings && this.ratings[Meteor.user()._id] === -1);
    },
    
    'rating': function() {
        var rating = 0;
        
        for (var prop in this.ratings) {
            rating += this.ratings[prop];
        }
        
        return rating;
    },
});

Template.commentItem.events({
    //Click event for the upvote button on a comment
    'click .upArrowButton': function(e){
        var key = {
            'userID': this.userID,
            'text': this.text,
            'createdAt': this.createdAt,
        };

        var new_rating;

        if (Meteor.user()._id in this.ratings && this.ratings[Meteor.user()._id] === 1) {
            new_rating = 0;
        } else {
            new_rating = 1;
        }

        Meteor.call('set-post-comment-rating', this.postID, key, new_rating);
    },
    //Click event for downvote button
    'click .downArrowButton': function(e){
        var key = {
            'userID': this.userID,
            'text': this.text,
            'createdAt': this.createdAt,
        };

        var new_rating;

        if (Meteor.user()._id in this.ratings && this.ratings[Meteor.user()._id] === -1) {
            new_rating = 0;
        } else {
            new_rating = -1;
        }

        Meteor.call('set-post-comment-rating', this.postID, key, new_rating);
    },

    //Click event for delete button
    'click .deleteComment': function(e){
        var key = {
            'userID': this.userID,
            'text': this.text,
            'createdAt': this.createdAt,
        };

        if (confirm("Are you sure you want to delete this comment?")){
            Meteor.call('remove-post-comment', this.postID, key);
        }
    },
});
