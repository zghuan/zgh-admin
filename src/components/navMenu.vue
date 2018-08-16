<template>
    <el-menu :default-active="$route.meta.item" :default-openeds="this.openArray" class="el-menu-vertical-demo" background-color="#324057" text-color="#fff" active-text-color="#ffd04b" style="width:200px;"  :unique-opened="true">
        <el-submenu :index="menu.name" style="width:200px;" v-for="menu in this.$store.state.morkMenuList" :key="menu.id">
            <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{menu.name}}</span>
            </template>
            <el-menu-item-group v-for="sub in menu.childrenMenu" :key="sub.id">
                <router-link :to="sub.code">
                    <el-menu-item :index="sub.code">
                        <i class="el-icon-tickets"></i>
                        <span>{{sub.name}}</span>
                    </el-menu-item>
                </router-link>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>

</template>
<script>
import { otherRouter, addRouter } from "../router/index.js";
import { mutations } from "../vuex/store.js";
export default {
    data() {
        return {
            menuList: [],
            openArray:[],
        };
    },
    methods: {
        
    },  
    created() {
       
            this.$store.commit('getMenuListData');
        
    },
    mounted() {
        // this.$store.commit('getMenuListData');
    }
};
</script>

<style lang="less" scoped>
</style>

