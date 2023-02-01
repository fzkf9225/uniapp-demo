<template>
	<view>
		<view class="bg align-center">
			<view class="text-white text-xl margin-bottom-xl text-center">智慧工地监管平台</view>
			<swiper class="screen-swiper round-dot margin-lr" :indicator-dots="true" :circular="true" :autoplay="true" interval="2000"
			 duration="500">
				<swiper-item v-for="(item,index) in bannerList" :key="index">
					<image :src="item" mode="aspectFill" class="radius-lg" lazy-load></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="cu-list card-menu grid margin-top margin-lr align-center text-center" :class="['col-' + gridCol,gridBorder?'':'no-border']">
			<view class="cu-item" v-for="(item,index) in cuIconList" :key="index" v-if="index<gridCol*2">
				<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]" @click="toPath(item.type)">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
					</view>
				</view>
				<text @click="toPath(item.type)">{{item.name}}</text>
			</view>
		</view>

		<view>
			<yomol-upgrade :type="upgradeType" :url="upgradeUrl" :title="updateTitle" :content="upgradeContent" ref="yomolUpgrade"></yomol-upgrade>
		</view>
	</view>
</template>

<script>
	import {
		isLogin,
		isLoginSuccess,
		downloadFile,
		getLocalFile,
		getPlatForm
	} from '../../common/common.js';
	import {
		checkVersion,
		getBannerList
	} from '../../common/ApiServiceHelper.js'
	import {
		dingPost,
		getAutoCode,
	} from '../../common/DingTalk.js'
	import yomolUpgrade from '@/components/yomol-upgrade/yomol-upgrade.vue';

	export default {
		components: {
			yomolUpgrade
		},
		data() {
			return {
				scrollHeight: '',
				bannerList: [],
				banner: "",
				upgradeType: 'pkg', //pkg 整包 wgt 升级包
				upgradeContent: '', //更新内容
				upgradeUrl: '', //更新地址
				updateTitle: "发现新版本",
				cuIconList: [{
					cuIcon: 'circlefill',
					color: 'olive',
					badge: 120,
					name: '项目管理',
					type: 1
				}, {
					cuIcon: 'friendfill',
					color: 'cyan',
					badge: 2,
					name: '专户管理',
					type: 2
				}, {
					cuIcon: 'peoplefill',
					color: 'red',
					badge: 5,
					name: '人员管理',
					type: 3
				}, {
					cuIcon: 'global',
					color: 'orange',
					badge: 22,
					name: '环境管理',
					type: 4
				}, {
					cuIcon: 'recordfill',
					color: 'blue',
					badge: 4,
					name: '实时监控',
					type: 5
				}, {
					cuIcon: 'similar',
					color: 'pink',
					badge: 56,
					name: 'Demo',
					type: 6
				}],
				modalName: null,
				gridCol: 3,
				gridBorder: false,
				VersionBean: {
					versionName: "",
					versionCode: "",
					updateType: 1,
				},
				dingTalk:{
					tmp_auth_code:""
				}
			}
		},
		onReady() {
			if (!isLogin()) {
				// #ifdef MP-DINGTALK
				console.log("---------钉钉中运行--------");
				let that = this;
				getAutoCode().then(res =>{
					console.log("获取autoCode: " + res);
					that.dingTalk.tmp_auth_code = res;
					return dingPost(res)
				}).then(res =>{
					console.log("登录成功："+JSON.stringify(res))
				}).catch(e =>{
					console.log("error:"+e);
				});
				return;
				// #endif
				// #ifndef MP-DINGTALK
				console.log("---------非钉钉中运行--------");
				uni.navigateTo({
					url: "../user/login"
				});
				return;
				// #endif
				
			};
			this.requestData();
		},
		onShow() {
			isLoginSuccess(this.$store.state).then(() => {
				this.requestData();
			}).catch(res => {
				console.log(res);
			});
		},
		methods: {
			requestData() {
				let that = this;
				getBannerList({}).then(res => {
					// if (getPlatForm() === "android") {
					// 	for (let image of res.data) {
					// 		getLocalFile(image.bannerImgUrl).then(res => {
					// 			console.log("未找到缓存文件")
					// 			return downloadFile(res);
					// 		}).then(res => {
					// 			console.log("下载成功" + res)
					// 			that.bannerList.push(res);
					// 		}).catch(e => {
					// 			console.log("缓存：" + e)
					// 			that.bannerList.push(e)
					// 		})
					// 	}
					// } else {
						for (let image of res.data) {
							that.bannerList.push(image.bannerImgUrl)
						}
					// }
					// #ifdef APP-PLUS
					that.VersionBean.versionCode = that.$store.state.versionCode;
					that.VersionBean.versionName = that.$store.state.versionName;
					return checkVersion(that.VersionBean, false, false);
					// #endif
				}).then(version => {
					// #ifdef APP-PLUS
					if (version.updateType === 1) { //1 =》全量更新，2 =》增量更新
						that.updateTitle = "发现新版本" + version.versionName;
						that.upgradeType = 'pkg'
						that.upgradeContent = version.versionMsg
						that.upgradeUrl = version.url
						that.$refs.yomolUpgrade.show()
					} else {
						that.updateTitle = "发现新版本" + version.versionName;
						that.upgradeType = 'wgt'
						that.upgradeContent = version.versionMsg
						that.upgradeUrl = version.url;
						that.$refs.yomolUpgrade.show()
					}
					// #endif
				}).catch(res => {
					console.log(res);
				});
			},
			testBase64() {
				console.log("初始字符串：123456");
				console.log("base64编码：" + Base64.encode("123456"));
				console.log("base64编码还原：" + Base64.decode(Base64.encode("123456")));
			},
			toPath(type) { //点击跳转
				console.log(type);
				if (1 === type) { //项目管理
					uni.navigateTo({
						url: "../project/projectManager"
					})
					return;
				}
				if (2 === type) { //专户管理
					uni.navigateTo({
						url: "../acc/accManager"
					})
					return;
				}
				if (3 === type) { //工人管理
					uni.navigateTo({
						url: "../worker/workerManager"
					})
					return;
				}
				if (4 === type) { //环境管理
					uni.navigateTo({
						url: "../env/envManager"
					})
					return;
				}
				if (5 === type) { //实时监控
					uni.navigateTo({
						url: "../camera/realTimeMmonitor"
					});
				}
				if (6 === type) { //demo
					uni.navigateTo({
						url: "../demo/demo"
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.bg {
		background-image: url('~@/static/tbg.png');
		// width: 750rpx;
		background-size: 100%;
		background-position: top center;
		background-repeat: no-repeat;
		padding-top: 10%;
	}

	image {
		will-change: transform
	}
</style>
