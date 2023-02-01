<template>
  <view>
    <view class="cu-bar bg-gray search">
      <view class="search-form round bg-white">
        <text class="cuIcon-search"></text>
        <input type="text" placeholder="搜索" confirm-type="search" @input="searchIcon" />
      </view>
    </view>
    <view>
      <mescroll-body
        ref="mescrollRef"
        @init="mescrollInit"
        @down="downCallback"
        @up="upCallback"
        :down="downOption"
        :up="upOption"
      >
        <view
          class="cu-list grid col-1"
          style="background-color: #eee;"
          :class="{padding:dataList.length>0}"
        >
          <view class="bg-white item margin-bottom" v-for="(item, index) in dataList" :key="index">
            <view class="flex padding justify-between text-df">
              <view class="project-name">{{item.projectName}}</view>
              <view class="text-gray">{{item.tmlName}}</view>
            </view>
            <view class="flex padding justify-between">
              <view>
                <view class="flex justify-start align-end">
                  <view class="number">{{ item.pmTwoPointFive }}</view>
                  <view class="unit">μg/m³</view>
                </view>
                <view class="text-gray margin-top-sm">PM2.5</view>
              </view>
              <view>
                <view class="flex justify-start align-end">
                  <view class="number">{{ item.pmTen }}</view>
                  <view class="unit">μg/m³</view>
                </view>
                <view class="text-gray margin-top-sm">PM10</view>
              </view>
              <view>
                <view class="flex justify-start align-end">
                  <view class="number">{{ item.noise }}</view>
                  <view class="unit">db</view>
                </view>
                <view class="text-gray margin-top-sm">噪音</view>
              </view>
            </view>
            <view class="flex padding justify-between">
              <button class="cu-btn round lg" @click="showNotUseMsg">实时监控</button>
              <button class="cu-btn round lg" @click="showNotUseMsg">喷淋监控</button>
            </view>
          </view>
        </view>
      </mescroll-body>
    </view>
    <!--  <view class="flex padding-left padding-right padding-top justify-between">
            <button class="cu-btn bg-blue round lg">环境监测数据</button>
            <button class="cu-btn bg-blue round lg">环境预警数据</button>
    </view>-->
  </view>
</template>

<script>
import { showToast } from "../../common/common.js";
// 引入mescroll-mixins.js
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";

import { getEnvList } from "../../common/ApiServiceHelper.js";

import {
  pageSizeGlobal,
  noMoreSizeGlobal,
  emptyTip,
  textNoMore
} from "../../common/config.js";

export default {
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      keywords: "",
      dataList: [],
      downOption: {
        use: true, // 是否启用下拉刷新; 默认true
        auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
        native: false // 启用系统自带的下拉组件,默认false;仅mescroll-body生效,mescroll-uni无效 (native: true, 则需在pages.json中配置 "enablePullDownRefresh": true)
      },
      // 上拉加载的常用配置
      upOption: {
        use: true, // 是否启用上拉加载; 默认true
        auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: pageSizeGlobal // 每页数据的数量,默认10
        },
        noMoreSize: noMoreSizeGlobal, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
        empty: {
          tip: emptyTip
        },
        textNoMore: textNoMore
        // textNoMore:"暂无相关数据"
      }
    };
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    /*下拉刷新的回调, 有三种处理方式: */
    downCallback() {
      this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
    },
    /*上拉加载的回调*/
    upCallback(page) {
      let pageNum = page.num; // 页码, 默认从1开始
      let pageSize = page.size; // 页长, 默认每页10条

      getEnvList({
        pageNum: pageNum,
        pageSize: pageSize,
        keywords: this.keywords
      })
        .then(res => {
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
          if (this.mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
          this.dataList = this.dataList.concat(curPageData); //追加新数据
          this.mescroll.endBySize(curPageLen, totalSize);
          this.$nextTick(() => {
            this.mescroll.endSuccess(curPageLen);
          });
        })
        .catch(res => {
          this.mescroll.endErr();
        });
    },
    showNotUseMsg() {
      showToast("功能暂不可用");
    },
    //         search(e) {
    //             this.keywords = e.value.trim();
    // this.mescroll.resetUpScroll();
    //         },
    //         cancel(e) {
    // this.keywords = null;
    // this.mescroll.resetUpScroll();
    //         },
    searchIcon(e) {
      this.keywords = e.detail.value.trim();
      this.mescroll.resetUpScroll();
    }
  }
};
</script>

<style lang="scss">
.item {
  border-radius: 10px;

  .number {
    font-size: 60rpx;
    line-height: 60rpx;
  }

  .unit {
    font-size: 30rpx;
    line-height: 50rpx;
  }

  .project-name {
    width: 400rpx;
    text-align: left;
    overflow: hidden;
  }
}
</style>
