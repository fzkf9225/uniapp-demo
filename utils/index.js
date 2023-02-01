import md5 from './md5.js';

//用于加密身份证号等敏感字段
let rsaPublicKey =
	"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC77146BsfQZ9RpTpBs+H8M+1xCrXUTeCvsVjWaNfUai768+Se3BwWjz9KvPlxX5I7b8bW0sEouZNRlEKbfXwbReOr0E/0zOg6t2HBadGrCZHCUOptY50d0cYOcFmcjhQMyW6lZMdLbjyX+T+wZdZB92O2mncycutgVXIILHZxYBwIDAQAB+H8M+1xCrXUTeCvsVjWaNfUai768+Se3BwWjz9KvPlxX5I7b8bW0sEouZNRlEKbfXwbReOr0E/0zOg6t2HBadGrCZHCUOptY50d0cYOcFmcjhQMyW6lZMdLbjyX+T+wZdZB92O2mncycutgVXIILHZxYBwIDAQAB/YUm4BH30XFHeibEzoF/JJC4OTsArF98CxJDsD6vWE62E7/OX6q8ejfKqCjwMvn/wIDAQAB";
let appId = "dxa";
let appSecret = "adsf23sadfas";
/*
 * 20001 登录过期,20002 未登录,20003 用户令牌信息不一致，请重新登陆,
 * 20004 刷新令牌与token不一致,20005 刷新令牌的有效期已过
 */
let loginErrorCode = ["20001", "20002", "20003", "20004", "20005"];
//请求成功
let successCode = "00000";
//每页显示条数
export let pageSizeGlobal = 10;
//配置列表的总数量要大于等于5条才显示'-- END --'的提示
export let noMoreSizeGlobal = 5;
//生成随机数
function randomWord(randomFlag, min, max) {
	let str = "",
		range = min,
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
			'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
			'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-'
		];

	//'-','.','~','!','@','#','$','%','^','&','*','(',')','_',':','<','>','?'

	if (randomFlag) {
		range = Math.round(Math.random() * (max - min)) + min; // 任意长度
	}
	for (let i = 0; i < range; i++) {
		var pos = Math.round(Math.random() * (arr.length - 1));
		str += arr[pos];
	}
	return str;
}

//生成签名
function encodeSign(data, timestamp) {
	console.log("data:" + data);
	console.log("timestamp:" + timestamp);
	console.log("appSecret:" + appSecret);
	let signStrUpper = ("x-appsecret" + appSecret + data + "x-timestamp" + timestamp).toUpperCase();
	console.log(signStrUpper);
	let sign = (md5(signStrUpper) + "").toUpperCase();
	console.log("sign:" + sign);
	return sign;
}

function request(url, method, data, showLoading = true, isShowToast = true) {
	return new Promise((resolve, reject) => {
		if (showLoading) {
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
		};
		data = data || {};
		console.log("----------------request start----------------");
		console.log("请求url:" + url);
		var timestamp = new Date().getTime();

		var dataStr = JSON.stringify(data);

		uni.request({
			url: url,
			header: {
				'Content-Type': 'application/json',
				'x-appid': appId,
				'x-phoneidentity': getPhoneIdentity(),
				'x-token': getToken(),
				'x-timestamp': timestamp,
				'x-uuid': randomWord(false, 16),
				'x-phoneinfo': getPhoneInfo(),
				'x-protocolversion': '1.0',
				'x-sign': encodeSign(dataStr, timestamp)
			},
			data: dataStr,
			method: method,
			dataType: 'json',
			success: function(res) {
				console.log(res);
				if (showLoading) {
					uni.hideLoading();
				};
				//请求成功
				if (res.statusCode == 200) {
					console.log("response:" + (isEmpty(res.data) ? "" : JSON.stringify(res.data)));
					if (res.data.code === successCode) {
						resolve(res.data.data);
						return;
					}
					if (loginErrorCode.indexOf(res.data.code) > -1) {
						uni.navigateTo({
							url: "/pages/user/login"
						})
						return;
					}
					console.log("请求fail");
					if (isShowToast) {
						showToast(res.data.msg); //提示信息
					}
					reject(res.data.code);
					return;
				}
				//请求失败
				if (isShowToast) {
					showToast(res.err_msg); //提示信息
				}
				reject("");
			},
			fail: function(res) {
				if (showLoading) {
					uni.hideLoading();
				};
				if (isShowToast) {
					showToast(res.err_msg); //提示信息
				}
				reject("");
			},
			complete() {
				console.log("----------------request end----------------");
			}
		});
	});
};

//获取手机基础信息
export function getPhoneInfo() {
	try {
		const phone = uni.getSystemInfoSync();
		console.log("手机信息:" + JSON.stringify(phone))
		return phone;
	} catch (e) {
		console.log("手机信息获取失败" + e);
		return ""
	}
}

//获取手机运行系统
export function getPlatForm() {
	try {
		const phone = uni.getSystemInfoSync();
		console.log("手机运行平台:" + phone.platform)
		return phone.platform;
	} catch (e) {
		console.log("手机运行平台获取失败:" + e);
		return ""
	}
}

//获取手机唯一表示
export function getPhoneIdentity() {
	try {
		const phone = uni.getSystemInfoSync();
		console.log("手机运行平台:" + phone.platform)
		if (phone.platform === "android") {
			console.log("imei:" + plus.device.imei);
			return plus.device.imei;
		} else if (phone.platform === "ios") {
			console.log("uuid:" + plus.device.uuid);
			return plus.device.uuid;
		} else {
			return "";
		}
	} catch (e) {
		console.log("imei或uuid获取失败:" + e);
		return ""
	}
}

//选择多张图片
export function chooseMultiImage(imageCount) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: imageCount,
			success: (chooseImageRes) => {
				resolve(chooseImageRes.tempFilePaths);
				return;
			},
			fail: res => {
				reject();
				return;
			}
		});
	});
}

//选择单张图片
export function chooseOneImage() {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: 1,
			success: (chooseImageRes) => {
				console.log("选择图片地址:" + chooseImageRes.tempFilePaths[0])
				resolve(chooseImageRes.tempFilePaths[0]);
				return;
			},
			fail: res => {
				reject();
				return;
			}
		});
	});
}

//压缩图片
export function compressImage(imagePath) {
	return new Promise((resolve, reject) => {
		uni.compressImage({
			src: imagePath,
			quality: 80,
			success: res => {
				console.log("压缩图片:" + res.tempFilePath);
				resolve(res.tempFilePath);
				return;
			},
			fail: res => {
				showToast("图片压缩失败");
				reject();
				return;
			}
		})
	});
}

//image图片地址转base
export function imagePathToBase64(imagePath) {
	return new Promise((resolve, reject) => {
		plus.io.resolveLocalFileSystemURL(imagePath, function(entry) {
			entry.file(function(file) {
				var AppReader = new plus.io.FileReader();
				AppReader.onloadend = function(e) {
					let base64 = e.target.result
					resolve(base64.split(",")[1])
				};
				AppReader.onerror = function(err) {
					console.log("----base64-onerror----" + err);
					reject(err)
				};
				AppReader.readAsDataURL(file);
			}, function(e) {
				onsole.log("----base64转图片出现错误----" + e);
				reject(e)
			});
		});

	})
}

//toast提示信息
export function showToast(title, icon = 'none') {
	if (isEmpty(title)) return;
	uni.showToast({
		title: title.toString(),
		icon
	});
};

export function isEmpty(str) {
	return !str && str !== 0;
}

//获取用户登录状态
export function isLogin() {
	try {
		return getToken() !== "" && getUserInfo() !== "";
	} catch (e) {
		return false;
	}
}

export function exit() {
	try {
		uni.removeStorageSync('token');
		uni.removeStorageSync("userInfo");
	} catch (e) {
		console.log("退出账号失败!");
	}
}

//获取用户账号
export function getUserAccount() {
	return getStorageMessage("userAccount", );
}

//保存用户账号
export function setUserAccount(userAccount) {
	setStorageMessage("userAccount", userAccount);
}

//获取token
export function getToken() {
	return getStorageMessage("token", );
}

//保存token
export function setToken(token) {
	setStorageMessage("token", token);
}

//获取用户信息
export function getUserInfo() {
	return getStorageMessage("userInfo", );
}

//保存用户信息
export function setUserInfo(userInfo) {
	setStorageMessage("userInfo", userInfo);
}

export function setStorageMessage(key, value) {
	uni.setStorageSync(key, value);
}
//获取数据缓存
export function getStorageMessage(key, defaultValue = "") {
	try {
		let message = uni.getStorageSync(key);
		return message === "" ? defaultValue : message;
	} catch (e) {
		console.log("-------getStorageMessage---" + e);
		return defaultValue;
	}
}
//提示功能开发中...
export function showTipPending() {
	showToast('功能开发中...');
}

//Modal弹窗
export function showModal(title, content, showCancel = false) {
	uni.showModal({
		title: isEmpty(title) ? "" : title.toString(),
		content: content.toString(),
		showCancel: false
	});
};

export function get(url, data, showLoading = true, showToast = true) {
	return request(url, 'GET', data, showLoading, showToast);
}

export function post(url, data, showLoading = true, showToast = true) {
	return request(url, 'POST', data, showLoading, showToast);
}

//是否登录成功回调
export function isLoginSuccess(state) {
	return new Promise((resolve, reject) => {
		if (state.isLoginCallBack && isLogin()) {
			state.isLoginCallBack = false;
			resolve();
			return;
		} else {
			reject();
			return;
		}
	});
}

/**
 * rsa加密
 * @param {Object} $jsencrypt 对象 
 * @param {Object} param 加密字符串
 */
export function encrypt(encrypt, param) {
	console.log(encrypt);
	encrypt.setPublicKey(rsaPublicKey)
	let encrypted = encrypt.encrypt(param);
	console.log("encrypted" + encrypted);
	return encrypted;
}
//校验邮箱格式
export function checkEmail(email) {
	return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(
		email);
}
//校验手机格式
export function checkMobile(mobile) {
	return RegExp(/^1[34578]\d{9}$/).test(mobile);
}
//数字
export function checkNumber(number) {
	return RegExp(/^[1-9]\d*$/).test(number);
}
//身份证号码
export function checkIdCard(idCard) {
	return RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/).test(idCard) ||
		RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/).test(idCard);
}
//是否包含特殊字符
export function checkSpecialChar(param) {
	return RegExp(/[~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im).test(param);
}
//是否只包含数字和字母
export function checkStringAndNumber(param) {
	return RegExp(/^[A-Za-z0-9]+$/).test(param);
}
/**
 * @param {Object} size 字节
 */
export function countFileSize(size) {
	if (!size)
		return "0.00byte";
	var num = 1024.00; //byte
	if (size < num)
		return size + "B";
	if (size < Math.pow(num, 2))
		return (size / num).toFixed(2) + "KB"; //kb
	if (size < Math.pow(num, 3))
		return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
	if (size < Math.pow(num, 4))
		return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
	return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}
