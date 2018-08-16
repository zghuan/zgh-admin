<template>
    <div class="user-list">
        <el-card class="box-card">
            <el-button size="small" style="background:#7AC9FB;color:#000;" @click="addModal = true">发布新版本</el-button>
            <el-table :data="tableData" style="width: 100%;margin-top:15px;" border stripe :default-sort="{prop: 'createTime', order: 'descending'}">
                <el-table-column prop="sysAppVersionId" label="编号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="clientType" label="客户端类型" width="180" align="center">
                </el-table-column>
                <el-table-column prop="appVersion" label="版本号" align="center">
                </el-table-column>
                <el-table-column prop="addContent" label="版本内容" align="center">
                </el-table-column>
                <el-table-column label="是否强制更新" align="center">
                    <template slot-scope="zgh">
                        <span :style="{color:zgh.row.isUpdate=='1'?'red':'green'}">{{zgh.row.isUpdate|filterType}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发布时间" align="center" sortable>
                </el-table-column>
                <el-table-column prop="action" label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="lookEdit(scope.$index, scope.row)">查看编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top:15px;text-align:center">
                <el-pagination @size-change="changePage" @current-change="changeCurrent" :current-page="page" :page-size="limit" prev-text="上一页" next-text="下一页" layout="total, prev, next,jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 发布新版本 -->
        <el-dialog title="发布新版本" :visible.sync="addModal" width="50%">
            <el-form :model="add" label-position="right" label-width="100px">
                <el-form-item label="客户端类型">
                    <el-select v-model="add.clientType" placeholder="请选择" size="small" style="width: 200px">
                        <el-option key="ios" label="ios" value="ios"></el-option>
                        <el-option key="android" label="android" value="android"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本号">
                    <el-input v-model="add.appVersion" auto-complete="off" placeholder="请输入版本号，如1.0" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="是否强制更新">
                    <el-radio-group v-model="add.isUpdate">
                        <el-radio label="1" value="1">是</el-radio>
                        <el-radio label="-1" value="-1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="更新内容">
                    <el-input type="textarea" v-model="add.addContent" placeholder="更新内容" style="width:400px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addModal = false">取 消</el-button>
                <el-button type="primary" @click="app">发 布</el-button>
            </div>
        </el-dialog>
        <!-- 发编辑 -->
        <el-dialog title="编辑" :visible.sync="editModal" width="50%" @close="cancel">
            <el-form :model="edit" label-position="right" label-width="100px">
                <el-form-item label="客户端类型">
                    <el-select v-model="edit.clientType" placeholder="请选择" size="small" style="width: 200px">
                        <el-option key="ios" label="ios" value="ios"></el-option>
                        <el-option key="android" label="android" value="android"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本号">
                    <el-input v-model="edit.appVersion" auto-complete="off" placeholder="请输入版本号，如1.0" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="是否强制更新">
                    <el-radio-group v-model="edit.isUpdate">
                        <el-radio label="1" value="1">是</el-radio>
                        <el-radio label="-1" value="-1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="更新内容">
                    <el-input type="textarea" v-model="edit.addContent" placeholder="更新内容" style="width:400px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editModal = false">取 消</el-button>
                <el-button type="primary" @click="update">更 新</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import util from "../../../util/utils.js";
export default {
    data() {
        return {
            page: 1,
            total: null,
            limit: 10,
            search: "",
            select: "",
            addModal: false,
            editModal: false,
            radio: "否",
            add: {
                clientType: "",
                appVersion: "",
                isUpdate: "",
                addContent: ""
            },
            edit: {},
            tableData: [],
            mark: false,
            marks: false
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysAppVersion/getAppVersionList",
                params: {
                    page: this.page,
                    limit: this.limit,
                    sign: $fn.sign
                }
            }).then(res => {
                console.log(res, "app分页查询");
                this.tableData = res.data.result.records;
                this.total = res.data.result.total;
            });
        },
        app(i, row) {
            var params = {
                clientType: this.add.clientType,
                appVersion: this.add.appVersion,
                isUpdate: this.add.isUpdate,
                addContent: this.add.addContent
            };
            for (let i in params) {
                if (params[i] == "") {
                    this.$message({
                        message: "值不能为空",
                        type: "error"
                    });
                    this.marks = false;
                    return false;
                } else {
                    this.marks = true;
                }
            }
            console.log(params, "zghzgzgh");
            if (this.marks == true) {
                this.$http({
                    method: "POST",
                    url:  $fn.apiHost2+"/web/sysAppVersion/saveAppVersion",
                    params: { params: JSON.stringify(params) }
                }).then(res => {
                    console.log(res, "发布新版本");
                    console.log(res, "更新app版本号");
                    if (res.data.code == 200) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.init();
                        this.add = {
                            clientType: "",
                            appVersion: "",
                            isUpdate: "",
                            addContent: ""
                        };
                        this.marks = false;
                        this.addModal = false;
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
            }
        },
        lookEdit(i, row) {
            this.editModal = true;
            this.edit = row;
            console.log(this.edit);
        },
        update() {
            var params = {
                clientType: this.edit.clientType,
                appVersion: this.edit.appVersion,
                isUpdate: this.edit.isUpdate,
                addContent: this.edit.addContent,
                sysAppVersionId: this.edit.sysAppVersionId
            };
            for (let i in params) {
                if (params[i] == "") {
                    this.$message({
                        message: "值不能为空",
                        type: "error"
                    });
                    return false;
                } else {
                    this.mark = true;
                }
            }
            if (this.mark == true) {
                this.$http({
                    method: "POST",
                    url: $fn.apiHost2+"/web/sysAppVersion/updateAppVersion",
                    params: { params: JSON.stringify(params) }
                }).then(res => {
                    console.log(res, "更新app版本号");
                    if (res.data.code == 200) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.init();
                        this.mark = false;
                        this.editModal = false;
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
            }
        },
        cancel() {
            this.init();
        },
        changePage(page) {
            this.page = page
            console.log(page);
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysAppVersion/getAppVersionList",
                params: {
                    page: page,
                    limit: this.limit,
                    sign: $fn.sign
                }
            }).then(res => {
                console.log(res, "app分页查询");
                this.tableData = res.data.result.records;
                this.total = res.data.result.total;
            });
        },
        changeCurrent(page) {
            this.page = page
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysAppVersion/getAppVersionList",
                params: {
                    page: page,
                    limit: this.limit,
                    sign: $fn.sign
                }
            }).then(res => {
                console.log(res, "app分页查询");
                this.tableData = res.data.result.records;
                this.total = res.data.result.total;
            });
        }
    },
    filters: {
        filterType(e) {
            if (e == 1) {
                return "是";
            } else {
                return "否";
            }
        }
    }
};
</script>
<style scoped>
</style>

