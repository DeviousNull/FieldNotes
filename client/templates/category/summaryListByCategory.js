Template.summaryListByCategory.helpers({
    //Return an array of summaries from a category id
    'summaries': function(_categoryID){
        var summaries = [];

        Posts.find({categoryID: _categoryID}, { 'reactive': false }).forEach(function(post) {
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
