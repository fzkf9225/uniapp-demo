//引入网络请求
import $http from './request/requestConfig';
import {
	appSecret
} from './config.js';
import {
	randomWord,
	getToken
} from './common.js';
import md5 from './md5';

//用户登录
export function login(data, load = true, isPrompt = true) {
	let dataStr = JSON.stringify(data);
	return $http.post('login', dataStr, getOption(dataStr, load, isPrompt));
}

//获取用户信息
export function postUserInfo(load = true, isPrompt = true) {
	return $http.post('user/getUserInfo', "", getOption("", load, isPrompt));
}

//版本检测更新
export function checkVersion(data, load = true, isPrompt = true) {
	let dataStr = JSON.stringify(data);
	return $http.post('version', dataStr, getOption(dataStr, load, isPrompt));
}

//用户登录
export function postModifyPassword(data, load = true, isPrompt = true) {
	let dataStr = JSON.stringify(data);
	return $http.post('user/updatePwd', dataStr, getOption(dataStr, load, isPrompt));
}

//预警信息 预警
export function getWarnMsgList(data, load = true, isPrompt = true) {
	let dataStr = JSON.stringify(data);
	return $http.post('common/getWarnMsgList', dataStr, getOption(dataStr, load, isPrompt));
}

//预警信息 消息
export function getMsgList(data, load = true, isPrompt = true) {
	let dataStr = JSON.stringify(data);
	return $http.post('common/getMsgList', dataStr, getOption(dataStr, load, isPrompt));
}

//环境管理
export function getEnvList(data, load = true, isPrompt = true) {
	let dataStr = JSON.stringify(data);
	return $http.post('env/indexData', dataStr, getOption(dataStr, load, isPrompt));
}

//首页Banner
export function getBannerList(data, load = true, isPrompt = true) {
	let dataStr = JSON.stringify(data);
	return $http.post('common/getBannerList', dataStr, getOption(dataStr, load, isPrompt));
}

//form 提交
export function saveForm(data, load = true, isPrompt = true) {
	let dataStr = JSON.stringify(data);
	return $http.post('form/saveForm', dataStr, getOption(dataStr, load, isPrompt));
}

//获取人员图片
export function getUserUploadHeadImg(data, load = true, isPrompt = true) {
	let dataStr = JSON.stringify(data);
	return $http.post('user/uploadHeadImg', dataStr, getOption(dataStr, load, isPrompt));
}

/**
 * 封装option
 */
function getOption(data = "", load = true, isPrompt = true) {
	var timestamp = new Date().getTime();
	let sign = encodeSign(data, timestamp);
	let headers = {
		'x-timestamp': timestamp+"",
		'x-sign': sign,
		'x-uuid': randomWord(false, 16),
		'x-token': getToken()
	};
	let option = {
		"isPrompt": isPrompt,
		"load": load,
		"headers": headers,
	};
	return option;
}

//生成签名
function encodeSign(data, timestamp) {
	let signStrUpper = ("x-appsecret" + appSecret + data + "x-timestamp" + timestamp).toUpperCase();
	let sign = (md5(signStrUpper) + "").toUpperCase();
	return sign;
}