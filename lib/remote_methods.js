Meteor.methods({
  'delete-summary': function (_summaryID) {
    check(_summaryID, String);
    
    var summary = Summaries.findOne(_summaryID);
    
    if (!summary) {
      throw new Meteor.Error("no-such-summary", "No summary exists with the given ID");
    }
    
    if (!Roles.userIsInRole(this.userId, 'admin') && summary.userID != this.userId) {
      throw new Meteor.Error("access-denied", "Current user does not own the given summary");
    }

    Summaries.remove(_summaryID);
  },

  'ban-user': function (_userID){
    check(_userID, String);

    if(!Roles.userIsInRole(this.userId, 'admin'))
      throw new Meteor.Error("access-denied", "Only Admins can ban users");
    
    Roles.addUsersToRoles(_userID, ['banned']);
  },

  /**
   * _rating: integer 1-5, or -1 to remove rating from post
   */
  'set-post-quality-rating': function(_postID, _rating) {
    check(_postID, String);
    check(_rating, Match.Where(function(value) {
      return (value === -1 ||
              value === 1 ||
              value === 2 ||
              value === 3 ||
              value === 4 ||
              value === 5);
    }));

    Posts.update(_postID, {
    '$pull': {
        'quality_ratings': {
            'userID': this.userId,
        }
      },
    });

    if (_rating !== -1) {
      Posts.update(_postID, {
        '$addToSet': {
            'quality_ratings': {
              'userID': this.userId,
              'rating': _rating,
            }
          }
      });
    }
  }
}); 
