<template>
	<!-- 不能用v-if (i: 每个tab页的专属下标;  index: 当前tab的下标; 申明在 MescrollMoreItemMixin )-->
	<view v-show="i === index">
		<!-- top="90"下拉布局往下偏移,防止被悬浮菜单遮住 -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="90" bottom = "10" :down="downOption" @down="downCallback" :up="upOption"
		 @up="upCallback" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item,index) in dataList" :key="index" :data-id="index">
					<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
					<view class="content">
						<view class="text-grey">凯撒</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								<text class="cuIcon-infofill text-red  margin-right-xs"></text>
								{{item.msgContect}}。
							</view>
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">22:20</view>
						<view class="cu-tag round bg-grey sm">5</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		pageSizeGlobal,
		noMoreSizeGlobal,
		emptyTip,
		textNoMore
	} from '../../common/common.js';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import {
		getMsgList
	} from '../../common/ApiServiceHelper.js';

	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		data() {
			return {
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: pageSizeGlobal // 每页数据的数量
					},
					noMoreSize: noMoreSizeGlobal, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: emptyTip
					},
					textNoMore: textNoMore
				},
				dataList: [] //列表数据
			}
		},
		methods: {
			/*下拉刷新的回调, 有三种处理方式: */
			downCallback() {
				//下拉刷新和上拉加载调同样的接口
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(page) {
				console.log("页码" + page.num);
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条

				getMsgList({
					pageNum: pageNum,
					pageSize: pageSize
				}).then(res => {
					// 接口返回的当前页数据列表 (数组)
					let curPageData = res.data;
					// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
					let curPageLen = curPageData.length;
					// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
					let totalSize = res.total;
					// 接口返回的是否有下一页 (true/false)
					let hasNext = true;
					if (res.data.length == 0) {
						hasNext = false;
					}
					//设置列表数据
					if (this.mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					this.mescroll.endBySize(curPageLen, totalSize);
					// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
					this.$nextTick(() => {
						this.mescroll.endSuccess(curPageLen)
					})
				}).catch(res => {
					console.log(res);
					this.mescroll.endErr();
				});
			}
		}
	}
</script>
