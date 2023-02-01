<template>
	<view>
		<view class="flex flex-direction">
			<image src="../../static/app_logo.png" class="self-center login-image"></image>
			</image>
		</view>
		<view class="cu-list card-menu first-input">
			<view class="cu-form-group">
				<input placeholder="请输入用户名" v-model="inputBean.user" ></input>
			</view>
			<view class="cu-form-group">
				<input placeholder="请输入密码" v-model="inputBean.userPassword" password="true" maxlength="16"></input>
			</view>
		</view>	
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-theme margin-tb-lg lg round" @click="loginSubmit">登录</button>
		</view>
	</view>
</template>

<script>
	import {
		encrypt,
		showToast,
		setUserAccount,
		setToken,
		setUserInfo,
		getUserAccount,
		isEmpty
	} from '../../common/common.js';
	let loginRules = [{
			name: 'user',
			type: 'required',
			errmsg: '请输入用户名'
		},
		{
			name: 'userPassword',
			type: 'required',
			errmsg: '请输入密码'
		}
	];
	import validate from '../../common/fshjie-formvalidate/ys-validate.js';
	import {
		login,
		postUserInfo
	} from '../../common/ApiServiceHelper.js';
	export default {
		data() {
			return {
				menuCard: true,
				userBean: {
					loginId: "",
					password: "",
					channel: 2,
				},
				inputBean: {
					user: "",
					userPassword: "",
				},
				backButtonPress: 0
			};
		},
		onBackPress(e) {
			if (e.from == 'backbutton') {
				this.backButtonPress++;
				if (this.backButtonPress > 1) {
					plus.runtime.quit();
				} else {
					showToast("再次点击退出应用");
				}
				setTimeout(function() {
					this.backButtonPress = 0;
				}, 300);
				return true;
			}
		},
		onShow() {
			console.log('--------onShow---------');
		},
		onReady() {
			this.inputBean.user = getUserAccount();
		},
		methods: {
			loginSubmit() {
				let valLoginRes = validate.validate(this.inputBean, loginRules);
				if (!valLoginRes.isOk) {
					showToast(valLoginRes.errmsg);
					return;
				}
				let that = this;
				//测试加密后的密码：eMJJhatfPQy9t+AbgWuXR1jtcGDte7/r5xDdHHPAGgZxVH92o0KFE2VIk+WCz9b1LEDb0UOJ90Wvw/v90NhefYiP0F6/+DRDK6getmnap4x2xIKeYnfgNY5yXr9gJDSe0Yce4Rl0x7SQKYgnKWyTxmJQ1/1nzhYd7fb/i7tpsaQ=
				let jsencrypt = new this.$jsencrypt();
				this.userBean.password = encrypt(jsencrypt, this.inputBean.userPassword);
				this.userBean.loginId = this.inputBean.user;
				login(this.userBean).then(res => {
					setToken(res.token);
					return postUserInfo();
				}).then(res => {
					setUserInfo(res);
					that.$store.state.isLoginCallBack = true;
					//如果是原账号登录则返回上个页面，如果切换了账号登录则跳转到index页面，并关闭其他所有页面
					if (getUserAccount() === "" || getUserAccount() !== that.userBean.loginId) {
						setUserAccount(that.userBean.loginId);
						uni.switchTab({
							url: "../index/index"
						})
					} else {
						setUserAccount(that.userBean.loginId);
						uni.navigateBack();
					}
				}).catch(res => {
					console.log(res);
				});
			}
		}
	}
</script>

<style>
	.login-image {
		width: 208rpx;
		height: 97rpx;
		margin-top: 200rpx;
	}

	.first-input {
		margin-top: 192rpx;
	}
</style>
