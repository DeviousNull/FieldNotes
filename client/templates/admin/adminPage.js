

Template.adminPage.helpers({
	
});

Template.adminPage.events({
    'click #change-title-link': function(e){
    	$('#siteTitle').attr('href', '');
       	$('#siteTitle').attr('contenteditable', 'true');
    },
});