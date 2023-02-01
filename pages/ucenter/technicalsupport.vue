<template>
	<view class="flex flex-direction">
		<view class="flex flex-direction">
			<image class="radius" src="../../static/qr_code.jpg" style="width: 258rpx;height: 258rpx;
				margin-top: 120rpx; align-self: center;" @click="qrCode" />
			<text class="margin-top-lg auto-color text-sm" style="align-self: center;
				margin-bottom: 120rpx;">合肥景云软件工程有限责任公司</text>
		</view>
		<view class="align-start text_item align-center bg-white padding-lr-lg flex">
			<text class="dark-color text-sm">电话</text>
			<text class="dark-color text-sm  margin-left-lg">0551-65605212</text>
		</view>
		<view class="align-start text_item align-center  bg-white padding-lr-lg flex">
			<text class="dark-color text-sm">邮箱</text>
			<text class="dark-color text-sm  margin-left-lg">jyrj@jcloudsoft.com</text>
		</view>
		<view class="align-start text_item align-center bg-white padding-lr-lg flex" @click="checkUpdate">
			<text class="dark-color text-sm">地址</text>
			<text class="dark-color text-sm  margin-left-lg">合肥市高新区玉兰大道767号中科大国祯大厦502A1区</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			qrCode() {
				uni.previewImage({
					urls: ["../../static/qr_code.jpg"],
					longPressActions: {
						success: function(data) {
							console.log("---------success---------")
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			}
		}
	}
</script>

<style>
	.text_item {
		height: 112rpx;
	}
</style>
