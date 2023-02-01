<template>
	<!-- 不能用v-if (i: 每个tab页的专属下标;  index: 当前tab的下标; 申明在 MescrollMoreItemMixin )-->
	<view v-show="i === index">
		<!-- top="90"下拉布局往下偏移,防止被悬浮菜单遮住 -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="90" bottom = "10" :down="downOption" @down="downCallback" :up="upOption"
		 @up="upCallback" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<view class="cu-list menu-avatar">
				<view class="cu-item cur" v-for="(item,index) in dataList" :key="index" :data-id="index">
					<view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81020.jpg);">
						<view class="cu-tag badge"></view>
					</view>
					<view class="content">
						<view>
							<view class="text-cut">{{item.msgContect}}</view>
							<view class="cu-tag round bg-orange sm">1条</view>
						</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut"> {{item.inputTime}}</view>
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">22:20</view>
						<view class="cuIcon-notice_forbid_fill text-grey"></view>
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
		getWarnMsgList
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
				// 第1种: 请求具体接口
				/* uni.request({
					url: 'xxxx',
					success: () => {
						// 请求成功,隐藏加载状态
						this.mescroll.endSuccess()
					},
					fail: () => {
						// 请求失败,隐藏加载状态
						this.mescroll.endErr()
					}
				}) */
				// 第2种: 下拉刷新和上拉加载调同样的接口, 那么不用第1种方式, 直接mescroll.resetUpScroll()即可
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				// 第3种: 下拉刷新什么也不处理, 可直接调用或者延时一会调用 mescroll.endSuccess() 结束即可
				//this.mescroll.endSuccess();
				// 若整个downCallback方法仅调用mescroll.resetUpScroll(),则downCallback方法可删 (mixins已默认)
			},
			/*上拉加载的回调*/
			upCallback(page) {
				console.log("页码" + page.num);
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条

				getWarnMsgList({
					pageNum: pageNum,
					pageSize: pageSize
				}).then(res => {
					// 接口返回的当前页数据列表 (数组)
					let curPageData = res.data;
					// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
					let curPageLen = curPageData.length;
					// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
					//let totalPage = Math.ceil(total/pageSize);
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

					// 请求成功,隐藏加载状态
					//方法一(推荐): 后台接口有返回列表的总页数 totalPage
					//this.mescroll.endByPage(curPageLen, totalPage);

					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					this.mescroll.endBySize(curPageLen, totalSize);

					//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
					//this.mescroll.endSuccess(curPageLen, hasNext); 

					//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
					//如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
					//如果传了hasNext,则翻到第二页即可显示无更多数据.
					//this.mescroll.endSuccess(curPageLen);

					// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
					this.$nextTick(() => {
						this.mescroll.endSuccess(curPageLen)
					})

					/*curPageLen必传的原因:
					 1. 使配置的noMoreSize 和 empty生效
					 2. 判断是否有下一页的首要依据:
						当传的值小于page.size时(说明不满页了), 则一定会认为无更多数据;
					比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
					3. 当传的值等于page.size时, 才会取totalPage, totalSize, hasNext判断是否有下一页
					传totalPage, totalSize, hasNext目的是避免方法四描述的小问题 */

					// 提示: 您无需额外维护页码和判断显示空布局,mescroll已自动处理好.
					// 当您发现结果和预期不一样时, 建议再认真检查以上参数是否传正确
				}).catch(res => {
					console.log(res);
					this.mescroll.endErr();
				});
			}
		}
	}
</script>
