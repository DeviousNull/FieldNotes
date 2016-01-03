Template.summaryList.helpers({
    'Summaries': function(){
        var summaries = [];
        var posts = Posts.find({}).fetch();

        posts.forEach(function(post) {
            post.summaries.forEach(function(summary) {
                var copy = {
                    'postID': post._id,
                    'userID': summary.userID,
                    'isOfficialAbstract': summary.isOfficialAbstract,
                    'createdAt': summary.createdAt,
                    'text': summary.text,
                    'ratings': summary.ratings,
                };
                summaries.push(copy);
            });
        });

        return summaries;
    }
});
