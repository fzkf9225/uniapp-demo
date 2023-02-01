import {
	showToast,
	setStorageMessage,
	setUserInfo
} from './common.js';
let url = "http://192.168.1.239:8888";
//钉钉post请求
export function dingPost(data) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: url + '/dingTalkLogin',
			method: 'POST',
			data: {
				authCode: data
			},
			header: {'Content-Type': 'application/x-www-form-urlencoded'},
			success: function(res) {
				//请求完成回调
				if (res.data.code === 0) {
					setDingTalkUserInfo(res.nick);
					showToast("钉钉信息同步成功");
					resolve(res.data)
				} else {
					dd.alert({
						content: JSON.stringify(res.data.msg)
					});
					reject(res.data.code);
				}
				console.log("服务器返回：" + JSON.stringify(res));
			},
			fail: function(res) {
				dd.alert({
					content: JSON.stringify(res)
				});
				reject(-1);
			},
			complete: function(res) {
				dd.hideLoading();
			}
		});
	});
}
//获取认证信息的autoCode
export function getAutoCode() {
	return new Promise((resolve, reject) => {
		dd.getAuthCode({
			success: (res) => {
				resolve(res.authCode);
			},
			fail: (err) => {
				reject("钉钉登录授权失败");
			}
		})
	});
}

//保存钉钉用户信息
export function setDingTalkUserInfo(name) {
	let dingUser = {
		realName:""
	}
	dingUser.realName = name;
	setUserInfo(dingUser);
}
