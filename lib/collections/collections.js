//Mongo db collections used on the client
Posts = new Mongo.Collection('posts');
Comments = new Mongo.Collection('comments');
Dictionaries = new Mongo.Collection('dictionary');
Adminlabels = new Mongo.Collection('adminlabels');
Summaries = new Mongo.Collection('summaries');
Terms = new Mongo.Collection('terms');
Categories = new Mongo.Collection('categories');
Definitions = new Mongo.Collection('definitions');
Cates = new Mongo.Collection('cates');
Term_label_values = new Mongo.Collection('term_label_values');
Comment_ratings = new Mongo.Collection('comment_ratings');
Post_tags = new Mongo.Collection('post_tags');

//Create search indexes on collections you want to use easy search with
Posts.initEasySearch(['title', 'doi', 'author', 'publisher'], {
    'limit' : 20
});

Summaries.initEasySearch(['text'],{
    'limit' : 20
});

Categories.initEasySearch(['category_name'],{

});

Dictionaries.initEasySearch(['name'],{

});

Terms.initEasySearch(['term_name'],{

});

//collection config for admin page
AdminConfig = {
	adminEmails:['jjordan@gmail.com','dillon@gmail.com','kendall@gmail.com'],

	collections:{
		
		Posts:{
			icon: 'post',
			tableColumns:[
				{label: 'Title', name: 'title'},
				{label: 'User', name: 'getUser()'},
			],
		},
		Comments:{
			icon: 'comment',
			tableColumns:[
				{label: 'Text', name: 'text'},
				{label: 'Post', name: Posts.findOne(this.postID)},//'postTitle' },
				{label: 'User', name: 'getUser'},
			],
			//showEditColumn: true,
			//showDelColumn: true,
			//showWidget: false,
			//color: 'red',
		},
	},

	skin: 'blue-light', //black-light blue blue-light green green-light purple purple-light red red-light yellow yellow-light
};
