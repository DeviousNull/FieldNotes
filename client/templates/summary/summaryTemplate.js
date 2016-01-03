Template.summaryTemplate.onCreated(function() {
    // flag for toggling edit mode
    this.editMode = new ReactiveVar(false);
});

Template.summaryTemplate.events({
    'click #upvote-summary-button': function(e) {
        var key = {
            'userID': this.userID,
            'text': this.text,
            'isOfficialAbstract': this.isOfficialAbstract,
            'createdAt': this.createdAt,
        };

        var new_rating;

        if (Meteor.user()._id in this.ratings && this.ratings[Meteor.user()._id] === 1) {
            new_rating = 0;
        } else {
            new_rating = 1;
        }

        Meteor.call('set-post-summary-rating', this.postID, key, new_rating);
    },

    'click #downvote-summary-button': function(e) {
        var key = {
            'userID': this.userID,
            'text': this.text,
            'isOfficialAbstract': this.isOfficialAbstract,
            'createdAt': this.createdAt,
        };

        var new_rating;

        if (Meteor.user()._id in this.ratings && this.ratings[Meteor.user()._id] === -1) {
            new_rating = 0;
        } else {
            new_rating = -1;
        }

        Meteor.call('set-post-summary-rating', this.postID, key, new_rating);
    },

    'click #delete-summary': function(e) {
        if (confirm("Are you sure you want to delete this summary?")) {
            var key = {
                'userID': this.userID,
                'text': this.text,
                'isOfficialAbstract': this.isOfficialAbstract,
                'createdAt': this.createdAt,
            };

            Meteor.call('remove-post-summary', this.postID, key);
        }
    },

    'click #edit-summary': function(e) {
        Template.instance().editMode.set(true);
    },

    'click #save-summary': function(e) {
        Template.instance().editMode.set(false);

        var key = {
            'userID': this.userID,
            'text': this.text,
            'isOfficialAbstract': this.isOfficialAbstract,
            'createdAt': this.createdAt,
        };

        var mod = {
            'text': Template.instance().$('textarea#summary-text').val(),
        };

        Meteor.call('update-post-summary', this.postID, key, mod);
    },
});

Template.summaryTemplate.helpers({
    'markdownedText': function() {
        var converter = new Showdown.converter();

        //return text with reinstated underscores in place of <em> & </em>
        return converter.makeHtml(this.text).replace(/<em>|<\/em>/g,"_");
    },

    'up_pressed': function() {
        if (!Meteor.user()) {
            return false
        }

        return (Meteor.user()._id in this.ratings && this.ratings[Meteor.user()._id] === 1);
    },

    'down_pressed': function() {
        if (!Meteor.user()) {
            return false
        }

        return (Meteor.user()._id in this.ratings && this.ratings[Meteor.user()._id] === -1);
    },

    'influence': function() {
        var rating = 0;
        
        for (var prop in this.ratings) {
            rating += this.ratings[prop];
        }
        
        return rating;
    },

    'is_official_abstract': function() {
        return Template.instance().data.isOfficialAbstract;
    },

    'user_can_delete': function() {
        if (Meteor.user()) {
            return (Roles.userIsInRole(Meteor.user()._id,'admin')
                    || Template.instance().data.userID === Meteor.user()._id);
        } else {
            return false;
        }
    },

    'user_can_modify': function() {
        if (Meteor.user()) {
            return Template.instance().data.userID === Meteor.user()._id;
        } else {
            return false;
        }
    },

    'edit_mode': function() {
        return Template.instance().editMode.get();
    }
});
