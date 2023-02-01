<template>
	<view>
		<view class="ld">
			 <view class="left">
				 <view 
					v-for="(item,index) in list" 
					:key="index" 
					@click="setId(index)"
					:class="{active:index===currentNum}"
					>
					 {{item.title}}
				 </view>
			 </view>
			 <view class="right">
				<scroll-view  
					:scroll-y="true"  
					style="white-space: nowrap;height:200px;"
					:scroll-into-view="clickId"
					scroll-with-animation
					@scroll="scroll"
					@scrolltolower="scrolltolower"
					>
					 <view v-for="(item,index) in list" :key="index">
							<view class="title" :id="'po'+index">{{item.title}}</view>
							<view v-for="(it,idx) in item.list" :key="idx">
								{{it}}
							</view>
					 </view> 
				 </scroll-view>	 
			 </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{title:"中餐",list:["盖饭","扒饭","咖喱饭","鸡排饭"]},
					{title:"西餐",list:["牛排","意面","芝士","汉堡"]},
					{title:"法餐",list:["辣子鸡丁","xxx","肥仔快乐水","填缝隙"]},
					{title:"快餐",list:["薯条","丸子","粥","饮料"]},
				],
				clickId:"",
				currentNum:0,
				topList:[],
			}
		},
		onReady(){
			this.getNodesInfo();
		},
		methods: {
			setId(index){
				this.clickId="po"+index;
				this.currentNum=index;
			},
			scroll(e){
				let scrollTop=e.target.scrollTop;
				for(let i=0;i<this.topList.length;i++){
					let h1=this.topList[i];
					let h2=this.topList[i+1];
					if(scrollTop>=h1&&scrollTop<h2){
						this.currentNum=i;
					}
				}
			},
			scrolltolower(){
					setTimeout(()=>{
						this.currentNum=3;
					}, 80);
			},
			getNodesInfo(){
				const query = uni.createSelectorQuery().in(this);
				query.selectAll('.title').boundingClientRect().exec((res)=>{
					let nodes=res[0];
					let rel=[];
					nodes.map(item=>{
						rel.push(item.top)
					})
					this.topList=rel;
				});
			},
		}
	}
</script>

<style lang="scss">
.ld{
	display: flex;
	.left{
		width:100px;
		border:1px solid red;
	}
	.right{
		flex: 1;
		border:1px solid red;
		.title{
			font-size: 20px;
			font-weight: bold;
			background:pink;
		}
	}
}
.active{
	background:red;
}
</style>
