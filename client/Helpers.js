import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './MongoDBCollection.js';
import './Router.js';
import './Events.js';
import './main.html';
var RE0   = new ReactiveVar(1);
var MeteorEach = [];


Template.paymentlist.helpers({
	disable(){
		window.plugins.spinnerDialog.hide();
	},
});

// 設定完成
Template.set.helpers({
	btn1(){
		MeteorEach=[];
		let _status = '1';
		let _title  = "需要";
		let _class	= "btn-success";
		// let _id    = "ceDEzGn5QdTgT3WNF";
		let _id    = Meteor.userId();
		let _info	= Mongo_info.findOne({PersonId:_id});
		if(_info.notifi>0){
			_title  = "取消";
			_status = '0'
			_class 	= "btn-default";
		}
		MeteorEach.push({
			status:_status,
			 class:_class,
			 title:_title
		});
		return MeteorEach;
	},
	name(){
		return Meteor.user().services.facebook.name;
		// return "Nian Bao Zou";
	},
	pic(){
		return Meteor.user().profile.pic;
		// return "";
	}});

// 目前擁有幣值
	// Template.footlist.helpers({
	// 	allcion(){
	// 		let _id    = "ceDEzGn5QdTgT3WNF";
	// 		// let _id    = Meteor.userId();
	// 		let _info	= Mongo_info.findOne({PersonId:_id});
	// 		return _info.cion;
	// 		// return (parsefloat(_info.cion)).toFixed(8);
	// 	}
	// });
Template.workerlist.helpers({
	disable(){
		window.plugins.spinnerDialog.hide();
	}
});

//帳戶列表 
Template.Actlist.helpers({
	div1(){
		MeteorEach  = [];
		// let _id     = "ceDEzGn5QdTgT3WNF";
		let _id   	= Meteor.userId();
		let _info	= Mongo_info.find({PersonId:_id}).fetch();
		// let _length	= _info.length;
		// for(var i=0;i<_length;i++){
		let _actleng = _info[0].account.length;
		for(var j=0;j<_actleng;j++){
			MeteorEach.push({
			 	   queue:j,
			 	collapse:'collapse'+j,
				  actlst:_info[0].account[j].as,
				   money:_info[0].account[j].cion
			});
		}
		// }
		return MeteorEach;
	},
});

// 登入畫面
Template.page0.helpers({
	token(){
		FCMPlugin.getToken(function (token){
			let devicePlatform = device.platform;
			// let _id    = "ceDEzGn5QdTgT3WNF";
			let _id    = Meteor.userId();
			Meteor.call('infotokendeviceupdate',_id,devicePlatform,token);	
		});
		window.plugins.spinnerDialog.hide();
	},
});


//帳戶頁面
Template.page1.helpers({
	
});
