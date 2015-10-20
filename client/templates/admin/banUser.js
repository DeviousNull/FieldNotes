Template.banUser.helpers({
	'users': function(){
        return Meteor.users.find();
    }
});

Template.banUser.events({
    'click #ban-user-button': function(e){
       	var usr = Template.instance().$('[name=username]').val();

	  	var user = Meteor.users.findOne({username: usr});

	  	if(!user)	alert(usr+" is NOT a valid username.");
	  	else	
	  		if(confirm("Are you sure you want to ban this user?"))
            	Meteor.call('ban-user', user._id);
	  	
	  	Router.go('banUser');
	}
});