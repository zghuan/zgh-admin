import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//流水的路由----加路由在这里添加
export const addRouter = [
  
  {
    path: "/user-list",
    name: "用户列表",
    meta: {
      name: '用户管理',
      group: "user",
      item: "user-list"

    },
    component: resolve =>
      import ('../pages/views/user/user-list')
  },
  {
    path: "/user-feedback",
    name: "意见反馈",
    meta: {
      name: '用户管理',
      group: "user",
      item: "user-feedback"

    },
    component: resolve =>
      import ('../pages/views/user/user-feedback')
  },
  {
    path: "/transfer-list",
    name: "转账列表",
    meta: {
      name: '账单管理',
      group: "account",
      item: "transfer-list"

    },
    component: resolve =>
      import ('../pages/views/account/transfer-list')
  },
  {
    path: "/sandui-list",
    name: "闪兑列表",
    meta: {
      name: '账单管理',
      group: "account",
      item: "sandui-list"

    },
    component: resolve =>
      import ('../pages/views/account/sandui-list')
  },
  {
    path: "/earn-setting",
    name: "收益设置",
    meta: {
      name: '营销管理',
      group: "marketing",
      item: "earn-setting"

    },
    component: resolve =>
      import ('../pages/views/marketing/earn-setting')
  },
  {
    path: "/pay-account-setting",
    name: "出账设置",
    meta: {
      name: '营销管理',
      group: "marketing",
      item: "pay-account-setting"

    },
    component: resolve =>
      import ('../pages/views/marketing/pay-account-setting')
  },

  {
    path: "/miner-setting",
    name: "矿工费设置",
    meta: {
      name: '营销管理',
      group: "marketing",
      item: "miner-setting"
    },
    component: resolve =>
      import ('../pages/views/marketing/miner-setting')
  },
  {
    path: "/suocan-setting",
    name: "锁仓/释仓设置",
    meta: {
      name: '营销管理',
      group: "marketing",
      item: "suocan-setting"
    },
    component: resolve =>
      import ('../pages/views/marketing/suocan-setting')
  },
  {
    path: "/coin-list",
    name: "币种列表",
    meta: {
      name: '系统管理',
      group: "system",
      item: "coin-list"
    },
    component: resolve =>
      import ('../pages/views/system/coin-list')
  },
  {
    path: "/app-version",
    name: "App版本管理",
    meta: {
      name: '系统管理',
      group: "system",
      item: "app-version"
    },
    component: resolve =>
      import ('../pages/views/system/app-version')
  },
]


//超级管理员的权限路由
export const qxRouter = [
  //管理员管理
  {
    path: "/admin-user",
    name: "管理员管理",
    meta: {
      name: '权限管理',
      group: "admin",
      item: "admin-user"
    },
    component: resolve =>
      import ('../pages/views/admin/admin-user')
  },
  //角色管理
  {
    path: "/admin-role",
    name: "角色管理",
    meta: {
      name: '权限管理',
      group: "admin",
      item: "admin-role"
    },
    component: resolve =>
      import ('../pages/views/admin/admin-role')
  },
  //菜单管理
  {
    path: "/admin-menu",
    name: "系统菜单",
    meta: {
      name: '权限管理',
      group: "admin",
      item: "admin-menu"
    },
    component: resolve =>
      import ('../pages/views/admin/admin-menu')
  },
]

//铁打的路由
export const otherRouter = [{
  routes: [{
      path: '/',
      name: 'Login',
      component: resolve =>
        import ('../pages/Login')
    }, {
      path: '/index',
      name: "首页",
      meta: {
        group: "store",
        item: "index"
      },
      component: resolve =>
        import ('../pages/Index'),
      children: [
        ...addRouter,
        ...qxRouter
      ]
    },
    {
      path: "*",
      name: "404",
      meta: {
        group: "erro",
        item: "erro"
      },
      component: resolve =>
        import ('../pages/Erro')
    },
    {
      path: "/error520",
      name: "error520",
      meta: {
        group: "erro",
        item: "error520"
      },
      component: resolve =>
        import ('../pages/error520')
    },
  ]
}]