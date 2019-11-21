<template>
  <div class="regulation-tb">
    <el-row type="flex" justify="space-around">
      <el-col :span="12">
        <div class="box">
          <search-box>
            <template slot="input">
              <el-col :span="12">
                <el-form-item label="名称">
                  <el-input v-model="form.keyWords" size="mini" placeholder="名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
                <!-- <el-button type="info" size="medium"  icon="el-icon-refresh" round @click="resetForm">重置</el-button> -->
              </el-col>
            </template>
          </search-box>
          <div class="box2">
            <div class="tagsSearchShowBox">
              &nbsp;&nbsp;&nbsp;
              <span style="color:#606266;font-size:14px;">标签选择</span>
              <span
                class="tagItem active"
                v-for="(item,index) in form.labelList"
                :key="index"
              >{{item}}</span>
              <i class="rightAboslute el-icon-menu" title="选择标签" @click="tagsShow=true"></i>
            </div>
          </div>
          <el-radio-group v-model="form.type" size="small" @change="getDataList">
            <el-radio-button label="statutes">法规</el-radio-button>
            <el-radio-button label="standards">标准</el-radio-button>
          </el-radio-group>
          <br>
          <br>
          <el-table :data="dataList" :height="434">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <div class="operation-icon">
                  <!-- <i class="iconfont icon-chakan icon-edit" @click="goStandarOrStatute(scope.row.id)">查看</i> -->
                  <el-button type="primary" size="mini" @click="checkWord(scope.row)">选词条</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="box">
          <search-box>
            <template slot="input">
              <el-col :span="12">
                <el-form-item label="名称">
                  <el-input v-model="formWord.keyWords" size="mini" placeholder="名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-search"
                  @click="getWordDataList"
                >搜索</el-button>
                <!-- <el-button type="info" size="medium"  icon="el-icon-refresh" round @click="resetForm">重置</el-button> -->
              </el-col>
            </template>
          </search-box>
          <div class="box2">
            <div class="tagsSearchShowBox">
              &nbsp;&nbsp;&nbsp;
              <span style="color:#606266;font-size:14px;">标签选择</span>
              <span
                class="tagItem active"
                v-for="(item,index) in formWord.labelList"
                :key="index"
              >{{item}}</span>
              <i class="rightAboslute el-icon-menu" title="选择标签" @click="tagsWordShow=true"></i>
            </div>
          </div>
          <div style="padding:.5em;font-size:12px;margin-bottom:.5em;">章节选择：
            <el-select size="mini" v-model="formWord.chapter" @change="getWordDataList">
              <el-option value label="全部"></el-option>
              <el-option
                v-for="(item,index) in wordCapterList"
                :key="index"
                :value="item.chapterName"
                :label="item.context"
              ></el-option>
            </el-select>
          </div>
          <el-table :data="wordList" :height="400">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="chapterName" label="目录"></el-table-column>
            <el-table-column prop="context" label="名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="operation-icon">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="chooseItemWord(scope.row)"
                  >{{isChooseWord(scope.row)}}</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagniation
            :totalPage="wordTotalPage"
            :totalNum="wordTotalNum"
            @changePage="handleChangePageWord"
          ></pagniation>
        </div>
      </el-col>
    </el-row>
    <div class="saveBox">
      <el-button type="primary" @click="saveBoxShow=true">保存</el-button>
    </div>
    <el-dialog title="标签选择" width="30%" :visible.sync="tagsShow">
      <span
        class="tagItem"
        v-bind:class="[isActive(item)]"
        v-for="(item,index) in tagsList"
        :key="index"
        @click="addOrRemoveTag(item)"
      >{{item}}</span>
    </el-dialog>
    <el-dialog title="标签选择" width="30%" :visible.sync="tagsWordShow">
      <span
        class="tagItem"
        v-bind:class="[isActiveWord(item)]"
        v-for="(item,index) in tagsWordList"
        :key="index"
        @click="addOrRemoveTagWord(item)"
      >{{item}}</span>
    </el-dialog>
    <el-dialog title="保存" width="30%" :visible.sync="saveBoxShow">
      <el-form :model="basisCheck" :rule="{name:{required:true,message:'必填'}}" style="padding:1em;" label-position="top">
        <el-form-item label="检查表名称" prop="name">
          <el-select v-model="basisCheck.name" size="small">
            <el-option value label="请选择"></el-option>
            <el-option value="test" label="test"></el-option>
            <el-option value="test2" label="test2"></el-option>
            <el-option value="test3" label="test3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="saveBoxShow=false" type="info">取消</el-button>
          <el-button @click="save()" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SearchBox from "@/components/tools/searchBox.vue";
export default {
  name: "checkDetail",
  components: { pagniation, preview, SearchBox },
  data() {
    return {
      curId: "",
      totalPage: 0,
      totalNum: 0,
      wordTotalNum: 0,
      wordTotalPage: 0,
      dataList: [],
      wordList: [],
      curItem: {},
      tagsShow: false,
      tagsWordShow: false,
      saveBoxShow: false,
      tagsList: [],
      tagsWordList: [],
      wordCapterList: [],
      curIndex: 0,
      basisCheck: {
        abolitionTime: new Date().getTime(),
        basisId: "",
        name: "",
        standards: [],
        statutes: []
      },
      form: {
        pageSize: 30,
        status: "",
        type: "statutes",
        labelList: [],
        current: 0,
        basisId: ""
      },
      formWord: {
        pageSize: 30,
        chapter: "",
        statuteId: "",
        labelList: [],
        current: 0
      }
    };
  },
  activated() {
    this.form.basisId = this.$route.params.basisId;
    this.form.type = "statutes";
    this.curId = this.$route.params.id;
    this.basisCheck.basisId = this.form.basisId;
    this.wordList = [];
    this.curItem = {};
    this.initBasisCheck();
    this.getDataList();
    this.getBasisBankTags();
  },
  methods: {
    /**
     * 初始化
     */
    initBasisCheck() {
      if (this.curId != 0) {
        this.getBasisCheck();
      } else {
        this.basisCheck = {
          abolitionTime: new Date().getTime(),
          basisId: this.form.basisId,
          name: "",
          standards: [],
          statutes: []
        };
      }
    },
    getBasisCheck() {
      this.$http.basisBankService.getBasisCheckById(this.curId).then(res => {
        this.basisCheck = res.data;
      });
    },
    /**
     * 选词条
     */
    checkWord(item) {
      let index = this.basisCheck[this.form.type].findIndex(
        e => e.id === item.id
      );
      if (index === -1) {
        this.basisCheck[this.form.type].push(item);
      }
      index = this.basisCheck[this.form.type].findIndex(e => e.id === item.id);
      this.curIndex = index;
      this.curItem = this.basisCheck[this.form.type][this.curIndex];
      this.formWord.statuteId = this.curItem.id;
      this.formWord.chapter = "";
      this.tagsWordList = item.itemLabelNameList;
      this.getWordCapter();
      this.getWordDataList();
    },
    /**
     * 是否选中
     */
    isChoose(item) {
      let index = this.basisCheck[this.form.type].findIndex(
        e => e.id === item.id
      );
      return index != -1 ? "取消选中" : "选中";
    },
    isChooseWord(item) {
      let index = this.curItem.wordItems.findIndex(e => e.id === item.id);
      return index != -1 ? "取消选中" : "选中";
    },
    /**
     * 选择
     */
    chooseItem(item) {
      let index = this.basisCheck[this.form.type].findIndex(
        e => e.id === item.id
      );
      if (index != -1) {
        this.basisCheck[this.form.type].splice(index, 1);
      } else {
        this.basisCheck[this.form.type].push(item);
      }
      this.curItem = {};
      this.wordList = [];
      this.wordCapterList = [];
      this.wordTotalNum = 0;
      this.wordTotalPage = 0;
    },
    chooseItemWord(item) {
      let index = this.curItem.wordItems.findIndex(e => e.id === item.id);
      if (index != -1) {
        this.curItem.wordItems.splice(index, 1);
      } else {
        this.curItem.wordItems.push(item);
      }
    },
    /**
     * 判断是否选中
     */
    isActive(item) {
      return this.form.labelList.findIndex(e => e === item) != -1
        ? "active"
        : "";
    },
    isActiveWord(item) {
      return this.formWord.labelList.findIndex(e => e === item) != -1
        ? "active"
        : "";
    },
    /**
     * 添加或者移除标签
     */
    addOrRemoveTag(item) {
      let index = this.form.labelList.findIndex(e => e === item);
      if (index != -1) {
        this.form.labelList.splice(index, 1);
      } else {
        this.form.labelList.push(item);
      }
    },
    addOrRemoveTagWord(item) {
      let index = this.formWord.labelList.findIndex(e => e === item);
      if (index != -1) {
        this.formWord.labelList.splice(index, 1);
      } else {
        this.formWord.labelList.push(item);
      }
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    handleChangePageWord(page) {
      this.formWord.pageSize = page.pageSize;
      this.formWord.current = page.currentPage - 1;
      this.getWordDataList();
    },
    save() {
      this.curId === "0" ? this.createCheck() : this.updateCheck();
    },
    createCheck() {
      this.$http.basisBankService.createBasisCheck(this.basisCheck).then(() => {
        this.goBack();
      });
    },
    updateCheck() {
      this.$http.basisBankService
        .updateBasisCheck(this.curId, this.basisCheck)
        .then(() => {
          this.goBack();
        });
    },
    goBack() {
      this.saveBoxShow = false;
      this.goRoutePath("/basisBank/checkList", this.form.basisId);
    },
    /**
     * 路由跳转
     */
    goRoutePath(path, id = 0) {
      this.$router.push(path + "/" + id);
    },
    getWordCapter() {
      this.$http.basisBankService
        .getWordCapter(this.formWord.statuteId)
        .then(res => {
          this.wordCapterList = res.data;
        });
    },
    getWordList() {
      this.$http.basisBankService
        .getWordsList(this.formWord.statuteId, this.formWord)
        .then(res => {
          this.wordList = res.data.content;
          this.wordTotalNum = res.data.totalElements;
          this.wordTotalPage = res.data.totalPages;
        });
    },
    /**
     * 获取list
     */
    getDataList() {
      if (this.form.status === "1") {
        if (this.form.keyWords) {
          this.dataList = this.basisCheck[this.form.type].filter(item => {
            this.wordList = this.curItem.wordItems.filter(item => {
              let flag = this.form.labelList.length != 0 ? false : true;
              //   if(this.formWord.labelList.indexOf(item.labelList))
              if (item.labelList) {
                item.labelList.map(j => {
                  let index = this.form.labelList.indexOf(j);
                  if (index != -1) {
                    flag = true;
                  }
                });
              }
              if (flag && item.name.indexOf(this.form.keyWords || "") != -1) {
                return item;
              }
            });
          });
        } else {
          this.dataList = this.basisCheck[this.form.type];
        }
        this.totalPage = 0;
        this.totalNum = 0;
      } else {
        this.form.type === "statutes" ? this.getStatutes() : this.getStandars();
      }
    },
    getStatutes() {
      this.$http.basisBankService
        .getBasisBankStatutes(this.form.basisId, this.form)
        .then(res => {
          if (res.data) {
            this.dataList = res.data.content.map(item => {
              item.wordItems = [];
              return item;
            });
            this.totalPage = res.data.totalPages;
            this.totalNum = res.data.totalElements;
          } else {
            this.setDataEmpty();
          }
        });
    },
    setDataEmpty() {
      this.dataList = [];
      this.totalPage = 0;
      this.totalNum = 0;
    },
    getStandars() {
      this.$http.basisBankService
        .getBasisBankStandars(this.form.basisId, this.form)
        .then(res => {
          if (res.data) {
            this.dataList = res.data.content.map(item => {
              item.wordItems = [];
              return item;
            });
            this.totalPage = res.data.totalPages;
            this.totalNum = res.data.totalElements;
          } else {
            this.setDataEmpty();
          }
        });
    },
    getBasisBankTags() {
      this.$http.basisBankService
        .getBasisBankLabels(this.form.basisId, this.form)
        .then(res => {
          this.tagsList = res.data;
        });
    },
    getWordDataList() {
      if (!this.curItem) {
        return;
      }
      if (this.formWord.status === "1") {
        if (this.formWord.keyWords || this.formWord.labelList) {
          this.wordList = this.curItem.wordItems.filter(item => {
            let flag = this.formWord.labelList.length != 0 ? false : true;
            //   if(this.formWord.labelList.indexOf(item.labelList))
            if (item.labelList) {
              item.labelList.map(j => {
                let index = this.formWord.labelList.indexOf(j);
                if (index != -1) {
                  flag = true;
                }
              });
            }
            if (
              flag &&
              item.context.indexOf(this.formWord.keyWords || "") != -1
            ) {
              return item;
            }
          });
          //   this.formWord.labelList;
        } else {
          this.wordList = this.curItem.wordItems;
        }
        this.wordTotalPage = 0;
        this.wordTotalNum = 0;
      } else {
        this.getWordList();
        // this.form.type === 'statutes'
        //   ? this.getWordStatutes()
        //   : this.getWordStandars();
      }
      //    this.$http.status
    },
    getWordStatutes() {
      this.$http.statute.getWords(this.formWord).then(res => {
        this.wordList = res.data.content;
        this.wordTotalNum = res.data.totalElements;
        this.wordTotalPage = res.data.totalPages;
      });
    },
    getWordStandars() {
      this.$http.standardService.getWordList(this.formWord).then(res => {
        this.wordList = res.data.content;
        this.wordTotalNum = res.data.totalElements;
        this.wordTotalPage = res.data.totalPages;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.tools-bar {
  margin: 0 0 18px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tools-bar .tb-title {
  color: #343a45;
  font-weight: bold;
  display: inline-block;
}

.tools-bar .tb-title::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 15px;
  position: relative;
  top: 2px;
  margin-right: 6px;
  background: #26beff;
}
.saveBox {
  margin-top: 1em;
  padding: 1em;
  text-align: center;
  background-color: #ffffff;
}
.box {
  padding: 1em;
  margin: 0 0.5em;
  background-color: #ffffff;
}
.box2 {
  background-color: #f5f7fa;
  padding: 0.5em 1em;
  margin: 0 0 1em;
}
.rightAboslute {
  position: absolute;
  color: #9badcc;
  right: 0;
  top: 0.5em;
}
.active {
  background-color: #e1eafa;
}
.tagItem {
  border: 1px solid #e1eafa;
  display: inline-block;
  cursor: pointer;
  text-align: center;
  min-width: 80px;
  padding: 0.3em 0.6em;
  font-size: 12px;
  margin: 0 0.8em 0.5em;
  box-sizing: border-box;
}
.tagsSearchShowBox {
  position: relative;
  height: 2em;
  overflow: hidden;
}
.tagsSearchShowBox {
  position: relative;
  height: 2em;
  overflow: hidden;
}
.detailBox {
  padding: 1em;
  box-sizing: border-box;
  background-color: #ffffff;
}

.search-box {
  border-radius: 5px;
}

.search-row {
  padding: 1em 0;
  line-height: 40px;
  height: 40px;
  box-sizing: content-box;
}

.search-row > .el-col {
  //   margin-right: 30px;
  text-align: center;
}

.search-row .arror-down {
  margin-right: 5px;
}
</style>
