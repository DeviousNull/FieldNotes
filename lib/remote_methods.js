var APISchemas = {};

APISchemas.CommentSpecifier = new SimpleSchema({
    'userID': {
        type: String,
    },
    'text': {
        type: String,
    },
    'createdAt': {
        type: Date,
    },
});

APISchemas.SummarySpecifier = new SimpleSchema({
    'userID': {
        type: String,
    },
    'text': {
        type: String,
    },
    'isOfficialAbstract': {
        type: Boolean,
    },
    'createdAt': {
        type: Date,
    },
});


Meteor.methods({
  'add-post-summary': function(_postID, _text, _isOfficialAbstract) {
    check(this.userId, String);
    check(_postID, String);
    check(_text, String);
    check(_isOfficialAbstract, Boolean);

    Posts.update(_postID, {
      '$addToSet': {
          'summaries': {
            'userID': this.userId,
            'createdAt': new Date().toUTCString(),
            'text': _text,
            'isOfficialAbstract': _isOfficialAbstract,
            'ratings': {},
        },
      },
    });
  },

  'remove-post-summary': function (_postID, _summary) {
    check(this.userId, String);
    check(_postID, String);
    check(_summary, APISchemas.SummarySpecifier);

    if (this.userId !== _summary.userID && !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Match.Error("access-denied", "You must be the summary author or a site admin to remove a summary");
    }

    Posts.update(_postID, {
      '$pull': {
          'summaries': _summary,
      },
    });
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
    check(this.userId, String);
    check(_postID, String);
    check(_rating, Match.Where(function(value) {
      return (value === -1 ||
              value === 1 ||
              value === 2 ||
              value === 3 ||
              value === 4 ||
              value === 5);
    }));

    var property = {};
    property['quality_ratings.' + this.userId] = _rating;

    var modifier;

    if (_rating === -1) {
        modifier = {
          '$unset': property,
        };
    } else {
        modifier = {
          '$set': property,
        };
    }

    Posts.update({
      '_id': _postID,
    }, modifier);
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

    var property = {};
    property['influence_ratings.' + this.userId] = _rating;

    var modifier;

    if (_rating === 0) {
        modifier = {
          '$unset': property,
        };
    } else {
        modifier = {
          '$set': property,
        };
    }

    Posts.update({
      '_id': _postID,
    }, modifier);
  },

  'update-post': function(_postID, _mod) {
    check(this.userId, String);
    check(_postID, String);
    check(_mod, {
        'doi': String,
        'author': String,
        'publisher': String,
        'publish_date': String,
    });

    Posts.update(_postID, {
        '$set': _mod,
        '$currentDate': { 
            'modifiedAt': { '$type': "timestamp" }
        },
    });
  },

  'update-post-summary': function(_postID, _summary, _mod) {
    check(this.userId, String);
    check(_postID, String);
    check(_summary, APISchemas.SummarySpecifier);
    check(_mod, {
        'text': String,
    });

    var modifier = {
        'summaries.$.text': _mod.text,
    };

    Posts.update({
      '_id': _postID,
      'summaries': {
        '$elemMatch': _summary,
      }
    }, {
        '$set': modifier,
    });
  },

  'add-post-comment': function(_postID, _text) {
    check(this.userId, String);
    check(_postID, String);
    check(_text, String);

    Posts.update(_postID, {
      '$addToSet': {
          'comments': {
            'userID': this.userId,
            'createdAt': new Date().toUTCString(),
            'text': _text,
            'ratings': {},
        },
      },
    });
  },

  'remove-post-comment': function(_postID, _comment) {
    check(this.userId, String);
    check(_postID, String);
    check(_comment, APISchemas.CommentSpecifier);

    if (this.userId !== _comment.userID && !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Match.Error("access-denied", "You must be the comment author or a site admin to remove a comment");
    }

    Posts.update(_postID, {
      '$pull': {
          'comments': _comment,
      },
    });
  },

  'add-tag-to-paper': function(_postID, _tag) {
    check(this.userId, String);
    check(_postID, String);
    check(_tag, String);

    Posts.update(_postID, {
      '$addToSet': {
        'tags': _tag,
      },
    });
  },

  'remove-tag-from-paper': function(_postID, _tag) {
    check(this.userId, String);
    check(_postID, String);
    check(_tag, String);

    Posts.update(_postID, {
      '$pull': {
        'tags': _tag,
      },
    });
  },

  'set-post-comment-rating': function(_postID, _comment, _rating) {
    check(this.userId, String);
    check(_postID, String);
    check(_comment, APISchemas.CommentSpecifier);
    check(_rating, Match.Where(function(value) {
      return (value === -1 ||
              value === 0 ||
              value === 1);
    }));

    var property = {};
    property['comments.$.ratings.' + this.userId] = _rating;

    var modifier;

    if (_rating === 0) {
        modifier = {
          '$unset': property,
        };
    } else {
        modifier = {
          '$set': property,
        };
    }

    Posts.update({
      '_id': _postID,
      'comments': {
        '$elemMatch': _comment,
      }
    }, modifier);
  },

  'set-post-summary-rating': function(_postID, _summary, _rating) {
    check(this.userId, String);
    check(_postID, String);
    check(_summary, APISchemas.SummarySpecifier);
    check(_rating, Match.Where(function(value) {
      return (value === -1 ||
              value === 0 ||
              value === 1);
    }));

    var property = {};
    property['summaries.$.ratings.' + this.userId] = _rating;

    var modifier;

    if (_rating === 0) {
        modifier = {
          '$unset': property,
        };
    } else {
        modifier = {
          '$set': property,
        };
    }

    Posts.update({
      '_id': _postID,
      'summaries': {
        '$elemMatch': _summary,
      }
    }, modifier);
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
