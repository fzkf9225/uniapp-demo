<!-- 
tab组件: 
<app-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></app-tabs>
tabs支持的数据格式： ['全部', '待付款'] 或 [{name:'全部'}, {name:'待付款'}]
-->
<template>
	<view class="top-tab">
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==value?'text-blue cur':''" v-for="(item,index) in tabs" :key="index"
				 @tap="tap(index)" :data-id="index">
					{{getTabName(item)}}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			tabs: Array,
			value: { // 当前显示的下标 (使用v-model语法糖: 1.props需为value; 2.需回调input事件)
				type: [String, Number],
				default () {
					return 0
				}
			},
			fixed: Boolean // 是否悬浮,默认false
		},
		methods: {
			getTabName(tab) {
				return typeof tab === "object" ? tab.name : tab
			},
			tap(index) {
				if (this.value != index) {
					this.$emit("input", index);
					this.$emit("change",index);
				}
			}
		}
	}
</script>

<style>
	
</style>
