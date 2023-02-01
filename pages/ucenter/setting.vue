<template>
	<view class="flex flex-direction">
		<view class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
			<view @click="clearCache" class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="text-grey">清理缓存</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{ cacheFileSize }}</text>
				</view>
			</view>
			<view @click="technicalSupport" class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="text-grey">技术支持</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">景云软件</text>
				</view>
			</view>

			<view @click="checkUpdate" class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="text-grey">检查更新</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{ versionName }}</text>
				</view>
			</view>
			<view @click="share" class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="text-grey">分享给朋友</text>
				</view>
			</view>
		</view>
<!--  #ifndef MP-DINGTALK-->
		<text class="text-red text-sm text-center exit" @click="exit" v-if="visible">退出账号</text>
<!--  #endif -->
		<view>
			<yomol-upgrade :type="upgradeType" :url="upgradeUrl" :title="updateTitle" :content="upgradeContent" ref="yomolUpgrade"></yomol-upgrade>
		</view>
	</view>
</template>

<script>
	import {
		showToast,
		isLogin,
		countFileSize,
		exit,
		isLoginSuccess
	} from '../../common/common.js';
	import {
		checkUpdate
	} from '../../common/version.js';
	import yomolUpgrade from '@/components/yomol-upgrade/yomol-upgrade.vue';
	import {
		showShare,
		hideShare,
		nvImageMenuVisible
	} from '../../common/share.js'
	export default {
		components: {
			yomolUpgrade
		},
		data() {
			return {
				visible: isLogin(),
				cacheFileSize: '',
				versionName: '',
				menuBorder: true,
				menuCard: false,
				menuArrow: false,
				upgradeType: 'pkg', //pkg 整包 wgt 升级包
				upgradeContent: '', //更新内容
				upgradeUrl: '', //更新地址
				updateTitle: "发现新版本"
			};
		},
		onBackPress() {
			//监听back键，关闭弹出菜单
			if (nvImageMenuVisible()) {
				hideShare();
				return true
			}
		},
		onReady() {
			// #ifdef APP-PLUS
			this.versionName = "v" + this.$store.state.versionName;
			// #endif
		},
		onShow() {
			isLoginSuccess(this.$store.state).then(() => {
				console.log("-----------登录成功返回-----------");
			}).catch(() => {
				console.log("-----------登录失败返回-----------");
			});
			this.visible = isLogin();
		},
		methods: {
			share() {
				showShare()
			},
			checkUpdate() {
				// #ifdef APP-PLUS
				//测试热更新：http://scs.jcloudsoft.com/scs-app/static/tmp/__UNI__8A3CCB4.wgt
				checkUpdate(true, version => {
					if (version.updateType === 1) {
						this.updateTitle = "发现新版本" + version.versionName;
						this.upgradeType = 'pkg'
						this.upgradeContent = version.versionMsg
						this.upgradeUrl = version.url
						this.$refs.yomolUpgrade.show()
					} else {
						this.updateTitle = "发现新版本" + version.versionName;
						this.upgradeType = 'wgt'
						this.upgradeContent = version.versionMsg
						this.upgradeUrl = version.url
						this.$refs.yomolUpgrade.show()
					}
				});
				// #endif
			},
			technicalSupport() {
				uni.navigateTo({
					url: '../ucenter/technicalsupport'
				});
			},
			exit() {
				this.visible = false;
				try {
					exit();
					uni.navigateTo({
						url: '../user/login'
					});
				} catch (e) {
					showToast('账号退出异常！');
				}
			},
			calCacheFileSize() {
				plus.cache.calculate(size => {
					this.cacheFileSize = countFileSize(size);
				});
			},
			clearCache() {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '是否确定清理缓存?',
					success(res) {
						if (res.confirm) {
							plus.cache.clear(function() {
								_this.calCacheFileSize();
								uni.showToast({
									title: '清除成功',
									icon: 'none',
									duration: 2000
								});
							});
						}
					}
				});
			}
		},
		mounted() {
			this.calCacheFileSize();
		}
	};
</script>
<style>
	.exit {
		margin-top: 180rpx;
	}
</style>
