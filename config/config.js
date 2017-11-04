/*
 *database configuration
 */
module.exports.database = {

	'url' :'mongodb://localhost:27017/admin'
};
/*
 * oauth credentials for social login
 */
module.exports.oAuth = {

    'facebookAuth' : {
        'clientID'      : 'Your clientID',
        'clientSecret'  : 'Your clientSecret',
        'callbackURL'   : '/auth/facebook/callback'
    },
    'googleAuth' : {
        'clientID'      : 'Your clientID',
        'clientSecret'  : 'Your clientSecret',
        'callbackURL'   : '/auth/google/callback'
    }
};
/*
 *email credentials to
 *send send email to verify password
 */
module.exports.mail =
{
	user: 'your mail id',
	pass: 'gmail password'
}
