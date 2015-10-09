Template.summaryTemplate.events({
    'click #summary-user-rating': function(e) {
        var user_rating = Summary_ratings.findOne({
            'userID': Meteor.userId(),
            'summaryID': Template.instance().data._id,
        });

        if (!user_rating) {
            Summary_ratings.insert({
                'userID': Meteor.userId(),
                'summaryID': Template.instance().data._id,
                'rating': Template.instance().$('#summary-user-rating').data('userrating'),
            });
        } else if (user_rating.rating != Template.instance().$('#summary-user-rating').data('userrating')) {
            Summary_ratings.update(user_rating._id, {
                '$set': {
                    'rating': Template.instance().$('#summary-user-rating').data('userrating'),
                }
            });
        } else {
            Summary_ratings.remove(user_rating._id);
        }
    },

    'click #delete-summary': function(e) {
        if (confirm("Are you sure you want to delete this summary?")) {
            Meteor.call('delete-summary', this._id);
        }
    },
});

Template.summaryTemplate.helpers({
    'markdownedText': function() {
        var converter = new Showdown.converter();
        return converter.makeHtml(this.text);
    },

    'summary_quality_rating': function() {
        var all_ratings = Summary_ratings.find({
            'summaryID': Template.instance().data._id,
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

    'summary_user_rating': function() {
        if (!Meteor.userId()) {
            return -1;
        } else {
            var user_rating = Summary_ratings.findOne({
                'userID': Meteor.userId(),
                'summaryID': Template.instance().data._id,
            });
            if (user_rating) {
                return user_rating.rating;
            } else {
                return -1;
            }
        }
    },

    'is_official_abstract': function() {
        return Template.instance().data.isOfficialAbstract;
    },

    'user_can_modify': function() {
        if (Meteor.user()) {
            return (Roles.userIsInRole(Meteor.user()._id,'admin')
                    || Template.instance().data.userID === Meteor.user()._id);
        } else {
            return false;
        }
    },
});
