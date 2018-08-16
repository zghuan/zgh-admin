import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)
import axios from '../util/axios.js'
import util from '../util/utils.js'
const state = {
  token:null,
  breadData: [], //面包屑数组
  menuList: [{
      name: '用户管理',
      childrenMenu: [{
          code: 'user-list',
          name: '用户列表',
        },
        {
          code: 'user-feedback',
          name: '意见反馈',
        },
      ]
    },
    {
      name: '账单管理',
      childrenMenu: [{
          code: 'sandui-list',
          name: '闪兑列表',
        },
        {
          code: 'transfer-list',
          name: '转账列表',
        },
      ]
    },
    {
      name: '营销管理',
      childrenMenu: [{
          code: 'earn-setting',
          name: '收益设置',
        },
        {
          code: 'pay-account-setting',
          name: '出账设置',
        },
        {
          code: 'miner-setting',
          name: '矿工费设置',
        },
        {
          code: 'suocan-setting',
          name: '锁仓/释仓设置',
        },
      ]
    },
    {
      name: '系统管理',
      childrenMenu: [{
          code: 'coin-list',
          name: '币种列表',
        },
        {
          code: 'app-version',
          name: 'APP版本管理',
        },

      ]
    },
    {
      name: '权限管理',
      childrenMenu: [{
          code: 'admin-user',
          name: '管理员列表',
        },
        {
          code: 'admin-role',
          name: '角色管理',
        },
        {
          code: 'admin-menu',
          name: '菜单管理',
        },
      ]
    },
  ],
  morkMenuList: []
}
const mutations = {
  token(state,token){
    state.token = token
  },
  //添加面包屑数组
  addListData(state, obj) {
    state.breadData = []
    state.breadData.push({
      name: obj.name,
      subName: obj.subName
    })
  },

  //清空面包屑数组
  clearListData(state, mark) {
    state.breadData = []
  },

  //获取菜单数据
  getMenuListData(state) {
    state.morkMenuList = []
    axios({
      method: "POST",
      url:  $fn.apiHost2+"/web/sysMenu/getMenuList",
     
    }).then(res => {
      console.log(res.data.result, '左侧菜单列表')
      state.menuList = res.data.result;
      let arr = [],
        obj = {}
      res.data.result.filter((e, i) => {
        arr.push(e.parent)
      });
      arr = util.arrayRepet(arr)
      for (var i = 0; i < arr.length; i++) {
        state.morkMenuList.push({
          name: arr[i],
          childrenMenu: []
        })
      }
      state.morkMenuList.forEach((e, i) => {
        e.childrenMenu.push(...(state.menuList.filter((a, i) => {
          return a.parent == e.name
        })))
      });
    
     
    });
  }
}

const actions = {
  //刷新菜单
  EDIT_MENU_DATA(edit) {
    edit.commit('getMenuListData')
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})