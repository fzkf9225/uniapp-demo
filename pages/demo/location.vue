<template>
	<view>
		<view class="cu-bar bg-white  margin-top solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<text class="">您现在的位置</text>
				<view class="wz">
					<text>经度：{{longitude}}</text>
					<text>纬度：{{latitude}}</text>
				</view>
			</view>
		</view>
		<view class="bg-white">
			<map class="map" :longitude="longitude" :latitude="latitude"></map>
		</view>
		<view class="bg-white">
			<view>{{address}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				latitude:0,
				longitude:0,
				address	:{}
			}
		},
		onLoad(optison) {
			this.latitude=this.$store.state.localtion.latitude;
			this.longitude=this.$store.state.localtion.longitude;
			this.getLocation();
		},
		onPullDownRefresh() {
				this.getLocation();
		        setTimeout(function () {
		            uni.stopPullDownRefresh();
		        }, 1000);
		},
		methods:{
		 	 getLocation(){
			 	uni.getLocation({
				    type: 'gcj02',
					geocode:true,
				    success:(res) => {
						console.log("定位："+JSON.stringify(res))
				        console.log('当前位置的经度：' + res.longitude);
				        console.log('当前位置的纬度：' + res.latitude);
						console.log('当前地址：' + res.address);
						this.longitude=res.longitude;
						this.latitude=res.latitude;
						this.address=res.address;
				    },
					fail: function(e) {  
                        this.$showToast("无法获取手机GPS信息");  
                    }  
				});
			},
		}
	}
</script>

<style lang="scss">
	.action{
		width: 750rpx;
		.wz{
			width: 50%;
			margin-left: 60rpx;
			
			text{
				margin-right: 20rpx;
			}
		}
	}
	.map{
		width: 750rpx;
		height: 750rpx;
	}
</style>
