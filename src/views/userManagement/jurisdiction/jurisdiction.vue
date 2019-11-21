<template>
    <div>
        <!-- <el-button @click="show">show</el-button> -->
        <div class="box">
              <span style="width:56px;height:12px;font-size:14px;font-family:MicrosoftYaHei;color:rgba(93,104,122,1);line-height:0px;">权限列表</span><br/><br/>
              <el-tree
                :data="data"
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if="data.type==='menu'">{{ data.title }}</span>
                  <span v-if="data.type==='fn'">&nbsp;&nbsp;{{ data.name }}</span>
                </span> 
              </el-tree> 
            </div>
            <!-- <Palette :visible.sync="isShow">
              <template>
               <CkDrag name="我是个测试" :svg.sync="svg" v-model="testData"></CkDrag>
               <CkDrag name="我是个测试" :svg.sync="svg2" v-model="testData"></CkDrag>
               <CkDrag name="我是个测试" :svg.sync="svg3" v-model="testData"></CkDrag>
               <CkDrag name="我是个测试" :svg.sync="svg4" v-model="testData"></CkDrag>
              </template>
            </Palette> -->
    </div>
</template>
<script>
// import CkDrag from '@/components/drag/drag.vue';
// import Palette from '@/components/drag/palette.vue';
// import ckSvg from '@/components/drag/svg.vue';
export default {
  name: 'jurisdiction',
  data() {
    return {
      svg: { type: 'circle' },
      svg2: { type: 'rect' },
      svg4: { type: 'ellipse' },
      svg3: {
        type: 'polygon',
        points: ['12,10', ' 200,150', ' 180,100', ' 30,40', ' 80,90']
      },
      isShow: true,
      data: [],
      testData: { num: '123' },
      form: {}
    };
  },
  activated() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$http.jurisdictionService
        .getJurisdictionTree(this.form)
        .then((res) => {
          this.data = this.reloadData(res);
        });
    },
    reloadData(data) {
      let result = [];
      data.map((item) => {
        let obj = item.data.menu;
        obj.type = 'menu';
        // obj.permission = item.permission;
        if (item.children) {
          obj.children = this.reloadData(item.children);
        }
        if (item.permission.length != 0) {
          obj.children = obj.children || [];
          item.permission.map((e) => {
            let ob = e;
            ob.type = 'fn';
            obj.children.push(ob);
          });
        }
        result.push(obj);
      });
      return result;
    }
  }
};
</script>
<style lang="scss" scoped>
.tree-name {
  color: rgba(52, 58, 69, 1);
  font-size: 12px;
}
.tree-name:hover {
  color: #26beff;
}
.box {
  padding: 0.5em;
}
.el-tree {
  background: none;
}
.search-box {
  background: #fff;
  border-radius: 5px;
}

.search-row {
  border-bottom: 1px solid #edf1f7;
  padding: 15px;
  line-height: 40px;
  height: 40px;
  box-sizing: content-box;
}
.search-box .el-col {
  width: 350px;
}
.search-row > .el-col {
  margin-right: 30px;
  text-align: center;
}
.tools-bar {
  margin: 18px 0;
  overflow: hidden;
}

.tools-bar .tb-title {
  color: #343a45;
  font-weight: bold;
  width: 120px;
  display: inline-block;
  border-left: 3px solid #26beff;
  padding-left: 15px;
}
</style>

