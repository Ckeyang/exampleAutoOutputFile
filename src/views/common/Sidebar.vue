<template>
  <div class="sidebar" ref='sidebar'>
    <el-scrollbar class="el-scrollbar_height">
      <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#545c64" text-color="#fff"
      active-text-color="#ffd04b" unique-opened router>
      <template v-for="(item) in items">
        <template v-if="item.children">
          <!-- <li :key='item.title' class="menuTitle" v-if='item.menuTitle'>{{item.menuTitle}}</li> -->
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="subItem.index" v-if="!subItem.isMobile">
              {{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import Bus from './bus.js';
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      items: [],
      // menuTitles: {
      //   BASE: '基础库',
      //   BUSINESS: '业务库',
      //   SYSTEM: '系统库'
      // },
      collapse: false //是否折叠
    };
  },
  computed: {
    //高亮当前菜单
    onRoutes() {
      return this.$route.path;
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    Bus.$on('collapse', (msg) => {
      this.collapse = msg;
    });
    this.getJurisdiction();
  },
  methods: {
    ...mapActions(['setAuth']),
    getJurisdiction() {
      this.$http.jurisdictionService.getJurisdictionTree(this.form).then((res) => {
        this.setAuth(res);
        this.items = this.reloadData(res);
      });
    },
    reloadData(data) {
      let result = [];
      data.map((item) => {
        let obj = item.data.menu;
        obj.index = item.path;
        obj.type = 'menu';
        obj.menuType = item.menuType;
        if (item.children) {
          obj.children = this.reloadData(item.children);
        }
        result.push(obj);
      });
      return result;
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      Bus.$emit("collapse", this.collapse);
    }
  }
};
</script>
<style >
.sidebar .el-submenu .el-menu-item{
  height: 38px;
  line-height: 38px;
}
</style>
<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
}
.el-scrollbar_height {
  height: 100%;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 210px;
}
.sidebar > ul {
  height: 100%;
}
.menuTitle {
  padding-left: 10px;
  font-size: 14px;
  font-family: 'MicrosoftYaHei';
  font-weight: 400;
  color:rgba(255,255,255,.65);
  line-height: 50px;
  border-top: 1px solid rgba(66, 74, 87, 1);
}
.shousuo-active {
  display: inline-block;
  transform: rotate(-180deg);
}
.collapse-btn{
  height: 50px;
  width: 100%;
  background: #424D5C;
  position: absolute;
  bottom: 0;
  cursor: pointer;
  line-height: 50px;
  text-align: center;
}
</style>