<template>
	<view>
		<view class="bg-white">
			<view class="grid col-5 padding-sm">
				<view class="margin-tb-sm text-center" v-for="(item,index) in buttonList" :key="index">
					<button @click="navigation(index)" class="cu-btn round bg-blue shadow">{{item.name}}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buttonList: [{
						name: "表单",
						navigation: "/pages/demo/form"
					},
					{
						name: "级联",
						navigation: "/pages/demo/jiL"
					},
					{
						name: "定位",
						navigation: "/pages/demo/location"
					},
					{ 
						name: "柱状图",
						navigation: "/pages/demo/chart"
					},
					{
						name: "折线图",
						navigation: "/pages/demo/line"
					},
					{
						name: "饼状图",
						navigation: "/pages/demo/pie"
					},
				]
			};
		},
		methods: {
			navigation(index) {
				uni.navigateTo({
					url: this.buttonList[index].navigation,
					animationType: "pop-in"
				})
			},
		}
	}
</script>

<style lang="scss">

</style>
