//add access to users' data
Houston.add_collection(Meteor.users);
Houston.add_collection(Houston._admins);


//add links to main pages
Houston.menu({
	'type': 'link',
	'use': '/search',
	'title': 'FieldNotes Search',
}
,{
	'type': 'link',
	'use': '/',
	'title': 'FieldNotes Home',
	'target': 'self'
});