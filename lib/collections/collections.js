/**********
* Schemas *
***********/
var Schemas = {};

Schemas.Posts = new SimpleSchema({
    'userID': {
        type: String,
    },
    'createdAt': {
        type: Date,
    },
    'modifiedAt': {
        type: Date,
    },
    'title': {
        type: String,
    },
    'doi': { // TODO(James): We should validate against DOI.org here.
        type: String,
    },
    'author': {
        type: String,
    },
    'publisher': {
        type: String,
    },
    'publish_date': {
        type: String,
    },
    'categoryID': { //TODO(James): Replace category ID references with names
        type: String,
    },
    'definedTermIDArray': { //TODO(James): Replace term ID references with names
        type: [String],
    },
    'usedTermIDArray': { //TODO(James): Replace term ID references with names
        type: [String],
    },
    'influence_ratings': { // NOTE: Map of userID->rating, where property names are the userID and property values are the rating
        type: Object,
        blackbox: true,
    },
    'quality_ratings': { // NOTE: Map of userID->rating, where property names are the userID and property values are the rating
        type: Object,
        blackbox: true,
    },
    // Summaries
    'summaries': {
        type: [Object],
    },
    'summaries.$.userID': {
        type: String,
    },
    'summaries.$.text': {
        type: String,
    },
    'summaries.$.isOfficialAbstract': {
        type: Boolean,
    },
    'summaries.$.createdAt': {
        type: Date,
    },
    'summaries.$.ratings': { // NOTE: Map of userID->rating, where property names are the userID and property values are the rating
        type: Object,
        blackbox: true,
    },
    // Comments
    'comments': {
        type: [Object],
    },
    'comments.$.userID': {
        type: String,
    },
    'comments.$.text': {
        type: String,
    },
    'comments.$.createdAt': {
        type: Date,
    },
    'comments.$.ratings': { // NOTE: Map of userID->rating, where property names are the userID and property values are the rating
        type: Object,
        blackbox: true,
    },
    // Tags
    'tags': {
        type: [String],
    },
});

//Mongo db collections used on the client
Posts = new Mongo.Collection('posts');
Posts.attachSchema(Schemas.Posts);

Dictionaries = new Mongo.Collection('dictionary');
Adminlabels = new Mongo.Collection('adminlabels');
Terms = new Mongo.Collection('terms');
Categories = new Mongo.Collection('categories');
Definitions = new Mongo.Collection('definitions');
Cates = new Mongo.Collection('cates');
Term_label_values = new Mongo.Collection('term_label_values');
Term_tags = new Mongo.Collection('term_tags');
//Create search indexes on collections you want to use easy search with
Posts.initEasySearch(['title', 'doi', 'author', 'publisher'], {
    'limit' : 20
});

Categories.initEasySearch(['category_name'],{

});

Dictionaries.initEasySearch(['name'],{

});

Terms.initEasySearch(['term_name'],{

});