<template>
  <div class="diathesis-box regulation-tb box-style_common" v-show='isShow'>
    <div class="tools-bar_common">
      <h5 class="table-title">具体限值规定-噪声</h5>
    </div>
    <ul>
      <li class="list-box-1 list-box">
        <div>
          <p class="title">工作场所脉冲噪声职业接触限值</p>
          <p class="num">{{dataList.contactTimeLimit}}</p>
        </div>
        <div>
          <p class="title">Lex,8HdB (A)</p>
          <p class="num">{{dataList.lexOfEightHours}}</p>
        </div>
        <div>
          <p class="title">Lex,8wdB (A)</p>
          <p class="num">{{dataList.lexOfWeek}}</p>
        </div>
      </li>
      <li class="list-box-2 list-box">
        <p style="font-size:12px;margin-bottom:10px;color:#3C4551">工作场所脉冲噪声职业接触限值</p>
        <el-table
          :data="dataList.noisesContactOfWorkplaceTable"
          style="width:100%"
          border
          size="small"
        >
          <el-table-column label="工作日接触脉冲次数限值（n，次）">
            <template slot-scope="scope">
              <span>{{transformValue(scope.row.occupationalHealthLimit)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="声压级峰值dB（A）" prop="spl"></el-table-column>
        </el-table>
      </li>
      <li class="list-box-3 list-box">
        <p style="font-size:12px;margin-bottom:10px;color:#3C4551">非噪声工作地点噪声声级设计要求</p>
        <el-table
          :data="dataList.nonNoisesContactOfWorkplaceTable"
          style="width:100%"
          border
          size="small"
        >
          <el-table-column label="非噪声工作地点">
            <template slot-scope="scope">
              <span>{{transformValue(scope.row.occupationalHealthLimit)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="噪声声级dB(A)" prop="noiseLevel"></el-table-column>
          <el-table-column label="工效限值dB(A)" prop="limitOfErgonomics"></el-table-column>
        </el-table>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "noise",
  props: ["dataList"],
  computed:{
    isShow(){
      return !Array.isArray(this.dataList)
    }
  },
  methods: {
    transformValue(type) {
      switch (type) {
        case "LESS_HUNDRED":
          return "N <= 100";
        case "BETWEEN_HUNDRED_THOUSAND":
          return "100 < N <= 1000";
        case "GREATER_THOUSAND":
          return "N > 1000";
        case "NOISE_WORKSHOP_OFFICE":
          return "噪声车间办公室";
        case "NON_NOISE_WORKSHOP_OFFICE":
          return "非噪声车间办公室";
        case "CONFERENCE_ROOM":
          return "会议室";
      }
    }
  }
};
</script>

<style scoped>
.list-box {
  margin-bottom: 20px;
}
.list-box-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-box-1 .num {
  background: #fafcff;
  border: 1px solid rgba(213, 224, 237, 1);
  height: 30px;
  line-height: 30px;
  text-indent: 10px;
  border-radius: 5px;
  font-size: 12px;
  color: #3c4551;
}
.list-box-1 > div {
  width: 32%;
}
.list-box-1 p.title {
  font-size: 12px;
  color: #3c4551;
  margin-bottom: 5px;
}
</style>
