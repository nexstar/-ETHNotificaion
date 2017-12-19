import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
// import { Random } from 'meteor/random';
import './MongoDBCollection.js';
import './main.html';
import './Router.js';

// const _address      = "0xa413b225177a33554dfd025130280030ed39a33a";

// const _balance      = "https://api.nanopool.org/v1/eth/balance/";
// const _avghashrate  = "https://api.nanopool.org/v1/eth/avghashrate/";
// const _user 		= "https://api.nanopool.org/v1/eth/user/";
// const _payments 	= "https://api.nanopool.org/v1/eth/payments/";
// const _calculator 	= "https://api.nanopool.org/v1/eth/approximated_earnings/";

// var typearray = ['coins','dollars','euros',
// 				 'rubles','yuan','bitcoins'];
// var dolltype  = ['/預估幣量: ','/預估台灣幣: ','/預估歐元: ',
// 				 '/預估俄羅斯盧布: ','/預估人民幣: ','/預估比特幣: '];

function gettype(data,type){
	console.log('-------'+type+'-------');
	for(var i=0;i<typearray.length;i++){
		console.log(typearray[i]+dolltype[i]+(data[typearray[i]].toFixed(6)));
	};
}

	
	const _payments = "https://api.nanopool.org/v1/eth/payments/";
// helpers 導向資金列表
	Template.paymentlist.helpers({
		div1(){
			let _Sessionworkerlistcount = Session.get("workerlistcount");
			
			let _info   = Mongo_info.findOne({
				// PersonId:"ceDEzGn5QdTgT3WNF"
				PersonId:Meteor.userId()
			});
			let url	= _payments+_info.account[_Sessionworkerlistcount].address;
			MeteorEach = [];
			$.ajax({
				type: "GET",
				async: false,
				crossDomain: true,
				url: url,
				dataType: "json",
				success: function (data) {
					if(data=="null"){
					}else{
						let _view   = data.data;
						if(_view.length<=0){
							MeteorEach.push({
								name:'尚未導向至錢包...'
							});
						}
						for(var i=0;i<_view.length;i++){
							MeteorEach.push({
								name:parseFloat(_view[i].amount),
							});
						}
					};
				}, error: function (jqXHR) {}
			});
			return MeteorEach;
		},
	});

	const _workers = "https://api.nanopool.org/v1/eth/workers/";
// helpers 礦工列表
	Template.workerlist.helpers({
		div1(){
			let _Sessionworkerlistcount = Session.get("workerlistcount");
			
			let _info   = Mongo_info.findOne({
				// PersonId:"ceDEzGn5QdTgT3WNF"
				PersonId:Meteor.userId()
			});

			let url	= _workers+_info.account[_Sessionworkerlistcount].address;
			
			MeteorEach=[];

			$.ajax({
				type: "GET",
				async: false,
				crossDomain: true,
				url: url,
				dataType: "json",
				success: function (data) {
					if(data=="null"){
					}else{
						let _view   = data.data;
						for(var i=0;i<_view.length;i++){
							MeteorEach.push({
								collapse:'collapse'+i,
								name:(_view[i].id).toUpperCase(),
								hashrate:_view[i].hashrate,
								rating:_view[i].rating
							});
						}
					};
				}, error: function (jqXHR) {}
			});
			return MeteorEach;
		},
	});

// 帳戶列表 
	Template.Actlist.events({
		'click .delete':(evt,tmp)=>{
			evt.preventDefault();
			let _aid   = "account."+evt.currentTarget.name;
			let _name  = evt.currentTarget.dataset.value;
			// let _id    = "ceDEzGn5QdTgT3WNF";
			let _id    = Meteor.userId();
			navigator.notification.confirm("",
				function (r) {
					switch (r) {
						case 0:
						case 1:
							break;
						case 2:
							Meteor.call("deladr",_id,_aid,_name,(err,res)=>{
								if(res){
									alert("已經刪除...");
								}
							});
							break;
					}
				},
				"確定要刪除",
				['取消', '刪除']
			);
		},
		'click .detail':(evt,tmp)=>{
			evt.preventDefault();
			let _aid = evt.currentTarget.name;
			Session.set("workerlistcount",_aid);
			Router.go('post.worker');
			// alert(_aid);
		},
		'click .payment':(evt,tmp)=>{
			evt.preventDefault();
			let _aid = evt.currentTarget.name;
			Session.set("workerlistcount",_aid);
			Router.go('post.payment');
		},
	});

// 設定
	Template.set.events({
		'click [name=exit]':(evt,tmp)=>{
			evt.preventDefault();
			Meteor.logout();
			// let _id    = "ceDEzGn5QdTgT3WNF";
			let _id    = Meteor.userId();
			Meteor.call('infotokenupdate',_id);
			Router.go('post.page0');
		},
		'click [name=notifi]':(evt,tmp)=>{
			evt.preventDefault();
			// let _value = evt.currentTarget.value;
			// let _id    = "ceDEzGn5QdTgT3WNF";
			let _id    = Meteor.userId();
			Meteor.call('infonotifiupdate',_id,_value);
		},
	});

// 登入
	Template.page0.events({
		'click [name=fblogin]':(evt,tmp)=>{
			evt.preventDefault();
			// Router.go('post.page1');
			Meteor.loginWithFacebook({
		        requestPermissions:[
		          'public_profile','email',
		          'user_friends','publish_actions']
		    },
		        function (err) {
		          if (err) {
		            console.log('Handle errors here: ', err);
		          }else{
	          		let _id   = Meteor.userId();
					let _info = Mongo_info.findOne({PersonId:_id});
					if((String(_info)=="undefined")){
						Meteor.call('CheckUser',_id);
					}
		          	Router.go('post.page1');
		          }
		        }
		    );
		},
		// 'click [name=fblogout]':(evt,tmp)=>{
		// 	evt.preventDefault();
		// 	Meteor.call('port',(err,res)=>{
		// 		alert(res);
		// 	});
		// 	Meteor.logout();
		// },
	});


const _accountexist = "https://api.nanopool.org/v1/eth/accountexist/";
function getJsonLength(jsonData){
	var jsonLength = 0;
	for(var item in jsonData){
		jsonLength++;
	}
	return jsonLength;
}

// 帳戶頁面
	Template.page1.events({
		'click [name=setting]':(evt,tmp)=>{
			evt.preventDefault();
			Router.go('post.set');
		},
		'click #addbtn':(evt,tmp)=>{
			evt.preventDefault();
			let _wallet = tmp.$('[name=wallet]').val();
			if(_wallet!=""){
				let url = _accountexist+_wallet;
				window.plugins.spinnerDialog.show("", "載入中...",true);
				HTTP.call('GET', url,(err,res)=>{
					let _view = res.data;
					if(!(_view.status)){
						alert(_view.error)
					}else{
						let _actexist = false;
						// let _id     = "ceDEzGn5QdTgT3WNF";
						let _id    = Meteor.userId();
						let _info	= Mongo_info.find({PersonId:_id}).fetch();
						let _length = _info.length;
						for(var i=0;i<_length;i++){
							let _actleng = _info[i].account.length;
							for(var j=0;j<_actleng;j++){
								_actexist = (_info[i].account[j].address===_wallet);
							}
						}
						
						if(!_actexist){
							let _AsName = prompt("請輸入帳戶別名","");
							if(_AsName!=""){
								Meteor.call('addaccount',_id,_wallet,_AsName)
							}
						}
					}
				});
				window.plugins.spinnerDialog.hide();
			}
			$('[name=wallet]').val('');
		}
	});


