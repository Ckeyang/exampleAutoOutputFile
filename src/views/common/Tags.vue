<template>
  <div style=" position: fixed;top: 60px;width: 100%;z-index: 2;margin-left:15px">
    <div class="tags" v-if="showTags">
      <ul>
        <li
          class="tags-li"
          v-for="(item,index) in tagsList"
          :class="{'active': isActive(item.path)}"
          :key="index"
        >
          <span class="circel" v-show="isActive(item.path)"></span>
          <!-- <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link> -->
          <span class="tags-li-title" @click="toPage(item.path)">{{item.title}}</span>
          <span class="tags-li-icon" @click="closeTags(index)">
            <i class="el-icon-close"></i>
          </span>
        </li>
      </ul>
      <div class="tags-close-box">
        <el-dropdown @command="handleTags">
          <el-button size="mini" type="primary">
            标签选项
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu size="small" slot="dropdown">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    // 存放tags数组
    tagsList: {
      get: function() {
        return this.$store.state.Tags.tagsList;
      },
      set: function(newValue) {
        this.$store.state.Tags.tagsList = newValue;
      }
    },
    //是否显示tags
    showTags() {
      return this.tagsList.length > 0;
    }
  },
  //监视路由的变化，如果重复则添加最新的
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue);
    }
  },
  //初始化首页
  created() {
    this.setTags(this.$route);
  },
  methods: {
    //改变store里面的tags
    changeTagsList(tags) {
      this.$store.commit({
        type: "tag_changeTagsList",
        tags
      });
    },
    // 高亮当前路径
    isActive(path) {
      return path === this.$route.path;
    },
    // 关闭单个标签
    closeTags(index) {
      const delItem = this.tagsList.splice(index, 1)[0];
      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1];
      if (item) {
        delItem.path === this.$route.path && this.$router.push(item.path);
        //改变store里面的tags
        this.changeTagsList(this.tagsList);
      } else {
        this.tagsList = [];
        this.$router.push("/index");
        this.changeTagsList([]);
      }
    },
    // 关闭全部标签
    closeAll() {
      //改变store里面的tags
      this.changeTagsList([{path:"/index",title:"首页"}]);
      this.$router.push("/index");
    },
    // 关闭其他标签
    closeOther() {
      const curItem = this.tagsList.filter(item => {
        return item.path === this.$route.path;
      });
      this.changeTagsList(curItem);
    },
    // 设置标签
    setTags(route) {
      const isExist = this.tagsList.some(item => {
        return item.path === route.path;
      });
      if (!isExist && route.name !== "404") {
        for (let item of this.tagsList) {
          if (item.title === route.meta.title) {
            //如果title相同，则替换为最新的router
            item.path = route.path;
            return;
          }
        }
        //反之则添加
        this.tagsList.push({
          title: route.meta.title,
          path: route.path,
          name: route.name
        });
        //只保留5个tags
        if(this.tagsList.length > 5){
          this.tagsList.shift()
        }
      }
      //改变store里面的tags
      this.changeTagsList(this.tagsList);
    },
    handleTags(command) {
      command === "other" ? this.closeOther() : this.closeAll();
    },
    toPage(path, name){
      this.$router.push({
        path,
        query:{ 
          cache:true // 是否使用缓存
        },
      })
    }
  }
};
</script>
<style>
.circel {
  position: absolute;
  top: 9px;
  left: 7px;
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
}

.tags {
  position: relative;
  height: 40px;
  width:100%;
  overflow-x: auto;
  overflow-y: hidden;
}
.tags::after {
  content: "";
  width: 100%;
  height: 1px;
  display: block;
}
.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-left: 11px;
}

.tags-li {
  position: relative;
  float: left;
  margin: 6px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #96CEFF;
  padding: 1px 5px 1px 12px;
  vertical-align: middle;
  color: #666;
  /* -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: color 0.3s ease-in; */
}

/* .tags-li:not(.active):hover {
  background: #f8f8f8;
} */

.tags-li.active {
  color: #fff;
  padding-left: 20px;
}
.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

 
.tags-li .el-icon-close:hover {
  background: #b4bccc;
  border-radius: 50%;
  transition: color 0.3s;
}
.tags-close-box {
  position: fixed;
  right: 18px;
  top: 65px;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  z-index: 10;
}
.tags-close-box button {
  padding: 6px 15px;
  border-radius: 3px;
  background: transparent;
  border-color: #fff;
}
.tags-close-box :hover .el-button,
.tags-close-box .el-button--primary:focus{
  background: #fff;
  color: #1D7FFF;
  border-color: #fff;
}
 
</style>