Template.categoryPage.helpers({
    //Return the posts to be displayed
    'posts': function() {
        if (Template.instance().data.type == "category") {

            var post_array = Posts.find().fetch();

            post_array.sort(function(a, b) {
                var a_rating = 0;
                for (var prop in a.influence_ratings) {
                    a_rating += a.influence_ratings[prop];
                }
                var b_rating = 0;
                for (var prop in b.influence_ratings) {
                    b_rating += b.influence_ratings[prop];
                }

                return (b_rating - a_rating);
            });

            return post_array;
        } else if (Template.instance().data.type == "tag") {

            var post_array = Posts.find({
                'tags' : Template.instance().data.object,
            }, { 'reactive': false }).fetch();
            
            post_array.sort(function(a, b) {
                var a_rating = 0;
                for (var prop in a.influence_ratings) {
                    a_rating += a.influence_ratings[prop];
                }
                var b_rating = 0;
                for (var prop in b.influence_ratings) {
                    b_rating += b.influence_ratings[prop];
                }

                return (b_rating - a_rating);
            });
            
            return post_array;
        }
    }
});
