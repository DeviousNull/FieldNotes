Template.categoryPage.helpers({
    //Return the posts to be displayed
    'posts': function() {
        if (Template.instance().data.type == "category") {
            
            //client's version of Posts collection only contains posts from a category and its subcategories
            return Posts.find();

        } else if (Template.instance().data.type == "tag") {
            var postIDs = [];
            Post_tags.find({'tag': Template.instance().data.object }).forEach(function(doc) {
                postIDs.push(doc.postID);
            });

            return Posts.find({
                '_id' : {
                    '$in' : postIDs,
                }
            });

        }
    }
});
