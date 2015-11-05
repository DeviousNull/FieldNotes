Template.searchTemplate.onCreated(function() {
    this.postResultsList = new ReactiveVar([]);
    this.summaryResultsList = new ReactiveVar([]);
    this.searchInputHasFocus = new ReactiveVar(false);
    this.selectedSearchType = new ReactiveVar("papers");

    var self = this;

    this.autorun(function(comp) {
        var instance = EasySearch.getComponentInstance(
            { 'id': 'search_input', 'index': 'posts' }
        );

        instance.on('searchResults', function (results) {
            self.postResultsList.set(results);
        });
    });

    this.autorun(function(comp) {
        var instance = EasySearch.getComponentInstance(
            { 'id': 'search_input', 'index': 'summaries' }
        );

        instance.on('searchResults', function (results) {
            if (results) {
                self.summaryResultsList.set(results);
            } else {
                self.summaryResultsList.set([]);
            }
        });
    });
});

Template.searchTemplate.events({
    'focus #search_input': function(ev) {
        Template.instance().searchInputHasFocus.set(true);
    },
    'blur #search_input': function(ev) {
        Template.instance().searchInputHasFocus.set(false);
    },
    'keypress #search_input': function(ev) {
        if (ev.which === 13) { // 13: CR, aka 'Enter'
            Template.instance().$(":focus").blur();
        }
    },
    'change input[name=doc_type]': function(ev) {
        Template.instance().selectedSearchType.set(ev.target.value);
    }
});

//Array of indexes to search. Indexes defined in collections.js
Template.searchTemplate.helpers({
    'indexes': function() {
        return ['posts', 'dictionary', 'terms', 'summaries'];
    },
    'post_list': function() {
        var all_posts = (Template.instance().postResultsList.get() || []).concat([]);
        var summaries = (Template.instance().summaryResultsList.get() || []);
        for (var x = 0; x < summaries.length; x++) {
            var post = Posts.findOne(summaries[x].postID);
            if (post && all_posts.indexOf(post) === -1) {
                all_posts.push(post);
            }
        }
        return all_posts;
    },
    'search_input_has_focus': function() {
        return Template.instance().searchInputHasFocus.get();
    },
    'search_type_is': function(type) {
        return (Template.instance().selectedSearchType.get() === type);
    },
});
