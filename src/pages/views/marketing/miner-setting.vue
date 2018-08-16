<template>
    <div class="miner">
        <el-card style="margin:15px;">
            <h4 style="margin:10px auto 0 10px;">转账矿工费</h4>
            <hr class="hr">
            <div>
                用户在本平台发起转账时，矿工费可选取区间为
                <el-input v-model="get.minTran" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;SMRI ~
                 <el-input v-model="get.maxTran" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;SMRI
               <!-- 其中默认矿工费为
                <el-input v-model="get.gasPrice" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;SMRI -->
            </div>
            <div style="float:right">
                <el-button size="small" style="background:#7AC9FB;color:#000" @click="setTransferMiner">保存</el-button>
            </div>

        </el-card>
        <el-card style="margin:15px;">
            <h4 style="margin:10px auto 0 10px;">闪兑矿工费</h4>
            <hr class="hr"> 
             <div style="margin:15px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='EXCHANGE_TAB_RATE'">
            用户在本平台进行SMRI闪兑外币时，矿工费收取为兑换SMRI的
            <el-input v-model="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;%
             <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
             </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            get:{},
            listData:[],
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.init1();
            this.init2(); //闪兑
        },
        init1() {
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/walletBase/getTransferTab"
            }).then(res => {
                console.log(res, "矿工费列表");
                this.get = res.data.result;
              
            });
        },
        setTransferMiner(){
            var params = {
                id:this.get.walletTransferTabId,
                    gasPrice:this.get.gasPrice,
                    minTran:this.get.minTran,
                    maxTran:this.get.maxTran,
                    coinType:'SMRI',
                    operation:'admin',
                    type:'edit'
            }
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/walletBase/setTransferTab",
                params:params
            }).then(res => {
                console.log(res, "设置列表");
               if(res.data.code ==200){
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.init1()
               }
            });
        },  
        init2() {
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysConfig/queryList"
            }).then(res => {
                console.log(res, "三队列表");
                this.listData = res.data.result;
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
    }
};
</script>
<style scoped>
.edit_item span {
    font-weight: bold;
}
</style>
