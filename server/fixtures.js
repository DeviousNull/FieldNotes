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
    Houston._admins.insert({
      user_id: jeremy
    });

    var dillon = Accounts.createUser({
        username: 'dillon',
        email: 'dillon@gmail.com',
        password: 'password',
        profile : {
            name: 'dillon'
        }
    });

    Roles.setUserRoles(dillon,'admin');
    Houston._admins.insert({
      user_id: dillon
    });

    var kendall = Accounts.createUser({
        username: 'kendall',
        email: 'kendall@gmail.com',
        password: 'password',
        profile : {
            name: 'kendall'
        }
    });

    Roles.setUserRoles(kendall,'admin');
    Houston._admins.insert({
      user_id: kendall
    });

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
 
    var min_terms=50,max_terms=250,term_id;
    
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
var level0, level1, level2;

if(Categories.find().count() === 0) {
    Categories.insert({
        category_name: 'Algorithms',
        parentID: undefined,
        isSystemCategory: false,
    });
    Categories.insert({
        category_name : 'NP',
        parentID : Categories.find().fetch()[0]['_id'],
        isSystemCategory: false,
    });
    Categories.insert({
        category_name : 'Artificial Intelligence',
        parentID : Categories.find().fetch()[0]['_id'],
        isSystemCategory: false,
    });
    Categories.insert({
        category_name : 'Data Structures',
        parentID: undefined,
        isSystemCategory: false,
    });
    Categories.insert({
        category_name : 'Discrete Math',
        parentID: undefined,
        isSystemCategory: false,
    });
    Categories.insert({
        category_name : 'Trees',
        parentID : Categories.find().fetch()[3]['_id'],
        isSystemCategory: false,
    });
    level0=Categories.insert({
        category_name: 'Level_0',
        parentID: undefined,
        isSystemCategory: false,
    });
    level1=Categories.insert({
        category_name: 'Level_1',
        parentID: level0,
        isSystemCategory: false,
    });
    level2=Categories.insert({
        category_name: 'Level_2',
        parentID: level1,
        isSystemCategory: false,
    });
}
if(Posts.find().count() === 0){
    var num_cats = 12;

    for(var d=0;d<num_cats;d++) {
        var name = gen_lorem_ipsum(1,2,0).slice(0,-1);
        if (Categories.find({ category_name : name }).count() === 0) {
            Categories.insert({
                category_name : name,
                parentID: undefined,
                isSystemCategory: false,
            });
        }
    }

    var num_posts = 30;

    for(var i=0;i<num_posts;i++){
        var pop_rate = get_rand(0,UsersData.length),
            pop_rate_map = {},
            post_summaries = [],
            post_comments = [],
            cat_id = Categories.find({ 'isSystemCategory': false }).fetch()[get_rand(0,num_cats)]['_id'];

        for(var c=0;c<pop_rate;c++) {
            pop_rate_map[UsersData[c]['_id']] = 1;
        }

        for(var k=0,n=get_rand(1,10);k<n;k++){
            post_comments.push({
                        userID : UsersData[get_rand(0,2)]['_id'],
                        text : gen_lorem_ipsum(1,30,1),
                        createdAt : new Date().toUTCString(),
                        ratings : {},
                    });
        }
        
        var html=(i%5===0) ? '<strong>BOLD</strong> ' : '';
        
        for(var k=0,n=get_rand(1,10);k<n;k++){
            var sum_rate = (Math.random()*(5)),
            com_rate = get_rand(0,10);

            post_summaries.push({
                        userID : UsersData[get_rand(0,2)]['_id'],
                        text : html+gen_lorem_ipsum(10,150,1),
                        isOfficialAbstract: false,
                        createdAt: new Date().toUTCString(),
                        ratings : {},
                    });
        }

        var j = Posts.insert({
                    userID : UsersData[get_rand(0,2)]['_id'],
                    createdAt: new Date().toUTCString(),
                    modifiedAt: new Date().toUTCString(),
                    title : (function(base){
                        if(cat_id==level0) return ("Level 0 - "+base);
                        else if(cat_id==level1) return ("Level 1 - "+base);
                        else if(cat_id==level2) return ("Level 2 - "+base);
                        else return base;})(gen_lorem_ipsum(1,15,1)),
                    doi : '10.1016/j.iheduc.2008.03.001' ,
                    author : gen_lorem_ipsum(2,3,0),
                    publisher : gen_lorem_ipsum(2,3,0),
                    publish_date : get_rand(1,12)+"/"+get_rand(1,29)+"/"+get_rand(1800,2015),

                    categoryID : cat_id,
                    definedTermIDArray : [ TermsData[0]['_id'] ],
                    usedTermIDArray : [ TermsData[1]['_id'] ],
                    influence_ratings : pop_rate_map,
                    quality_ratings : {},
                    comments : post_comments,
                    summaries : post_summaries,
                    tags : [],
                });
    }
}

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