<template>
	<view class="flex flex-direction">
		<view class="bg-theme flex padding-lr-lg" style="padding-top: 64px;padding-bottom: 158rpx;
			width: auto;">

			<image :src="defaultImage" class="cu-avatar xl round" @click="headImage" @error="errImage"></image>

			<view class="flex flex-direction margin-lr margin-top-sm">
				<text class="text-sm text-white" @click="user">{{userName}}</text>
				<text class="margin-top-df text-sm  text-white margin-top-sm">{{userTel}}</text>
			</view>
			<text class="text-sm text-white margin-top-sm" style="text-align: end; margin-left: 50rpx;flex-grow: 1;">{{department}}</text>
		</view>

		<view class="cu-list menu" style="margin-top: -80rpx;" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
			<view class="cu-item" :class="menuArrow?'arrow':''" @click="modifyPassword">
				<view class="content">
					<image src="../../static/w_2.png" class="png" mode="aspectFit"></image>
					<text class="text-grey">修改密码</text>
				</view>
			</view>
			<view class="cu-item" :class="menuArrow?'arrow':''" @click="setting">
				<view class="content">
					<image src="../../static/w_1.png" class="png" mode="aspectFit"></image>
					<text class="text-grey">系统设置</text>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import {
		getUserInfo,
		isLogin,
		chooseOneImage,
		compressImage,
		imagePathToBase64,
		setUserInfo
	} from '../../common/common.js';
	import {
		postUserInfo,
		getUserUploadHeadImg
	} from '../../common/ApiServiceHelper.js'
	export default {
		data() {
			return {
				userName: "点击登录",
				userTel: "",
				department: "",
				defaultImage: "../../static/icon_head_default.png",
				HeadImageBean: {
					headImg: ""
				},
				menuBorder: true,
				menuCard: true,
				menuArrow: true,

			};
		},
		onReady() {
			console.log("-------------onReady-------------");
		},
		onLoad() {
			console.log("-------------onLoad-------------");
		},
		onPullDownRefresh() {
			this.refreshUserInfo();
		},
		onShow() {
			this.updateView(getUserInfo());
		},
		methods: {
			errImage() {
				console.log('--------errImage---------');
				this.defaultImage = "../../static/icon_head_default.png";
			},
			refreshUserInfo() {
				let that = this;
				postUserInfo(false).then(userInfo => {
						setUserInfo(userInfo);
						uni.stopPullDownRefresh();
					}).catch(res => {
						uni.stopPullDownRefresh();
						console.log(res);
					});
			},
			updateView(data) {
				console.log("--------updateView--------" + (data !== ""))
				if (data !== "") {
					this.userName = data.realName;
					this.userTel = data.mobile;
					this.department = data.appRoleList[0].name;
					this.defaultImage = data.headImg;
				}
			},
			modifyPassword() {
				if (!isLogin()) {
					uni.navigateTo({
						url: "../user/login"
					})
				} else {
					uni.navigateTo({
						url: "../ucenter/modifypassword"
					})
				}
			},
			setting() {
				uni.navigateTo({
					url: "../ucenter/setting"
				})
			},
			user() {
				// #ifndef MP-DINGTALK
				if (!isLogin()) {
					uni.navigateTo({
						url: "../user/login"
					})
				}
				// #endif
			},
			headImage() {
				let that = this;
				if (isLogin()) {
					chooseOneImage().then(res => {
						return compressImage(res);
					}).then(res => {
						return imagePathToBase64(res);
					}).then(res => {
						that.HeadImageBean.headImg = res;
						return getUserUploadHeadImg(that.HeadImageBean);
					}).then(res => {
						let userInfo = getUserInfo();
						userInfo.headImg = res;
						setUserInfo(userInfo);
						that.defaultImage = res;
					});
				} else {
					// #ifndef MP-DINGTALK
					uni.navigateTo({
						url: "../user/login"
					});
					// #endif
				}
			}
		},
	}
</script>

<style lang="scss">

</style>
