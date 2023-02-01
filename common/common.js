import md5 from './md5.js';
import {
	version,
	baseUrl,
	appId,
	appSecret,
	loginErrorCode,
	successCode,
	pageSizeGlobal,
	noMoreSizeGlobal,
	rsaPublicKey
} from './config.js'

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

//获取手机基础信息
function getPhoneInfo() {
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
function getPlatForm() {
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
function getPhoneIdentity() {
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
function chooseMultiImage(imageCount) {
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
function chooseOneImage() {
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
function compressImage(imagePath) {
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
function imagePathToBase64(imagePath) {
	return new Promise((resolve, reject) => {
		plus.io.resolveLocalFileSystemURL(imagePath, function (entry) {
			entry.file(function (file) {
				var AppReader = new plus.io.FileReader();
				AppReader.onloadend = function (e) {
					let base64 = e.target.result
					resolve(base64.split(",")[1])
				};
				AppReader.onerror = function (err) {
					console.log("----base64-onerror----" + err);
					reject(err)
				};
				AppReader.readAsDataURL(file);
			}, function (e) {
				onsole.log("----base64转图片出现错误----" + e);
				reject(e)
			});
		});

	})
}

//下载文件
function downloadFile(image_url) {
	return new Promise((resolve, reject) => {
		var dtask = plus.downloader.createDownload(image_url, {}, function (download, status) {
			// 下载完成
			if (status == 200) {
				console.log("download success")
				resolve(download.filename)
				return;
			} else {
				console.log("download fail")
				reject();
				return;
			}
		});
		//dtask.addEventListener("statechanged", onStateChanged, false);
		dtask.start();
	});
}

//根据url寻找本地文件是否存在
function getLocalFile(image_url) {
	return new Promise((resolve, reject) => {
		plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function (fs) {
			fs.root.getDirectory('_downloads', {
				create: true
			}, imageDir => {
				let imageReader = imageDir.createReader();
				let urlFileName = getUrlFileName(image_url);
				imageReader.readEntries(list => {
					let has = null;
					for (let e of list) {
						if (urlFileName === e.name) {
							has = e.fullPath;
							break;
						}
					}
					if (isEmpty(has)) {
						resolve();
					} else {
						reject(plus.io.convertAbsoluteFileSystem(has));
					}
				})
			}, e => {
				console.log("获取文件异常：" + e);
				resolve();
			})
		}, function (e) {
			resolve();
			console.log("Request file system failed: " + e.message);
		});
	});
}

//获取文件名
function getUrlFileName(url) {
	if (!url) return "";
	var tmp = new Array(); //临时变量，保存分割字符串
	tmp = url.split("/"); //按照"/"分割
	var pp = tmp[tmp.length - 1]; //获取最后一部分，即文件名和参数
	tmp = pp.split("?"); //把参数和文件名分割开
	console.log("tmp：" + tmp[0]);
	return tmp[0];
}

//toast提示信息
function showToast(title, icon = 'none') {
	if (isEmpty(title)) return;
	uni.showToast({
		title: title.toString(),
		icon
	});
};

function isEmpty(str) {
	return !str && str !== 0;
}

//获取用户登录状态
function isLogin() {
	try {
		return getToken() !== "" && getUserInfo() !== "";
	} catch (e) {
		return false;
	}
}

function exit() {
	try {
		uni.removeStorageSync('token');
		uni.removeStorageSync("userInfo");
	} catch (e) {
		console.log("退出账号失败!");
	}
}

//获取用户账号
function getUserAccount() {
	return getStorageMessage("userAccount", );
}

//保存用户账号
function setUserAccount(userAccount) {
	setStorageMessage("userAccount", userAccount);
}

//获取token
function getToken() {
	return getStorageMessage("token", );
}

//保存token
function setToken(token) {
	setStorageMessage("token", token);
}

//获取用户信息
function getUserInfo() {
	return getStorageMessage("userInfo", );
}

//保存用户信息
function setUserInfo(userInfo) {
	setStorageMessage("userInfo", userInfo);
}

function setStorageMessage(key, value) {
	uni.setStorageSync(key, value);
}
//获取数据缓存
function getStorageMessage(key, defaultValue = "") {
	try {
		let message = uni.getStorageSync(key);
		return message === "" ? defaultValue : message;
	} catch (e) {
		console.log("-------getStorageMessage---" + e);
		return defaultValue;
	}
}
//提示功能开发中...
function showTipPending() {
	showToast('功能开发中...');
}

//是否登录成功回调
function isLoginSuccess(state) {
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
function encrypt(encrypt, param) {
	console.log(encrypt);
	encrypt.setPublicKey(rsaPublicKey)
	let encrypted = encrypt.encrypt(param);
	console.log("encrypted" + encrypted);
	return encrypted;
}

/**
 * @param {Object} size 字节
 */
function countFileSize(size) {
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

export {
	randomWord,
	getPhoneInfo,
	getPlatForm,
	getPhoneIdentity,
	chooseMultiImage,
	chooseOneImage,
	compressImage,
	imagePathToBase64,
	downloadFile,
	getLocalFile,
	getUrlFileName,
	showToast,
	isEmpty,
	isLogin,
	exit,
	getUserAccount,
	setUserAccount,
	getToken,
	setToken,
	getUserInfo,
	setUserInfo,
	setStorageMessage,
	getStorageMessage,
	showTipPending,
	isLoginSuccess,
	encrypt,
	countFileSize
}