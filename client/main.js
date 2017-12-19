import './main.html';
import './Events.js';
import './Helpers.js';
import './Router.js';
import './MongoDBCollection.js';

Accounts.onLogin(function () {
   // Tracker.autorun(function (c) {
   // 	Meteor.call('ShowLog',c,"c");
   // 		const userId = Meteor.userId();
	  //   if (!userId) {
	  //       Router.go('/');
	  //   }
   // })
  Meteor.logoutOtherClients(function (error) {
  // 	// console.log('123');
  // 	// alert('AA');
  // 	alert('我被攻擊...');
  // 	// Meteor.logout();
  });
});