<template>
  <div style="position:relative" @click="handledefult">
    <div class="city-box">
      <el-input placeholder="请输入内容" v-model="inputCity" clearable @focus="handleFocus" :title="inputCity" @input="handleSearch"  >
      </el-input>
    </div>
    <el-collapse-transition>
      <div v-show="isShow" class="city-item-box" @click="isShow=false">
        <transition name="el-zoom-in-center">
          <div>
            <p class="no-data" v-show="isNoData">暂无数据！</p>
            <ul class="cityes-1 cityes">
              <li v-for='(items,index) of cityesCaptions' :key="index" :class="{'active':captionsIndex==items.id}" :id="items.id" data-index="1"
                @click="handleCaptions" :title="items.name">
                {{items.name}}
                <i class="el-icon-arrow-right"></i>
              </li>
            </ul>
          </div>
        </transition>
        <transition name="el-zoom-in-center">
          <ul class="cityes-2 cityes" v-show="index>0">
            <li v-for="(items,index) of cityesShi" :id="items.id" :key="index" :class="{'active':cityesShiIndex==items.id}" data-index="2"
              @click="handleCaptions" :title="items.name">
              {{items.name}}
              <i class="el-icon-arrow-right"></i>
            </li>
          </ul>
        </transition>
        <transition name="el-zoom-in-center">
          <ul class="cityes-3 cityes" v-show="index>1">
            <li v-for="(items,index) of citysArea" :id="items.id" :key="index" :class="{'active':citysAreaIndex==items.id}" data-index="3"
              @click="handleCity" :title="items.name">{{items.name}}</li>
          </ul>
        </transition>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cityesCaptions: [], //省会
      cityesShi: [], //市
      citysArea: [], //区县
      inputCity: "",
      isShow: false, //是否显示下拉面板
      isNoData: false, //是否无数据
      index: "", //当前显示的级别
      captionsIndex: "",
      cityesShiIndex: "",
      citysAreaIndex: ""
    };
  },
  props: ["rootId", "clear"],
  activated() {
    this.getCitys(this.rootId);
    let _this = this;
    this.inputCity = "";
    document.body.addEventListener("click", function() {
      _this.isShow = false;
    });
  },
  watch: {
    isShow(newVal, oldVal) {
      if (!newVal) {
        this.$emit("getCitys", this.inputCity);
      }
    },
    clear(newVal, oldVal) {
      this.inputCity = "";
    }
  },
  methods: {
    getCitys(id, index) {
      this.isNoData = false;
      this.$http.getKind(id).then(res => {
        if (!index) {
          this.cityesCaptions = res.data;
        } else if (index == 1) {
          if (!res.data.length) {
            this.isShow = false;
            this.index = 0;
            this.captionsIndex = id;
            return;
          }
          this.cityesShi = res.data;
          this.captionsIndex = id;
        } else {
          if (!res.data.length) {
            this.isShow = false;
            this.index = 1;
            this.cityesShiIndex = id;
            return;
          }
          this.citysArea = res.data;
          this.cityesShiIndex = id;
        }
      });
    },
    handleCaptions(e) {
      e.stopPropagation();
      if (e.target.id != 0) {
        this.getCitys(e.target.id, e.target.getAttribute("data-index"));
        this.index = e.target.getAttribute("data-index");
        this.inputCity = e.target.innerText;
      } else {
        this.isShow = false;
        this.inputCity = e.target.innerText;
        this.captionsIndex = e.target.id;
      }
    },
    handleSearch(e) {
      if (this.inputCity) {
        this.$http.getKindsForName("name=" + this.inputCity).then(res => {
          if (!res.data.length) {
            this.isNoData = true;
            this.clearState();
            this.cityesCaptions = [];
            return;
          }
          this.cityesCaptions = res.data;
          this.isNoData = false;
          this.index = 0;
        });
      } else {
        this.getCitys(this.rootId);
      }
    },
    // 确定城市
    handleCity(e) {
      this.isShow = false;
      this.inputCity = e.target.innerText;
      this.citysAreaIndex = e.target.id;
    },
    handleFocus(e) {
      this.isShow = true;
      e.stopPropagation();
    },
    //阻止冒泡
    handledefult(e) {
      e.stopPropagation();
    },
    // 清除状态
    clearState() {
      this.index = 0;
      this.captionsIndex = "";
      this.cityesShiIndex = "";
      this.citysAreaIndex = "";
    }
  }
};
</script>
<style scoped>
.city-box {
  width: 100%;
}

.cityes {
  margin-top: 20px;
  width: 150px;
  height: 200px;
  border: 1px solid #dcdfe6;
}

.cityes-1,
.cityes-2,
.cityes-3 {
  overflow-y: auto;
  background: #fff;
  float: left;
}

li {
  font-size: 14px;
  padding: 8px 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 1.3;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  outline: 0;
  text-align: left;
}

li i {
  position: absolute;
  right: 5px;
  top: 12px;
}

.city-item-box {
  position: absolute;
  top: 42px;
  z-index: 2;
  width: 480px;
}

.city-item-box ul {
  color: #606266;
  border: 1px solid #e4e7ed;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 4px;
  line-height: 30px;
  margin: 5px 0;
}

.no-data {
  position: absolute;
  top: 3px;
  left: 21px;
}

li:hover {
  background: #f5f7fa;
}

li.active {
  color: #409eff;
  font-weight: bold;
}

li.active i {
  font-weight: bold;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/

::-webkit-scrollbar {
  width: 3px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/

::-webkit-scrollbar-thumb {
  background-color: #0ae;
  border-radius: 10px;
  background-image: -webkit-gradient(
    linear,
    0 0,
    0 100%,
    color-stop(0.5, rgba(255, 255, 255, 0.2)),
    color-stop(0.5, transparent),
    to(transparent)
  );
}
</style>