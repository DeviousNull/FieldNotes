
Template.layout.helpers({  
  'categories': function(){
    parent = undefined;
    
    if(Template.instance().data)
      if(Template.instance().data.type == "category" && Template.instance().data.object['parentID']){
        parent = Template.instance().data.object['_id']
      }
  	
    //Return all level 0 categories
    //return Categories.find({parentID: undefined});
    return Categories.find();
  },

  'isCategory': function(){
     return false;
     //(Template.instance().data && Template.instance().data.type == "category" && Template.instance().data.object['parentID']);
  }
});