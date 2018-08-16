<template>
    <div class="kg">
        <el-card style="margin:15px;">
            <h4 style="margin:10px auto 0 10px;">锁仓设置</h4>
            <hr class="hr">
            <div style="margin:15px auto;">
                当用户在本平台进行外币兑换SMRI时，所兑得SMRI&nbsp;
                <el-input v-model.number="value" size="small" placeholder=" " style="width: 100px" clearable></el-input> %为锁仓内正常释仓值
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(id,value)">修改</el-button>
            </div>
            <div style="margin:15px auto;">
                当用户在本平台进行外币兑换SMRI时，所兑得SMRI&nbsp;
                <el-input v-model.number="result" size="small" placeholder=" " style="width: 100px" clearable disabled></el-input> %为锁仓内可加速释仓值
            </div>
        </el-card>
        <el-card style="margin:15px;">
            <h4 style="margin:10px auto 0 10px;">释仓设置</h4>

            <hr class="hr">
            <div style="margin:15px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='UNFREEZE_NORMAL_RATE'">
                用户每笔锁仓资产的正常释仓值将按每月以每笔锁仓资产总额的&nbsp;
                <el-input v-model="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input> %为进行正常释仓
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
            </div>
            <div style="margin:15px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='UNFREEZE_SPEED_RATE'">
                用户每笔锁仓资产的可加速释仓值将按用户每次获得SMRI奖励的&nbsp;
                <el-input v-model="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input> % 进行加速释仓
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
            </div>
            <div style="margin:15px auto;" v-for="list in listData" :key="list.id" v-if="list.configKey =='PRIVATE_RATE'">
                用户持有的SMRI每天将以&nbsp;
                <el-input v-model="list.configValue" size="small" placeholder=" " style="width: 100px" clearable></el-input> % 进行比例释仓
                <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="setting(list.sysConfigId,list.configValue)">修改</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            value: "",
            id: "",
            listData: []
        };
    },
    computed: {
        result(e) {
            return 100 - this.value;
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.$http({
                method: "POST",
                url: $fn.apiHost2 + "/web/sysConfig/queryList"
            }).then(res => {
                console.log(res, "锁仓设置");
                this.listData = res.data.result;
                this.listData.forEach((e, i) => {
                    if (e.configKey == "WALLET_EXCHANGE_NORMAL") {
                        this.id = e.sysConfigId;
                        this.value = e.configValue;
                    }
                });
            });
        },
        setting(id, value) {
            this.$http({
                method: "POST",
                url: $fn.apiHost2 + "/web/sysConfig/updateSysConfig",
                params: {
                    id: id,
                    configValue: value,
                    operation: "admin"
                }
            }).then(res => {
                console.log(res, "设置成功？");
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.init();
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                    this.init();
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
