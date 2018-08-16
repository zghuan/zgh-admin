<template>
    <div class="user-list">
        <el-card class="box-card">
            <div class="space-between flex-row">
                <div style="flex:1;">
                    <el-button size="small" style="background:#7AC9FB;color:#000;" @click="addModal = true">新增菜单</el-button>
                    <el-tag style="float:right">一级菜单</el-tag>
                    <el-table :data="tableData" style="width: 100%;margin-top:15px;" border stripe @row-click="rowClick">
                        <el-table-column prop="name" label="菜单标题" align="center">
                        </el-table-column>
                        <el-table-column prop="code" label="路由名称" align="center">
                        </el-table-column>
                        <el-table-column prop="parent" label="菜单分类" align="center">
                        </el-table-column>
                        <el-table-column prop="level" label="层级" align="center">
                        </el-table-column>
                        <el-table-column prop="sort" label="排序" align="center">
                        </el-table-column>
                        <el-table-column prop="address" label="操作" width="200" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" style="background:#7AC9FB;color:#000" @click.native.stop="lookEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" style="color:#fff" @click="deleteMenu(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </div>
        </el-card>
        <!-- 新增菜单 -->
        <el-dialog title="新增菜单" :visible.sync="addModal" width="30%">
            <el-form :model="add" label-position="right" label-width="100px">
                 <el-form-item label="菜单分类">
                    <el-input v-model="add.parent" auto-complete="off" placeholder="菜单分类" style="width:200px;"></el-input>
                </el-form-item> 
                <el-form-item label="菜单标题">
                    <el-input v-model="add.name" auto-complete="off" placeholder="标题" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="路由名称">
                    <el-input v-model="add.code" auto-complete="off" placeholder="路由名称" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="菜单排序">
                    <el-input v-model="add.sort" auto-complete="off" placeholder="排序" style="width:200px;"></el-input>
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
                 <el-form-item label="菜单分类">
                    <el-input v-model="edit.parent" auto-complete="off" placeholder="菜单分类" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="菜单标题">
                    <el-input v-model="edit.name" auto-complete="off" placeholder="请输入角色名称" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="路由名称">
                    <el-input v-model="edit.code" auto-complete="off" placeholder="请输入角色名称" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="菜单排序">
                    <el-input v-model.number="edit.sort" auto-complete="off" placeholder="请输入角色名称" style="width:200px;"></el-input>
                </el-form-item>
                
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
            total: 125,
            limit: 10,
            addModal: false,
            select: 0,
            add: {},
            edit:{},
            editModal:false,
            menuList: [],
            tableData: [
            
            ]
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.$http({
                method: "GET",
                url:  $fn.apiHost2+"/web/sysMenu/queryAllMenu",
                params: {}
            }).then(res => {
                console.log(res, "菜单列表");
                this.tableData = res.data.result;
                this.total = res.data.result.total;
            });
        },
        addUser() {
            var params = {
                parent:this.add.parent,
                name: this.add.name,
                code: this.add.code,
                sort: this.add.sort,
                level:'1'
            };
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+"/web/sysMenu/save",
                params: {param:params}
            }).then(res => {
                console.log(res, "新增菜单");
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.add = {};
                    this.addModal = false;
                    this.init();
                    this.$store.dispatch('EDIT_MENU_DATA')
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
            });
        },
        lookEdit(i, row) {
            console.log("zgh");
            this.editModal = true
            this.edit = row
        },
        editUser(){ 
             var params = {
                parent:this.edit.parent,
                name: this.edit.name,
                code: this.edit.code,
                sort: this.edit.sort,
                level:'1',
                sysMenuId:this.edit.sysMenuId
            };
             this.$http({
                method: "POST",
                url: $fn.apiHost2+"/web/sysMenu/update",
                params: {param:params}
            }).then(res => {
                console.log(res, "新增菜单");
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.$store.dispatch('EDIT_MENU_DATA')
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
        deleteMenu(i, row) {
            this.$confirm("是否删除该菜单", "提示", {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$http({
                        method: "POST",
                        url:  $fn.apiHost2+"/web/sysMenu/delSysMenu",
                        params: {
                            menuId: row.sysMenuId
                        }
                    }).then(res => {
                        console.log(res, "删除菜单");
                        if (res.data.code == 200) {
                            this.$message({
                                type: "success",
                                message: res.data.msg
                            });
                            this.init();
                            this.$store.dispatch('EDIT_MENU_DATA')
                        } else {
                            this.$message({
                                type: "error",
                                message: res.data.msg
                            });
                        }
                    });
                })
                .catch(() => {});
            //this.walletModal = true;
        },
        cancel(){
            this.init()
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return "background:#f8f8f9";
            } else {
                return "";
            }
        },
        rowClick(row, event, column) {
            console.log(row, event, column);
        }
    }
};
</script>
