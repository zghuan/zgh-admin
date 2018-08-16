<template>
    <div class="user-list">
        <el-card class="box-card">
            <el-input v-model="mobile" size="small" placeholder="手机号" style="width: 150px" clearable></el-input>
            <el-input v-model="address" size="small" placeholder="钱包地址" style="width: 150px" clearable></el-input>
            <el-select v-model="state" placeholder="交易状态" size="small" style="width: 100px">
                <el-option key="全部" label="全部" value=""></el-option>
                <el-option key="成功" label="成功" value="成功"></el-option>
                <!-- <el-option key="处理中" label="处理中" value="处理中"></el-option> -->
                <el-option key="失败" label="失败" value="失败"></el-option>
            </el-select>

            <el-date-picker v-model="beginDate" type="date" placeholder=" 开始日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" class="date">
            </el-date-picker>&nbsp;~
            <el-date-picker v-model="endDate" type="date" placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" class="date">
            </el-date-picker>
            <el-button size="small" class="btn" @click="search">搜索</el-button>
            <el-button size="small" class="btn" style="float:right" @click="exportList">导出列表</el-button>
            <hr class="hr">
            <el-table :data="tableData" style="width: 100%;margin-top:15px;" border stripe ref="table" id="table">
                <el-table-column prop="walletExchangeRecordId" label="编号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="userMobile" label="手机号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="walletAddress" label="钱包地址" align="center">
                </el-table-column>
               
                <el-table-column prop="fromCoinType" label="兑换币种" align="center">
                </el-table-column>
                <el-table-column prop="fromExchangeNum" label="兑换数量" align="center">
                </el-table-column>
                <el-table-column prop="toCoinType" label="兑换为币种" align="center">
                </el-table-column>
                <el-table-column prop="toExchangeNum" label="兑换所得数量" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="兑换时间" align="center">
                </el-table-column>
                <el-table-column label="交易状态" align="center">
                    <template slot-scope="zgh">
                        <span :style="{color:zgh.row.state=='成功'?'green':zgh.row.state=='失败'?'red':'blue'}">{{zgh.row.state}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="address" label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="lookEdit(scope.$index, scope.row)">查看编辑</el-button>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="walletDetail(scope.$index, scope.row)">钱包详情</el-button>
                    </template>
                </el-table-column> -->
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
            mobile: "",
            address: "",
            pageSize: 10,
            beginDate: null,
            endDate: null,
            state: "",
            radio: "正常",
            currentUser: "",
            tableData: [
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "正常"
                }
            ]
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.$http({
                method: "POST",
                url:
                    $fn.apiHost1 +
                    "/web/walletExchangeRecord/getWalletExchangeRecord",
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    state: this.state,
                    userMobile: this.mobile,
                    walletAddress: this.address,
                    beginDate: this.beginDate,
                    endDate: this.endDate
                }
            }).then(res => {
                console.log(res, "闪兑列表");
                this.tableData = res.data.result.selectList;
                this.total = res.data.result.count;
            });
        },
        search() {
            this.$http({
                method: "POST",
                url:
                    $fn.apiHost1 +
                    "/web/walletExchangeRecord/getWalletExchangeRecord",
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    state: this.state,
                    userMobile: this.mobile,
                    walletAddress: this.address,
                    beginDate: this.beginDate,
                    endDate: this.endDate
                }
            }).then(res => {
                console.log(res, "闪兑列表");
                this.tableData = res.data.result.selectList;
                this.total = res.data.result.count;
            });
        },
        changePage(page) {
            this.page = page
            this.$http({
                method: "POST",
                url:
                    $fn.apiHost1 +
                    "/web/walletExchangeRecord/getWalletExchangeRecord",
                params: {
                    page: page,
                    pageSize: this.pageSize,
                    state: this.state,
                    userMobile: this.mobile,
                    walletAddress: this.address,
                    beginDate: this.beginDate,
                    endDate: this.endDate
                }
            }).then(res => {
                console.log(res, "闪兑列表");
                this.tableData = res.data.result.selectList;
                this.total = res.data.result.count;
            });
        },
        changeCurrent(page) {
            this.page = page
            this.$http({
                method: "POST",
                url:
                    $fn.apiHost1 +
                    "/web/walletExchangeRecord/getWalletExchangeRecord",
                params: {
                    page:page,
                    pageSize: this.pageSize,
                    state: this.state,
                    userMobile: this.mobile,
                    walletAddress: this.address,
                    beginDate: this.beginDate,
                    endDate: this.endDate
                }
            }).then(res => {
                console.log(res, "闪兑列表");
                this.tableData = res.data.result.selectList;
                this.total = res.data.result.count;
            });
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return "background:#f8f8f9";
            } else {
                return "";
            }
        },
        exportList() {
            util.exportExcel(document.querySelector("#table"), "闪兑列表");
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
