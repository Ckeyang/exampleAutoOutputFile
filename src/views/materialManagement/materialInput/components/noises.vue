<template>
    <div class="noisesInput">
        <h3 id="NOISES">噪声</h3>
        <el-form label-position="top">
            <div class="flexWrap">
                <div style="width:48%;margin:1%;" v-if="isShow('contactTimeLimit')">
                    <el-form-item label="噪声职业接触限值dB(A)">
                        <el-input v-model="model.contactTimeLimit"></el-input>
                    </el-form-item>
                </div>
                <div style="width:48%;margin:1%;" v-if="isShow('lexOfEightHours')">
                    <el-form-item>
                        <template slot="label">
                            L<sub>EX,8h</sub>
                        </template>
                        <el-input v-model="model.lexOfEightHours"></el-input>
                    </el-form-item>
                </div>
                <div style="width:48%;margin:1%;"  v-if="isShow('lexOfWeek')">
                    <el-form-item>
                        <template slot="label">
                            L<sub>EX,W</sub>
                        </template>
                        <el-input v-model="model.lexOfWeek"></el-input>
                    </el-form-item>
                </div>
                <div style="width:96%;margin:2%;">
                    <el-form-item label="工作场所脉冲噪声职业接触限值">
                        <el-table :data="model.noisesContactOfWorkplaceTable">
                            <el-table-column label="工作日接触脉冲次数限值(n,次)">
                            <template slot-scope="scope">
                                {{key[scope.row.occupationalHealthLimit]}}
                            </template>
                            </el-table-column>
                            <el-table-column label="声压级峰值dB(A)">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.spl" size="mini"></el-input>
                            </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </div>
                <div style="width:96%;margin:2%;">
                    <el-form-item label="非噪声工作地点噪声声级设计要求">
                        <el-table  :data="model.nonNoisesContactOfWorkplaceTable">
                            <el-table-column label="非噪声工作地点">
                            <template slot-scope="scope">
                                {{key[scope.row.occupationalHealthLimit]}}
                            </template>
                            </el-table-column>
                            <el-table-column label="噪声声级dB(A)">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.noiseLevel " size="mini"></el-input>
                            </template>
                            </el-table-column>
                            <el-table-column label="工效限值dB(A)">
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
  name: 'noisesInput',
  props: { model: Object, action: String  },
  data() {
    return {
      key: {
        LESS_HUNDRED: 'N<=100',
        BETWEEN_HUNDRED_THOUSAND:'100<N<=1000',
        GREATER_THOUSAND:'1000<N<=10000',
        NOISE_WORKSHOP_OFFICE:'噪声车间办公室',
        NON_NOISE_WORKSHOP_OFFICE:'非噪声车间办公室',
        CONFERENCE_ROOM:'会议室'
      }
    };
  },
  watch: {
    model: {
      handler(val) {
        this.$emit('update:model', val);
      },
      deep: true,
      immediate: true
    }
  },
  methods:{
     isShow(params) {
      if (!this.model[params] && this.action === "view") {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.noisesInput {
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
