<template>
    <div class="admin-user">
        <el-card class="box-card">
            <el-input v-model="search" size="small" placeholder="账号、用户姓名" style="width: 200px" clearable></el-input>
            <el-button size="small" style="background:#7AC9FB;color:#000" @click="searchs">搜索</el-button>
            <hr style="border:none;height:1px;background:#f8f8f9;margin:10px 0 ;">
            <el-button size="small" style="background:#7AC9FB;color:#000;" @click="addModal = true">添加管理员</el-button>
            <el-table :data="tableData" style="width: 100%;margin-top:15px;" border stripe>
                <el-table-column prop="sysUserId" label="编号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="username" label="账号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="name" label="用户姓名" align="center">
                </el-table-column>
                <el-table-column prop="operationTime" label="最近登录" align="center">
                </el-table-column>
                <el-table-column prop="roleName" label="所属角色" align="center">
                </el-table-column>
                <el-table-column label="用户状态" align="center">
                    <template slot-scope="zgh">
                        <span :style="{color:zgh.row.status=='1'?'green':'red'}">{{zgh.row.status | filterStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="openEditModal(scope.$index, scope.row)" >查看编辑</el-button>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="openLog(scope.row.sysUserId,scope.row.username)">操作日志</el-button>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="deleteUser(scope.$index, scope.row)" v-if="scope.$index!==0">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top:15px;text-align:center">
                <el-pagination @size-change="changePage" @current-change="changeCurrent" :current-page="page" :page-size="limit" prev-text="上一页" next-text="下一页" layout="total, prev, next,jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 添加管理员 -->
        <el-dialog title="添加管理员" :visible.sync="addModal" width="30%" @close="cancel">
            <el-form :model="add" label-position="right" label-width="100px">
                <el-form-item label="姓名">
                    <el-input v-model="add.name" auto-complete="off" placeholder="真实姓名" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="管理员账号">
                    <el-input v-model="add.username" auto-complete="off" placeholder="账号" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="add.password" auto-complete="off" placeholder="密码" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="所属角色">
                    <el-select v-model="add.value" placeholder="请选择" style="width:200px;">
                        <el-option :label="role.label" :value="role.value" v-for="role in roleList" :key="role.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addModal = false">取 消</el-button>
                <el-button type="primary" @click="addUser">创 建</el-button>
            </div>
        </el-dialog>
        <!-- 编辑管理员 -->
        <el-dialog title="编辑管理员" :visible.sync="editModal" width="30%" @close="cancel">
            <el-form :model="edit" label-position="right" label-width="100px">
                <el-form-item label="姓名">
                    <el-input v-model="edit.name" auto-complete="off" placeholder="真实姓名" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="管理员账号">
                    <el-input v-model="edit.username" auto-complete="off" placeholder="账号" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="edit.password" auto-complete="off" placeholder="密码" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="所属角色">
                    <el-select v-model="edit.roleName" placeholder="请选择" style="width:200px;" @change="change">
                        <el-option :label="role.label" :value="role.value" v-for="role in roleList" :key="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最近登录时间">
                    {{edit.operationTime}}
                </el-form-item>
                <el-form-item label="用户状态" v-if="userAdmin!==0">
                    <el-radio-group v-model="edit.status">
                        <el-radio label="1" value="1">正常</el-radio>
                        <el-radio label="-1" value="-1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editModal = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 查看日志 -->
        <el-dialog :title="user+'的操作日志'" :visible.sync="logModal" center>
            <el-table :data="logData" border stripe :header-cell-style="getRowClass">
                <el-table-column property="operationTime" label="操作时间"></el-table-column>
                <el-table-column property="operationContent" label="操作内容"></el-table-column>
            </el-table>
            <div style="margin-top:15px;text-align:center">
                <el-pagination @size-change="changePage1" @current-change="changeCurrent1" :current-page="page1" :page-size="limit1" prev-text="上一页" next-text="下一页" layout="total, prev, next,jumper" :total="total1">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import util from "../../../util/utils.js";
import md5 from "js-md5";
var Base64 = require("js-base64").Base64;
export default {
    data() {
        return {
            user: "曾冠寰",
            userAdmin:null,
            page: 1,
            page1:1,
            userId:'',
            username:'',
            total1:null,
            total: null,
            limit: 10,
            limit1:10,
            search: "",
            radio: "正常",
            tableData: [],
            roleId: "",
            logData: [
                {
                    date: "2016-05-02",
                    content: "删除了数据库跑路"
                }
            ],
            roleList: [],
            addModal: false,
            editModal: false,
            logModal: false,
            add: {},
            edit: {}
        };
    },
    created() {
        this.init();
        this.role();
    },
    mounted() {},
    methods: {
        init() {
            this.$http({
                method: "POST",
                url: $fn.apiHost2+"/web/sysUser/list",
                params: {
                    searchKey: this.search,
                    page: this.page,
                    limit: this.limit
                }
            }).then(res => {
                console.log(res, "管理员列表");
                this.tableData = res.data.result.record;
                this.total = res.data.result.total;
            });
        },
        role() {
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysUser/roleSelect"
            }).then(res => {
                console.log(res, "角色列表");
                this.roleList = res.data.result;
            });
        },
        addUser() {
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysUser/addUser",
                params: {
                    param: {
                        name: this.add.name, //真实姓名
                        username: this.add.username, //账号
                        password: md5(this.add.password) //密码
                    },
                    extra: this.add.value
                }
            }).then(res => {
                console.log(res, "新增管理员");
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.addModal = false;
                    this.init();
                    this.add = {};
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
            });
        },
        openEditModal(i, obj) {
            this.editModal = true;
            this.edit = obj;
            this.userAdmin = i
            console.log(i, obj);
        },
        editUser() {
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysUser/editUser",
                params: {
                    param: {
                        sysUserId: this.edit.sysUserId,
                        name: this.edit.name, //真实姓名
                        username: this.edit.username, //账号
                        password: md5(this.edit.password), //密码
                        status: this.edit.status
                    },
                    extra: this.roleId
                }
            }).then(res => {
                console.log(res, "编辑管理员");

                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.editModal = false;
                    this.init();
                    this.edit = {};
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
            });
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return "background:#f8f8f9";
            } else {
                return "";
            }
        },
        deleteUser(i, row) {
            this.$confirm(
                `是否确认<span style='color:red'>永久删除</span>管理员用户<span style='color:red'>${
                    row.name
                }</span>`,
                "提示",
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    this.deleteAdmin(i, row);
                })
        },
        deleteAdmin(i, obj) {
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysUser/delSysUser",
                params: {
                    id: obj.sysUserId
                }
            }).then(res => {
                console.log(res, "删除管理员");

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
        },
        openLog(id,name){
            this.userId = id
            this.username = name
            this.logModal = true
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysUser/getOperationRecord",
                params: {
                   username:name,
                   page:this.page,
                   limit:this.limit
                }
            }).then(res => {
                console.log(res, "日志列表");
                this.logData = res.data.result.records;
                this.total1 = res.data.result.total;
            });
        },
        cancel() {
            this.init();
        },
        change(e) {
            console.log(e, "zgh");
            this.roleId = e;
        },
        searchs() {
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysUser/list",
                params: {
                    searchKey: this.search,
                    page: this.page,
                    limit: this.limit
                }
            }).then(res => {
                console.log(res, "管理员列表");
                this.tableData = res.data.result.record;
                this.total = res.data.result.total;
            });
        },
        changePage(page) {
            this.page = page
            this.$http({
                method: "POST",
                url: $fn.apiHost2+"/web/sysUser/list",
                params: {
                    searchKey: this.search,
                    page: page,
                    limit: this.limit
                }
            }).then(res => {
                console.log(res, "管理员列表");
                this.tableData = res.data.result.record;
                this.total = res.data.result.total;
            });
        },
        changePage1(page){
            this.page = page
             this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysUser/getOperationRecord",
                params: {
                   username:this.username,
                   page:this.page,
                   limit:this.limit1
                }
            }).then(res => {
                console.log(res, "日志列表");
                this.logData = res.data.result.records;
                this.total1 = res.data.result.total;
            });
        },
        changeCurrent(page) {
            this.page = page
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysUser/list",
                params: {
                    searchKey: this.search,
                    page: page,
                    limit: this.limit
                }
            }).then(res => {
                console.log(res, "管理员列表");
                this.tableData = res.data.result.record;
                this.total = res.data.result.total;
            });
        },
        changeCurrent1(page){
            this.page = page
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysUser/getOperationRecord",
                params: {
                   username:this.username,
                   page:page,
                   limit:this.limit1
                }
            }).then(res => {
                console.log(res, "日志列表");
                this.logData = res.data.result.records;
                this.total1 = res.data.result.total;
            });
        }
    },
    filters: {
        filterStatus(status) {
            if (status == "1") {
                return "正常";
            } else {
                return "禁用";
            }
        }
    }
};
</script>
