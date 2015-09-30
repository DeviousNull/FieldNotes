Template.postsList.helpers({
    'posts': function() {
        if (!Template.instance().data) {
            return Posts.find();
        } else {
            return Template.instance().data;
        }
    }
});
