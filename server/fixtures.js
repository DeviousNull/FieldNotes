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
 
    var min_terms=50,max_terms=250;
    
    //50-250 terms per dictionary
    for(var a=0; a<4;a++)
        for(var b=0,c=get_rand(min_terms,max_terms);b<c;b++){

            term_id= Terms.insert({
                        term_name : gen_lorem_ipsum(1,3,0),
                        dictionaryID : Dictionaries.find().fetch()[a]['_id']
                    });
            for(var f=0,g=get_rand(0,2);f<g;f++)
                Definitions.insert({
                    termID : term_id,
                    userID : UsersData[get_rand(0,2)]['_id'],
                    text : gen_lorem_ipsum(3,10,1),
                    quality_rating : 4,
                    numRaters : 1
                });
        }
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
if(Posts.find().count() === 0){
    var num_cats = 12;

    for(var d=0;d<num_cats;d++)
            Categories.insert({
                category_name : gen_lorem_ipsum(1,2,0).slice(0,-1),
                parentID : 0
            });

    var num_posts = 30;

    for(var i=0;i<num_posts;i++){
        var num_raters = get_rand(1,1000),
        pop_rate = get_rand(1,num_raters),
        quality_rate = (Math.random()*(5));

        var j = Posts.insert({
                    userID : UsersData[get_rand(0,2)]['_id'],
                    createdAt: moment(),
                    modifiedAt: moment(),
                    title : (gen_lorem_ipsum(1,15,1)),
                    pop_rating : pop_rate,
                    quality_rating : quality_rate,
                    numRaters : num_raters,
                    doi : '10.1016/j.iheduc.2008.03.001' ,
                    author : gen_lorem_ipsum(2,3,0),
                    publisher : gen_lorem_ipsum(2,3,0),
                    publish_date : get_rand(1,12)+"/"+get_rand(1,29)+"/"+get_rand(1800,2015),

                    categoryID : Categories.find().fetch()[get_rand(0,14)]['_id'],
                    definedTermIDArray : [ TermsData[0]['_id'] ],
                    usedTermIDArray : [ TermsData[1]['_id'] ],
                    upvoteUserIDArray : [ UsersData[get_rand(0,2)]['_id'] ],
                    downvoteUserIDArray : [],
                });

        Post_quality_ratings.insert({
            'userID': UsersData[get_rand(0,2)]['_id'],
            'postID': j,
            'rating': quality_rate,
        });
        
        for(var k=0,n=get_rand(1,10);k<n;k++){
            var sum_rate = (Math.random()*(5)),
            com_rate = get_rand(0,10);

            var c_id = Comments.insert({
                        userID : UsersData[get_rand(0,2)]['_id'],
                        parentID : '0', //No parent
                        postID : j,
                        text : gen_lorem_ipsum(1,30,1),
                        date : get_rand(1,12)+"/"+get_rand(1,29)+"/"+2015
                    });

            var s_id = Summaries.insert({
                        userID : UsersData[get_rand(0,2)]['_id'],
                        postID : j,
                        text : html+gen_lorem_ipsum(10,150,1),
                        isOfficialAbstract: false
                    });

            Summary_ratings.insert({
                'userID': UsersData[get_rand(0,2)]['_id'],
                'summaryID': s_id,
                'rating': sum_rate,
            });

            for(var l=0;l<com_rate;l++)
                Comment_ratings.insert({
                    'userID': UsersData[get_rand(0,2)]['_id'],
                    'commentID': c_id,
                    'isUpvote': true,
                });
        }
    }
}
/*
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
    

    var PostsData = Posts.find().fetch();

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

    var CommentsData = Comments.find().fetch();

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
    var SummaryData = Summaries.find().fetch();
}

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
*/

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

    var num_labels = 5;

    for(var e=0;e<num_labels;e++){
        Adminlabels.insert({
            dictionaryID : DictionaryData[get_rand(0,3)]['_id'],
            label : gen_lorem_ipsum(1,3,1),
            description : gen_lorem_ipsum(3,10,1)
        });
        /*
        for()
        Term_label_values.insert({
            termID : TermsData[0]['_id'],
            adminlabelsID : AdminLabelsData[0]['_id'],
            value : "$n^2$"
        });
    */
    }
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

//=================================================================================================================
//generates text from 'min' to 'max', inclusive
function gen_lorem_ipsum(min, max, mj){
    var vocab = ["lorem","ipsum"," $X^Y$ "," $X_Y$ "," $A_b$ "," $A_B$ "," $\\sqrt{a+b}$ "," $\\delta$ "," $\\sum_i^n$ ","amet,","consectetur","adipisicing","elit,","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua.","enim","ad","minim","veniam,","quis","nostrud","exercitation","ullamco","laboris","nisi","ut","aliquip","ex","ea","commodo","consequat.","duis","aute","irure","dolor","in","reprehenderit","in","voluptate","velit","esse","cillum","dolore","eu","fugiat","nulla","pariatur.","excepteur","sint","occaecat","cupidatat","non","proident,","sunt","in","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum.","sed","ut","perspiciatis,","unde","omnis","iste","natus","error","sit","voluptatem","accusantium","doloremque","laudantium,","totam","rem","aperiam","eaque","ipsa,","quae","ab","illo","inventore","veritatis","et","quasi","architecto"];
    if(!mj) vocab=vocab.slice(10);

    var rand_length = get_rand(min,max);
    var text = "";

    for(var i=0; i<rand_length; i++){
        var new_word = vocab[get_rand(0,vocab.length - 1)];

        if(!i || (text.slice(-1)==='.' || text.slice(-1)==='?'))
            new_word = new_word[0].toUpperCase()+new_word.slice(1);

        text += (i) ? " " + new_word : new_word;
    }
    return (text.substring(0,text.length-1)+".");
}
function get_rand(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}