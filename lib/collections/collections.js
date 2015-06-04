//Mongo db collections used on the client
Posts = new Mongo.Collection('posts');
Comments = new Mongo.Collection('comments');
Dictionaries = new Mongo.Collection('dictionary');
Adminlabels = new Mongo.Collection('adminlabels');
Summaries = new Mongo.Collection('summaries');
Terms = new Mongo.Collection('terms');
Categories = new Mongo.Collection('categories');
Definitions = new Mongo.Collection('definitions');

//Mongo db pivot tables. Should only be used on server publications.
Term_label_values = new Mongo.Collection('term_label_values');

//Create search indexes on collections you want to use easy search with
Posts.initEasySearch(['title', 'doi', 'author', 'publisher'], {
    'limit' : 20
});

Dictionaries.initEasySearch(['name'],{

});

Terms.initEasySearch(['term_name'],{

});
