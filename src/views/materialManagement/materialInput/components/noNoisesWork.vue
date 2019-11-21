<template>
  <div class="baseInput">
    <h3 id="NON_NOISE_WORK_PLACE">非噪声工作地点噪声限值规定</h3>
    <el-form label-position="top">
      <div class="flexWrap">
        <div style="width:96%;margin:2%;">
          <el-form-item label="非噪声工作地点噪声声级设计要求">
            <el-table :data="model">
              <el-table-column label="非噪声工作地点">
                <template slot-scope="scope">{{key[scope.row.occupationalHealthLimit]}}</template>
              </el-table-column>
              <el-table-column label="噪声声级dB(A)" prop="noiseLevel">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.noiseLevel" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="工效限值dB(A)" prop="limitOfErgonomics">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.limitOfErgonomics" size="mini"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "NON_NOISE_WORK_PLACE",
  props: { model: Array },
  watch: {
    model: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      key: {
        NOISE_WORKSHOP_OFFICE: "噪声车间办公室",
        NON_NOISE_WORKSHOP_OFFICE: "非噪声车间办公室",
        CONFERENCE_ROOM: "会议室"
      }
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.baseInput {
  background-color: #ffffff;
  padding: 1em;
  .flexWrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>
