Template.summaryListByCategory.helpers({
    //Return an array of summaries from a category id
    'summaries': function(_categoryID){
        var summaries = [];

        Posts.find({categoryID: _categoryID}, { 'reactive': false }).forEach(function(post) {
            Summaries.find({postID: post._id}, { 'reactive': false }).forEach(function(summary) {
                summaries.push(summary);
            });
        });

        return summaries;
    }
});
