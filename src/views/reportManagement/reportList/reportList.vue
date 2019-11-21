<template>
  <div class="content-warp">
    <search-box :from="form">
      <template slot="input">
        <el-col :span="5">
          <el-form-item label="状态" v-show="$route.params.action==='all'">
            <el-select v-model="form.status" style="width:100%" @change="getDataList(true)">
              <el-option label="全部" value></el-option>
              <el-option label="发布版" value="PUBLISH"></el-option>
              <el-option label="待审版" value="AUDIT"></el-option>
              <el-option label="草稿版" value="DRAFT"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="模板类型">
            <el-select
              v-model="form.templateTypeEnum"
              style="width:100%"
              @change="getDataList(true)"
            >
              <el-option label="全部" value></el-option>
              <el-option
                v-for="(item,index) in templateTypeEnums"
                :value="item.key"
                :key="index"
                :label="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="业务类别">
            <el-cascader
              :options="categories"
              clearable
              :show-all-levels="false"
              @change="getDataList(true)"
              v-model="form.evaluationCategoryList"
              :props="{label:'name',children:'childList',value:'id'}"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="关键字">
            <el-input v-model="form.keyWords" size="medium" placeholder="关键词" @keyup.enter.native="getDataList" clearable></el-input>
          </el-form-item>
        </el-col>
      </template>
      <template slot="button">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </template>
    </search-box>
    <div class="regulation-tb box-style_common">
      <div class="tools-bar_common">
        <h5 class="tb-title">报告模板列表</h5>
        <div style="float: right;">
          <el-button size="small" icon="iconfont icon-banbenguanlian" @click="goRelation">
            版本关联
          </el-button>
            <el-button
              size="small"
              icon="iconfont icon-shunxu"
              @click="
                sortBoxVisible = true;
              "
              >设置顺序</el-button
            >
          <el-button
            v-if="checkAuth('RBAC_PERMISSION_api_app_report_templates_POST')"
            type="success"
            size="small"
            icon="el-icon-plus"
            class="entry-btn"
            @click="addReportTemplate"
          >新增报告模板</el-button>
        </div>
      </div>
      <el-table :data="dataList"
            :max-height="winHeight - 340">
         <template slot="empty">
            <br/>
            <br/>
            <img src="@/assets/empty.png"/>
            <br/>
            <span>暂无数据</span>
            <br/>
            <br/>
            <br/>
            <br/>
        </template>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div style="backgournd-color:#cccccc">
              <el-table class="expandTable" :data="scope.row.history" :show-header="false">
                <el-table-column label="业务类别" prop="evaluationCategoryName"  width="150"></el-table-column>
                <el-table-column label="模板类型" prop="templateTypeEnum"  width="220">
                  <template slot-scope="sc">
                    {{templateTypeEnumsKey[sc.row.templateTypeEnum]}}</template>
                </el-table-column>
                <el-table-column label="状态" prop="status" width="90">
                  <template slot-scope="sc">
                      <el-tag
                        size="mini"
                        :type="statusEnumsKey[sc.row.status].color"
                      >{{statusEnumsKey[sc.row.status].name}}</el-tag>
                    <!-- {{statusEnumsKey[sc.row.status].name}} -->
                  </template>
                </el-table-column>
                <el-table-column label="模板名称" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="版本时间" width="130">
                  <template
                    slot-scope="sc"
                  >{{sc.row.versionDate | formatDate("yyyy-MM-dd hh:mm")}}</template>
                </el-table-column>
                <el-table-column label="发布时间" width="130">
                  <template
                    slot-scope="sc"
                  >{{sc.row.publishedDate | formatDate("yyyy-MM-dd hh:mm")}}</template>
                </el-table-column>
                <el-table-column width="200">
                  <template slot-scope="sc">
                    <div class="operation-icon">
                       <i
                        title="预览"
                        class="iconfont icon-i-yulan"
                        @click="goReportTempalte(sc.row.id,'view')"
                      >预览</i>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="业务类别" prop="evaluationCategoryName"  width="150"></el-table-column>
        <el-table-column label="模板类型" prop="templateTypeEnum"  width="220">
          <template slot-scope="scope">{{templateTypeEnumsKey[scope.row.templateTypeEnum]}}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="90">
          <template slot-scope="scope">
             <el-tag
              size="mini"
              :type="statusEnumsKey[scope.row.status].color"
            >{{statusEnumsKey[scope.row.status].name}}</el-tag>
            <!-- <span class="cus-tags-style">{{statusEnumsKey[scope.row.status].name}}</span> -->
            <!-- {{statusEnumsKey[scope.row.status].name}} -->
          </template>
        </el-table-column>
        <el-table-column label="模板名称" prop="name" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column label="发布时间" prop="lastUpdate"><template slot-scope="scope">{{translateDateTime(scope.row.lastUpdate)}}</template></el-table-column> -->
        <el-table-column label="版本时间" width="130">
          <template
            slot-scope="scope"
          >{{scope.row.versionDate | formatDate("yyyy-MM-dd hh:mm")}}</template>
        </el-table-column>
        <el-table-column label="发布时间" width="130">
          <template
            slot-scope="scope"
          >{{scope.row.publishedDate | formatDate("yyyy-MM-dd hh:mm")}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <div class="operation-icon">
              <i
                v-if="scope.row.status==='AUDIT'&&checkAuth('RBAC_PERMISSION_api_app_report_templates_{identifier}_{id}_audit_PUT')"
                title="审核"
                class="iconfont icon-shenhe"
                @click="autidReport(scope.row)"
              >审核</i>
              <i
                v-if="((scope.row.status==='DRAFT')||(scope.row.status==='REJECTED')||scope.row.draft)&&checkAuth('RBAC_PERMISSION_api_app_report_templates_{identifier}_{id}_submit_PUT')"
                title="提交审核"
                class="iconfont icon-shenhe"
                @click="publishReport(scope.row)"
              >提交审核</i>
              <i
                title="预览"
                class="iconfont icon-i-yulan"
                @click="goReportTempalte(scope.row.id,'view')"
              >预览</i>
              <i
                v-if="scope.row.status==='PUBLISH'&&checkAuth('RBAC_PERMISSION_api_app_report_templates_{identifier}_{id}_PUT')"
                title="修订"
                class="iconfont icon-xiugai"
                @click="showReviseBox(scope.row)"
              >修订</i>
              <i
                v-if="((scope.row.status==='DRAFT')||(scope.row.status==='REJECTED'))&&checkAuth('RBAC_PERMISSION_api_app_report_templates_{identifier}_{id}_PUT')"
                title="编辑"
                class="iconfont icon-xiugai"
                @click="goReportTempalte(scope.row.id,'edit')"
              >编辑</i>
              <i
                v-if="scope.row.status==='DISABLE'&&checkAuth('RBAC_PERMISSION_api_app_report_templates_{identifier}_{id}_enable_PUT')"
                title="启用"
                class="iconfont icon-qiyong"
                @click="updateReportStatus(scope.row)"
              >启用</i>
              <i
                v-if="scope.row.status==='PUBLISH'&&!scope.row.draft&&checkAuth('RBAC_PERMISSION_api_app_report_templates_{identifier}_{id}_disable_PUT')"
                title="停用"
                class="iconfont icon-tingyong"
                @click="updateReportStatus(scope.row)"
              >停用</i>
              <!-- <i class="iconfont icon-fuzhi icon-edit" @click="doCopy(scope.row.id,scope.row.version)">复制</i> -->
              <i
                v-if="((scope.row.status==='DRAFT')||(scope.row.status==='REJECTED'))"
                title="删除"
                class="iconfont icon-shanchu"
                @click="doDelete(scope.row.identifier,scope.row.id)"
              >删除</i>
              <i
                title="记录"
                class="iconfont icon-jilu"
                @click="viewLog(scope.row)"
              >记录</i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagniation :totalPage="totalPage" :currentPage='form.current' :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
    </div>
    <el-dialog title="设置顺序" :visible.sync="sortBoxVisible" width="34%" :close-on-click-modal="false">
      <el-form ref="sortParams" :model="sortParams" :rules="sortParamsRule" @submit.native.prevent>
        
        <el-form-item label="业务类别" prop="evaluationCategory">
           <el-cascader
            size="small"
            :options="categories"
            clearable
            :show-all-levels="false"
            v-model="evaluationCategory"
            @change="getCategorie"
            :props="{label:'name',children:'childList',value:'id'}"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="模板类型" prop="reportType">
             <el-select
                v-model="sortParams.reportType"
                style="width:100%"
                size="small"
                @change="getReportTemplateConfigs"
              >
                <el-option
                  v-for="(item,index) in reportTypeEnums"
                  :value="item.key"
                  :key="index"
                  :label="item.value"
                ></el-option>
              </el-select>
        </el-form-item>
      </el-form>
      <p style="font-size:12px;color:#96A2B3;margin-top:10px;">PS：拖曳操作直接影响报告最终输出时候的先后组装顺序。分割操作用于分割 整套报告，生成互不干扰的连贯页码。 </p>
      <br/>
      <sort-box roWkey="identifier" v-model="sortParams.reportTemplateConfigs" :props="ruleProps" :isDivision="true"></sort-box>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sortBoxVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="saveReportTemplateConfigs" size="medium">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增模板" :visible.sync="showReportForm" width="30%" :close-on-click-modal="false">
      <el-form :rules="rule" ref="reportTemplate" :model="reportTemplate" label-position="top">
        <el-form-item label="业务类别" prop="evaluationCategory">
          <el-cascader
            size="small"
            :options="categories"
            clearable
            :show-all-levels="false"
            v-model="evaluationCategory"
            @change="getCategorie"
            :props="{label:'name',children:'childList',value:'id'}"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="模板类型"
          prop="templateTypeEnum"
        >
         <el-select
            v-model="reportTemplate.templateTypeEnum"
            style="width:100%"
            size="small"
          >
            <el-option
              v-for="(item,index) in templateTypeEnums"
              :value="item.key"
              :key="index"
              :label="item.value"
            ></el-option>
          </el-select>
          <!-- <el-radio-group v-model="reportTemplate.templateTypeEnum">
            <el-radio v-for="(item,index) in templateTypeEnums" :key="index" :label="item.key">
              <template>{{item.value}}</template>
            </el-radio>
          </el-radio-group> -->
        </el-form-item>
        <el-form-item
          label="采样方式"
          prop="samplingMethod"
          v-show="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'||reportTemplate.templateTypeEnum==='SAMPLING_RECORD_TABLE'||reportTemplate.templateTypeEnum==='COMMON_WORK_RECORD'"
        >
          <el-select size="small" style="width:100%" v-model="reportTemplate.samplingMethod">
            <el-option
              v-for="(item,index) in getSamplingMethod(reportTemplate.samplingMethod)"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="采样方式对应共享件"
          prop="samplingMethodShareComponentId"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'||reportTemplate.templateTypeEnum==='SAMPLING_RECORD_TABLE'||reportTemplate.templateTypeEnum==='COMMON_WORK_RECORD'"
        >
          <el-select
            size="small"
            style="width:100%"
            v-model="reportTemplate.samplingMethodShareComponentId"
            filterable
          >
            <el-option
              v-for="(jtem,jndex) in shartList"
              :key="jndex"
              :value="jtem.id"
              :label="jtem.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- EXPERIMENTAL_ORIGINAL_RECORD_TABLE -->
        <el-form-item
          label="适用物质"
          prop="substanceType"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'||reportTemplate.templateTypeEnum==='EXPERIMENTAL_ORIGINAL_RECORD_TABLE'||reportTemplate.templateTypeEnum==='SAMPLING_RECORD_TABLE'||reportTemplate.templateTypeEnum==='COMMON_WORK_RECORD'"
        >
          <el-radio-group v-model="reportTemplate.substanceType" @change="reportTemplate.substances=[]">
            <el-radio label="INCLUDED">已收录物质 &nbsp;  <span v-if="reportTemplate.substanceType==='INCLUDED'"><el-button size="mini" @click="showFilterMaterial=true" type="primary">添加物质</el-button><span style="color:#E6902E">&nbsp;&nbsp;已添加{{reportTemplate.substances.length}}条</span></span></el-radio>
            <el-radio label="NOT_INCLUDED">未收录物质</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="适用物质对应共享件"
          prop="substanceShareComponentId"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'||reportTemplate.templateTypeEnum==='EXPERIMENTAL_ORIGINAL_RECORD_TABLE'||reportTemplate.templateTypeEnum==='SAMPLING_RECORD_TABLE'||reportTemplate.templateTypeEnum==='COMMON_WORK_RECORD'"
        >
          <el-select
            size="small"
            style="width:100%"
            v-model="reportTemplate.substanceShareComponentId"
            filterable
          >
            <el-option
              v-for="(jtem,jndex) in shartList"
              :key="jndex"
              :value="jtem.id"
              :label="jtem.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item
          label="物质类别"
          prop="materialCategory"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'"
        >
          <el-radio-group v-model="reportTemplate.materialCategory">
            <el-radio
              v-for="(item,index) in materialTypeTree"
              :key="index"
              :label="item.substanceCategoryType"
              @change="reportTemplate.limitSpecifiedList=['']"
            >
              <template>{{item.name}}</template>
            </el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item
          label="限值规定"
          prop="limitSpecifiedList"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'"
        >
          <div
            class="pd1"
            v-show="reportTemplate.materialCategory==='CHEMISTRY'"
            v-for="(j,jndex) in reportTemplate.limitSpecifiedList"
            :key="jndex"
          >
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[jndex]">
              <el-option
                v-for="(item,index) in chemisties"
                :key="index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
            <i class="iconfont icon-jia" @click="addLimitSpecified()"></i>
            <i class="iconfont icon-jian" v-if="jndex>=1" @click="removeLimitSpecified(jndex)"></i>
          </div>
          <div
            class="pd1"
            v-show="reportTemplate.materialCategory==='BIOLOGY'"
            v-for="(j,jndex) in reportTemplate.limitSpecifiedList"
            :key="'test'+jndex"
          >
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[jndex]">
              <el-option
                v-for="(item,index) in biologies"
                :key="'BIOLOGY'+index+'-'+jndex"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
            <i class="iconfont icon-jia" @click="addLimitSpecified()"></i>
            <i class="iconfont icon-jian" v-if="jndex>=1" @click="removeLimitSpecified(jndex)"></i>
          </div>
          <div class="pd1" v-show="reportTemplate.materialCategory==='PHYSICS'">
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[0]">
              <el-option
                v-for="(item,index) in keys"
                :key="'PHYSICS'+index+'-0'"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <div class="pd1" v-if="reportTemplate.materialCategory==='OTHER'">
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[0]">
              <el-option label="无限值" value></el-option>
            </el-select>
          </div>
          <div class="pd1" v-if="reportTemplate.materialCategory==='DISSOCIATE_SILICA'">
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[0]">
              <el-option label="游离类SiO₂" value></el-option>
            </el-select>
          </div>
        </el-form-item> -->
        <!-- <el-form-item
          label="物质对应共享件"
          prop="substanceShareComponentId"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'"
        >
          <el-select
            size="small"
            style="width:100%"
            v-model="reportTemplate.substanceShareComponentId"
            filterable
          >
            <el-option
              v-for="(jtem,jndex) in shartList"
              :key="jndex"
              :value="jtem.id"
              :label="jtem.name"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="模板名称" prop="name">
          <el-input size="medium" v-model.trim="reportTemplate.name"></el-input>
        </el-form-item>
        <el-form-item label="模板描述" prop="description">
          <el-input size="medium" type="textarea" v-model.trim="reportTemplate.description"></el-input>
        </el-form-item>
        <el-form-item label="报告模板" prop="documentSource ">
          <el-radio-group
            v-model="reportTemplate.documentSource"
            @change="reportTemplate.documentAddress='';fileName=''"
          >
            <el-radio label="ONLINE" style="display:block;margin-top:1em;margin-left:0;">
              <template>新建模板</template>
            </el-radio>
            <el-radio label="COPY" style="display:block;margin-top:1em;margin-left:0;">
              <template>
                引用模板 &nbsp;&nbsp;&nbsp;&nbsp;
                <el-select
                  size="mini"
                  v-show="reportTemplate.documentSource==='COPY'"
                  v-model="reportTemplate.documentAddress"
                  filterable
                  remote
                  @focus="remoteMethod('')"
                  :remote-method="remoteMethod"
                  :loading="loading">
                  <el-option
                    v-for="(item,index) in allTemplateList"
                    :key="index"
                    :label="item.name+'     ['+item.evaluationCategoryName+'+'+item.typeName+']'"
                    :value="item.documentAddress"
                  ></el-option>
                </el-select>
                <!-- <el-select
                  size="mini"
                  
                  v-show="reportTemplate.documentSource==='COPY'"
                  v-model="reportTemplate.documentAddress"
                >
                  <el-option
                    v-for="(item,index) in allTemplateList"
                    :key="index"
                    :label="item.name"
                    :value="item.documentAddress"
                  ></el-option>
                </el-select> -->
              </template>
            </el-radio>
            <el-radio label="UPLOAD" style="display:block;margin-top:1em;margin-left:0;">
              <template>
                上传模板 &nbsp;&nbsp;&nbsp;&nbsp;
                {{fileName}}
                <el-button
                  v-loading.fullscreen.lock="fullscreenLoading"
                  element-loading-text="报告导入中"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  element-loading-spinner="el-icon-loading"
                  v-show="reportTemplate.documentSource==='UPLOAD'"
                  class="pr"
                  type="primary"
                  size="mini"
                >
                  上传模板
                  <input class="displayInput" type="file" @change="doUpdate">
                </el-button>
              </template>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label prop="documentAddress" v-show="reportTemplate.documentSource!='ONLINE'"></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showReportForm=false">取消</el-button>
        <el-button type="primary" @click="doSave">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="curItem.status==='DISABLE'?'启用模板':'停用模板'"
      :visible.sync="showReportEnableBox"
      :close-on-click-modal="false"
      width="30%">
      <el-form :model="curItem" label-position="top">
        <el-form-item v-if="curItem.status==='DISABLE'" label="修订内容" prop="log" :rules="{
              required: true, message: '必填', trigger: 'blur'
            }">
          <el-input size="medium" type="textarea" maxlength="200" rows="3" v-model.trim="curItem.enabledRemark"></el-input>
        </el-form-item>
        <el-form-item v-else label="修订内容" prop="log" :rules="{
            required: true, message: '必填', trigger: 'blur'
          }">
          <el-input size="medium" type="textarea" maxlength="200" rows="3" v-model.trim="curItem.disabledRemark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showReportEnableBox=false">取消</el-button>
        <el-button type="primary" @click="doUpdateEnable">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修订" :visible.sync="reviseBox" width="30%">
      <span>PS:修订的模板，需要审核通过才会生效</span>
      <el-form :rules="rule" ref="reportTemplate" :model="reportTemplate" label-position="top">
        <el-form-item label="业务类别" prop="evaluationCategory">
          <el-cascader
            disabled
            size="small"
            :options="categories"
            clearable
            :show-all-levels="false"
            v-model="evaluationCategory"
            @change="getCategorie"
            :props="{label:'name',children:'childList',value:'id'}"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="模板类型"
          prop="templateTypeEnum"
        >
          <el-select
            v-model="reportTemplate.templateTypeEnum"
            style="width:100%"
            disabled
            size="small"
          >
            <el-option
              v-for="(item,index) in templateTypeEnums"
              :value="item.key"
              :key="index"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="采样方式"
          prop="samplingMethod"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'||reportTemplate.templateTypeEnum==='SAMPLING_RECORD_TABLE'||reportTemplate.templateTypeEnum==='COMMON_WORK_RECORD'"
        >
          <el-select
            size="small"
            style="width:100%"
            v-model="reportTemplate.samplingMethod"
            disabled
          >
            <el-option
              v-for="(item,index) in getSamplingMethod(reportTemplate.samplingMethod)"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="采样方式对应共享件"
          prop="samplingMethodShareComponentId"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'||reportTemplate.templateTypeEnum==='SAMPLING_RECORD_TABLE'||reportTemplate.templateTypeEnum==='COMMON_WORK_RECORD'"
        >
          <el-select
            size="small"
            style="width:100%"
            v-model="reportTemplate.samplingMethodShareComponentId"
            filterable
          >
            <el-option
              v-for="(jtem,jndex) in shartList"
              :key="jndex"
              :value="jtem.id"
              :label="jtem.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="适用物质"
          prop="substanceType"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'||reportTemplate.templateTypeEnum==='EXPERIMENTAL_ORIGINAL_RECORD_TABLE'||reportTemplate.templateTypeEnum==='SAMPLING_RECORD_TABLE'||reportTemplate.templateTypeEnum==='COMMON_WORK_RECORD'"
        >
          <el-radio-group v-model="reportTemplate.substanceType" @change="reportTemplate.substances=[]">
            <el-radio label="INCLUDED">已收录物质 &nbsp;  <span v-if="reportTemplate.substanceType==='INCLUDED'"><el-button size="mini" @click="showFilterMaterial=true" type="primary">添加物质</el-button><span style="color:#E6902E">&nbsp;&nbsp;已添加{{reportTemplate.substances.length}}条</span></span></el-radio>
            <el-radio label="NOT_INCLUDED">未收录物质</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="适用物质对应共享件"
          prop="substanceShareComponentId"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'||reportTemplate.templateTypeEnum==='EXPERIMENTAL_ORIGINAL_RECORD_TABLE'||reportTemplate.templateTypeEnum==='SAMPLING_RECORD_TABLE'||reportTemplate.templateTypeEnum==='COMMON_WORK_RECORD'"
        >
           <el-select
            size="small"
            style="width:100%"
            v-model="reportTemplate.substanceShareComponentId"
            filterable
          >
            <el-option
              v-for="(jtem,jndex) in shartList"
              :key="jndex"
              :value="jtem.id"
              :label="jtem.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item
          label="物质类别"
          prop="materialCategory"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'"
        >
          <el-radio-group v-model="reportTemplate.materialCategory" disabled>
            <el-radio
              v-for="(item,index) in materialTypeTree"
              :key="index"
              :label="item.substanceCategoryType"
              @change="reportTemplate.limitSpecifiedList=['']"
            >
              <template>{{item.name}}</template>
            </el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item
          label="限值规定"
          prop="limitSpecifiedList"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'"
        >
          <div
            class="pd1"
            v-show="reportTemplate.materialCategory==='CHEMISTRY'"
            v-for="(j,jndex) in reportTemplate.limitSpecifiedList"
            :key="jndex"
          >
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[jndex]" disabled>
              <el-option
                v-for="(item,index) in chemisties"
                :key="index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <div
            class="pd1"
            v-show="reportTemplate.materialCategory==='BIOLOGY'"
            v-for="(j,jndex) in reportTemplate.limitSpecifiedList"
            :key="'test'+jndex"
          >
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[jndex]" disabled>
              <el-option
                v-for="(item,index) in biologies"
                :key="'BIOLOGY'+index+'-'+jndex"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <div class="pd1" v-show="reportTemplate.materialCategory==='PHYSICS'">
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[0]" disabled>
              <el-option
                v-for="(item,index) in keys"
                :key="'PHYSICS'+index+'-0'"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <div class="pd1" v-if="reportTemplate.materialCategory==='OTHER'">
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[0]" disabled>
              <el-option label="无限值" value></el-option>
            </el-select>
          </div>
          <div class="pd1" v-if="reportTemplate.materialCategory==='DISSOCIATE_SILICA'">
            <el-select size="small" v-model="reportTemplate.limitSpecifiedList[0]" disabled>
              <el-option label="游离类SiO₂含量" value></el-option>
            </el-select>
          </div>
        </el-form-item> -->
        <!-- <el-form-item
          label="物质对应共享件"
          prop="substanceShareComponentId"
          v-if="reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'"
        >
          <el-select
            size="small"
            style="width:100%"
            v-model="reportTemplate.substanceShareComponentId"
            filterable
          >
            <el-option
              v-for="(jtem,jndex) in shartList"
              :key="jndex"
              :value="jtem.id"
              :label="jtem.name"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="模板名称" prop="name">
          <el-input size="medium" v-model.trim="reportTemplate.name"></el-input>
        </el-form-item>
        <el-form-item label="模板描述" prop="description">
          <el-input size="medium" type="textarea" v-model.trim="reportTemplate.description"></el-input>
        </el-form-item>
        <el-form-item label prop="documentAddress" v-show="reportTemplate.documentSource!='ONLINE'"></el-form-item>
      </el-form>
      <!-- <el-form :model="curItem" label-position="top">
        <el-form-item label="模板名称" prop="name">
          <el-input size="medium" v-model.trim="curItem.name"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="evaluationBigCategory">
          <el-input size="medium" :value="curItem.evaluationCategoryName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input size="medium" type="textare" v-model.trim="curItem.description"></el-input>
        </el-form-item>
      </el-form>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviseBox=false">取消</el-button>
        <el-button type="primary" @click="doRevice">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提交审核" :visible.sync="publishBox" width="30%" :close-on-click-modal="false">
      <el-form ref="publishForm" label-position="top" :model="curItem" @submit.native.prevent>
        <el-form-item label="修订记录" prop="log" :rules="{
      required: true, message: '必填', trigger: 'blur'
    }">
          <el-input rows="10" type="textarea" v-model="curItem.log"></el-input>
        </el-form-item>
        <el-form-item label="修订范围" v-if="curItem.publishedDate">
                <div>
                  <el-radio v-model="versionType" label="UPDATE">更新版本</el-radio>
                  <el-tooltip placement="top-start" effect="light" :offset="30">
                    <div slot="content" class="tips-content">更新版本指：非实质性内容变动，将覆盖原模板，不生<br/>成新版本，版本时间不会变化，无需做版本关联！</div>
                    <i class="tooltips-icon iconfont icon-wenhaomiaoshu"></i>
                  </el-tooltip>
                </div>
                <div>
                  <el-radio v-model="versionType" label="UPGRADE">升级版本</el-radio>
                  <el-tooltip placement="top-start" effect="light" :offset="30">
                    <div slot="content" class="tips-content">
                      升级版本指：实质性内容变动，不覆盖原模板，直接<br/>生成新版本，版本时间会变化，需做版本关联！
                    </div>
                    <i class="tooltips-icon iconfont icon-wenhaomiaoshu"></i>
                  </el-tooltip>
                </div>
          <!-- <el-radio-group v-model="versionType">
            <el-radio label="UPDATE">更新版本</el-radio>
            <el-radio label="UPGRADE">升级版本</el-radio>
          </el-radio-group> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="publishBox=false">取消</el-button>
        <el-button type="primary" @click="doCheckNameDesc('publishForm')">确定</el-button>
      </span>
    </el-dialog>
    
    <el-dialog title="报告模板的修订记录" :visible.sync="logsBox" width="50%" :close-on-click-modal="false">
      <el-table :data="logsList">
        <el-table-column label="操作日志" prop="action"></el-table-column>
        <el-table-column label="版本时间" prop="versionDate">
          <template slot-scope="scope">{{scope.row.versionDate}}</template>
        </el-table-column>
        <el-table-column label="发布时间" prop="publishDate">
          <template slot-scope="scope">{{scope.row.publishDate}}</template>
        </el-table-column>
        <el-table-column label="修订记录" prop="log">
          <template slot-scope="scope"><el-popover trigger="click" width="300" placement="right"><span>{{scope.row.log}}</span><i slot="reference" class="iconfont icon-jilu"></i></el-popover></template>
        </el-table-column>
      </el-table>
      <pagniation :totalPage="logsTotalPages" :currentPage='logsForm.current' :totalNum="logsTotal" @changePage="handleChangeLogsPage"></pagniation>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="20%">
      <span>是否通过此版本?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectTemplate()">不通过</el-button>
        <el-button type="primary" @click="publishReportTempalte()">通过</el-button>
      </span>
    </el-dialog>
          <filterMaterial :visible.sync="showFilterMaterial" v-model="reportTemplate.substances"></filterMaterial>
  </div>
</template>
<script>
import highlightWords from "@/components/tools/HighlightWords.vue";
import pagniation from "@/components/tools/Pagniation.vue";
import preview from "@/components/tools/Preview.vue";
import SearchBox from "@/components/tools/searchBox.vue";
import SortBox from "@/components/tools/sortBox.vue";
import filterMaterial from "@/components/tools/filterMaterial/index.vue";
import { mapGetters } from "vuex";
export default {
  name: "reportList",
  components: { highlightWords, SortBox, SearchBox, pagniation, preview ,filterMaterial },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["checkAuth"])
  },
  data() {
    return {
      totalPage: 0,
      totalNum: 0,
      showReportForm: false,
      showReportEnableBox: false,
      showFilterMaterial:false,
      dialogVisible: false,
      sortBoxVisible:false,
      sortParams:{
        evaluationCategory:"",
        reportType:"",
        reportTemplateConfigs:[]
      },
      sortParamsRule:{evaluationCategory:{required:true,message:"必填"},reportType:{required:true,message:"必填"}},
      ruleProps: [
        { key: "name", label: "模板名称" },
        { key: "description", label: "模板描述" }
      ],
      versionType: "PUBLISH",
      reviseBox: false,
      publishBox: false,
      reportTemplate: {},
      chemisties: [
        { key: "MAC", value: "MAC" },
        { key: "PC-TWA", value: "PC-TWA" },
        { key: "PC-STEL", value: "PC-STEL" },
        { key: "EL", value: "EL" },
        { key: "PC-TWA总尘", value: "PC-TWA总尘" },
        { key: "PC-TWA呼尘", value: "PC-TWA呼尘" },
        { key: "IDLH浓度", value: "IDLH浓度" }
      ],
      biologies: [
        { key: "MAC", value: "MAC" },
        { key: "PC-TWA", value: "PC-TWA" },
        { key: "PC-STEL", value: "PC-STEL" }
      ],
      keys: [
        { key: "POWER_FREQUENCY_ELECTRIC_FIELD", value: "工频电场" },
        { key: "HAND_VIBRATION", value: "手传振动" },
        { key: "MICROWAVE", value: "微波辐射" },
        { key: "ULTRAVIOLET_RADIATION", value: "紫外辐射（紫外线）" },
        { key: "HF_ELECTROMAGNETIC_FIELD", value: "高频电磁场" },
        { key: "UHF_RADIATION", value: "超高频辐射" },
        // { key: "NON_NOISE_WORK_PLACE", value: "非噪声工作地点噪声" },
        // { key: "NOISE_WORK_PLACE_OF_PULSE", value: "工作场所脉冲噪声" },
        { key: "ARC_WELDING_LIGHT", value: "紫外辐射（电焊弧光）" },
        { key: "NOISES", value: "噪声" },
        { key: "HIGH_TEMPERATURE", value: "高温" },
        { key: "ILLUMINATION", value: "照度" }
      ],
      templateTypeEnums: [
        { key: "DETECTION_PLAN", value: "检测方案" },
        { key: "SAMPLE_TRANSFER_ORDER", value: "样品交接单" },
        { key: "EXPERIMENTAL_ORIGINAL_RECORD_TABLE", value: "实验原始记录表" },
        { key: "SURVEY_RECORD_TABLE", value: "现场记录表/调查记录表" },
        { key: "SAMPLING_RECORD_TABLE", value: "现场记录表/采样记录表" },
        { key: "BASICGENERALINFORMATION", value: "检测报告/基础通用信息" },
        { key: "DETECTIONRESULTREPORT", value: "检测报告/检测结果报告" },
        { key: "COMMON_WORK_RECORD", value: "通用工作记录" },
        { key: "EVALUATION_REPORT", value: "评价报告" },
        { key: "ATTACHMENT", value: "检测报告/附件" }
      ],
      reportTypeEnums:[
        { key: "DETECTION_PLAN", value: "检测方案" },
        { key: "SAMPLE_TRANSFER_ORDER", value: "样品交接单" },
        { key: "EXPERIMENTAL_ORIGINAL_RECORD_TABLE", value: "实验原始记录表" },
        { key: "SITE_RECORD_TABLE", value: "现场记录表" },
        { key: "COMMON_WORK_RECORD", value: "通用工作记录" },
        { key: "EVALUATION_REPORT", value: "评价报告" },
        { key: "FINAL_REPORT", value: "检测报告" }
      ],
      templateTypeEnumsKey: {
        DETECTION_PLAN: "检测方案" ,
        SAMPLE_TRANSFER_ORDER: "样品交接单" ,
        EXPERIMENTAL_ORIGINAL_RECORD_TABLE: "实验原始记录表" ,
        SURVEY_RECORD_TABLE: "现场记录表/调查记录表" ,
        SAMPLING_RECORD_TABLE: "现场记录表/采样记录表" ,
        BASICGENERALINFORMATION: "检测报告/基础通用信息" ,
        DETECTIONRESULTREPORT: "检测报告/检测结果报告" ,
        COMMON_WORK_RECORD: "通用工作记录",
        EVALUATION_REPORT: "评价报告",
        ATTACHMENT: "检测报告/附件" 
      },
      statusEnumsKey: {
        REJECTED:{name: "审核不通过", color: "danger" },
        DISABLE: { name: "停用", color: "danger" },
        AUDIT: { name: "审核", color: "" },
        PUBLISH: { name: "发布", color: "success" },
        DRAFT: { name: "草稿", color: "info" },
        STALE: { name: "已过时", color: ""}
      },
      samplingMethodList: [],
      categories: [],
      fileName: "",
      rule: {
        categoryType: { required: true, message: "必填" },
        evaluationCategory: { required: true, message: "必填" },
        substanceType:{required:true,
        validator: this.checkSubstanceType,message:"必填"},
        materialCategory: {
          required: true,
          validator: this.checkParamsTwo,
          message: "必填"
        },
        name: { required: true, message: "必填" },
        samplingMethod: {
          required: true,
          validator: this.checkParamsTwo,
          message: "必填"
        },
        samplingMethodShareComponentId: {
          required: true,
          message: "必填"
        },
        substanceShareComponentId: {
          required: true,
          message: "必填"
        },
        templateTypeEnum: {
          required: true,
          message: "必填"
        }
      },
      evaluationCategory: [],
      allTemplateList: [],
      materialTypeTree: [],
      fullscreenLoading: false,
      loading:false,
      logsBox:false,
      logsForm:{
        current:0,
        pageSize:30
      },
      logsList:[],
      logsTotal:0,
      logsTotalPages:0,
      curId: "",
      shartList: [],
      materialList:[],
      curItem: {},
      status: "",
      form: {
        keyWords: "",
        pageSize: 30,
        current: 0,
        evaluationCategoryList: []
      },
      dataList: []
    };
  },
  watch: {
    sortParams:{
      handler(val){
        this.$forceUpdate();
      },
      deep:true,
      immediate:true
    },
    $route() {
      this.status = this.$route.params.action;
      this.form.current = 0;
      this.form.projectState = "";
      this.getDataList();
    },
    showReportForm(val) {
      if (!val) {
        this.$refs["reportTemplate"].resetFields();
      }
    },
    sortBoxVisible(val){
      if (!val&&this.$refs["sortParams"]) {
        this.$refs["sortParams"].resetFields();
        this.sortParams.reportTemplateConfigs=[];
      }
    }
  },
  activated() {
    this.status = this.$route.params.action;
    this.getDataList();
    // this.getSamplingMethodList();
    this.getMaterialCategories();
    this.getCategories();
    // this.getLaboratoryList();
    // this.getShartList();
  },
  methods: {
    goRelation(){
      this.$router.push('/reportTemplateManagement/relation')
    },
    // getLaboratoryList(){
    //   this.$http.materialService.getMaterial({}).then(res=>{
    //     this.materialList=res.data;
    //   })
    // },
    getReportTemplateConfigs(){
      let {
        categoryType,
        evaluationCategory,
        reportType,
      }=this.sortParams;
      this.$http.reportService.getReportTemplateConfigs({
        categoryType,
        evaluationCategory,
        reportType,
      }).then(res=>{this.sortParams.reportTemplateConfigs=res.data;})
    },
    saveReportTemplateConfigs(){
      if(this.sortParams.reportTemplateConfigs.length===0){
        this.$message.info("没有模板可以配置")
        return 
      }
      this.$http.reportService.putReportTemplateConfigs(this.sortParams).then(()=>{this.sortBoxVisible=false;});
      
    },
    doUpdate($event) {
      let file = $event.target.files[0];
      this.fileName = file.name;
      if (file.name.indexOf(".docx") === -1) {
        this.$message.error("报告只支持 docx 格式的word文档");
        return;
      }
      $event.target.value = "";
      let formData = new FormData();
      formData.append("upload", file);
      this.fullscreenLoading = true;
      this.$http.fileService
        .uploadFile(formData)
        .then(res => {
          this.reportTemplate.documentAddress = res.data;
        })
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    getShartList() {
      this.$http.sharedPartsService
        .getSharedPartsList({
          evaluationCategory: this.reportTemplate.evaluationCategory
        })
        .then(res => {
          this.shartList = res.data;
        });
    },
    has(str1 = "", str2 = "") {
      if (!str1) {
        return false;
      }
      return str1.indexOf(str2) !== -1 ? true : false;
    },
    checkParamsOne(rule, value, callback) {
      if (
       
        !value
      ) {
        // this.reportTemplate.templateTypeEnum==='DETECTIONRESULTREPORT'
        callback("必填");
      } else {
        callback();
      }
    },
    checkParamsTwo(rule, value, callback) {
      if (
        !value.trim() && this.reportTemplate.reportType === "SAMPLING_RECORD_TABLE" && this.reportTemplate.reportType === "DETECTIONRESULTREPORT"
        && this.reportTemplate.reportType === "COMMON_WORK_RECORD"
      ) {
        callback("必填");
      } else {
        callback();
      }
    },
    checkParamsThree(rule, value, callback) {
      if (
        !value[0] &&
        this.reportTemplate.materialCategory !== "OTHER" &&
        this.reportTemplate.materialCategory !== "DISSOCIATE_SILICA"
      ) {
        callback("必填");
      } else {
        callback();
      }
    },
    checkSubstanceType(rule, value, callback){
      if(!this.reportTemplate.substanceType){
        callback("必填");
      }else if(this.reportTemplate.substanceType==='INCLUDED'&&this.reportTemplate.substances.length===0){
        callback("必需选一个物质");
      }else {
        callback();
      }
    },
    addLimitSpecified() {
      this.reportTemplate.limitSpecifiedList.push("");
    },
    removeLimitSpecified(index) {
      this.reportTemplate.limitSpecifiedList.splice(index, 1);
    },
    getMaterialCategories() {
      this.$http.reportService.getCategoryNotIncluded({}).then(res => {
        this.materialTypeTree = this.reloadMaterialType(res.data);
      });
    },
    reloadCategories(data) {
      let result = [];
      data.map(item => {
        let { id, name, childList } = item;
        if (childList && childList.length > 0) {
          result.push({
            id: id,
            name: name,
            childList: this.reloadCategories(childList)
          });
        } else {
          result.push({
            id: id,
            name: name
          });
        }
      });
      return result;
    },
    /**
     * 过滤subclass为空
     */
    reloadMaterialType(data) {
      let result = [];
      data.map(item => {
        let {
          id,
          name,
          rankType,
          parentId,
          substanceCategoryType,
          applicationType,
          subclass,
          templateId
        } = item;
        if (subclass.length > 0) {
          result.push({
            id: id,
            name: name,
            rankType: rankType,
            applicationType: applicationType,
            parentId: parentId,
            substanceCategoryType: substanceCategoryType,
            templateId: templateId,
            subclass: this.reloadMaterialType(subclass)
          });
        } else {
          result.push({
            id: id,
            name: name,
            rankType: rankType,
            applicationType: applicationType,
            parentId: parentId,
            substanceCategoryType: substanceCategoryType,
            templateId: templateId
          });
        }
      });
      return result;
    },
    getCategorieByType(params="") {
      let result = this.categories.find(item => {
        if (item.id === (params||this.reportTemplate.categoryType)) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    getCategorieByTypeForm() {
      let result = this.categories.find(item => {
        if (item.id === this.form.categoryType) {
          return item;
        }
      });
      return result ? result.childList : [];
    },
    /**
     * 修订
     */
    doRevice() {
      this.reportTemplate.evaluationCategory = this.evaluationCategory[
        this.evaluationCategory.length - 1
      ];
      this.$http.reportService
        .reviceReport(this.reportTemplate.identifier, this.reportTemplate.id, this.reportTemplate)
        .then(res => {
          this.reviseBox = false;
          this.goReportTempalte(res.data, "edit");
        })
        .then(this.getDataList);
    },
    /**
     * 审核
     */
    autidReport(item) {
      this.curId = item.id;
      this.curItem = item;
      this.dialogVisible = true;
      // this.$confirm("是否通过此版本?", "", {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: "通过",
      //   cancelButtonText: "不通过",
      //   type: "warning"
      // })
      //   .then(() => {})
      //   .catch(action => {
      //     if (action === "cancel") {
      //       this.$http.reportService
      //         .rejectTemplate(item.id)
      //         .then(this.getDataList);
      //     }
      //   });
    },
    publishReportTempalte() {
      this.dialogVisible = false;
      this.$http.reportService
        .publishReportTempalte(this.curItem.identifier,this.curId, this.curItem)
        .then(()=>{setTimeout(()=>{this.getDataList()},1000)});
    },
    rejectTemplate() {
      this.dialogVisible = false;
      this.$http.reportService
        .rejectTemplate(this.curItem.identifier,this.curId)
        .then(this.getDataList);
    },
    publishReport(item) {
      this.curId = item.draft || item.id;
      item.draft ? this.getTempalteDetail(this.curId) : (this.curItem = item);
      this.versionType = item.publishedDate ? "UPDATE" : "PUBLISH";
      this.publishBox = true;
    },
    /**
     * 启用
     */
    doUpdateEnable() {
      let action = this.curItem.status === "DISABLE" ? "enable" : "disable";
      if(action==='enable'&&!this.curItem.enabledRemark){
        this.$message.error("必填修订内容")
        return;
      }
      if(action==='disable'&&!this.curItem.disabledRemark){
        this.$message.error("必填修订内容")
        return ;
      }
      this.$http.reportService
        .disableOrEnableTemplate(this.curItem.identifier,this.curItem.id, action, this.curItem)
        .then(() => {
          this.$message.success("修改成功");
          this.showReportEnableBox = false;
        })
        .then(this.getDataList);
    },
    /**
     * 展示修订框
     */
    showReviseBox(item) {
      // console.log(item)
      this.reportTemplate = item;
      item.draft ? this.getTempalteDetail(item.draft) : null;
      // console.log(this.reportTemplate.evaluationCategory);
      // console.log(this.reportTemplate)
      let list = this.reportTemplate.evaluationCategory.split("-");
      this.evaluationCategory = this.getEvaluationCategoryList(list);
      this.getCategorie(this.evaluationCategory);
      this.reviseBox = true;
    },
    getEvaluationCategoryList(list) {
      let length = list.length;
      let result = [];
      let str = "";
      for (let i = 0; i < length; i++) {
        str += "-" + list[i];
        result.push(str.substr(1, str.length - 1));
      }
      result = result.splice(1, result.length);
      return result;
    },
    getTempalteDetail(id) {
      this.$http.reportService.getReporTemplateById(id).then(res => {
        this.reportTemplate = res.data;
        this.curItem = res.data;
      });
    },
    viewLog(item){
      this.logsForm.identifier=item.identifier;
      this.logsForm.current=0;
      this.logsForm.pageSize=30;
      this.logsBox=true;
      this.getReportLogs();
    },
    getReportLogs(){
       this.$http.reportService.getReportLogs(this.logsForm.identifier,this.logsForm).then(res=>{
         this.logsList=res.data.content;
         this.logsTotal=res.data.totalElements;
         this.logsTotalPages=res.data.totalPages;
       })
    },
    /**
     * 执行状态
     */
    updateReportStatus(item) {
      this.curItem = JSON.parse(JSON.stringify(item));
      this.showReportEnableBox = true;
    },
    doCopy(id, version) {
      this.$http.reportService
        .copyReportTemplate(id + "/" + (version || 0))
        .then(() => {
          this.getDataList();
        });
    },
    resetForm() {
      this.form = {
        keyWords: "",
        pageSize: 30,
        current: 0,
        templateTypeEnum: "",
        status: "",
        evaluationCategoryList: []
      };
      this.getDataList();
    },
    doDelete(identifier,id) {
      this.$confirm("是否删除此草稿？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.reportService
          .deleteReportTemplate(identifier,id)
          .then(this.getDataList);
      });
    },
    /**
     * 保存表单
     */
    doSave() {
      this.reportTemplate.evaluationCategory = this.evaluationCategory[
        this.evaluationCategory.length - 1
      ];
      this.doCheckNameDesc("reportTemplate");
    },

    /**
     * 翻译时间
     */
    translateDateTime(dateTime) {
      if (!dateTime) {
        return "";
      }
      let lastUpdate = dateTime;
      let now = new Date(lastUpdate);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      if (month < 10) {
        month = "0" + month;
      }
      return year + "-" + month + "-" + date;
    },
    /**
     * 检查表单
     */
    doCheckNameDesc(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.publishBox = false;
          form === "publishForm"
            ? this.doPublish()
            : this.createReportTemplate();
          // this.$refs[form].resetFields();
        } else {
          return false;
        }
      });
    },
    doPublish() {
      // this.curItem.version =
      //   this.versionType === "T"
      //     ? this.curItem.version + 0.1
      //     : this.curItem.version
      //     ? this.curItem.version + 1
      //     : 1;
      // this.curItem.version = Math.floor(this.curItem.version * 10) / 10;
      this.curItem.versionOperation = this.versionType;
      this.curItem.operation = this.versionType;
      this.$http.reportService
        .auditTemplate(this.curItem.identifier,this.curId, this.curItem)
        .then(() => {
          this.$message.success("提交成功");
          this.getDataList();
        });
    },
    /**
     * 创建一个report
     */
    createReportTemplate() {
      this.$http.reportService
        .createReportTemplate(this.reportTemplate)
        .then(res => {
          this.showReportForm = false;
          this.getDataList();
          this.goReportTempalte(res.data, "edit");
          this.$refs["reportTemplate"].resetFields();
        });
    },
    /**
     * 获取行业分类
     */
    getCategories() {
      this.$http.advisoryCategoryService
        .getAdvisoryCategoryTree().then(res => {
        this.categories = res.data.childList;
      });
    },
    getSamplingMethodList(val) {
      this.$http.takeExampleService.getList({categoryId:val[0]}).then(res => {
        this.samplingMethodList =res.data||[];
      });
    },
    getSamplingMethod(samplingMethod){
    return  this.samplingMethodList.filter(item=>{if(item.id===samplingMethod||item.enableOrDisable === "ENABLE"){return item}})
    },
    /**
     * 获取分类
     */
    getCategorie(val) {
      this.reportTemplate.evaluationCategory = val[val.length - 1];
      this.sortParams.evaluationCategory=val[val.length - 1];
      this.getShartList();
      this.getSamplingMethodList(val);
      // this.reportTemplate.name = val
      //   .map((i) => this.getCategoryName(this.categories, i))
      //   .toString();
    },
    getCategoryName(list, val) {
      let result = "";
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === val) {
          result = list[i].name;
          break;
        }
        if (list[i].children) {
          result = this.getCategoryName(list[i].children, val);
          if (result) {
            break;
          }
        }
      }
      return result;
    },
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getDataList();
    },
    handleChangeLogsPage(page){
      this.logsForm.pageSize = page.pageSize;
      this.logsForm.current = page.currentPage - 1;
      this.getReportLogs();
    },
    goReportTempalte(id, action, version = 0) {
      let localPath =
        location.href.split(this.$route.path)[0] +
        "/reportTemplate/" +
        id +
        "/" +
        action +
        "/" +
        version;
      window.open(localPath);
    },
    /**
     * 添加报告模板
     */
    addReportTemplate() {
      this.reportTemplate = {
        description: "",
        documentSource: "ONLINE",
        documentAddress: "",
        evaluationCategory: "",
        limitSpecifiedList: [""],
        substances:[],
        materialCategory: "OTHER",
        name: "",
        samplingMethod: "",
        templateTypeEnum: ""
      };
      this.fileName = "";
      this.evaluationCategory = [];
      this.showReportForm = true;
    },

    /**
     * 获取列表
     */
    getDataList(flag = false) {
      if (flag) {
        this.form.current = 0;
      }
      this.form.evaluationCategory = this.form.evaluationCategoryList[
        this.form.evaluationCategoryList.length - 1
      ];
      // this.getAllTemplateList();
      switch (this.status) {
        case "publish":
          this.$http.reportService
            .getReportTemplateListPublish(this.form)
            .then(res => {
              this.dataList = res.data.content;
              this.totalPage = res.data.totalPages;
              this.totalNum = res.data.totalElements;
            });
          break;
        case "checkPending":
          this.$http.reportService
            .getReportTemplateListAudit(this.form)
            .then(res => {
              this.dataList = res.data.content;
              this.totalPage = res.data.totalPages;
              this.totalNum = res.data.totalElements;
            });
          break;
        case "manuscript":
          this.$http.reportService
            .getReportTemplateListDraft(this.form)
            .then(res => {
              this.dataList = res.data.content;
              this.totalPage = res.data.totalPages;
              this.totalNum = res.data.totalElements;
            });
          break;
        default:
          this.$http.reportService
            .getReportTemplateList(this.form)
            .then(res => {
              this.dataList = res.data.content;
              this.totalPage = res.data.totalPages;
              this.totalNum = res.data.totalElements;
            });
      }
      // this.$http.reportService.getReportTemplateList(this.form).then((res) => {
      //   this.dataList = res.data.content;
      //   this.totalPage = res.data.totalPages;
      //   this.totalNum = res.data.totalElements;
      // });
    },
    remoteMethod(query) {
      this.loading = true;
      this.getAllTemplateList(query);
    },
    getAllTemplateList(query) {
      this.$http.reportService
        .getAllTemplateList({ evaluationCategory: this.evaluationCategory[0], keyWords: query })
        .then(res => {
            this.loading = false;
          this.allTemplateList = res.data;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.pr {
  position: relative;
}
.displayInput {
  opacity: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  position: absolute;
  left: 0;
  top: 0;
}
.el-table__expanded-cell {
  padding: 1em 0;
}
.selfDesign {
  color: #26beff;
  border: 1px solid #26beff;
}
.tagLabel {
  font-size: 14px;
  color: #5d687a;
  padding: 1em 0;
}
.chooseTagColor {
  color: #fff;
  background-color: #26beff;
}
.tagColor {
  background-color: #e1eafa;
}
.tagItem {
  display: inline-block;
  cursor: pointer;
  text-align: center;
  min-width: 80px;
  padding: 0.5em 1em;
  font-size: 12px;
  margin: 0 1.1em 1em;
  box-sizing: border-box;
}
.search-box {
  background: #fff;
  border-radius: 5px;
}

.tagLabel {
  font-size: 14px;
  color: #5d687a;
  padding: 1em 0;
}

.chooseTagColor {
  color: #fff;
  background-color: #26beff;
}

.tagColor {
  background-color: #e1eafa;
}

.tagItem {
  display: inline-block;
  text-align: center;
  min-width: 80px;
  padding: 0.5em 1em;
  font-size: 12px;
  margin: 0 1.1em 1em;
  box-sizing: border-box;
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

.search-row > .el-col {
  margin-right: 30px;
  text-align: center;
  width: 270px;
}
.pd1 {
  padding: 1em 0;
}
</style>
