<template>
    <div class="user-list">
        <el-card class="box-card">
            <el-input v-model="mobile" size="small" placeholder="手机号" style="width: 150px" clearable></el-input>
            <el-input v-model="userName" size="small" placeholder="姓名" style="width: 100px" clearable></el-input>
            <el-input v-model="walletAddress" size="small" placeholder="钱包地址" style="width: 200px" clearable></el-input>
            <el-select v-model="select" placeholder="用户状态" size="small" style="width: 100px">
                <el-option key=" " label="全部" value=" "></el-option>
                <el-option key="正常" label="正常" value="正常"></el-option>
                <el-option key="删除" label="禁用" value="删除"></el-option>
            </el-select>
            <el-button size="small" style="background:#7AC9FB;color:#000" @click="search">搜索</el-button>
            <el-button size="small" style="background:#7AC9FB;color:#000;float:right" @click="exportList">导出列表</el-button>
            <hr style="border:none;height:1px;background:#f8f8f9;margin:10px 0 ;">
            <el-button size="small" style="background:#7AC9FB;color:#000;" @click="addModal = true">添加A类用户</el-button>
            <el-table :data="tableData" style="width: 100%;margin-top:15px;" border stripe ref="table" id="table">
                <el-table-column prop="userId" label="编号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="nickName" label="姓名" align="center">
                </el-table-column>
                <el-table-column prop="walletAddress" label="钱包地址" align="center">
                </el-table-column>
                <el-table-column prop="inviteCode" label="邀请码" align="center">
                </el-table-column>
                <el-table-column prop="personCount" label="好友人数" align="center">
                    <template slot-scope="zgh">
                        <span v-if="currentIndex == zgh.$index">{{friendCount}}</span>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="friend(zgh.row.userId,zgh.$index)" v-else>查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="lastLoginTime" label="最近登录" align="center">
                </el-table-column>
                <el-table-column label="用户状态" align="center">
                    <template slot-scope="zgh">
                        <span :style="{color:zgh.row.tbStatus=='正常'?'green':'red'}">{{zgh.row.tbStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="lookEdit(scope.$index, scope.row)">查看编辑</el-button>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="walletDetail(scope.$index, scope.row)">钱包详情</el-button>
                        <el-button size="mini" style="background:#7AC9FB;color:#000" @click="bbDetail(scope.$index, scope.row.userId,scope.row.nickName)">拨币</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top:15px;text-align:center">
                <el-pagination @size-change="changePage" @current-change="changeCurrent" :current-page="page" :page-size="limit" prev-text="上一页" next-text="下一页" layout="total, prev, next,jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 添加A类用户 -->
        <el-dialog title="添加A类用户" :visible.sync="addModal" width="30%">
            <el-form :model="add" label-position="right" label-width="100px">
                <el-form-item label="" label-width="0">
                    <div style="width:100%;">你正在创建A类用户，请你仔细确认填写信息，用户创建成功后，系统会将账号密码以短信的形式通知该用户</div>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="add.nickName" auto-complete="off" placeholder="昵称" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="add.mobile" auto-complete="off" placeholder="账号" style="width:200px;"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addModal = false">取 消</el-button>
                <el-button type="primary" @click="addUser">添 加</el-button>
            </div>
        </el-dialog>
        <!-- 查看钱包 -->
        <el-dialog :title="currentUser+'的钱包'" :visible.sync="walletModal" center>
            <el-table :data="walletData" border stripe :header-cell-style="getRowClass">
                <el-table-column property="coinType" label="币种"></el-table-column>
                <el-table-column property="holdingQuantity" label="持有量"></el-table-column>
                <el-table-column property="cny" label="约合人民币"></el-table-column>
            </el-table>
        </el-dialog>
        <!-- 查看编辑 -->
        <el-dialog title="" :visible.sync="editModal" center @close="cancel">
            <el-form :model="edit" label-position="right" label-width="100px" class="edit_item">
                <el-form-item label="用户头像">
                    <img :src="edit.avatar" alt="" style="width:40px;height:40px;">
                </el-form-item>
                <el-form-item label="姓名">
                    <span>{{edit.realName}}</span>
                </el-form-item>
                <el-form-item label="手机号">
                    <span>{{edit.mobile}}</span>
                </el-form-item>
                <el-form-item label="邀请码">
                    <span>{{edit.inviteCode}}</span>
                </el-form-item>
                <el-form-item label="钱包地址">
                    <span>{{edit.walletAddress}}</span>
                </el-form-item>
                <el-form-item label="用户等级">
                    <span>{{edit.userType}}</span>
                </el-form-item>
                <el-form-item label="登录次数">
                    <span>{{edit.serilaLoginCount}}</span>
                </el-form-item>
                <el-form-item label="最近登录时间">
                    <span>{{edit.lastLoginTime}}</span>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-radio-group v-model="edit.tbStatus">
                        <el-radio label="正常">正常</el-radio>
                        <el-radio label="删除">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="editUser(edit.userId,edit.tbStatus)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 拨币 -->
        <el-dialog title="拨币操作" :visible.sync="bbModal" center>
            <el-form :model="bb" label-position="right" label-width="100px">
                <el-form-item label="" label-width="0">
                    <div style="width:100%;">你正在对{{currentUser}}进行拨送私募币的操作，每位用户只可拨送一次私募币，请你仔细进行确认信息</div>
                </el-form-item>
                <el-form-item label="拨送">
                    <el-input v-model.number="bb.num" auto-complete="off" placeholder="数量" style="width:200px;"></el-input> &nbsp;SMRI
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="bb.remark" type="textarea" maxlength="20" auto-complete="off" placeholder="备注" style="width:300px;position:relative">
                        
                    </el-input>
                    <span class="pos">{{bb.text}}/20</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="bbModal = false">取 消</el-button>
                <el-button type="primary" @click="bbUser(bb.userId,bb.tbStatus)">确 定</el-button>
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
            friendCount:null,
            currentIndex:null,
            radio: "正常",
            userIds:'',
            addModal: false,
            bbModal : false,
            editModal: false,
            walletModal: false,
            currentUser: "",
            mobile: "",
            walletAddress: "",
            userName: "",
            select: "",
            nums:'',
            bb: {
              num:'',
              remark:'',
              text:0
            }, //拨币
            add: {
                nickName: "",
                mobile: ""
            },
            edit: {},
            coinData: [],
            tableData: [],
            walletData: [
                {
                    coin: "SMRI",
                    have: "100.00000",
                    rmb: "10000"
                }
            ]
        };
    },
    created() {
        this.init();
       
    },
    computed: {
        zgh() {
            return this.bb.remark;
        },
        num(){
            return this.bb.num +'.000000'
        }
    },
    watch: {
            zgh(news, old) {
                this.bb.text = news.length
                console.log(news.length, "length");
            },
            num(news,old){
                this.nums = news
                console.log(this.nums,news,'zgh')
            }
    },
    methods: {
        init() {
            this.$http({
                method: "POST",
                url:$fn.apiHost3+"/web/user/getUserList",
                params: {
                    page: this.page,
                    pageSize: this.limit,
                    userStatus: this.select,
                    mobile: this.mobile,
                    walletAddress: this.walletAddress,
                    userName: this.userName
                }
            }).then(res => {
                console.log(res, "用户列表");
                this.total = res.data.result.count;
                this.tableData = res.data.result.selectList;
            });
        },

        addUser() {
            this.add.clientAES = util.encryption()
            this.add.clientBcrypt = util.bcryptSecret()
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/register/user/registerLegacy",
                params: this.add
            }).then(res => {
                console.log(res, "注册传承链用户");
                if (res.data.code == 200) {
                    this.$message({
                        message: "注册成功",
                        type: "success"
                    });
                    this.add = {}
                    this.addModal = false;
                    this.init();
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: "error"
                    });
                }
            });
        },
        editUser(userId, status) {
            console.log(this.edit, "zgh");
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/web/user/editUserStatus",
                params: {
                    userStatus: status,
                    userId: userId
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        message: res.data.msg,
                        type: "success"
                    });
                    this.editModal = false;
                    this.init();
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: "error"
                    });
                }
                console.log(res, "更改状态");
            });
        },
        friend(id,index){
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/web/user/getFriends",
                params: {
                    userId: id
                }
            }).then(res => {
                this.currentIndex = index
                console.log(res, this.currentIndex,"查看好友");
                if(res.data.code==500&&res.data.msg=="未找到该用户好友"){
                    this.friendCount = 0
                }else{
                    this.friendCount = res.data.result.friendsAmount
                }
                
            });
        },
        lookEdit(i, row) {
            console.log(i, row);
            this.editModal = true;
            this.edit = row;
        },
        cancel() {
            this.editModal = false;
            this.init();
           
        },
        search() {
             this.currentIndex = null
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/web/user/getUserList",
                params: {
                    page: this.page,
                    pageSize: this.limit,
                    mobile: this.mobile,
                    walletAddress: this.walletAddress,
                    userName: this.userName,
                    userStatus: this.select
                }
            }).then(res => {
                console.log(res, "用户列表");
                this.total = res.data.result.count;
                this.tableData = res.data.result.selectList;
            });
        },
        //钱包地址
        walletDetail(i, row) {
            console.log(i, row);
            if (row.realName == "") {
                this.currentUser = row.mobile;
            } else {
                this.currentUser = row.realName;
            }
            this.getWallet(row.userId);
            this.walletModal = true;
        },
        //获取钱包详情
        getWallet(e) {
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/walletBase/getWallet",
                params: {
                    userId: e
                }
            }).then(res => {
                
                this.coinList(res.data.result);
            });
        },
        //拨币
        bbDetail(i,userId,name){
            this.bbModal = true 
            this.currentUser = name
            console.log(name)
            this.userIds = userId
        },
        //拨币
        bbUser(){
            
            if(this.bb.num == ''&&this.bb.remark == ''){
                 this.$message({
                        type: "warning",
                        message:'输入不能为空'
                    });
                    
            }else{
                this.$http({
                method: "POST",
                url: $fn.apiHost1+"/web/walletBase/giveCoin",
                params:{
                    userId:this.userIds,
                    count:this.bb.num,
                    remark:this.bb.remark
                }
            }).then(res => {
                //console.log(res.data.result,'币种列表')
                if(res.data.code == 200){
                     this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.init()
                     this.bbModal = false
                }else{
                     this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
               
            });
            }
            
             
        },
        //币种列表-兑换汇率
        coinList(array) {
            this.$http({
                method: "POST",
                url:  $fn.apiHost1+"/web/walletCoinType/getWalletCoinType"
            }).then(res => {
                //console.log(res.data.result,'币种列表')
                this.walletData = array;
                res.data.result.forEach((e, i) => {
                    //console.log(e.cny)
                    this.walletData[i].cny =
                        this.walletData[i].holdingQuantity * e.cny;
                });
            });
        },
        changePage(page) {
             this.currentIndex = null
            console.log(this.page,'sadsadas')
            this.page = page
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/web/user/getUserList",
                params: {
                    page: page,
                    pageSize: this.limit,
                    userStatus: this.select,
                    mobile: this.mobile,
                    walletAddress: this.walletAddress,
                    userName: this.userName
                }
            }).then(res => {
                console.log(res, "用户列表");
                this.total = res.data.result.count;
                this.tableData = res.data.result.selectList;
            });
        },
        changeCurrent(page) {
             this.currentIndex = null
            this.page = page
            console.log(this.page,'hhhhh');
            this.$http({
                method: "POST",
                url: $fn.apiHost3 + "/web/user/getUserList",
                params: {
                    page: page,
                    pageSize: this.limit,
                    mobile: this.mobile,
                    walletAddress: this.walletAddress,
                    userName: this.userName,
                    userStatus: this.select
                }
            }).then(res => {
                console.log(res, "用户列表");
                this.total = res.data.result.count;
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
        exportList() {
            util.exportExcel(document.querySelector("#table"), "用户信息列表");
        },
        // filterTime: function(row, column) {
        //     if (row.lastLoginTime == null) {
        //         return "无";
        //     } else {
        //         return new Date(Number(row.lastLoginTime)).toLocaleString("chinese", {
        //             hour12: false
        //         });
        //     }
        // }
    }
};
</script>
<style scoped>
.edit_item span {
    font-weight: bold;
}

</style>
