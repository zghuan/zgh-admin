<template>
    <div id="index" class="flex-col">
        <div id="head" class="flex-row">
            <div class="flex-align" style="height: 64px;">
                <div class="flex-align  flex-center">
                    <div class="title">
                        <!-- <i class="el-icon-loading"></i> -->
                        博文驿站管理后台
                    </div>
                </div>
            </div>
            <div style="height: 64px;margin-right: 40px;cursor: pointer;" class="flex-align flex-row">
                <el-dropdown>
                    <div class="el-dropdown-link flex-align">
                        <img src="../assets/logo.png" alt="" style="width:40px;height:40px;">
                        <span style="margin-left:5px;color:#fff">{{user.name}}</span>
                        <!-- <i class="el-icon-caret-bottom" color="#fff"></i> -->
                    </div>
                    <el-dropdown-menu slot="dropdown" @click.native="loginOut">
                        <el-dropdown-item>
                            <i class="el-icon-circle-close"></i>
                            退出登陆
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <div class="flex-row" style="flex:1;">
            <navMenu></navMenu>
            <div class="flex-col" style="width:100%;">
                <div style="padding:10px;border-bottom:1px solid #dddee1;">
                    <el-breadcrumb separator='/'>
                        <el-breadcrumb-item to="/index">
                            <span style="cursor: pointer;">首页</span>
                        </el-breadcrumb-item>
                        <el-breadcrumb-item v-for="bread in this.$store.state.breadData" :key="bread.id">
                            <span style="cursor: pointer;">{{bread.name}}</span>
                        </el-breadcrumb-item>
                        <el-breadcrumb-item v-for="bread in this.$store.state.breadData" :key="bread.id">
                            <span style="cursor: pointer;">{{bread.subName}}</span>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                
                <el-card class="box-card" v-if="isHome">
                    <div class="flex-row space-between" style="width:100%;font-size:14px;">
                        <div  style="width:50%">
                            <span>上次登录时间：</span><span>{{lastTime}}</span>
                            <span style="margin-left:20%">本次登录时间：</span><span>{{currentTime}}</span>
                        </div>
                        <!-- <div style="width:50%">
                            <span>本次登录IP：</span><span>{{lastIP}}</span>
                            <span style="margin-left:20%">本次登录IP：</span><span>{{lastIP}}</span>
                        </div> -->
                    </div><hr class="hr">
                    <div class="flex-row" style="border-bottom:1px solid #dddee1;overflow:auto;">
                        <div style="width:50%;border-right:1px solid #dddee1">
                            <div>会员统计</div>
                            <div class="flex-align flex-col" style="font-size:14px;font-weight:bold;text-align:center;">
                                <div class="flex-col flex-align" style="padding:10px;">
                                    <span>用户总数（人）</span>
                                    <span>{{userTotal.count}}</span>
                                </div>
                                <div class="flex-row" style="border-top:1px solid #dddee1;">
                                    <div class="flex-col flex-center" style="border-right:1px solid #dddee1;padding:10px">
                                        <span>本月新增用户（人）</span>
                                        <span>{{userTotal.monthCount}}</span>
                                    </div>
                                    <div class="flex-col flex-center" style="padding:10px">
                                        <span>今日新增用户（人）</span>
                                        <span>{{userTotal.dayCount}}</span>
                                    </div>
                                </div>
                            </div>
                            <echartLine :echart="this.lineData"></echartLine>
                        </div>
                        <div style="width:50%;">
                            <div style="padding-left:15px;">奖励统计</div>
                            <div class="flex-align flex-col" style="font-size:14px;font-weight:bold;text-align:center;">
                                <div class="flex-col flex-align" style="padding:10px;">
                                    <span>奖励总量（SMRI）</span>
                                    <span>{{award.sum}}</span>
                                </div>
                                <div class="flex-row" style="border-top:1px solid #dddee1;">
                                    <div class="flex-col flex-center" style="border-right:1px solid #dddee1;padding:10px">
                                        <span>注册奖励（SMRI）</span>
                                        <span>{{award.check}}</span>
                                    </div>
                                    <div class="flex-col flex-center" style="padding:10px;border-right:1px solid #dddee1;">
                                        <span>好友奖励（SMRI）</span>
                                        <span>{{award.friend}}</span>
                                    </div>
                                    <div class="flex-col flex-center" style="padding:10px">
                                        <span>持币收益（SMRI）</span>
                                        <span>{{award.user}}</span>
                                    </div>
                                </div>
                            </div>
                            <echartPie :data="this.pieData.data"></echartPie>
                        </div>
                    </div>
                    <div class="flex-row" style="border-bottom:1px solid #dddee1;">
                        <div style="width:50%;border-right:1px solid #dddee1;padding-top:15px;">
                            <div>转账统计</div>
                            <div class="flex-align flex-col" style="font-size:14px;font-weight:bold;text-align:center;margin-top:30px;">
                                <div class="flex-row" style="border-top:1px solid #dddee1;">
                                    <div class="flex-col flex-center" style="border-right:1px solid #dddee1;padding:10px;color:#EECB5F">
                                        <span style="">内部转账（SMRI）</span>
                                        <span>{{countUserList.inCounts}}</span>
                                    </div>
                                    <div class="flex-col flex-center" style="border-right:1px solid #dddee1;padding:10px;color:#7ECF51">
                                        <span  style="">外部转账（SMRI）</span>
                                        <span>{{countUserList.outCounts}}</span>
                                    </div>
                                    <div class="flex-col flex-center" style="padding:10px;color:#61A5E8">
                                        <span style="">矿工费（SMRI）</span>
                                        <span>{{countUserList.feeCounts}}</span>
                                    </div>
                                </div>
                            </div>
                            <echartLine :echart="this.line1Data"></echartLine>
                        </div>
                        <div style="width:50%;padding-top:15px;">
                            <div style="padding-left:15px;">闪兑统计</div>
                            <div class="flex-align flex-col" style="font-size:14px;font-weight:bold;text-align:center;margin-top:30px;">
                                <div class="flex-row" style="border-top:1px solid #dddee1;">
                                    <div class="flex-col flex-center" style="border-right:1px solid #dddee1;padding:10px;color:#EECB5F">
                                        <span>内兑换（SMRI）</span>
                                        <span>{{countUserList1.inCounts}}</span>
                                    </div>
                                    <div class="flex-col flex-center" style="padding:10px;border-right:1px solid #dddee1;color:#7ECF51">
                                        <span>外兑换（SMRI）</span>
                                        <span>{{countUserList1.outCounts}}</span>
                                    </div>
                                    <div class="flex-col flex-center" style="padding:10px;color:#61A5E8">
                                        <span>矿工费（SMRI）</span>
                                        <span>{{countUserList1.feeCounts}}</span>
                                    </div>
                                </div>
                            </div>
                            <echartLine :echart="this.line2Data"></echartLine>
                        </div>
                        
                    </div>
                </el-card>
                
                <router-view style="flex: 1;background-color: #f8f8f9;overflow: auto">
                    
                </router-view>
               
               
            </div>

        </div>
    </div>
</template>

<script>
import echarts  from 'echarts';
import util from '../util/utils.js';
import navMenu from "../components/navMenu";
import echartLine from "../components/line";
import echartPie from "../components/pie";
export default {
    name: "index",
    data() {
        return {
            userTotal:{},
            user:{
                admin: "",
                userId:'',
            },
            award:{},
            countUserList:{},
            countUserList1:{},
            lastTime:'',
            currentTime:'',
            lastIP:'10.10.10.10',
            isHome:false,
            lineData:{
                title:'',
                id:'line',
                height:'300px',
                data:[],
                xData:['一月', '二月', '三月', '四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                yData:[],
                y1Data:[],
                y2Data:[],
                y3Data:[],
            },
            line1Data:{
                title:'',
                id:'line1',
                height:'400px',
                in:'内部转账',
                out:'外部转账',
                xData:['一月', '二月', '三月', '四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                yData:[],
                y1Data:[],
                y2Data:[],
                y3Data:[],
            },
            line2Data:{
                title:'',
                id:'line2',
                height:'400px',
                in:'内兑换',
                out:'外兑换',
                xData:['一月', '二月', '三月', '四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                yData:[],
                y1Data:[],
                y2Data:[],
                y3Data:[],
            },
            pieData:{
                data:[]
            }
        };
    },
    created() {
        this.user = util.getStorage('session','user');
        this.lastTime = this.user.time;
        var currentTime =  util.getStorage('session','currentTime')
        this.currentTime = util.fillerTime(currentTime)
       
    },
    mounted(){
         this.getBread();
        this.vip() //会员
        this.awards() //奖励
        this.transfer() //转账
        this.sandui() //闪兑
    },
    watch: {
        $route() {
            this.getBread();
        },
    },
 
    methods: {
        vip(){
            this.$http({
                method: "POST",
                url: $fn.apiHost2+"/web/user/userCount",
            }).then(res => {
                console.log(res,'vip统计');
                this.$nextTick(e=>{
                    this.userTotal = res.data.result.countUserList
                    this.lineData.data = res.data.result.months
                })
            });
        },
        awards(){
            this.$http({
                method: "POST",
                url: $fn.apiHost2+"/web/walletRewardRecord/getRecord",
            }).then(res => {
                console.log(res,'奖励统计');
                this.$nextTick(e=>{
                    console.log('zgh')
                    this.award = res.data.result
                    this.pieData.data.push({
                        name:'注册奖励',
                        value:res.data.result.check
                    },{
                        name:'好友奖励',
                        value:res.data.result.friend
                    },{
                        name:'持币收益',
                        value:res.data.result.user
                    },)
                })
            });
        },
        transfer(){
             this.$http({
                method: "POST",
                url: $fn.apiHost2+"/web/walletTransferRecord/getTransferCount",
            }).then(res => {
                console.log(res,'转账统计');
                this.$nextTick(e=>{
                    this.countUserList = res.data.result.countUserList
                    this.line1Data.y1Data = res.data.result.inList
                    this.line1Data.y2Data = res.data.result.outList
                    this.line1Data.y3Data = res.data.result.chargeList
                })
            });
        },
        sandui(){
            this.$http({
                method: "POST",
                url: $fn.apiHost2+"/web/walletExchangeRecord/getExchangeRecord",
            }).then(res => {
                console.log(res,'闪兑统计');
                this.$nextTick(e=>{
                    this.countUserList1 = res.data.result.countUserList
                    this.line2Data.y1Data = res.data.result.inList
                    this.line2Data.y2Data = res.data.result.outList
                    this.line2Data.y3Data = res.data.result.chargeList
                })
            });
        },
        getBread() {
            if (this.$route.name != "首页") {
                this.isHome = false
                const config = {
                    name: this.$route.meta.name,
                    subName: this.$route.name
                };
                this.$store.commit("addListData", config);
            } else {
                this.isHome = true
                this.$store.commit("clearListData", true);
            }
        },
        loginOut() {
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysUser/signout",
            }).then(res => {
                console.log(res);
                if(res.data.code == 200){
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.$router.push({path:'/'})
                    sessionStorage.clear('user')
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
                
            });
        }
    },

    components: {
        navMenu,echartLine,echartPie
    }
};
</script>
<style lang="less">
#index {
    width: 100%;
    height: 100%;
    background: #fff;
    #head {
        background: #1f2d3d;
        height: 64px;
        border-bottom: 1px solid #dddee1;
        justify-content: space-between;
    }
}
#navMenu {
    width: 200px;
    height: 100%;
}
.box-card{
    overflow: auto;
}
</style>
<style scoped lang="less">
.title {
    width: 180px;
    margin-left: 10px;
    height: 48px;
    font-size: 16px;
    letter-spacing: 2px;
    text-align: center;
    color: #ffd04b;
    border-radius: 5px;
    line-height: 48px;
}

</style>
