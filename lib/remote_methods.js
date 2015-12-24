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

  'delete-category': function (_categoryID) {
    check(_categoryID, String);
    
    var category = Categories.findOne(_categoryID);
    
    if (!category) {
      throw new Meteor.Error("no-such-category", "No category exists with the given ID");
    }

    if (category.isSystemCategory) {
      throw new Meteor.Error("invalid-request", "The specified category is a system category");
    }

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error("access-denied", "Current user is not an admin");
    }

    var uncategoried = Categories.findOne({ 'category_name': 'Uncategorized' });

    if (!uncategoried) {
      throw new Meteor.Error("internal-error", "The internal database is in an unexpected state");
    }

    Categories.remove(_categoryID);
    Categories.update({
        'parentID': _categoryID,
    }, {
        //TODO(James): When category cascading is implemented, this needs to set the category's parent
        //             to its parent's parent, if such a category exists, rather than just unconditionally
        //             making it a top-level category.
        '$unset': {
            'parentID': "",
        }
    }, {
        'multi': true,
    });
    Posts.update({
      'categoryID': _categoryID,
    }, {
      '$set': {
        'categoryID': uncategoried._id,
      }
    }, {
        'multi': true,
    });
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
  },

  /**
   * _rating: 1 for upvote, -1 for downvote, 0 to remove rating from post
   */
  'set-post-influence-rating': function(_postID, _rating) {
    check(this.userId, String);
    check(_postID, String);
    check(_rating, Match.Where(function(value) {
      return (value === -1 ||
              value === 0 ||
              value === 1);
    }));

    if (_rating === 1) {
        Posts.update(_postID, {
            '$pull': {
                'downvoteUserIDArray': this.userId,
            },
            '$addToSet': {
                'upvoteUserIDArray': this.userId,
            }
        });
    } else if (_rating === -1) {
        Posts.update(_postID, {
            '$pull': {
                'upvoteUserIDArray': this.userId,
            },
            '$addToSet': {
                'downvoteUserIDArray': this.userId,
            }
        });
    } else {
        Posts.update(_postID, {
            '$pull': {
                'upvoteUserIDArray': this.userId,
                'downvoteUserIDArray': this.userId,
            },
        });
    }
  },
});

if (Meteor.isServer) {
    Meteor.methods({
       'validate-doi': function(_doi) {
           check(_doi, String);

           if (!_doi) {
               return false;
           }

            try {
                var doi_uri = "https://doi.org/" + encodeURIComponent(_doi);
                var result = HTTP.call("HEAD", doi_uri,
                                    {'timeout': 10000});
                return true;
            } catch (e) {
                return false;
            }
       },
    });
}
