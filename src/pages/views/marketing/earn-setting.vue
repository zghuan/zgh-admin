<template>
    <div class="miner">
        <el-card style="margin:15px;">
            <h4>好友奖励</h4>
            <hr class="hr">
            <div style="margin:15px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='A_REWARD_SCALE'">
                <span style="font-weight:bold;">投资时A奖励</span>&nbsp; 当下级好友在平台进行外币兑换SMRI时该类好友将获得好友兑换所得的SMRI数量*
                <el-input v-model.number="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;%
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
            </div>
            <div style="margin:15px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='B_REWARD_SCALE'">
                <span style="font-weight:bold;">投资时B奖励</span>&nbsp; 当下级好友在平台进行外币兑换SMRI时该类好友将获得好友兑换所得的SMRI数量*
                <el-input v-model.number="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;%
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
            </div>
            <div style="margin:15px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='C_REWARD_SCALE'">
                <span style="font-weight:bold;">投资时C奖励</span>&nbsp; 当下级好友在平台进行外币兑换SMRI时该类好友将获得好友兑换所得的SMRI数量*
                <el-input v-model.number="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;%
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
            </div>
            <div style="margin:15px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='SECOND_FRIEND_REWARD'">
                <span style="font-weight:bold;">投资时上二级奖励</span>&nbsp; 当下级好友在平台进行外币兑换SMRI时该类好友将获得好友兑换所得的SMRI数量*
                <el-input v-model.number="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;%
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
            </div>
            <div style="margin:15px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='FIRST_FRIEND_REWARD'">
                <span style="font-weight:bold;">投资时上一级奖励</span>&nbsp; 当下级好友在平台进行外币兑换SMRI时该类好友将获得好友兑换所得的SMRI数量*
                <el-input v-model.number="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp; %
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
            </div>
            <div style="margin:15px auto;">
                <span style="font-weight:bold;">注册奖励</span>&nbsp; 用户以注册之日起连续登陆
                <el-input v-model.number="day" size="small" placeholder=" " style="width: 100px" clearable></el-input> 天，将获得
                <el-input v-model.number="value" size="small" placeholder=" " style="width: 100px" clearable></el-input> SMRI
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="settingRegister(day,value)">修改</el-button>
            </div>
        </el-card>
        <el-card style="margin:15px;">
            <h4>持币收益</h4>
            <hr class="hr">
            <div style="margin:10px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='FREEZE_REWARD'">
                <span style="font-weight:bold;">持币收益</span>&nbsp; 用户在本平台持有锁仓SMRI事，每日将获得持有锁仓SMRI的
                <el-input v-model.number="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input> %为收益奖励
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
            </div>
        </el-card>
        <!-- <div class="flex-start">
            <el-button size="small" class="btn" @click="zero" style="margin-left:15px;">归零</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button size="small" class="btn" @click="keep">保存</el-button>
        </div> -->

    </div>
</template>
<script>
export default {
    data() {
        return {
            ad: "",
            list: {},
            listData: [],
            day:'',
            dayId:'',
            value:'',
            valueId:'',
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysConfig/queryList"
            }).then(res => {
                console.log(res, "设置列表");
                this.listData = res.data.result;
                this.listData.forEach((e,i)=>{
                    if(e.configKey == 'CONSECUTIVE_DAY_NUMBER'){
                        this.day = e.configValue
                        this.dayId = e.sysConfigId
                        console.log(this.day)
                    }
                   if(e.configKey == 'CONSECUTIVE_DAY_REWARD'){
                        this.value = e.configValue
                         this.valueId = e.sysConfigId
                        console.log(this.value)
                    }
                })
            });
        },
        setting(id, value) {
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/sysConfig/updateSysConfig",
                params: {
                    id: id,
                    configValue: value,
                    operation: "admin"
                }
            }).then(res => {
                console.log(res, "设置成功？");
               if(res.data.code == 200 ){
                   this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.init()
               }else{
                   this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                    this.init()
               }
            });
        },
        settingRegister(day,value){
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/sysConfig/updateSysConfig",
                params: {
                    id: this.valueId,
                    configValue: value,
                    operation: "admin"
                }
            }).then(res => {
            });
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/sysConfig/updateSysConfig",
                params: {
                    id: this.dayId,
                    configValue: day,
                    operation: "admin"
                }
            }).then(res => {
                console.log(res, "设置成功？");
               if(res.data.code == 200 ){
                   this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.init()
               }else{
                   this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                    this.init()
               }
            });
        }
    }
};
</script>
<style scoped>
.edit_item span {
    font-weight: bold;
}
</style>
