<template>
  <div class="container">
    <div v-if="rtype==0">
      <div class="handle-box">
        <span>所属类型：</span>
        <el-select v-model="type" placeholder="请选择类型" class="handle-select mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option v-for="(item,index) in typelist" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>标题：</span>
        <el-input v-model="title" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getMarketReport">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addTypelists">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" align="center"></el-table-column>
        <el-table-column prop="label" label="标签" align="center"></el-table-column>
        <el-table-column prop="team" label="团队" align="center"></el-table-column>
        <el-table-column prop="views" label="浏览次数" width="80" align="center"></el-table-column>
        <el-table-column prop="times" label="时间" width="120" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateMarketReport(scope.row)">查看</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <div class="pagination">
          <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
            :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event)"
            @size-change="handleSizeChange($event)"></el-pagination>
        </div>
      </div>
    </div>
    <div v-else-if="rtype==1">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.push('/marketReport')" class="mr10">
        <h3 v-if="query.id">查看报告</h3>
        <h3 v-else>添加报告</h3>
      </div>
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="form.title" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="类型："  prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" class="handle-input mr10">
            <el-option v-for="(item,index) in typelist" :key="index" :label="item.name" :value="item.id.toString()">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团队：" prop="team">
          <el-input v-model="form.team" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="标签：" prop="label">
          <el-input v-model="form.label" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="时间：" prop="times">
          <el-date-picker v-model="form.times" value-format="yyyy-MM-dd" class="handle-input" type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片：" prop="coverPicture">
          <label for="inputId" icon="el-icon-plus">
            <img v-if="form.coverPicture" :src="form.coverPicture" class="img" />
            <img v-else src="~assets/img/headportrait.png" alt="" class="img">
            <input style="display: none" id="inputId" ref="input" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
          </label>
        </el-form-item>
        <el-form-item label="简介：" prop="introduction">
          <el-input v-model="form.introduction" :autosize="{ minRows: 4, maxRows: 6}" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="reporturl">
          <UEditor ref="ueditor"></UEditor>

        </el-form-item>

        <el-form-item>
          <el-button @click="$router.push('/marketReport')">返回</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </el-form-item>
      </el-form>

    </div>
 
  </div>
</template>
<script>
  import UEditor from '@/components/ueditor.vue'

  export default {
    data() {
      return {
        type: "all",
        query: {},
        title: "",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {
          coverPicture: ""
        },
        editVisible: false,
        isAdd: 0,
        title: '',
        rules: {
          type: [{ required: true, message: "请选择类型", trigger: "blur" }],
          title: [{ required: true, message: "请输入标题", trigger: "blur" }],
          team: [{ required: true, message: "请输入团队", trigger: "blur" }],
          label: [{ required: true, message: "请输入标签", trigger: "blur" }],
          reporturl:[{ required: true, message: "请输入内容", trigger: "blur" }],
          coverPicture:[{ required: true, message: "请上传时间", trigger: "blur" }],
          times:[{ required: true, message: "请输入时间", trigger: "blur" }],
          introduction:[{ required: true, message: "请输入简介", trigger: "blur" }],
        },
        typelist: [],
      };
    },
    watch: {
      $route(to, form) {
        this.getType()
      }
    },
    created() {
      this.getType()
    },
    methods: {
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.coverPicture = res.data;
          }
        });
      },
      getType() {
        this.query = this.$route.query;
        this.getTypelist()
        if (this.query.rtype) {
          this.rtype = this.query.rtype;
        } else {
          this.rtype = 0;
          this.getMarketReport();
        }
        if (this.query.id) {
          this.getMarketReportInfo()
        }
      },
      getTypelist() {
        this.$post("/market/getTypelist", {}).then(res => {
          if (res.code == 200) {
            this.typelist = res.data
          }
        })
      },
      getMarketReportInfo() {
        this.$post("/market/showMarketReport", {
          id: this.query.id
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
            this.$refs.ueditor.setUEContent(this.form.reporturl)

          }
        })
      },
      //获取数据
      getMarketReport() {
        this.$post("/market/getMarketReport", {
          type: this.type,
          title: this.title,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      addTypelists() {
        this.$router.push({ path: "/marketReport", query: { rtype: 1 } })
      },
      // 保存编辑
      saveEdit() {
        this.form.reporturl = this.$refs.ueditor.getUEContent();
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.query.id) {
              this.$post("/market/updateMarketReport", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/marketReport")
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/market/insertMarketReport", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/marketReport")
                  this.$message.success(res.msg)
                }
              })
            }
          }
        })
      },
      updateMarketReport(row) {
        this.$router.push({ path: "/marketReport", query: { rtype: 1, id: row.id } })
      },
      // 分页导航
      handlePageChange(val) {
        console.log(val)
        this.PageNumber = val;
        this.getMarketReport();
      },
      handleSizeChange(val) {
        this.PageSize = val;
        this.getMarketReport();
      }
    },
    components: {
      UEditor
    }
  };
</script>

<style lang="scss" scoped>
  .text {
    color: #6a6a6a;

  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 200px;
  }

  .handle-input {
    width: 400px;
    display: inline-block;
  }

  .handle-search {
    width: 300px;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
</style>