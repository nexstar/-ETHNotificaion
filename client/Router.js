import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './Helpers.js';


// payment
	Router.route('/payment', {
		onBeforeAction:function(){
			window.plugins.spinnerDialog.show("", "載入中...",true);
			this.next();
		},
		name: 'post.payment',
		layoutTemplate: 'payment',
		data: {
			title: '導向資金',
		},
		yieldRegions: {
		   'paymentlist': {to: 'paymentbodyplugin'}
		},
	});

// worker
	Router.route('/worker', {
		onBeforeAction:function(){
			window.plugins.spinnerDialog.show("", "載入中...",true);
			this.next();
		},
		name: 'post.worker',
		layoutTemplate: 'worker',
		data: {
			title: '礦工列表',
		},
		yieldRegions: {
		   'workerlist': {to: 'workerbodyplugin'}
		},
	});

// set
	Router.route('/set', {
		name: 'post.set',
		layoutTemplate: 'set',
		data: {
			title: '設定',
		},
	});

// 首頁
	Router.route('/', {
		name: 'post.page0',
		layoutTemplate: 'page0',
		data: {
			title: '乙太幣帳戶',
		},
		yieldRegions: {
		   'Actlist': {to: 'bodyplugin'}
		},
	});