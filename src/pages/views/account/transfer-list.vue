<template>
    <div class="user-list">
        <el-card class="box-card">
            <el-input v-model="fromUserMobile" size="small" placeholder="转账人手机号" style="width: 150px" clearable></el-input>
            <el-input v-model="fromWalletAddress" size="small" placeholder="转账地址" style="width: 200px" clearable></el-input>
            <el-input v-model="toUserMobile" size="small" placeholder="收款人手机号" style="width: 150px" clearable></el-input>
            <el-input v-model="toWalletAddress" size="small" placeholder="收款人地址" style="width: 200px" clearable></el-input>
            <el-select v-model="state" placeholder="交易状态" size="small" style="width: 100px">
                <el-option key="全部" label="全部" value=" "></el-option>
                <el-option key="成功" label="成功" value="成功"></el-option>
                <!-- <el-option key="处理中" label="处理中" value="处理中"></el-option> -->
                <el-option key="失败" label="失败" value="失败"></el-option>
            </el-select>
            <el-date-picker v-model="beginDate" type="date" placeholder="开始日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" class="date">
            </el-date-picker>&nbsp;~
            <el-date-picker v-model="endDate" type="date" placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" class="date">
            </el-date-picker>
            <el-button size="small" class="btn" @click="search">搜索</el-button>
            <el-button size="small" class="btn" style="float:right" @click="exportList">导出列表</el-button>
            <hr class="hr">
            <el-table :data="tableData" style="width: 100%;margin-top:15px;" border stripe ref="table" id="table">
                <el-table-column prop="walletTransferRecordId" label="编号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="fromUserMobile" label="转账人手机号" width="120" align="center">
                </el-table-column>
                <el-table-column prop="fromWalletAddress" label="转账地址" align="center">
                </el-table-column>
                <el-table-column prop="toUserMobile" label="收款人手机号" align="center" >
                </el-table-column>
                <el-table-column prop="toWalletAddress" label="收款地址" align="center">
                </el-table-column>
                <el-table-column prop="coinType" label="币种" align="center">
                </el-table-column>
                <el-table-column prop="transferAmount" label="交易数量" align="center">
                </el-table-column>
                <el-table-column prop="transferCharge" label="矿工费/SMRI" align="center">
                </el-table-column>
                <el-table-column prop="address" label="哈希值" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="交易时间" align="center">
                </el-table-column>
                <el-table-column label="交易状态" align="center">
                    <template slot-scope="zgh">
                        <span :style="{color:zgh.row.state=='成功'?'green':zgh.row.state=='失败'?'red':'blue'}">{{zgh.row.state}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top:15px;text-align:center">
                <el-pagination @size-change="changePage" @current-change="changeCurrent" :current-page="page" :page-size="pageSize" prev-text="上一页" next-text="下一页" layout="total, prev, next,jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
import util from "../../../util/utils.js";
export default {
    data() {
        return {
            page: 1,
            total: null,
            pageSize: 10,
            currentUser: "",
            state: "",
            beginDate: null,
            endDate: null,
            tableData: [],
            fromUserMobile: "",
            fromWalletAddress: "",
            toUserMobile: "",
            toWalletAddress: ""
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.$http({
                method: "POST",
                url: $fn.apiHost1 +"/web/walletTransferRecord/getTransferRecord",
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    fromUserMobile: this.fromUserMobile,
                    fromWalletAddress: this.fromWalletAddress,
                    toUserMobile: this.toUserMobile,
                    toWalletAddress: this.toWalletAddress,
                    state: this.state,
                    beginDate:this.beginDate,
                    endDate:this.endDat,
                }
            }).then(res => {
                console.log(res, "转账列表");
                this.total = res.data.result.count
                this.tableData = res.data.result.selectList;
            });
        },
        changePage(page) {
            this.page = page
            this.$http({
                method: "POST",
                url: $fn.apiHost1 +"/web/walletTransferRecord/getTransferRecord",
                params: {
                    page: page,
                    pageSize: this.pageSize,
                    fromUserMobile: this.fromUserMobile,
                    fromWalletAddress: this.fromWalletAddress,
                    toUserMobile: this.toUserMobile,
                    toWalletAddress: this.toWalletAddress,
                    state: this.state,
                    beginDate:this.beginDate,
                    endDate:this.endDate,
                }
            }).then(res => {
                console.log(res, "搜索转账列表");
                this.total = res.data.result.count
                this.tableData = res.data.result.selectList;
            });
        },
        changeCurrent(page) {
            this.page = page
            this.$http({
                method: "POST",
                url: $fn.apiHost1 +"/web/walletTransferRecord/getTransferRecord",
                params: {
                    page:page,
                    pageSize: this.pageSize,
                    fromUserMobile: this.fromUserMobile,
                    fromWalletAddress: this.fromWalletAddress,
                    toUserMobile: this.toUserMobile,
                    toWalletAddress: this.toWalletAddress,
                    state: this.state,
                    beginDate:this.beginDate,
                    endDate:this.endDate,
                }
            }).then(res => {
                console.log(res, "搜索转账列表");
                this.total = res.data.result.count
                this.tableData = res.data.result.selectList;
            });
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return "background:#f8f8f9";
            } else {
                return "";
            }
        },
        search(){
            this.$http({
                method: "POST",
                url: $fn.apiHost1 +"/web/walletTransferRecord/getTransferRecord",
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    fromUserMobile: this.fromUserMobile,
                    fromWalletAddress: this.fromWalletAddress,
                    toUserMobile: this.toUserMobile,
                    toWalletAddress: this.toWalletAddress,
                    state: this.state,
                    beginDate:this.beginDate,
                    endDate:this.endDate,
                }
            }).then(res => {
                console.log(res, "搜索转账列表");
                this.total = res.data.result.count
                this.tableData = res.data.result.selectList;
            });
        },
        exportList() {
            util.exportExcel(document.querySelector("#table"), "转账列表");
        }
    }
};
</script>
<style scoped lang="less">
.edit_item span {
    font-weight: bold;
}
.date {
    width: 150px;
    height: 32px;
}
</style>
<style lang="less">
.date {
    .el-input__inner {
        height: 32px;
    }
    .el-input__icon {
        line-height: 32px;
    }
}
</style>
