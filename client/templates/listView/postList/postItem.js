Template.postItem.helpers({
    //Return the username of a another user
    'getUserName': function(userID) {
        var user = Meteor.users.findOne(userID)
        if (!user) {
            return "UID:" + userID;
        }
        return user.username;
    },
    'top_summary': function() {
        return Summaries.findOne({postID: this._id});
    },
    'community_quality_rating': function() {
        var all_ratings = Post_quality_ratings.find({
            'postID': Template.instance().data._id,
        });

        if (all_ratings.count() == 0) {
            return -1;
        }

        var total = 0;
        all_ratings.forEach(function(current) {
            total += current.rating;
        });

        return (total / all_ratings.count());
    },
});

Template.postItem.events({
    //Click event for the up arrow on the front page
    'click .upArrowButton': function(e){
        //If the user is logged in
        if(Meteor.user()) {
            //Save the buttons
            var button = $('[name=upArrow'+this._id+']');
            var downButton = $('[name=downArrow'+this._id+']');

            //Get the data from our post
            var post = Posts.findOne({_id : this._id});
            var postID = post._id;
            var pop_rating =post.pop_rating;

            //If the down button has class pressed and we've clicked the upvote button
            if (downButton.hasClass('pressed')){
                //Increase the rating by one
                pop_rating = pop_rating + 1;

                //Update the post
                Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});

                //Remove the pressed class, and change the look of the button
                downButton.toggleClass("pressed");
                downButton.toggleClass("btn-danger");
            }

            //If the up button has class pressed and we've clicked the upvote button
            //Executed when you've already pressed the upvote once.
            if (button.hasClass('pressed')){

                //Undo the update
                pop_rating = pop_rating -1;

                //Update the post
                Posts.update({_id: postID}, {$set : { pop_rating: pop_rating}});

            }
            //Upvote the post
            else{
                //Increase the rating
                pop_rating = pop_rating + 1

                //Update the post
                Posts.update({_id : postID},{$set : { pop_rating: pop_rating}});
            }

            //Toggle pressed class to allow for toggle functionality of upvotes
            button.toggleClass("pressed");

            //Change the look of the button
            button.toggleClass("btn-info");
        }
    },

    'click .downArrowButton': function(e){
        //If the user is logged in
        if(Meteor.user()) {
            //Save the upvote/downvote buttons
            var button = $('[name=downArrow' + this._id+']');
            var upButton = $('[name=upArrow'+this._id+']');

            //Find our post data
            var post = Posts.findOne({_id: this._id});
            var postID = post._id;
            var pop_rating = post.pop_rating;

            //If the upvote button has the class pressed and we've clicked the downvote button
            if (upButton.hasClass('pressed')){
                //Decrease the rating
                pop_rating = pop_rating - 1 ;

                //Update the post
                Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});

                //Change the look of the button
                upButton.toggleClass("pressed");
                upButton.toggleClass("btn-info");
            }

            //If the downvote button has the class pressed and we've clicked the downvote button
            if (button.hasClass('pressed')){
                //Undo the negative rating because the button was pressed again
                pop_rating = pop_rating +1 ;

                //Update the post
                Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});
            }
            //Downvote section
            else {
                //Decrease
                pop_rating = pop_rating -1;

                //Update post
                Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});
            }

            //Toggle the button class for downvote toggling functionality
            button.toggleClass("pressed");

            //Change the look of the button
            button.toggleClass("btn-danger");
        }
    }

});
