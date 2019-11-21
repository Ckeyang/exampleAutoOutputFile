<template>
  <div style="width:100%">
    <div class="slider-box">
      <div class="slider-btn" @mousedown="handlerSliderDown" ref="sliderBtn" @mouseup="handlerSliderUp" :class="{'success-btn':isPass,'slider-btn_transtion':transtion}">
        <i class="slider-btn_icon" :class="{'slider-icon-error':failBg && !isDown,'slider-icon-arrow':isDown && !isPass,'slider-icon-success':isPass}"></i>
      </div>
      <span v-show="textShow" style="margin-left:45px">请按住滑块，拖动到最右边</span>
      <div class="bg-slider" ref="sliderBg" :class="{'success-bg':isPass,'slider-bg_transtion':transtion,'fail-bg':failBg}">
        <span v-show="isPass">验证成功</span>
      </div>
    </div>
  </div>
</template>
<script>
let mouseX, mouseY, sliderBtn, sliderBg; //分别为:初始点击的x坐标、初始点击的x坐标、滑动按钮元素、背景框元素
export default {
  data() {
    return {
      isDown: false, //鼠标是否按下
      isPass: false, //验证是否通过
      textShow: true, //提示文字是否显示
      transtion: false, //过渡效果
      failBg: false //每次滑动后是否失败
    };
  },
  methods: {
    //判断滑动是否成功
    handleIsPass() {
      if (!this.isPass && this.isDown) {
        sliderBtn.style.backgroundColor = "#f57a7a";
        this.failBg = true;
        this.transtion = true;
        this.$nextTick(() => {
          let timer = setTimeout(() => {
            sliderBtn.style.backgroundColor = "";
            this.transtion = true;
            this.failBg = false;
            this.$nextTick(() => {
              sliderBg.style.width = 50 + "px";
              sliderBtn.style.left = 0 + "px";
              clearTimeout(timer);
              this.textShow = true;
            });
          }, 500);
        });
      }
      return false;
    },
    //鼠标弹起事件
    handlerSliderUp() {
      this.handleIsPass();
      this.isDown = false;
    },
    //鼠标按住事件
    handlerSliderDown(e) {
      if (!this.isPass) {
        this.transtion = false;
        this.textShow = false;
        this.isDown = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        sliderBtn.style.backgroundColor = "#1991fa";
      }
    }
  },
  mounted() {
    sliderBtn = this.$refs.sliderBtn;
    sliderBg = this.$refs.sliderBg;
    document.addEventListener("mousemove", e => {
      if (this.isDown) {
        if (e.clientX - mouseX <= 214 && e.clientX - mouseX >= 0) {
          sliderBtn.style.left = e.clientX - mouseX + "px";
          sliderBg.style.width = e.clientX - mouseX + 55 + "px";
        } else if (sliderBtn.offsetLeft >= 205) {
          sliderBtn.style.left = 214 + "px";
          sliderBg.style.width = 214 + 50 + "px";
          this.isDown = false;
          this.isPass = true;
          this.failBg = false;
          this.$emit("isSliderPass", this.isPass);
        }
      }
    });
    document.addEventListener("mouseup", e => {
      this.handleIsPass();
      this.isDown = false;
    });
  }
};
</script>
<style scoped>
.slider-box {
  width: 100%;
  height: 40px;
  position: relative;
  border: 1px solid #e4e7eb;
  background: rgba(235, 242, 255, 1);
  text-align: center;
  line-height: 40px;
  border-radius: 24px;
  box-sizing: border-box;
  font-size: 14px;
  color: rgba(155, 173, 204, 1);
}

.slider-btn_icon {
  display: inline-block;
  position: absolute;
  top: 50%;
  margin-top: -6px;
  left: 50%;
  margin-left: -6px;
  width: 14px;
  height: 10px;
  background: url("../../assets/icon_light.f13cff3.png") no-repeat 0 -26px;
  background-size: 34px 471px;
}

.slider-btn {
  width: 56px;
  border-radius: 2px;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background 0.2s linear;
  z-index: 22;
  cursor: pointer;
  border-radius: 24px;
}

.slider-btn:hover .slider-btn_icon {
  background-position: 0 -13px;
}

.slider-icon-error {
  background-position: 0 -83px !important;
}

.slider-icon-arrow {
  background-position: 0 -13px;
}

.slider-icon-success {
  background-position: 0 0 !important;
}

.slider-btn_transtion {
  transition: left 0.4s;
}

.slider-bg_transtion {
  transition: width 0.4s;
}

.slider-btn:hover {
  background-color: #1991fa;
}

.bg-slider {
  width: 56px;
  height: 100%;
  background: #d1e9fe;
  border-radius: 2px;
  position: absolute;
  top: 0px;
  left: 0px;
  border: 1px solid #1991fa;
  box-sizing: border-box;
  border-radius: 24px;
  font-size: 14px;
  color: #52ccba;
  border-right: none !important;
  line-height: 37px;
}

.success-btn {
  background-color: #52ccba !important;
  box-shadow: 0 0 3px #52ccba;
}

/* .fail-btn {
        background-color: #f57a7a !important;
    } */

.fail-bg {
  border: 1px solid#f57a7a !important;
  background-color: #fce1e1;
}

.success-bg {
  border: 1px solid#52ccba;
  background-color: #d2f4ef;
}

.border {
  border: 1px solid transparent;
}
</style>
