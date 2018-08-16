<template>
    <div class="user-feedback">
        <el-card class="box-card">
            <el-input v-model="mobile" size="small" placeholder="手机号" style="width: 150px" clearable></el-input>
            <el-input v-model="userName" size="small" placeholder="姓名" style="width: 150px" clearable></el-input>
            <el-input v-model="userAdvise" size="small" placeholder="反馈内容" style="width: 200px" clearable></el-input>
            <el-button size="small" class="btn" @click="search">搜索</el-button>
            <el-button size="small" class="btn" style="float:right" @click="exportList">导出列表</el-button>
            <hr class="hr">
            <el-table :data="tableData" style="width: 100%;margin-top:15px;" border stripe ref="table" id="table">
                <el-table-column prop="userMobile" label="手机号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="userName" label="姓名" align="center">
                </el-table-column>
                <el-table-column prop="userAdvise" label="反馈内容" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="反馈时间" align="center">
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="zgh">
                        <span :style="{color:zgh.row.tbStatus=='正常'?'green':'red'}">{{zgh.row.tbStatus}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="address" label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" class="btn" @click="lookEdit(scope.$index, scope.row)" v-if="reply">回复</el-button>
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
            pageSize:10,
            mobile: "",
            userName: "",
            userAdvise: "",
            tableData: []
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/web/userAdvise/getUserAdvise",
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    mobile: this.mobile,
                    userName: this.userName,
                    userAdvise: this.userAdvise
                }
            }).then(res => {
                console.log(res, "反馈列表");
                this.tableData = res.data.result.userList;
                this.total = res.data.result.count
            });
        },
        search() {
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/web/userAdvise/getUserAdvise",
                params: {
                    page: this.page,
                    pageSize: this.pageSize,
                    mobile: this.mobile,
                    userName: this.userName,
                    userAdvise: this.userAdvise
                }
            }).then(res => {
                console.log(res, "反馈列表");
                this.tableData = res.data.result.userList;
            });
        },
        changePage(page) {
            this.page = page
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/web/userAdvise/getUserAdvise",
                params: {
                    page: page,
                    pageSize: this.pageSize,
                    mobile: this.mobile,
                    userName: this.userName,
                    userAdvise: this.userAdvise
                }
            }).then(res => {
                console.log(res, "分页反馈列表");
                this.tableData = res.data.result.userList;
                this.total = res.data.result.count
            });
        },
        changeCurrent(page) {
            this.page = page
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/web/userAdvise/getUserAdvise",
                params: {
                    page: page,
                    pageSize: this.pageSize,
                    mobile: this.mobile,
                    userName: this.userName,
                    userAdvise: this.userAdvise
                }
            }).then(res => {
                console.log(res, "反馈列表");
                this.tableData = res.data.result.userList;
                this.total = res.data.result.count
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
            util.exportExcel(document.querySelector("#table"), "意见反馈列表");
        }
    }
};
</script>
<style scoped>
.edit_item span {
    font-weight: bold;
}
</style>
