Template.categoryPage.helpers({
    //Return the posts to be displayed
    'posts': function() {
        if (Template.instance().data.type == "category") {
            var cats = [Template.instance().data.object._id],
                subCats = Categories.find({parentID: Template.instance().data.object._id});            
            
            subCats.forEach(function(obj){
                cats.push(obj._id);
            });

            return Posts.find({
                'categoryID': {
                    '$in': cats
                }
            });
            
            
            //Below line is all that's needed if the correct posts are published (currently true)
            /*
            return Posts.find();
            */

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
