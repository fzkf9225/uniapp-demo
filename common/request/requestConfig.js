import request from "./request";
import {
	baseUrl,
	appId,
	loginErrorCode,
	successCode
} from '../config.js';
import {
	getPhoneInfo,
	getPhoneIdentity,
	isEmpty
} from '../common.js';
//可以new多个request来支持多个域名请求
let $http = new request({
	//接口请求地址
	baseUrl: baseUrl,
	//服务器本地上传文件地址
	fileUrl: baseUrl,
	//设置请求头
	headers: {
		'content-type': 'application/json;charset=UTF-8',
		'x-appid': appId + "",
		'x-phoneidentity': getPhoneIdentity(),
		'x-token': '',
		'x-timestamp': '',
		'x-uuid': '',
		'x-phoneinfo': getPhoneInfo(),
		'x-protocolversion': '1.0',
		'x-sign': ''
	},
	//以下是默认值可不写
	//是否提示--默认提示
	isPrompt: true,
	//是否显示请求动画
	load: true,
	//是否使用处理数据模板
	isFactory: true,
	//列表接口是否有加载判断
	loadMore: true,
});
//当前接口请求数
let requestNum = 0;
//请求开始拦截器
$http.requestStart = function(options) {
	if (requestNum <= 0) {
		// #ifdef MP-WEIXIN
		uni.showNavigationBarLoading();
		// #endif
		if (options.load) {
			//打开加载动画
			uni.showLoading({
				title: '加载中',
				mask: true
			});
		}
	}
	requestNum += 1;
	//请求前加入token
	//options.headers['token'] = "1234568";
	console.log("----------------request start----------------")
	console.log("接口地址：" + options.httpUrl);
	console.log("请求方式：" + options.method);
	console.log("请求体参数：" + options.data);
	console.log("请求头参数：" + JSON.stringify(options.headers));
	return options;
}
//请求结束
$http.requestEnd = function(options, resolve) {
	//判断当前接口是否需要加载动画
	requestNum = requestNum - 1;
	if (requestNum <= 0) {
		uni.hideLoading();
		// #ifdef MP-WEIXIN
		uni.hideNavigationBarLoading();
		// #endif
	}
	if (resolve.errMsg && (resolve.errMsg != "request:ok" || resolve.statusCode && resolve.statusCode != 200)) {
		uni.showToast({
			title: "网络错误，请检查一下网络",
			icon: "none"
		});
	}
}
//登录弹窗次数
let loginPopupNum = 0;
//所有接口数据处理（可在接口里设置不调用此方法）
$http.dataFactory = function(options, resolve) {
	console.log("接口返回结果：" + JSON.stringify(resolve.data));
	console.log("----------------request end----------------")
	//设置回调默认值
	var callback = {
		//success数据是否请求成功状态
		success: false,
		//这里返回的数据就是调用请求方法收到的数据
		result: ""
	};
	//判断数据是否请求成功
	if (resolve.data.code === successCode) {
		callback.success = true;
		callback.result = resolve.data.data;
	} else if (loginErrorCode.indexOf(resolve.data.code) > -1) {
		//update by chj 20200229
		uni.navigateTo({
			url: "/pages/user/login"
		});
		//未登录或登录已失效
		// if (loginPopupNum <= 0) {
		// 	loginPopupNum++;
		// 	uni.showModal({
		// 		title: '温馨提示',
		// 		content: '此时此刻需要您登录喔~',
		// 		confirmText: "去登录",
		// 		cancelText: "再逛会",
		// 		success: function (res) {
		// 			loginPopupNum--;
		// 			if (res.confirm) {
		// 				uni.navigateTo({
		// 					url: "/pages/user/login"
		// 				});
		// 			}
		// 		}
		// 	});
		// }
	} else { //其他错误提示
		//设置可以提示的时候
		if (options.isPrompt) {
			setTimeout(function() {
				//提示后台接口抛出的错误信息
				uni.showToast({
					title: resolve.data.msg,
					icon: "none",
					duration: 3000
				});
			}, 500);
		}
		callback.result = resolve.data;
	}
	return callback;
};
export default $http;
