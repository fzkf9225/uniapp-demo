<template>
	<view>
		<app-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></app-tabs>
		<warn-mescroll-item ref="mescrollItem0" :i="0" :index="tabIndex"></warn-mescroll-item>
		<msg-mescroll-item ref="mescrollItem1" :i="1" :index="tabIndex"></msg-mescroll-item>
	</view>
</template>

<script>
	import MsgMescrollItem from "./msg-mescroll-more-item.vue";
	import WarnMescrollItem from "./warn-mescroll-more-item.vue";
	// 引入mescroll-more.js
	import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
	//引入tab
	import AppTabs from "@/components/other/app-tabs.vue";
	
	export default {
		mixins: [MescrollMoreMixin],
		components: {
			WarnMescrollItem,
			MsgMescrollItem,
			AppTabs
		},
		data() {
			return {
				tabs: ['预警', '消息'],
				tabIndex: 0 // 当前tab下标
			};
		}
	}
</script>

<style lang="scss">
	
</style>
