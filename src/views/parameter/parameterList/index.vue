<template>
  <div style="height:100%">
      <div class="search-box box-style_common">
        <el-form ref="form" :model="form" label-width="70px">
          <el-row class="search-row">
            <el-col>
              <el-form-item label="关键字">
                <el-input v-model="form.name" size="small" placeholder="请输入关键字" clearable  @keyup.enter.native="getData"></el-input>
              </el-form-item>
            </el-col>
             <el-col style="width:220px">
              <el-button type="primary" size="small" icon="el-icon-search"  @click="getData">搜索</el-button>
              <el-button type="info" size="small" icon="el-icon-refresh" rund @click="resetForm">重置</el-button>
            </el-col>
          </el-row>
      </el-form>
    </div>
    <!-- 因素列表 -->
    <div class="diathesis-box regulation-tb box-style_common" style='height:calc(100% - 88px)'>
      <div class="tools-bar_common">
        <h5 class="table-title">参数列表</h5>
      </div>
      <el-table  :data="dataList"   style='width:100%'>
        <el-table-column label="参数名称" prop='name'>
        </el-table-column>
        <el-table-column label="用途描述" >
          <template slot-scope="scope">
            <div class="inline-edit" v-if='scope.row.isEdit'>
              <el-input v-model="scope.row.describtion" placeholder="请输入内容" size='mini' ></el-input>
              <div style="width:80px">
                <i class="iconfont icon-baocun"  @click='saveEdit(scope.row.id)'></i>
                <i class="iconfont icon-quxiao"  @click='closeEdit(scope.row.id)'></i>
              </div>
            </div>
            <div v-else class="inline-edit">
              <span>{{scope.row.describtion}}</span>
							<div style="width:80px">
								<i class="iconfont icon-xiugai" @click='editDescribe(scope.row.id)'></i>
							</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用途描述" width='100'>
          <template slot-scope="scope">
            <div  class="operation-icon">
              <i class="iconfont icon-guishuleibie"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>   
    </div>
  </div>
</template>
<script>
export default {
	name: 'parameterList',
	data() {
		return {
			form: {
				name
			},
			dataList: []
		};
	},
	methods: {
		getData() {},
		//修改描述
		editDescribe(id) {
			this.dataList = this.dataList.map((item) => {
				if (item.id === id) {
					item.isEdit = true;
				}
				return item;
			});
		},
		saveEdit(id) {
			// this.$http.
		},
		//取消编辑
		closeEdit(id) {
			this.dataList = this.dataList.map((item) => {
				if (item.id === id) {
					item.describtion = item.originDescribtion;
					item.isEdit = false;
				}
				return item;
			});
		},
		resetForm() {
			this.form.name = '';
			this.getData();
		}
	}
};
</script>
<style scoped>
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
.search-row > .el-col {
	margin-right: 30px;
	text-align: center;
	width: 280px;
}
.inline-edit {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: normal !important;
}
.inline-edit .icon-baocun,
.inline-edit .icon-xiugai {
	margin: 0 10px 0 15px;
}
.inline-edit i,
.operation-icon i {
	cursor: pointer;
	color: #26beff;
}
</style>
