Template.summaryItem.helpers({
    //Return the title of a post for the summaryItems
    'title': function() {
        return Posts.findOne(this.postID).title;
    },

    'markdownedText': function() {
        var converter = new Showdown.converter();

        //return text with reinstated underscores in place of <em> & </em>
        return converter.makeHtml(this.text).replace(/<em>|<\/em>/g,"_");
    },

    //Return the username from a user id
    'submitter': function(){
        var user = Meteor.users.findOne(this.userID)
        if (!user) {
            return "UID:" + userID;
        }
        return user.username;
    },

    'postLinkData': function() {
        return {'_id': this.postID};
    },

    'influence': function() {
        var rating = 0;

        for (var prop in this.ratings) {
            rating += this.ratings[prop];
        }

        return rating;
    }

});
