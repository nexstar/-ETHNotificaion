import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'
import { HTTP } from 'meteor/http'
import { check } from 'meteor/check'
import './MongoDBCollection.js';

Meteor.startup(() => {
  var Fiber = require('fibers');
  var sleep = require('sleep');

  const _user           = "https://api.nanopool.org/v1/eth/user/";
  const options         = { priority: "high", timeToLive: 60 * 0.1 };
  var payload = {
    notification: {
      title: '有挖到!!!!', body: '',
      badge: "0", color: "#AAAAAA",
      icon: "default", sound: "default"
    }
  };
  
  var _firebaseadmin    = require("firebase-admin");
  var _firebaseAuthCA   = require("authca/firebaseAuthCA.json");
  // var _firebaseAuthCA   = Assets.getText('firebaseAuthCA.json');
  _firebaseadmin.initializeApp({
    credential: _firebaseadmin.credential.cert(_firebaseAuthCA),
  });
  
  function AddSpace(){
    let _space   = "";
    for(var i=0;i<48;i++){
      _space += " "
    }
    return _space;
  }

  // 計時器(ETH)
  Meteor.setInterval(function(){
    Fiber(function(){
      let _info         = Mongo_info.find({}).fetch();
      let _length       = _info.length
      console.log(_length);
      console.log("-------------");
      for(var i=0;i<_length;i++){
        let _pid        = _info[i].PersonId;
        let _token      = _info[i].token;
        let _notifi     = _info[i].notifi;
      
        console.log(i);
        console.log("-------------");
        for(var j=0;j<_info[i].account.length;j++){
          let _cion       = parseFloat(_info[i].account[j].cion);
          let _as         = _info[i].account[j].as;
          let _url        = _user+_info[i].account[j].address;
          let _path       = "account."+j;
          let _cionpath   = _path+".cion";

          console.log(_as);
          console.log(_cion);
          console.log(_cionpath);

          
          // try{
          //   HTTP.call('GET', _url,(err,res)=>{
          //     if(res=="null"){
          //       console.log('=====');
          //       payload.notification.body = "錢包異常注意！！"+AddSpace();
          //       _firebaseadmin.messaging().sendToDevice(_token, payload, options); 
          //     }else{
          //       let _view   = res.data;
          //       try{
          //         if(_view!="null"){
          //           if(_view.data!="undefined"){
          //             let _gCion  = parseFloat(_view.data.balance);
                      
          //             try{
          //               Mongo_info.update({
          //                 PersonId:_pid
          //               },{
          //                 $set:{
          //                    [_cionpath]:parseFloat(_gCion)
          //                 }
          //               });
          //             }catch(ex){}

          //             if(_gCion > _cion){
          //               let _differ = (_gCion-_cion).toFixed(8);
                        
          //               let _money      = "";
          //               let GetSpace    = AddSpace();
                        
          //               _money += _as+"目前累積: " + _gCion+GetSpace;
          //               _money += "此幣挖到含量: " + _differ+GetSpace;

          //               payload.notification.body = _money;
                        
          //               try{
          //                 if(_notifi==="1"){
          //                   if(_token!="null"){
          //                       // console.log('終於挖到...'+_differ);
          //                       _firebaseadmin.messaging().sendToDevice(_token, payload, options);
          //                   }else{}
          //                 }else{}
          //               }catch(ex){}

          //             }else{
          //               console.log("小於");
          //             }

          //           }else{}

          //         }else{
          //           console.log("IF API有狀況...");
          //         }
          //       }catch(ex){
          //         console.log("TryCatch API有狀況...");
          //       }
          //     }
          //   });
          // }catch(ex){}
          // sleep.sleep(1);

        }
      }
      console.log("----END-----");
    }).run();
  },10000);

// Service 臉書系統
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });

  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '438183633234690',
    secret: '72cac95ab7a0bec05a36b121447706ec'
  });

  Accounts.onCreateUser(function (options, user) {
    if (!user.services.facebook) {
      return user;
    }
    user.username = user.services.facebook.name;
    personal = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
    user.profile = {
      address: user.services.facebook.email,
      link: user.services.facebook.link,
      pic: personal
    };
    return user;
  });

// client call Server
  Meteor.methods({
    deladr:(_id,_aid,_name)=>{
      Mongo_info.update({ PersonId:_id},{
        $pull:{
          account:{
            as:_name
          }
        }
      });

      // Mongo_userInfo.update({ "_id": id }, {
      //   $pull: {
      //     petlist: {
      //       "name": petname
      //     }
      //   }

      return 1;
    },  
    port:()=>{
      return this.process.env;
      // console.log(this.process.env);
    },
    ShowLog:(vlog, number)=>{
      // Fiber(function(){
        console.log('--' + number + '--');
        console.log(vlog);
      // }).run();
    },
    CheckUser:(_vid)=>{
      Mongo_info.insert({
          "PersonId":_vid,
            "notifi":"1",
            "device":"",
             "token":"null",
           "account":[]
      });
    },
    addaccount:(_vid,_address,_as)=>{
      Mongo_info.update({
        PersonId:_vid
      },{
        $push:{
          account:{
            "address":_address,
                 "as":_as,
               "cion":0
            //  "worker":_Array,
            // "payment":[] //等到乙太幣足夠轉入錢包在撰寫此地方
          }
        }
      });

      // const _workers  = "https://api.nanopool.org/v1/eth/workers/";
      // let url         = _workers+_address;
      // HTTP.call('GET', url,(err,res)=>{
      //     let _view   = res.data.data;
      //     // let _Array  = [];
      //     // for(var i=0;i<_view.length;i++){
      //     //   _Array.push({
      //     //             id:_view[i].id,
      //     //       hashrate:_view[i].hashrate,
      //     //      lastShare:_view[i].lastShare,
      //     //         rating:_view[i].rating
      //     //   });
      //     // }
      // });

      // ====================== PAYMENT ======================
      // const _payments   = "https://api.nanopool.org/v1/eth/payments/";
      // let url = _payments+_address;
      // HTTP.call('GET', url,(err,res)=>{
      //   let _view   = res.data;
      //   let _length = _view.data.length;
      //   if(!(_length>0)){
      //     console.log('尚未導入錢包');
      //   }else{
      //     for(var i=_length;i>0;i++){
      //       console.log('amount: '    + (_view.data[i])['amount']);
      //       console.log('txHash: '    + (_view.data[i])['txHash']);
      //       console.log('confirmed: ' + (_view.data[i])['confirmed']);
      //       console.log('date: '      + (_view.data[i])['date']);
      //     }
      //   }
      // }); 
    },
    infonotifiupdate:(_vid,_value)=>{
      try{
        Mongo_info.update({
          PersonId:_vid
        },{
          $set:{
            notifi:_value
          }
        });
      }catch(ex){}
    },
    infotokendeviceupdate:(_vid,_device,_token)=>{
      try{
        Mongo_info.update({
          PersonId:_vid
        },{
          $set:{
            device:_device,
             token:_token
          }
        });
      }catch(ex){}
    },
    infotokenupdate:(_vid)=>{
      try{
        Mongo_info.update({
          PersonId:_vid
        },{
          $set:{
             token:'null'
          }
        });
      }catch(ex){}
    },
  })

});
