<template>
    <div class="kg">
        <!-- <el-button size="small" style="background:#7AC9FB;color:#000;margin-left:15px;margin-top:15px;" @click="addModal = true">新增区间</el-button> -->
        <!-- 转账 -->
        <el-card style="margin:15px;">
            <h4 style="margin:10px auto 0 10px;">转账设置</h4>
            <hr class="hr">
            <div style="margin:15px auto;font-size:14px;" v-for="(list,index) in transData" :key="list.id">
                用户持有SMRI数量达到&nbsp;
                <el-input v-model="list.minTran" size="small" placeholder=" " style="width: 100px" clearable></el-input> &nbsp;~ &nbsp;
                <el-input v-model="list.maxTran" size="small" placeholder=" " style="width: 100px" clearable></el-input>
                &nbsp;SMRI时， 用户每日可转账数量为
                <el-input v-model="list.value" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;&nbsp;
                <i class="el-icon-check" @click="addUser(list.minTran,list.maxTran,list.value,index,'转账')" style="margin-right:10px;" v-if="list.mark==true"></i>
                <i class="el-icon-close" @click="close(index,'转账设置')" style="margin-right:10px;" v-if="list.mark==true"></i>
                <i class="el-icon-edit" @click="edit(list.walletTradeLimitId,list.coinType,list.type,list.value,list.minTran,list.maxTran)" style="margin-right:10px;" v-if="!list.mark==true"></i>
                <i class="el-icon-delete" @click="del(list.walletTradeLimitId,list.coinType,list.type)" v-if="index!==0&&!list.mark==true"></i>
            </div>
            <div style="margin-top:15px;">
                <el-button size="small" @click="adds('转账设置')" class="btn">继续添加</el-button>
            </div>
        </el-card>
        <!-- 闪兑 -->
        <el-card style="margin:15px;">
            <h4 style="margin:10px auto 0 10px;">闪兑设置</h4>
            <div style="margin:15px auto;font-size:14px;" v-for="(list,index) in sanduiData" :key="list.id">
                用户持有SMRI数量达到&nbsp;
                <el-input v-model="list.minTran" size="small" placeholder=" " style="width: 100px" clearable></el-input> &nbsp;~ &nbsp;
                <el-input v-model="list.maxTran" size="small" placeholder=" " style="width: 100px" clearable></el-input>
                &nbsp;SMRI时， 用户每日可转账数量为
                <el-input v-model="list.value" size="small" placeholder=" " style="width: 100px" clearable></el-input>&nbsp;&nbsp;
                <i class="el-icon-check" @click="addUser(list.minTran,list.maxTran,list.value,index,'闪兑')" style="margin-right:10px;" v-if="list.mark==true"></i>
                <i class="el-icon-close" @click="close(index,'闪兑设置')" style="margin-right:10px;" v-if="list.mark==true"></i>
                <i class="el-icon-edit" @click="edit(list.walletTradeLimitId,list.coinType,list.type,list.value,list.minTran,list.maxTran)" style="margin-right:10px;" v-if="!list.mark==true"></i>
                <i class="el-icon-delete" @click="del(list.walletTradeLimitId,list.coinType,list.type,list.operationType)" v-if="index!==0&&!list.mark==true"></i>
            </div>
            <div style="margin-top:15px;">
                <el-button size="small" @click="adds('闪兑设置')" class="btn">继续添加</el-button>
            </div>
        </el-card>
        <!-- 新增区间 -->
        <el-dialog title="新增区间" :visible.sync="addModal" width="30%" @close="cancel">
            <el-form :model="add" label-position="right" label-width="100px">
                <el-form-item label="默认值">
                    <el-input v-model.number="add.value" auto-complete="off" placeholder="区间对应得值" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="最小值">
                    <el-input v-model.number="add.minTran" auto-complete="off" placeholder="最小值" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="最大值">
                    <el-input type="maxTran" v-model.number="add.maxTran" auto-complete="off" placeholder="最大值" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="交易类型">
                    <el-select v-model="add.type" placeholder="请选择" style="width:200px;">
                        <el-option label="转账" value="转账"></el-option>
                        <el-option label="闪兑" value="闪兑"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addModal = false">取 消</el-button>
                <el-button type="primary" @click="addUser">添 加</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import util from "../../../util/utils.js";
export default {
    data() {
        return {
            addModal: false,
            add: {},
            transData: [],
            sanduiData: []
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/walletBase/getTradeLimit"
            }).then(res => {
                console.log(res, "出账设置");
                this.transData = util.sort(
                    res.data.result.filter(e => {
                        return e.type == "转账";
                    })
                );
                this.sanduiData = util.sort(
                    res.data.result.filter(e => {
                        return e.type == "闪兑";
                    })
                );
            });
        },
        adds(e) {
            if (e == "转账设置") {
                this.transData.push({
                    minTran: "",
                    maxTran: "",
                    value: "",
                    mark: true
                });
            } else {
                this.sanduiData.push({
                    minTran: "",
                    maxTran: "",
                    value: "",
                    mark: true
                });
            }
        },
        close(i, type) {
            console.log(type);
            if ((type == "转账设置")) {
                this.transData.splice(i, 1);
            } else {
                this.sanduiData.splice(i, 1);
            }
        },
        addUser(min, max, value, i, type) {
            (this.add.minTran = min),
            (this.add.maxTran = max),
            (this.add.value = value),
            (this.add.type = type),
            (this.add.operationType = "add");
            this.add.operation = "admin";
            this.add.coinType = "SMRI";

            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/walletBase/setTradeLimit",
                params: this.add
            }).then(res => {
                console.log(res, "新增设置");
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.addModal = false;

                    setTimeout(e => {
                        this.init();
                    }, 1000);
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
            });
        },
        edit(id, coinType, type, value, min, max) {
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/walletBase/setTradeLimit",
                params: {
                    id: id,
                    coinType: coinType,
                    type: type,
                    operationType: "edit",
                    operation: "admin",
                    value: value,
                    minTran: min,
                    maxTran: max
                }
            }).then(res => {
                console.log(res, "删除设置");
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    setTimeout(e => {
                        this.init();
                    }, 1000);
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
            });
        },
        del(id, coinType, type) {
            this.$confirm("是否确定删除该区间？", {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                console.log(id, "zgh");
                this.delTradeLimit(id, coinType, type);
            });
        },
        delTradeLimit(id, coinType, type) {
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/walletBase/setTradeLimit",
                params: {
                    id: id,
                    coinType: coinType,
                    type: type,
                    operationType: "delete",
                    operation: "admin"
                }
            }).then(res => {
                console.log(res, "删除设置");
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    setTimeout(e => {
                        this.init();
                    }, 1000);
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
            });
        },
        cancel() {
            this.init();
        }
    }
};
</script>
<style scoped>
i.el-icon-edit::before {
    cursor: pointer;
}
.edit_item span {
    font-weight: bold;
}
</style>
