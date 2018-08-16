<template>
    <div class="admin-user">
        <el-card class="box-card">
            <el-input v-model="search" size="small" placeholder="角色名称" style="width: 200px" clearable></el-input>
            <el-button size="small" style="background:#7AC9FB;color:#000" @click="searchs">搜索</el-button>
            <hr style="border:none;height:1px;background:#f8f8f9;margin:10px 0 ;">
            <el-button size="small" style="background:#7AC9FB;color:#000;" @click="addModal = true">添加角色</el-button>
            <el-table :data="tableData" style="width: 100%;margin-top:15px;" border stripe>
                <el-table-column prop="sysRoleId" label="编号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="roleName" label="角色姓名" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="角色描述" align="center">
                </el-table-column>
                <el-table-column label="用户状态" align="center">
                    <template slot-scope="zgh">
                        <span :style="{color:zgh.row.roleStatus=='正常'?'green':'red'}">{{zgh.row.roleStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" align="center">
                    <template slot-scope="scope">

                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="openRole(scope.row.sysRoleId,scope.row.roleName)" v-if="scope.row.sysRoleId!=='1'">权限</el-button>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="openEditModal(scope.$index, scope.row)" v-if="scope.row.sysRoleId!=='1'">查看编辑</el-button>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="deleteUser(scope.$index, scope.row)" v-if="scope.row.sysRoleId!=='1'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top:15px;text-align:center">
                <el-pagination @size-change="changePage" @current-change="changeCurrent" :current-page="page" :page-size="limit" prev-text="上一页" next-text="下一页" layout="total, prev, next,jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 添加角色 -->
        <el-dialog title="添加角色" :visible.sync="addModal" width="30%" @close="cancel">
            <el-form :model="add" label-position="right" label-width="100px">
                <el-form-item label="角色名称">
                    <el-input v-model="add.roleName" auto-complete="off" placeholder="请输入角色名称" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="add.remark" auto-complete="off" placeholder="备注" style="width:200px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addModal = false">取 消</el-button>
                <el-button type="primary" @click="addUser">创 建</el-button>
            </div>
        </el-dialog>
        <!-- 编辑橘色 -->
        <el-dialog title="编辑角色" :visible.sync="editModal" width="30%" @close="cancel">
            <el-form :model="edit" label-position="right" label-width="100px">
                <el-form-item label="角色名称">
                    <el-input v-model="edit.roleName" auto-complete="off" placeholder="请输入角色名称" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-radio-group v-model="edit.roleStatus">
                        <el-radio label="正常" value="1">正常</el-radio>
                        <el-radio label="禁用" value="-1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editModal = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 授权列表 -->
        <el-dialog :title="'授权角色：'+user" :visible.sync="logModal" center>
            <el-checkbox-group v-model="checked" @change="checking">
                <el-checkbox :label="list.sysMenuId" v-for="list in listData" :key="list.id">{{list.name}}</el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click="logModal = false">取 消</el-button>
                <el-button type="primary" @click="roleSure">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import util from "../../../util/utils.js";
import qs from "qs";
import md5 from "js-md5";
var Base64 = require("js-base64").Base64;
export default {
    data() {
        return {
            checked: [],
            isIndeterminate: false,
            listData: [],
            roleId: "",
            user: "曾冠寰",
            username: "",
            remark: "",
            page: 1,
            total: null,
            limit: 10,
            search: "",
            select: "",
            radio: "正常",
            tableData: [
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "正常"
                }
            ],
            roleName: "",
            addModal: false,
            editModal: false,
            logModal: false,
            add: {},
            edit: {}
        };
    },
    created() {
        this.init();
    },
    mounted() {
        //this.username =JSON.parse(sessionStorage.getItem('user')).admin;
    },
    methods: {
        init() {
            this.$http({
                method: "GET",
                url: $fn.apiHost2+"/web/sysRole/pageQuery",
                params: {
                    page: this.page,
                    limit: this.limit,
                    roleName: this.search
                }
            }).then(res => {
                console.log(res, "角色列表");
                this.tableData = res.data.result.records;
                this.total = res.data.result.total;
            });
        },
        addUser() {
            var params = {
                roleName: this.add.roleName,
                remark: this.add.remark
            };
            this.$http({
                method: "POST",
                url: $fn.apiHost2+"/web/sysRole/saveRole",
                params: { param: params }
            }).then(res => {
                console.log(res, "新增角色");
                //this.roleList = res.data.result
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.add = {};
                    this.addModal = false;
                    this.init();
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
            //this.user = obj.roleName
            console.log(obj);
        },
        editUser() {
            var params = {
                roleName: this.edit.roleName,
                roleStatus: this.edit.roleStatus,
                sysRoleId: this.edit.sysRoleId
            };
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysRole/updateRole",
                params: { param: params }
            }).then(res => {
                console.log(res, "编辑角色");
                //this.roleList = res.data.result
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.edit = {};
                    this.editModal = false;
                    this.init();
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
            this.$confirm("是否删除该角色", "提示", {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.deleteRole(i, row);
                })
                .catch(() => {});
        },
        deleteRole(i, obj) {
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysRole/delSysRole",
                params: {
                    id: obj.sysRoleId
                }
            }).then(res => {
                console.log(res, "删除角色");

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
        openRole(roleId,roleName) {
            this.roleId = roleId;
            this.user = roleName
            this.logModal = true;
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysRole/queryRoleMenuTree",
                params: {
                    roleId: roleId
                }
            }).then(res => {
                console.log(res, "获取角色权限列表");
                //this.checked
                
                this.listData = res.data.result;
                var array = res.data.result.filter(e=>{
                    return e.checked
                })
                this.checked  = array.map(e=>{
                    return e.sysMenuId
                })
                console.log(this.checked)
            });
        },

        searchs() {
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysRole/pageQuery",
                params: {
                    page: this.page,
                    limit: this.limit,
                    roleName: this.search
                }
            }).then(res => {
                console.log(res, "角色列表");
                this.tableData = res.data.result.records;
                this.total = res.data.result.total;
            });
        },
        cancel() {
            this.init();
        },
        roleSure() {
           var params = new URLSearchParams();
           params.append('roleId',this.roleId)
            this.checked.forEach((e,i)=>{
                params.append('menuIds',e)
            })
            console.log("zgh");
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysRole/editRoleMenu",
                params: params,
            }).then(res => {
                console.log(res, "权限列表");
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.init();
                    this.logModal = false;
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
            });
        },
        checking(e) {
            console.log(e, this.checked);
        },
        changePage(page) {
            this.page = page
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysRole/pageQuery",
                params: {
                    page: page,
                    limit: this.limit,
                    roleName: this.search
                }
            }).then(res => {
                console.log(res, "角色列表");
                this.tableData = res.data.result.records;
                this.total = res.data.result.total;
            });
        },
        changeCurrent(page) {
            this.page = page
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysRole/pageQuery",
                params: {
                    page: page,
                    limit: this.limit,
                    roleName: this.search
                }
            }).then(res => {
                console.log(res, "角色列表");
                this.tableData = res.data.result.records;
                this.total = res.data.result.total;
            });
        }
    }
};
</script>
