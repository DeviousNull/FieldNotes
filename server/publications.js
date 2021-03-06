//Server file containing all publications for collections.

/****************
*     LISTS     *
****************/

//Publish for posts lists
Meteor.publish('listAllPosts', function(){
    return Posts.find({});
});

//Publish the dictionaries
Meteor.publish('listAllDictionaries', function(){
    return Dictionaries.find({});
});

//Publish all the categories
Meteor.publish('listAllCategories', function(){
    return Categories.find({});
});

//Publish the list of searchable terms
Meteor.publish('listAllTerms', function(){
    return Terms.find({});
});

/****************
*   DOCUMENT    *
*     BY ID     *
****************/

//Publish the matching post
Meteor.publish('lookupPost', function(_postID){
    check(_postID, String);
    return Posts.find({_id: _postID});
});

Meteor.publish('lookupDictionary', function(_dictionaryID){
    check(_dictionaryID, String);
    return Dictionaries.find({_id: _dictionaryID});
});

//Publish the terms for a termPage
Meteor.publish('lookupTerm', function(_termID){
    check(_termID, String);
    return Terms.find({_id: _termID});
});

/****************
*   DOCUMENTS   *
*      BY       *
*  FOREIGN KEY  *
****************/

//Publish the admin term fields for a dictionary
Meteor.publish('getAdminlabelsFromDictionaryID', function(_dictionaryID){
    check(_dictionaryID, String);
    return Adminlabels.find({dictionaryID: _dictionaryID});
});

//Publish the terms for a dictionary
Meteor.publish('getTermsFromDictionaryID', function(_dictionaryID) {
    check(_dictionaryID, String);
    return Terms.find({dictionaryID: _dictionaryID});
});

//Publish the label values for a term
Meteor.publish('getLabelValuesFromTermID', function(_termID){
    check(_termID, String);
    return Term_label_values.find({termID: _termID});
});

//Publish the label values for all terms in a dictionary
Meteor.publishComposite('getLabelValuesFromDictionaryID', function(_dictionaryID){
    check(_dictionaryID, String);
    return { // All Dictionary Terms
        'find': function() {
            return Terms.find({'dictionaryID': _dictionaryID});
        },
        'children': [
            { // Term Label Values
                'find': function(term) {
                    return Term_label_values.find({'termID': term._id});
                }
            }
        ]
    };
});

//Publish all the definitions for the term ID
Meteor.publish('getDefinitionsFromTermID', function(_termID){
    check(_termID, String);
    return Definitions.find({termID: _termID});
});

//Publish all the cates for the term ID
Meteor.publish('getCatesFromTermID', function(_termID){
    check(_termID, String);
    return Cates.find({termID: _termID});
});

//Publish all the definitions for all terms in a dictionary
Meteor.publishComposite('getDefinitionsFromDictionaryID', function(_dictionaryID){
    check(_dictionaryID, String);
    return { // All Dictionary Terms
        'find': function() {
            return Terms.find({'dictionaryID': _dictionaryID});
        },
        'children': [
            { // Term Definitions
                'find': function(term) {
                    return Definitions.find({'termID': term._id});
                }
            }
        ]
    };
});

Meteor.publishComposite('getCatesFromDictionaryID', function(_dictionaryID){
    check(_dictionaryID, String);
    return { // All Dictionary Terms
        'find': function() {
            return Terms.find({'dictionaryID': _dictionaryID});
        },
        'children': [
            { // Term Cates
                'find': function(term) {
                    return Cates.find({'termID': term._id});
                }
            }
        ]
    };
});

/****************
* DOCUMENT SETS *
****************/
// All documents needed to render the layout template
Meteor.publish('retrieveLayout', function() {
    return Categories.find({}); // All categories
});

// All documents needed to render a postsList template
Meteor.publishComposite('retrievePostsList', { // All Posts
    'find': function() {
        return Posts.find({});
    },
    'children': [
        { // Poster Username
            'find': function(post) {
                return Meteor.users.find(post.userID, {'fields': {'username':1}});
            }
        },
    ]
});

// All documents needed to render a postPage template
Meteor.publishComposite('retrievePostPage', function(_postID) {
    check(_postID, String);
    return { // Post
        'find': function() {
            return Posts.find(_postID);
        },
        'children': [
            { // Post Submitter
                'find': function(post) {
                    return Meteor.users.find(post.userID, {'fields': {username :1}})
                }
            },
            { // Post Used Terms
                'find': function(post) {
                    return Terms.find({'_id': {'$in': post.usedTermIDArray}});
                }
            },
            { // Post Defined Terms
                'find': function(post) {
                    return Terms.find({'_id': {'$in': post.definedTermIDArray}});
                }
            },
            { // Post Comment Submitters
                'find': function(post) {
                    return Meteor.users.find({}, {'fields': {username :1}}) // TODO(James): Don't send every username to the client.
                }
            },
        ]
    };
});

// All documents needed to render a categoryPage template
Meteor.publishComposite('retrieveCategoryPage', function(_categoryID) {
    check(_categoryID, String);
    return { // Category
        'find': function() {
            return Categories.find(_categoryID);
        },
        'children': [
            { // Category & SubCategory Posts            
                'find': function(category) {
                    var cats = [category._id];

                    var get_sub_categories = function recurs(parentCats){
                        parentCats.forEach(function(parent_id){
                            var subCats=[];

                            Categories.find({parentID: parent_id}).forEach(function(cat){
                                subCats.push(cat._id);
                                cats.push(cat._id);
                            });
                            
                            if(subCats.length)
                                recurs(subCats);
                        });
                    } 
                    get_sub_categories(cats);

                    return Posts.find({
                        'categoryID': {
                            '$in': cats
                        }
                    });
                },
                'children': [
                    { // Category Post Submitter
                        'find': function(post, category) {
                            return Meteor.users.find(post.userID, {'fields': {username :1}});
                        },
                    },
                ]
            }
        ]
    };
});

Meteor.publishComposite('retrieveTagsPage', function(_tags) {
    check(_tags, String);
    return { // Tags
        'find': function() {
            return Term_tags.find({ 'tags': _tags });
        },
        'children': [
            { // Tag Terms
                'find': function(term_tag) {
                    return Terms.find({'_id': term_tag.termID});
                },
            }
        ]
    };
});


// All documents needed to render a tagPage template
Meteor.publishComposite('retrieveTagPage', function(_tag) {
    check(_tag, String);
    return { // Posts
        'find': function() {
            return Posts.find({ 'tags': _tag });
        },
        'children': [
            { // Post Submitter
                'find': function(post) {
                    return Meteor.users.find(post.userID, {'fields': {username :1}});
                },
            },
        ]
    };
});

// All documents needed to render a termPage template
Meteor.publishComposite('retrieveTermPage', function(_termID) {
    check(_termID, String);
    return { // Term
        'find': function() {
            return Terms.find(_termID);
        },
        'children': [
            { // Term Adminlabels
                'find': function(term) {
                    return Adminlabels.find({'dictionaryID': term.dictionaryID});
                },
                'children': [
                    { // Term Adminlabels Values
                        'find': function(adminlabel, term) {
                            return Term_label_values.find({'termID': term._id, 'adminlabelsID': adminlabel._id});
                        }
                    }
                ]
            },
            { // Term Definitions
                'find': function(term) {
                    return Definitions.find({'termID': term._id});
                }
            },
            { // Term Definitions
                'find': function(term) {
                    return Cates.find({'termID': term._id});
                }
            },
             { // Post Tags
                'find': function(term) {
                    return Term_tags.find({termID: _termID});
                },
            },
        ]
    };
});

// All documents needed to render a newTerm template
Meteor.publishComposite('retrieveNewTerm', function(_dictID) {
    check(_dictID, String);
    return { // Dictionary
        'find': function() {
            return Dictionaries.find(_dictID);
        },
        'children': [
            { // Dictionary Adminlabels
                'find': function(dictionary) {
                    return Adminlabels.find({'dictionaryID': dictionary._id});
                }
            }
        ]
    };
});

// All documents needed to render a summaryList template
Meteor.publishComposite('retrieveSummaryList', { // All Posts
    'find': function() {
        return Posts.find({});
    },
    'children': [
        { // Post Submitter
            'find': function(post) {
                return Meteor.users.find(post.userID, {'fields': {'username': 1}});
            }
        },
    ]
});

// All documents needed to render a summaryListByCategory template
Meteor.publishComposite('retrieveSummaryListByCategory', function(_categoryID) {
    check(_categoryID, String);
    return { // All Category Posts
        'find': function() {
            return Posts.find({'categoryID': _categoryID});
        },
        'children': [
            { // Post Submitter
                'find': function(post) {
                    return Meteor.users.find(post.userID, {'fields': {'username' : 1}});
                }
            },
        ]
    };
});
