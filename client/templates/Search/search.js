Template.searchTemplate.onCreated(function() {
    this.postResultsList = new ReactiveVar(null);
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
        return ['posts', 'dictionary', 'terms'];
    },
    'post_list': function() {
        return Template.instance().postResultsList.get();
    },
    'search_input_has_focus': function() {
        return Template.instance().searchInputHasFocus.get();
    },
    'search_type_is': function(type) {
        return (Template.instance().selectedSearchType.get() === type);
    },
});
