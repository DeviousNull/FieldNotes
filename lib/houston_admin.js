//add access to users' data
if(Meteor.isServer){
	Houston.add_collection(Meteor.users);
	Houston.add_collection(Houston._admins);
}

//add links to main pages
Houston.menu({
	'type': 'link',
	'use': '/',
	'title': 'FieldNotes Home',
	'target': 'blank'
});