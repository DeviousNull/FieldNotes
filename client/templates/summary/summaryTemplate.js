Template.summaryTemplate.onCreated(function() {
    // flag for toggling edit mode
    this.editMode = new ReactiveVar(false);
});

Template.summaryTemplate.events({
    'click #upvote-button': function(e) {
        if (!Meteor.user()) {
            return;
        }

        Summaries.update(this._id, {
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

        Summaries.update(this._id, {
            '$pull': {
                'upvoteUserIDArray': Meteor.user()._id,
            },
            '$addToSet': {
                'downvoteUserIDArray': Meteor.user()._id,
            }
        });
    },

    'click #delete-summary': function(e) {
        if (confirm("Are you sure you want to delete this summary?")) {
            Meteor.call('delete-summary', this._id);
        }
    },

    'click #edit-summary': function(e) {
        Template.instance().editMode.set(true);
    },

    'click #save-summary': function(e) {
        Template.instance().editMode.set(false);

        var updatedSummary = {
            $set : {
                'text': Template.instance().$('textarea#summary-text').val(),
            }
        };

        Summaries.update(this._id, updatedSummary);
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
