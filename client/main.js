import './main.html';
import './Events.js';
import './Helpers.js';
import './Router.js';
import './MongoDBCollection.js';

Accounts.onLogin(function () {
  Meteor.logoutOtherClients(function (error) {
  	alert('有人當入過....');
  });
});