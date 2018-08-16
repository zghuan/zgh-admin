<template>
    <div class="login flex-align flex-center">
        <el-card class="box-card">
            <div class="flex-center flex-col">
                <img src="../assets/logo.png" alt="" class="logo" v-if="isLogin">
                <h3 class="title" v-else>账号密码登陆</h3>
                <div class="flex-row flex-align">
                    <span>账号：</span>
                    <el-input type="username" v-model="login.username" clearable style="width:80%;"></el-input>
                </div>
                <div class="flex-row flex-align" style="margin-top:15px;">
                    <span>密码：</span>
                    <el-input type="password" v-model="login.password" clearable style="width:80%;" @keyup.enter.native="rule"></el-input>
                </div>
                <el-button :type="type" :disabled="disabled" size="" style="width:275px;margin-top:15px;" @click="rule">{{text}}</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
import md5 from 'js-md5';
import util from '../util/utils.js';
export default {
    name: "login",
    data() {
        return {
            text: "登陆",
            isLogin: false,
            type:'warning',
            disabled:false,
            login: {
                username: "",
                password: ""
            }
        };
    },
    methods: {
        rule() {
            if (
                this.login.username.trim() == "" ||
                this.login.password.trim() == ""
            ) {
                this.$message({
                    message: "输入值不能为空",
                    type: "warning"
                });
            } else {
                this.getToken(this.login.username,this.login.password)
                //this.logining(this.login.username,this.login.password)
            }
        },
    //获取token
        getToken(user,pwd){
            var params = {
                userName :user,
                password:md5(pwd),
                clientAES:util.encryption(),
                clientBcrypt:util.bcryptSecret(),
                type:'2'
            }
            console.log(params)
            this.$http({
                method: "POST",
               
                params:params
            }).then(res => {
                console.log(res,'获取token')
               if(res.data.code ==200){
                    // this.$message({
                    //     message: '获取token成功',
                    //     type: 'success'
                    // });
                    util.setStorage('session','token','bearer'+' '+res.data.result.accessToken)
                    this.logining(user,pwd)//登录
               }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error' 
                    });
               }
            })
        },
    //登录逻辑
        logining(user, pass) {
            this.isLogin = true
            this.type = 'info'
            this.text =  "登陆中...",
            this.disabled = true
            this.$http({
                method: "POST",
                url:  $fn.apiHost2+'/web/sysUser/login',
                params: {
                    username:user,
                    pwd:md5(pass)
                },
            }).then(res => {
                console.log(res)
                if(res.data.code ==200){
                    this.$router.push("/index")
                    this.text =  "登陆"
                    this.type = 'warning'
                    this.isLogin = false
                    this.disabled = false
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    util.setStorage('session','user',res.data.result)
                    util.setStorage('session','currentTime',new Date().getTime())
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                     this.text =  "登陆"
                     this.type = 'warning'
                     this.isLogin = false
                     this.disabled = false
                }
            })
          
            
        }
    }
};
</script>

<style scoped lang="less">
.login {
    width: 100%;
    height: 100%;
    background: url("../assets/bg.png") no-repeat;
    background-size: cover;
}
.box-card {
    width: 320px;
    margin-bottom: 150px;
}
.title {
    text-align: center;
    padding-bottom: 20px;
    font-weight: normal;
}
.logo {
    width: 50px;
    height: 50px;
    margin: 0 auto 15px auto;
    -webkit-animation: rotate 1s linear infinite;
    animation: rotate 1s linear infinite;
}
@keyframes rotate {
    0% {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
</style>
