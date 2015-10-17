/*
 * onCreateUser() is called every time a new user is created.
 */
Accounts.onCreateUser(function(options, user) {
    //set the user role
    Roles.setUserRoles(user,'user');

    // We still want the default hook's 'profile' behavior.
    if (options.profile)
        user.profile = options.profile;
    user.roles=['user'];
    
    return user;
});

Accounts.validateLoginAttempt(function(info){
	var user=info.user;
	
	if(Roles.userIsInRole(user._id, ["banned"])){
		alert("You have been banned.");
		return false;
	}
	else
		return true;
});