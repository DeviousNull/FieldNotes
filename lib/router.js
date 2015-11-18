//Router configurations
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loadingTemplate',
    waitOn: function() {
        return Meteor.subscribe('retrieveLayout'); // Used by the layout template; needed on every page.
    },
    onBeforeAction: function() {
        if (this.ready()) {
            this.next(); // If there is another hook, this function executes it. Otherwise, it executes the action
        } else {
            this.render('loadingTemplate');
        }
    },
});

/* Helper function for creating routes with human-friendly URLs.
 *
 * Registers a route for _baseURL and _baseURL + "/:_slug".
 * The former route retrieves the route's data and creates a slug based upon its _slugFieldName property. It then modifies the URL to include the slug and renders the template.
 * The latter route checks whether the route's data would create the same slug as was passed in the URL, changing to the correct URL if this is not the case.
 *
 * The _options parameter is an object, and must have properties named 'name' and 'data'. It may have properties named 'waitOn' and 'action'.
 * The listed _options properties are passed to Router.route(). All other properties are ignored because they are currently not used and James is lazy.
**/
function routeWithSlug(_baseURL, _slugFieldName, _options) {
    Router.route(_baseURL, {
        'name': _options.name,
        'waitOn': _options.waitOn,
        'data': _options.data,
        'onBeforeAction': function() {
            var slug = getSlug(this.data()[_slugFieldName]);
            history.replaceState(null, "", this.url + "/" + slug);
            this.next();
        },
        'action': _options.action,
    });

    Router.route(_baseURL + "/:_slug", {
        'name': _options.name + "_slug",
        'template': _options.name,
        'waitOn': _options.waitOn,
        'data': _options.data,
        'onBeforeAction': function() {
            var slug = getSlug(this.data()[_slugFieldName]);

            if (this.params._slug !== slug) {
                var lastSlash = this.url.lastIndexOf("/");
                var newURL = this.url.substring(0, lastSlash) + "/" + slug;
                history.replaceState(null, "", newURL);
            }
            
            this.next();
        },
        'action': _options.action,
    });
}

// This plugin renders a specified template if a route has a defined 'data' function which returns undefined.
Router.plugin('dataNotFound', {notFoundTemplate: 'notFoundTemplate'});


/*****************
* One-Off Routes *
*****************/

//Route for homepage
Router.route('/', {
    action: function() {
        this.redirect('postsList');
    }
});

//Route for the search page
Router.route('/search',{
    name: 'searchTemplate',
    waitOn: function() {
        return [
            Meteor.subscribe('listAllPosts'),
            Meteor.subscribe('listAllSummaries'),
            Meteor.subscribe('listAllDictionaries'),
            Meteor.subscribe('listAllTerms'),
        ]
    }
});

/***************
* Paper Routes *
***************/

//Route for viewing all posts
Router.route('/paper/list', {
    name: 'postsList',
    waitOn: function() {
        return Meteor.subscribe('retrievePostsList');
    }
});

//Route for submiting a post
Router.route('/paper/new', {
    name: 'submitPage',
    waitOn: function() {
        
        return [
            Meteor.subscribe('listAllCategories'),
            Meteor.subscribe('listAllDictionaries'),
            Meteor.subscribe('listAllTerms'),

        ];
         
    }
});





//Route for a post page when linked from postList
routeWithSlug('/paper/show/:_id', 'title', {
    name: 'postPage',
    waitOn: function() {
        return Meteor.subscribe('retrievePostPage', this.params._id);
    },
    data: function() {
        return Posts.findOne(this.params._id);
    }
});

//Route for submiting a new summary for a post
routeWithSlug('/paper/summary/new/:_id', 'title', {
    name: 'submitSummary',
    waitOn: function() {
        return Meteor.subscribe('lookupPost', this.params._id);
    },
    data: function() {
        return Posts.findOne(this.params._id);
    }
});

//Route for viewing all summaries
Router.route('/paper/list/summary' , {
    name: 'summaryList',
    waitOn: function() {
        return Meteor.subscribe('retrieveSummaryList');
    },
});

//Route for viewing posts inside a specific category
routeWithSlug('/paper/list/category/:_id', 'category_name', {
    name: 'categoryPage',
    waitOn: function() {
        return Meteor.subscribe('retrieveCategoryPage', this.params._id);

              
    },
    data: function() {
        return {
            'type': "category",
            'object': Categories.findOne(this.params._id),
        };
    }
});

//Route for viewing posts inside a specific category
Router.route('/paper/list/tag/:tag', {
    name: 'tagPage',
    template: 'categoryPage',
    waitOn: function() {
        return Meteor.subscribe('retrieveTagPage', this.params.tag);

    },
    data: function() {
        return {
            'type': "tag",
            'object': this.params.tag,
        };
    }
});

//Route for viewing all summaries inside a category
routeWithSlug('/paper/list/summary/category/:_id', 'category_name', {
    name: 'summaryListByCategory',
    waitOn: function() {
        return Meteor.subscribe('retrieveSummaryListByCategory', this.params._id);
    },
    data: function() {
        return Categories.findOne(this.params._id);
    }
});


/********************
* category Routes *
********************/
// route for creating a new category
Router.route('/category/new' , {
   name: 'newCategory'  
});

// route for list of categories
Router.route('/category/list', {
    name: 'categories',
    waitOn: function() {
        return Meteor.subscribe('listAllCategories');
    },
});

/********************
* Dictionary Routes *
********************/


//Route for viewing the list of dictionaries
Router.route('/dictionary/list', {
    name: 'dictionaries',
    waitOn: function() {
        return Meteor.subscribe('listAllDictionaries');
    },
});

//Route for creating a new dictionary
Router.route('/dictionary/new' , {
    name: 'newDictionary'
});

//Route for viewing a specific dictionary and the terms inside it
routeWithSlug('/dictionary/show/:_id', 'name', {
    name: 'dictionaryPage',
    waitOn: function() {
        return [
            Meteor.subscribe('lookupDictionary', this.params._id),
            Meteor.subscribe('getTermsFromDictionaryID', this.params._id),
        ];
    },
    data: function() {
        return Dictionaries.findOne({_id: this.params._id});
    }
});

//Route for creating a new term in a dictionary
routeWithSlug('/dictionary/term/new/:_id', 'name', {
    name: 'newTerm',
    waitOn: function() {
        return Meteor.subscribe('retrieveNewTerm', this.params._id);
    },
    data: function() {
        return Dictionaries.findOne(this.params._id)
    }
});
Router.route('/dictionary/term/tags/:tags', {
    name: 'tagsPage',
    template: 'termPage',
    waitOn: function() {
        return Meteor.subscribe('retrieveTagsPage', this.params.tags);

    },
    data: function() {
        return {
            'type': "tags",
            'object': this.params.tags,
        };
    }
});

//Route for viewing a specific term
routeWithSlug('/dictionary/term/show/:_id', 'term_name', {
    name: 'termPage',
    waitOn: function() {
        return Meteor.subscribe('retrieveTermPage', this.params._id);
    },
    data: function() {
        return Terms.findOne(this.params._id);
    }
});

//Route for submiting a new definition for a dictionary term
routeWithSlug('/dictionary/term/definition/new/:_id', 'term_name', {
    name: 'submitDefinition',
    waitOn: function() {
        return Meteor.subscribe('lookupTerm', this.params._id);
    },
    data: function() {
        return Terms.findOne(this.params._id)
    }
});

routeWithSlug('/dictionary/term/cate/new/:_id', 'term_name', {
    name: 'submitCate',
    waitOn: function() {
        return Meteor.subscribe('lookupTerm', this.params._id);
    },
    data: function() {
        return Terms.findOne(this.params._id)
    }
});

/*************************
* Admin dashboard Routes *
*************************/

//Route for admin page
Router.route('/admin/', {
    name: 'adminPage',
});

//Route for ban user page from admin dashboard
Router.route('/admin/banUser', {
    name: 'banUser',
    waitOn: function() {
        return Meteor.subscribe('userList');
    },
});

