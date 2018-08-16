<template>
    <div class="user-list">
        <el-card class="box-card">
            <h2>币种列表</h2>
            <!-- <el-input v-model="search" size="small" placeholder="币种代称" style="width: 200px" clearable></el-input> -->
            <!-- <el-button size="small" style="background:#7AC9FB;color:#000">搜索</el-button> -->
            <hr style="border:none;height:1px;background:#f8f8f9;margin:10px 0 ;">
            <el-table :data="tableData" style="width: 100%;margin-top:15px;" border stripe>
                <el-table-column prop="enName" label="币种图片" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.icon" alt="" style="width:55px;height:55px;">
                    </template>
                </el-table-column>
                <el-table-column prop="enName" label="币种代称" align="center">
                </el-table-column>
                <el-table-column prop="cny" label="市场价值（≈元）" align="center">
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="zgh">
                        <span :style="{color:zgh.row.tbStatus=='正常'?'green':'red'}">{{zgh.row.tbStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="freeze(scope.$index, scope.row)" v-if="scope.row.tbStatus=='正常'">冻结</el-button>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="freeze(scope.$index, scope.row)" v-else>解冻</el-button>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="lookEdit(scope.$index, scope.row)">查看编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div style="margin-top:15px;text-align:center">
                <el-pagination @size-change="changePage" @current-change="changeCurrent" :current-page="page" :page-size="limit" prev-text="上一页" next-text="下一页" layout="total, prev, next,jumper" :total="total">
                </el-pagination>
            </div> -->
        </el-card>
        <!-- 查看编辑 -->
        <el-dialog title="查看编辑" :visible.sync="editModal" width="30%" @close="cancel">
            <el-form :model="edit" label-position="right" label-width="100px">
                <el-form-item label="币种代称">
                    <el-input v-model="edit.enName" auto-complete="off" placeholder="SMRI" style="width:200px;" disabled></el-input>
                </el-form-item>
                <el-form-item label="市场价值">
                    <el-input v-model="edit.cny" auto-complete="off" :placeholder="edit.cny" style="width:200px;"></el-input>&nbsp;&nbsp;元
                </el-form-item>
                <!-- <el-form-item label="状态">
                    <el-radio-group v-model="edit.tbStatus">
                        <el-radio label="正常">正常</el-radio>
                        <el-radio label="冻结">冻结</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <!-- <el-form-item label="币种图片">
                    <img :src="edit.icon" alt="" style="width:55px;height:55px;">
                    <input type="file" accept="image/*" @change="changeImage" id="input">
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editModal = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
export default {
    data() {
        return {
            page: 1,
            file: "",
            limit: 10,
            search: "",
            radio: "正常",
            editModal: false,
            status: null,
            edit: {},
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
                url: $fn.apiHost1 + "/web/walletCoinType/getWalletCoinType"
            }).then(res => {
                console.log(res, "币种列表");
                this.tableData = res.data.result;
            });
        },
        lookEdit(i, row) {
            this.editModal = true;
            this.edit = row;
            console.log(i, row);
        },
        cancel() {
            this.init();
        },

        editUser() {
            this.$http({
                method: "POST",
                url: $fn.apiHost1 + "/web/walletCoinType/addWalletCoinType",
                params: {
                    enName:this.edit.enName,
                    cny:this.edit.cny,
                    operation:'admin',
                    type:'edit'
                }
            }).then(res => {
                console.log(res, "修改币种");
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    //this.init();
                    this.editModal = false;
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
            });
        },
        changeImage(e) {
            this.file = e.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(this.file);
            var that = this;
            reader.onload = function(e) {
                that.edit.icon = e.target.result;
                document.getElementById("input").value = "";
            };
        },
        freeze(i, row) {
            console.log(i, row);
            this.$confirm(
                `你正在操作<span style='color:red'>冻结${
                    row.cnName
                }</span>币，冻结后平台用户将无法在本平台进行该币的任何交易，请你仔细确认`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    dangerouslyUseHTMLString: true,
                    type: "warning",
                    center: true
                }
            ).then(() => {
                this.deleteCoin(row);
            });
        },
        deleteCoin(row) {
            console.log(row, "zgh");
            if (row.tbStatus == "正常") {
                this.status = "删除";
            } else {
                this.status = "正常";
            }
            this.$http({
                method: "POST",
                url: $fn.apiHost1 + "/web/walletCoinType/delWalletCoinType",
                params: {
                    coinType: row.enName,
                    status: this.status,
                    operation: "admin"
                }
            }).then(res => {
                console.log(res, "冻结币种");
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
                }
            });
        }
    }
};
</script>
<style>
.el-upload--picture-card {
    display: flex;
    align-items: center;
    justify-content: center;
}
#input{
    position: absolute;
    width: 55px;height: 55px;
    left: 0;
    opacity: 0;
}
</style>
