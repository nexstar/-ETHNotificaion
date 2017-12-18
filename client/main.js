import './main.html';
import './Events.js';
import './Helpers.js';
import './Router.js';
import './MongoDBCollection.js';

Accounts.onLogin(function () {
  
  Meteor.logoutOtherClients(function (error) {
  	// console.log('123');
  	// alert('AA');
    // Router.go('post.page0');
  });
});