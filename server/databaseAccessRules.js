/***********************
* ACL Helper Functions *
***********************/

// ACL function factory
// Returned functions return true IFF all specified functions return true.
// Commented out because its not used anywhere right now
/*function aclALL(_funcArray) {
    return function(_userid, _doc, _fields, _modifier) {
        var result = true;

        for (var i = 0; i < _funcArray.length; i++) {
            result = result && _funcArray[i](_userid, _doc, _fields, _modifier);
        }

        return result;
    }
}*/

// ACL function factory
// Returned functions return true IFF any of the specified functions return true.
function aclANY(_funcArray) {
    return function(_userid, _doc, _fields, _modifier) {
        var result = true;

        for (var i = 0; i < _funcArray.length; i++) {
            result = result || _funcArray[i](_userid, _doc, _fields, _modifier);
        }

        return result;
    }
}

// ACL function
// Returns true IFF the provided _userid has the 'admin' role.
function aclUserIsAdmin(_userid, _doc, _fields, _modifier) {
    return Roles.userIsInRole(_userid, 'admin');
}

// ACL function
// Returns true IFF the provided _userid is not null.
function aclUserIsAuthed(_userid, _doc, _fields, _modifier) {
    return (!!_userid);
}

// ACL function factory
// Returned functions return true IFF the document's _fieldName field contains the provided _userid.
function aclUserIsOwner(_fieldName) {
    return function(_userid, _doc, _fields, _modifier) {
        return (_doc[_fieldName] === _userid);
    };
}

/******************************
* Validation Helper Functions *
******************************/

// Validation function factory
// Returned functions return true IFF the field is a valid _id value from the specified collection.
function valIsForeignKey(_collection) {
    return function(_userid, _doc, _field) {
        if (_field in _doc) {
            var cursor = _collection.find({'_id': _doc[_field]});
            return (cursor.count() > 0);
        } else {
            return false;
        }
    };
}

// Validation function factory
// Returned functions return true IFF the field is an Array of valid _id values from the specified collection.
function valIsForeignKeyArray(_collection) {
    return function(_userid, _doc, _field) {
        if (Array.isArray(_doc[_field])) {
            var cursor = _collection.find({
                '_id': {
                    $in: _doc[_field]
                }
            });
            return (cursor.count() === _doc[_field].length);
        } else {
            return false;
        }
    };
}

// Validation function factory
// Returned functions return true IFF the field's value matches the provided pattern when used to call Match.test().
function valMatches(_pattern) {
    return function(_userid, _doc, _field) {
        return Match.test(_doc[_field], _pattern);
    }
}

// Validation function
// Returns true IFF the specified field contains the userID of the user making the request.
function valIsCurrentUserID(_userid, _doc, _field) {
    return (_userid === _doc[_field]);
}

// Validation function factory
// Returned functions return true IFF the field's value is a number in the range [_min, _max].
function valIsNumberInRange(_min, _max) {
    return function(_userid, _doc, _field) {
        if (!Match.test(_doc[_field], Number)) {
            return false;
        }

        return (_min <= _doc[_field] && _doc[_field] <= _max);
    }
}

// Validation function factory
// Returned functions return true IFF the field's value is an integer in the range [_min, _max].
function valIsIntegerInRange(_min, _max) {
    return function(_userid, _doc, _field) {
        if (!Match.test(_doc[_field], Match.Integer)) {
            return false;
        }

        return (_min <= _doc[_field] && _doc[_field] <= _max);
    }
}

// Condition function
// Returns true IFF the specified value is the userID of any user.
function conIsAnyUserID(_val) {
    if (!Match.test(_val, String)) {
        return false;
    }

    return (!!Meteor.users.findOne(_val));
}

/************************
* Database Access Rules *
*************************/

// Database name -> request type -> boolean value or function returning boolean
// NOTE(James): When adding a new Database name entry, be sure that a thunk for it exists at the bottom of this file.
var accessControlList = {
    'Posts' : {
        'insert' : aclUserIsAuthed,
        'update' : aclUserIsAuthed,
    },
    'Comments' : {
        'insert' : aclUserIsAuthed,
        'update' : aclUserIsAuthed,
        'remove' : aclUserIsAdmin
    },
    'Dictionaries' : {
        'insert' : aclUserIsAuthed,
        'update' : aclUserIsAdmin,
        'remove' : aclUserIsAdmin
    },
    'Categories' : {
       'insert' : aclUserIsAdmin,
       'update' : aclUserIsAdmin,
       'remove' : aclUserIsAdmin
   },
    'Adminlabels' : {
        'insert' : aclUserIsAuthed,
        'remove' : aclUserIsAdmin,
    },
    'Summaries' : {
        'insert' : aclUserIsAuthed,
        'update' : aclANY([
            aclUserIsAdmin,
            aclUserIsOwner('userID'),
        ]),
        'remove' : aclUserIsAdmin
    },
    'Terms' : {
        'insert' : aclUserIsAuthed,
        'update' : aclUserIsAdmin,
        'remove' : aclUserIsAdmin
    },
    'Definitions' : {
        'insert' : aclUserIsAuthed,
        'remove' : aclUserIsAdmin
    },
    'Term_label_values' : {
        'insert' : aclUserIsAuthed,
        'update' : aclUserIsAdmin,
        'remove' : aclUserIsAdmin,
    },
    'Post_quality_ratings' : {
        'insert' : aclUserIsAuthed,
        'update' : aclUserIsOwner('userID'),
        'remove' : aclANY([
            aclUserIsAdmin,
            aclUserIsOwner('userID'),
        ]),
    },
    'Summary_ratings' : {
        'insert' : aclUserIsAuthed,
        'update' : aclUserIsOwner('userID'),
        'remove' : aclANY([
            aclUserIsAdmin,
            aclUserIsOwner('userID'),
        ]),
    },
    'Comment_ratings' : {
        'insert' : aclUserIsAuthed,
        'update' : aclUserIsOwner('userID'),
        'remove' : aclANY([
            aclUserIsAdmin,
            aclUserIsOwner('userID'),
        ]),
    },
    'Post_tags' : {
        'insert' : aclUserIsAuthed,
        'remove' : aclUserIsAuthed,
    },
};

/************************
* Data Validation Rules *
************************/

// Database name -> { key, format, references }

// key is an array of field names, the combination of which is unique among documents in the database.
// If key is empty or not present, no uniqueness constraint is enforced.

// format is an object with properties named identically to those from documents in the database.
// The values of format's properties are validation functions.
// All properties of format must be present for a document to be valid

// references is an array containing objects with properties of the form 'Foreign Database Property Name -> Database Variable'.
// When a document is removed from the database, each Foreign Database Property's content is checked for the document's _id.
// The removal will be stopped if any references to the document are found.
// The Foreign Database Property may be either a String or an Array of Strings.

// NOTE(James): When adding a new Database name entry, be sure that a thunk for it exists at the bottom of this file.
var validationList = {
    'Posts' : {
        'key': [],
        'format': {
            'userID':             valMatches(Match.Where(conIsAnyUserID)),
            'createdAt':          valMatches(Match.Any), // Overwritten in DB hook
            'modifiedAt':         valMatches(Match.Any), // Overwritten in DB hook
            'title':              valMatches(String),
            'pop_rating':         valMatches(Number),
            'quality_rating':     valMatches(Number),
            'numRaters':          valMatches(Number),
            'doi':                valMatches(String),
            'author':             valMatches(String),
            'publisher':          valMatches(String),
            'publish_date':       valMatches(String),
            'categoryID':         valIsForeignKey(Categories),
            'definedTermIDArray': valIsForeignKeyArray(Terms),
            'usedTermIDArray':    valIsForeignKeyArray(Terms),
            'upvoteUserIDArray':  valMatches([Match.Where(conIsAnyUserID)]),
            'downvoteUserIDArray':valMatches([Match.Where(conIsAnyUserID)]),
        },
        'references': [
            {'postID': Comments},
            {'postID': Summaries},
            {'postID': Post_quality_ratings},
        ]
    },
    'Comments' : {
        'key': [],
        'format': {
            'userID':     valIsCurrentUserID,
            'parentID':   valMatches(Number),
            'postID':     valIsForeignKey(Posts),
            'text':       valMatches(String),
            'date':       valMatches(String),
        },
        'references': [
            {'parentID':  Comments},
            {'commentID': Comment_ratings},
        ]
    },
    'Categories':{
        'key': [],
        'format': {
            'category_name': valMatches(String),
        },
        'references': [
            {'categoryID': Adminlabels},
        ]
    },
    'Dictionaries' : {
        'key': [],
        'format': {
            'name': valMatches(String),
        },
        'references': [
            {'dictionaryID': Adminlabels},
            {'dictionaryID': Terms},
        ]
    },
    'Adminlabels' : {
        'key': [],
        'format': {
            'dictionaryID': valIsForeignKey(Dictionaries),
            'label':        valMatches(String),
            'description':  valMatches(String),
        },
        'references': [
            {'adminlabelID': Term_label_values},
        ]
    },
    'Summaries' : {
        'key': [],
        'format': {
            'userID':             valIsCurrentUserID,
            'postID':             valIsForeignKey(Posts),
            'text':               valMatches(String),
            'isOfficialAbstract': valMatches(Boolean),
        },
        'references': [
            {'summaryID': Summary_ratings},
        ]
    },
    'Terms' : {
        'key': [],
        'format': {
            'term_name':    valMatches(String),
            'dictionaryID': valIsForeignKey(Dictionaries),
        },
        'references': [
            {'termID':             Term_label_values},
            {'termID':             Definitions},
            {'definedTermIDArray': Posts},
            {'usedTermIDArray':    Posts},
        ]
    },
    'Definitions' : {
        'key': [],
        'format': {
            'termID':         valIsForeignKey(Terms),
            'userID':         valIsCurrentUserID,
            'text':           valMatches(String),
            'quality_rating': valMatches(Number),
            'numRaters':      valMatches(Number),
        },
        'references': [
        ]
    },
    'Term_label_values' : {
        'key': [ 'termID', 'adminlabelsID' ],
        'format': {
            'termID':        valIsForeignKey(Terms),
            'adminlabelsID': valIsForeignKey(Adminlabels),
            'value':         valMatches(String),
        },
        'references': [
        ]
    },
    'Post_quality_ratings' : {
        'key': [ 'userID', 'postID' ],
        'format': {
            'userID':   valIsCurrentUserID,
            'postID':   valIsForeignKey(Posts),
            'rating':   valIsNumberInRange(1, 5),
        },
        'references': [
        ]
    },
    'Summary_ratings' : {
        'key': [ 'userID', 'summaryID' ],
        'format': {
            'userID':    valIsCurrentUserID,
            'summaryID': valIsForeignKey(Summaries),
            'rating':    valIsNumberInRange(0, 5),
        },
        'references': [
        ]
    },
    'Comment_ratings' : {
        'key': [ 'userID', 'commentID' ],
        'format': {
            'userID':    valIsCurrentUserID,
            'commentID': valIsForeignKey(Comments),
            'isUpvote':  valMatches(Boolean),
        },
        'references': [
        ]
    },
    'Post_tags' : {
        'key': [ 'postID', 'tag' ],
        'format': {
            'postID':  valIsForeignKey(Posts),
            'tag':     valMatches(String),
        },
        'references': [
        ]
    },
};

/*********************
* ACL Implementation *
*********************/

// Checks the ACL for an entry matching the requested change.
function checkAccess(_dbname, _type, _userid, _doc, _fields, _modifier) {
    if (accessControlList[_dbname]) {
        if (accessControlList[_dbname][_type]) {
            if (typeof accessControlList[_dbname][_type] === "boolean") {
                var allow = accessControlList[_dbname][_type];
                if (!allow) {
                    console.log("WARN: databaseAccessRules.js: " + _dbname + " " + _type + " denied - ACL boolean false. (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
                }
                return allow;
            } else if (typeof accessControlList[_dbname][_type] === "function") {
                var allow = accessControlList[_dbname][_type](_userid, _doc, _fields, _modifier);
                if (!allow) {
                    console.log("WARN: databaseAccessRules.js: " + _dbname + " " + _type + " denied - ACL function returned false. (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
                }
                return allow;
            }
        }
    }
    console.log("WARN: databaseAccessRules.js: " + _dbname + " " + _type + " denied - No rule defined. (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
    return false; // Default deny
}

function allowThunkFactory(name) {
    return {
        insert : function(userId, doc) {
            return checkAccess(name, 'insert', userId, doc);
        },
        update : function(userId, doc, fieldNames, modifier) {
            return checkAccess(name, 'update', userId, doc, fieldNames, modifier);
        },
        remove : function(userId, doc) {
            return checkAccess(name, 'remove', userId, doc);
        }
    };
}

/****************************
* Validation Implementation *
****************************/

// Returns true IFF the data is valid.
function verifyData(_collection, _dbname, _userid, _doc) {
    if (validationList[_dbname]) {
        // Format constraint
        if (validationList[_dbname]['format']) {
            for (var property in _doc) { // verify that there are no unexpected fields
                if (!(property in validationList[_dbname]['format']) && !(property === '_id')) {
                    console.log("WARN: databaseAccessRules.js: " + _dbname + " request denied - Unexpected field: '" + property + "'. (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
                    return false;
                }
            }
            for (var property in validationList[_dbname]['format']) { // verify that all expected fields exist and have valid contents
                if (property in _doc) {
                    if (!validationList[_dbname]['format'][property](_userid, _doc, property)) {
                        console.log("WARN: databaseAccessRules.js: " + _dbname + " request denied - Verification function returned false. (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ", prop: " + property + ")");
                        return false;
                    }
                } else {
                    console.log("WARN: databaseAccessRules.js: " + _dbname + " request denied - Missing field: '" + property + "'. (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
                    return false;
                }
            }
        } else {
            console.log("FIXME: databaseAccessRules.js: " + _dbname + " no data validation performed on request.");
        }

        // Uniqueness constraint
        if (validationList[_dbname]['key'] && validationList[_dbname]['key'].length !== 0) {
            var query = {};
            validationList[_dbname]['key'].forEach(function(key) {
                query[key] = _doc[key];
            });

            var entry = _collection.findOne(query);
            if (typeof entry !== 'undefined') {
                if (!('_id' in _doc)) {
                    console.log("WARN: databaseAccessRules.js: " + _dbname + " request denied - entry with same keys already exists (No _id in new document). (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
                    return false;
                }
                if (_doc._id !== entry._id) {
                    console.log("WARN: databaseAccessRules.js: " + _dbname + " request denied - entry with same keys already exists (Different _id in new document). (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
                    return false;
                }
            }
        }

        return true;
    }
    console.log("FIXME: databaseAccessRules.js: " + _dbname + " no entry in validation list for database.");
    return true; // Default allow
}

// Applies a specified modifier to a specified document. Returns true if successful, false if the modifier is unsupported.
function applyModification(_doc, _modifier) {
    var supported_properties = [ "$set", "$pull", "$addToSet" ];
    for (var property in _modifier) {
        if (supported_properties.indexOf(property) === -1) {
            return false;
        }
    }

    if (_modifier.$set) {
        for (var property in _modifier.$set) {
            _doc[property] = _modifier.$set[property];
        }
    }

    if (_modifier.$pull) {
        for (var property in _modifier.$pull) {
            while (_doc[property].indexOf(_modifier.$pull[property]) >= 0) {
                _doc[property].splice(_doc[property].indexOf(_modifier.$pull[property]), 1);
            }
        }
    }

    if (_modifier.$addToSet) {
        for (var property in _modifier.$addToSet) {
            if (_doc[property].indexOf(_modifier.$addToSet[property]) < 0) {
                _doc[property].push(_modifier.$addToSet[property]);
            }
        }
    }

    return true;
}

// Returns true IFF no known references exist
function checkReferences(_dbname, _doc) {
    if (validationList[_dbname]) {
        if (validationList[_dbname]['references']) {
            var refArray = validationList[_dbname]['references'];
            for (var i = 0; i < refArray.length; i++) {
                for (var property in refArray[i]) {
                    var foreignDatabase = refArray[i][property];

                    var query = {};
                    query[property] = _doc._id;

                    if (foreignDatabase.find(query).count() !== 0) {
                        console.log("WARN: databaseAccessRules.js: " + _dbname + " remove denied - Reference exists in '" + property + "' (Rule #" + (i+1) + "/" + refArray.length + "). (doc: " + JSON.stringify(_doc) + ")");
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

function denyThunkFactory(collection, name) {
    return {
        insert : function(userId, doc) {
            return !verifyData(collection, name, userId, doc);
        },
        update : function(userId, doc, fieldNames, modifier) {
            var success = applyModification(doc, modifier);
            if (!success) {
                return true;
            }
            return !verifyData(collection, name, userId, doc);
        },
        remove : function(userId, doc) {
            return !checkReferences(name, doc);
        }
    };
}

/*****************
* Database Hooks *
******************/

Posts.allow(allowThunkFactory('Posts'));
Posts.deny(denyThunkFactory(Posts, 'Posts'));

Comments.allow(allowThunkFactory('Comments'));
Comments.deny(denyThunkFactory(Comments, 'Comments'));

Dictionaries.allow(allowThunkFactory('Dictionaries'));
Dictionaries.deny(denyThunkFactory(Dictionaries, 'Dictionaries'));

Adminlabels.allow(allowThunkFactory('Adminlabels'));
Adminlabels.deny(denyThunkFactory(Adminlabels, 'Adminlabels'));

Summaries.allow(allowThunkFactory('Summaries'));
Summaries.deny(denyThunkFactory(Summaries, 'Summaries'));

Terms.allow(allowThunkFactory('Terms'));
Terms.deny(denyThunkFactory(Terms, 'Terms'));

Categories.allow(allowThunkFactory('Categories'));
Categories.deny(denyThunkFactory(Categories, 'Categories'));

Definitions.allow(allowThunkFactory('Definitions'));
Definitions.deny(denyThunkFactory(Definitions, 'Definitions'));

Term_label_values.allow(allowThunkFactory('Term_label_values'));
Term_label_values.deny(denyThunkFactory(Term_label_values, 'Term_label_values'));

Post_quality_ratings.allow(allowThunkFactory('Post_quality_ratings'));
Post_quality_ratings.deny(denyThunkFactory(Post_quality_ratings, 'Post_quality_ratings'));

Summary_ratings.allow(allowThunkFactory('Summary_ratings'));
Summary_ratings.deny(denyThunkFactory(Summary_ratings, 'Summary_ratings'));

Comment_ratings.allow(allowThunkFactory('Comment_ratings'));
Comment_ratings.deny(denyThunkFactory(Comment_ratings, 'Comment_ratings'));

Post_tags.allow(allowThunkFactory('Post_tags'));
Post_tags.deny(denyThunkFactory(Post_tags, 'Post_tags'));