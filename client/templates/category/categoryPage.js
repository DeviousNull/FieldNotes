Template.categoryPage.helpers({
    //Return the posts to be displayed
    'posts': function() {
        if (Template.instance().data.type == "category") {
            var post_array = Posts.find({
                'categoryID': Template.instance().data.object._id,
            }).fetch();

            post_array.sort(function(a, b) {
                var a_score = (a.upvoteUserIDArray.length - a.downvoteUserIDArray.length);
                var b_score = (b.upvoteUserIDArray.length - b.downvoteUserIDArray.length);
                return (b_score - a_score);
            });

            return post_array;
        } else if (Template.instance().data.type == "tag") {
            var postIDs = [];
            Post_tags.find({'tag': Template.instance().data.object }).forEach(function(doc) {
                postIDs.push(doc.postID);
            });

            var post_array = Posts.find({
                '_id' : {
                    '$in' : postIDs,
                }
            }).fetch();
            
            post_array.sort(function(a, b) {
                var a_score = (a.upvoteUserIDArray.length - a.downvoteUserIDArray.length);
                var b_score = (b.upvoteUserIDArray.length - b.downvoteUserIDArray.length);
                return (b_score - a_score);
            });
            
            return post_array;
        }
    }
});
