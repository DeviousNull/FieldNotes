if(Meteor.users.find().count() === 0) {

    var jeremy = Accounts.createUser({
        username: 'jeremy',
        email: 'jjordan@gmail.com',
        password: 'password',
        profile : {
            name: 'jeremy'
        }
    });

    Roles.setUserRoles(jeremy,'admin');

    var dillon = Accounts.createUser({
        username: 'dillon',
        email: 'dillon@gmail.com',
        password: 'password',
        profile : {
            name: 'dillon'
        }
    });

    Roles.setUserRoles(dillon,'admin');

    var kendall = Accounts.createUser({
        username: 'kendall',
        email: 'kendall@gmail.com',
        password: 'password',
        profile : {
            name: 'kendall'
        }
    });

    Roles.setUserRoles(kendall,'admin');

    var guest = Accounts.createUser({
        username: 'guest',
        email: 'guest@gmail.com',
        password: 'password',
        profile : {
            name: 'guest'
        }
    });

    Roles.setUserRoles(guest,'guest');
}
var UsersData = Meteor.users.find().fetch();

if(Dictionaries.find().count() === 0) {
    Dictionaries.insert({
        name: 'Algorithms'
    });
    Dictionaries.insert({
        name: 'Data Structures'
    });
    Dictionaries.insert({
        name: 'Artificial Intelligence'
    });
    Dictionaries.insert({
        name: 'Discrete Math'
    });
}
var DictionaryData = Dictionaries.find().fetch();

if(Terms.find().count() === 0) {
    Terms.insert({
        term_name : 'Binary Tree $(X^y)$',
        dictionaryID : Dictionaries.find().fetch()[0]['_id']
    });
    Terms.insert({
        term_name : 'Variable',
        dictionaryID : Dictionaries.find().fetch()[1]['_id']
    });
    Terms.insert({
        term_name : 'Proof by contradiction',
        dictionaryID : Dictionaries.find().fetch()[3]['_id']
    });
    Terms.insert({
        term_name : 'Proof by induction',
        dictionaryID : Dictionaries.find().fetch()[2]['_id']
    });
}
var TermsData = Terms.find().fetch();

if(Categories.find().count() === 0) {
    Categories.insert({
        category_name: 'Algorithms',
        parentID : 0
    });
    Categories.insert({
        category_name : 'NP',
        parentID : Categories.find().fetch()[0]['_id']
    });
    Categories.insert({
        category_name : 'Artificial Intelligence',
        parentID : Categories.find().fetch()[0]['_id']
    });
    Categories.insert({
        category_name : 'Data Structures',
        parentID : 0
    });
    Categories.insert({
        category_name : 'Discrete Math',
        parentID : 0
    });
    Categories.insert({
        category_name : 'Trees',
        parentID : Categories.find().fetch()[3]['_id']
    });
}
var CategoriesData = Categories.find().fetch();


if(Posts.find().count() === 0) {
    Posts.insert({
        userID : UsersData[0]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "This and That, Algorithms united. $(X^y)$",
        pop_rating : 29,
        quality_rating : 4,
        numRaters : 20,
        doi : '12423' ,
        author : "Thom Yorke",
        publisher : "Kendrick Lamar",
        publish_date : "7/4/2010",
        categoryID : Categories.find().fetch()[0]['_id'],
        definedTermIDArray : [ TermsData[0]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[1]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "Why Discreet Math changed my life.",
        pop_rating : 67,
        quality_rating : 3,
        numRaters : 15,
        doi : '6789' ,
        author : "Elon Musk",
        publisher : "Tree House",
        publish_date : "7/5/2010",
        categoryID : Categories.find().fetch()[4]['_id'],
        definedTermIDArray : [ TermsData[1]['_id'], TermsData[2]['_id'] ],
        usedTermIDArray : [ TermsData[2]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[2]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "GLICKO: made easy.",
        pop_rating : 29,
        quality_rating : 4,
        numRaters : 10,
        doi : '12423' ,
        author : "Jane Goodall",
        publisher : "Kony 2012",
        publish_date : "7/2/2010",
        categoryID : Categories.find().fetch()[1]['_id'],
        definedTermIDArray : [ TermsData[3]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[2]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "The Monotonic Bounded Hirsch Conjecture is False for Dimension at Least 4.",
        pop_rating : 453,
        quality_rating : 4,
        numRaters : 2333,
        doi : '1287' ,
        author : "Michael Todd",
        publisher : "Mathematics of Operations Research",
        publish_date : "01/11/1980",
        categoryID : Categories.find().fetch()[3]['_id'],
        definedTermIDArray : [ TermsData[3]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[1]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "Dynamic Programming Algorithms for the Zero-One Knapsack Problem",
        pop_rating : 293,
        quality_rating : 2,
        numRaters : 413,
        doi : '12555' ,
        author : "P. Toth",
        publisher : "Computing Something",
        publish_date : "7/4/1980",
        categoryID : Categories.find().fetch()[0]['_id'],
        definedTermIDArray : [ TermsData[0]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[2]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "On Minimum-Maximal Matching in Series-Parallel Graphs",
        pop_rating : 55,
        quality_rating : 4,
        numRaters : 232,
        doi : '12555' ,
        author : "M. B. Richey, Gary Parker",
        publisher : "Science Publications",
        publish_date : "7/29/1997",
        categoryID : Categories.find().fetch()[0]['_id'],
        definedTermIDArray : [ TermsData[0]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[0]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "Linear Time Algorithms for Linear Programming in ${R}^3$ and Related Problems",
        pop_rating : 23,
        quality_rating : 3,
        numRaters : 32,
        doi : '12555' ,
        author : "Nimrod Megiddo",
        publisher : "Society for Industrial and Applied Mathematics",
        publish_date : "5/4/1983",
        categoryID : Categories.find().fetch()[0]['_id'],
        definedTermIDArray : [ TermsData[0]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[0]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "The Matroid Matching Problem",
        pop_rating : 12,
        quality_rating : 5,
        numRaters : 14,
        doi : '12555' ,
        author : "L Lovasz",
        publisher : "Elsevier",
        publish_date : "11/12/1980",
        categoryID : Categories.find().fetch()[1]['_id'],
        definedTermIDArray : [ TermsData[0]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[1]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "Paths, Trees and Flowers",
        pop_rating : 170,
        quality_rating : 3,
        numRaters : 211,
        doi : '12555' ,
        author : "Jack Edmonds",
        publisher : "Canadian Journal of Mathematics",
        publish_date : "3/5/1965",
        categoryID : Categories.find().fetch()[4]['_id'],
        definedTermIDArray : [ TermsData[0]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[1]['_id'],
        createdAt: moment(),
        modifiedAt: moment(),
        title : "The Simplex Method is Very Good! -- On the Expected Number of Pivot Steps and Related Properties of Random Linear Programs",
        pop_rating : 293,
        quality_rating : 2,
        numRaters : 413,
        doi : '12555' ,
        author : "Mordecai Haimovich",
        publisher : "Columbia Univ.",
        publish_date : "2/1/1996",
        categoryID : Categories.find().fetch()[0]['_id'],
        definedTermIDArray : [ TermsData[0]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
}
var PostsData = Posts.find().fetch();


if(Comments.find().count() === 0) {
    Comments.insert({
        userID : UsersData[0]['_id'],
        parentID : '0', //No parent
        postID : PostsData[0]['_id'],
        text : "This is the coolest paper ever. amirite? $(X^y)$",
        date : "3/2/2015"
    });
    Comments.insert({
        userID : UsersData[1]['_id'],
        parentID : Comments.find().fetch()[0]['_id'],
        postID : PostsData[0]['_id'],
        text : "N0pe. You think these sources are scholarly?",
        date : "3/2/2015"
    });
    Comments.insert({
        userID : UsersData[0]['_id'],
        parentID : Comments.find().fetch()[1]['_id'],
        postID : PostsData[0]['_id'],
        text : "Science has put Wikipedia to the test, it is the irrefutable all-source. You can't escape it.",
        date : "3/2/2015"
    });
    Comments.insert({
        userID : UsersData[2]['_id'],
        parentID : Comments.find().fetch()[0]['_id'],
        postID : PostsData[0]['_id'],
        text : "You are right. Hail Wiki.",
        date : "3/2/2015"
    });
    Comments.insert({
        userID : UsersData[2]['_id'],
        parentID : '0', //No parent
        postID : PostsData[0]['_id'],
        text : "This is what I've been looking for.",
        date : "3/3/2015"
    });
}

var CommentsData = Comments.find().fetch();

if(Summaries.find().count() === 0) {
    Summaries.insert({
        userID : UsersData[0]['_id'],
        postID : PostsData[0]['_id'],
        text : "In general, this paper explains the connection between this and that.",
        quality_rating : 3,
        numRaters : 2
    });
    Summaries.insert({
        userID : UsersData[1]['_id'],
        postID : PostsData[0]['_id'],
        text : "3 Dimensional Shadow: A shadow cast by a 4 dimensional object. $(X^y)$",
        quality_rating : 4.3,
        numRaters : 4
    });
    Summaries.insert({
        userID : UsersData[2]['_id'],
        postID : PostsData[1]['_id'],
        text: "THIS IS A SUMMARY.",
        quality_rating : 1,
        numRaters : 6
    });
    Summaries.insert({
        userID : UsersData[2]['_id'],
        postID : PostsData[2]['_id'],
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae erat sit amet risus ultricies cursus. Proin ac ante dapibus, aliquet felis vel, accumsan lectus. Aenean venenatis eget nisi a congue. Phasellus dignissim ligula id mattis sagittis. Etiam eget risus sed dui semper pharetra ut sit amet lorem. Duis ligula mauris, pulvinar sit amet vestibulum sit amet, luctus ac nisl. Ut commodo eget nulla eget malesuada. Vestibulum odio libero, congue non molestie vitae, vestibulum eu massa. Vivamus at bibendum lacus, venenatis interdum justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque facilisis erat ex, quis tristique sem tristique eget. Suspendisse suscipit massa diam, ac posuere erat interdum id. Phasellus pretium nisi nec elit malesuada rutrum.",
        quality_rating : 4.2,
        numRaters : 6
    });

    Summaries.insert({
        userID : UsersData[0]['_id'],
        postID : PostsData[3]['_id'],
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis urna quis mollis varius. Nullam in porta elit, vel pretium ante. Sed ac aliquam ligula, non fermentum nibh. Etiam varius mi ex. Phasellus condimentum dapibus aliquet. Sed sed finibus eros, accumsan gravida diam. Vivamus dignissim auctor laoreet. Nullam laoreet, enim eu placerat lacinia, lorem ipsum vulputate justo, eu consequat nibh sem sed diam. Aenean porta rutrum sodales.",
        quality_rating : 3,
        numRaters : 7
    });
    Summaries.insert({
        userID : UsersData[2]['_id'],
        postID : PostsData[4]['_id'],
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In rutrum malesuada arcu sit amet rutrum. Duis posuere justo ac nisl elementum viverra. Integer accumsan ex quis pretium gravida. Pellentesque porta.",
        quality_rating : 6.2,
        numRaters : 66
    });
    Summaries.insert({
        userID : UsersData[1]['_id'],
        postID : PostsData[5]['_id'],
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae erat sit amet risus ultricies cursus. Proin ac ante dapibus, aliquet felis vel, accumsan lectus. Aenean venenatis eget nisi a congue. Phasellus dignissim ligula id mattis sagittis. Etiam eget risus sed dui semper pharetra ut sit amet lorem. Duis ligula mauris, pulvinar sit amet vestibulum sit amet, luctus ac nisl. Ut commodo eget nulla eget malesuada. Vestibulum odio libero, congue non molestie vitae, vestibulum eu massa. Vivamus at bibendum lacus, venenatis interdum justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque facilisis erat ex, quis tristique sem tristique eget. Suspendisse suscipit massa diam, ac posuere erat interdum id. Phasellus pretium nisi nec elit malesuada rutrum.",
        quality_rating : 2.8,
        numRaters : 10
    });
    Summaries.insert({
        userID : UsersData[0]['_id'],
        postID : PostsData[6]['_id'],
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis urna quis mollis varius. Nullam in porta elit, vel pretium ante. Sed ac aliquam ligula, non fermentum nibh. Etiam varius mi ex. Phasellus condimentum dapibus aliquet. Sed sed finibus eros, accumsan gravida diam. Vivamus dignissim auctor laoreet. Nullam laoreet, enim eu placerat lacinia, lorem ipsum vulputate justo, eu consequat nibh sem sed diam. Aenean porta rutrum sodales.",
        quality_rating : 4.2,
        numRaters : 9
    });
    Summaries.insert({
        userID : UsersData[0]['_id'],
        postID : PostsData[7]['_id'],
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae erat sit amet risus ultricies cursus. Proin ac ante dapibus, aliquet felis vel, accumsan lectus. Aenean venenatis eget nisi a congue. Phasellus dignissim ligula id mattis sagittis. Etiam eget risus sed dui semper pharetra ut sit amet lorem. Duis ligula mauris, pulvinar sit amet vestibulum sit amet, luctus ac nisl. Ut commodo eget nulla eget malesuada. Vestibulum odio libero, congue non molestie vitae, vestibulum eu massa. Vivamus at bibendum lacus, venenatis interdum justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque facilisis erat ex, quis tristique sem tristique eget. Suspendisse suscipit massa diam, ac posuere erat interdum id. Phasellus pretium nisi nec elit malesuada rutrum.",
        quality_rating : 4.8,
        numRaters : 31
    });
    Summaries.insert({
        userID : UsersData[2]['_id'],
        postID : PostsData[8]['_id'],
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis urna quis mollis varius. Nullam in porta elit, vel pretium ante. Sed ac aliquam ligula, non fermentum nibh. Etiam varius mi ex. Phasellus condimentum dapibus aliquet. Sed sed finibus eros, accumsan gravida diam. Vivamus dignissim auctor laoreet. Nullam laoreet, enim eu placerat lacinia, lorem ipsum vulputate justo, eu consequat nibh sem sed diam. Aenean porta rutrum sodales.",
        quality_rating : 4.2,
        numRaters : 3
    });
    Summaries.insert({
        userID : UsersData[1]['_id'],
        postID : PostsData[9]['_id'],
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae erat sit amet risus ultricies cursus. Proin ac ante dapibus, aliquet felis vel, accumsan lectus. Aenean venenatis eget nisi a congue. Phasellus dignissim ligula id mattis sagittis. Etiam eget risus sed dui semper pharetra ut sit amet lorem. Duis ligula mauris, pulvinar sit amet vestibulum sit amet, luctus ac nisl. Ut commodo eget nulla eget malesuada. Vestibulum odio libero, congue non molestie vitae, vestibulum eu massa. Vivamus at bibendum lacus, venenatis interdum justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque facilisis erat ex, quis tristique sem tristique eget. Suspendisse suscipit massa diam, ac posuere erat interdum id. Phasellus pretium nisi nec elit malesuada rutrum.",
        quality_rating : 5,
        numRaters : 5
    });
}
var SummaryData = Summaries.find().fetch();

if(Definitions.find().count() === 0) {
    Definitions.insert({
        termID : TermsData[0]['_id'],
        userID : UsersData[0]['_id'],
        text : "A tree data structure in which each node has at most two children, which are referred to as the left child and the right child. $(X^y)$",
        quality_rating : 5,
        numRaters : 10
    });
    Definitions.insert({
        termID : TermsData[0]['_id'],
        userID : UsersData[2]['_id'],
        text : "1s and 0s that grow trunks ad leaves",
        quality_rating : 1,
        numRaters : 5
    });
    Definitions.insert({
        termID : TermsData[1]['_id'],
        userID : UsersData[1]['_id'],
        text : 'Something used to hold a value.',
        quality_rating : 5,
        numRaters : 2
    });
    Definitions.insert({
        termID : TermsData[2]['_id'],
        userID : UsersData[0]['_id'],
        text : 'A form of indirect proof, that establishes the truth or validity of a proposition by showing that the proposition\'s being false would imply a contradiction.',
        quality_rating : 4,
        numRaters : 6
    });
    Definitions.insert({
        termID : TermsData[3]['_id'],
        userID : UsersData[0]['_id'],
        text : '+1',
        quality_rating : 3,
        numRaters : 1
    });
}

var DefinitionData = Definitions.find().fetch();


if(Adminlabels.find().count() === 0) {
    Adminlabels.insert({
        dictionaryID : DictionaryData[0]['_id'],
        label : 'Running time big-O $(X^y)$',
        description : 'Running time is required for this term to be added to this dictionary'
    });
    Adminlabels.insert({
        dictionaryID : DictionaryData[0]['_id'],
        label : 'Running time little-O',
        description : 'Running time is required for this term to be added to this dictionary'
    });
}
var AdminLabelsData = Adminlabels.find().fetch();


/****************
*               *
* PIVOT TABLES  *
*               *
****************/

if(Term_label_values.find().count() === 0) {
    Term_label_values.insert({
        termID : TermsData[0]['_id'],
        adminlabelsID : AdminLabelsData[0]['_id'],
        value : "$n^2$"
    });
    Term_label_values.insert({
        termID : TermsData[0]['_id'],
        adminlabelsID : AdminLabelsData[1]['_id'],
        value : "log(n)"
    });
}
