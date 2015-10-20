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
    Summary_ratings.find({'summaryID': _summaryID}).forEach(function(doc) {
        Summary_ratings.remove(doc._id);
    });
  },

  'ban-user': function (_userID){
    check(_userID, String);

    if(!Roles.userIsInRole(this.userId, 'admin'))
      throw new Meteor.Error("access-denied", "Only Admins can ban users");
    
    Roles.addUsersToRoles(_userID, ['banned']);
  }
}); 
