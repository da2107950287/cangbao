<template>
  <div class="container">
    <div v-if="!$route.query.isAdd">
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
          <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>新闻公司：</span>
        <el-input v-model="newsName" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
        <span>新闻标题：</span>
        <el-input v-model="newsTitle" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getNews">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addNews">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="newsTitle" label="新闻标题" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.newsPurl" lazy class="img"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="newsName" label="新闻公司" align="center"></el-table-column>
        <el-table-column prop="newsTime" label="发布时间" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateNewsState(scope.row)">
              <span v-if="scope.row.state==1">下架</span>
              <span v-else>上架</span>
            </el-button>
            <el-button type="primary" size="mini" @click="updateNews(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
          :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <div v-if="$route.query.isAdd">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="新闻公司：">
          <el-input v-model="form.newsName" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="新闻标题：">
          <el-input v-model="form.newsTitle" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="新闻标签：">
          <el-checkbox-group v-model="form.label">
            <el-checkbox v-for="(item,index) in labelsList" :label="item.dicName" :key="index">{{item.dicName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="新闻时间：">
          <el-date-picker v-model="form.newsTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
            class="handle-input" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="新闻图片：" prop="newsPurl" class="personal-icon">
          <label for="inputId" icon="el-icon-plus">
            <img v-if="form.newsPurl" :src="form.newsPurl" />
            <img v-else src="~assets/img/headportrait.png" alt="">
            <input style="display: none" id="inputId" ref="input" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
          </label>
        </el-form-item>
        <el-form-item label="新闻内容：" prop="content">
          <UEditor ref="ueditor"></UEditor>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.push('/news')">取 消</el-button>
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
        newsName: '',
        newsTitle: '',
        state: "all",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        labelsList: [],
        form: {
          newsPurl: "",
          label: []
        },
        editVisible: false,
        isAdd: false,
        title: '',
        rules: {
          dicType: [{ required: true, message: "请选择类型", trigger: "blur" }],
          dicName: [{ required: true, message: "请输入名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
        },
        statesList: [
          { id: "all", name: "全部" },
          { id: 1, name: "上架" },
          { id: 2, name: "下架" }
        ],
      };
    },
    watch: {
      $route(to, from) {
        this.getNewInfo()
        if (this.$route.query.isAdd) {
          this.getAllDictionary()
        }
      },
    },
    mounted() {
      this.getNews();
      this.getNewInfo()
      if (this.$route.query.isAdd) {
        this.getAllDictionary()
      }
    },
    methods: {
      //消息列表
      getNews() {
        this.$post("/other/getNews", {
          newsName: this.newsName,
          newsTitle: this.newsTitle,
          state: this.state,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取标签列表
      getAllDictionary() {
        this.$post("/other/getAllDictionary", {
          dicType: "1"
        }).then(res => {
          if (res.code == 200) {
            this.labelsList = res.data;
          }
        })
      },
      addNews() {
        this.$router.push({ path: "/news", query: { isAdd: true } })
      },
      updateNews(row) {
        this.$router.push({ path: "/news", query: { newsId: row.newsId, isAdd: false } })
      },
      getNewInfo() {
        if (this.$route.query.newsId) {
          this.$post("/other/showNews", {
            newsId: this.$route.query.newsId
          }).then(res => {
            if (res.code == 200) {
         
              this.form = res.data;
              let labelArr = this.form.label.split(" ")
              for (let i = 0; i < labelArr.length; i++) {
                console.log(labelArr[i])
                labelArr[i] = labelArr[i].replace(/#/, "")
              }
              this.form.label = labelArr;
              this.$refs.ueditor.setUEContent(res.data.content)
            }
          })
        }

      },
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.newsPurl = res.data;
          }
        });
      },
      //修改新闻状态
      updateNewsState(row) {
        let state;
        if (row.state == 1) {
          state = 2
        } else {
          state = 1
        }
        this.$post("/other/updateNewsState", {
          newsId: row.newsId,
          state
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getNews()
          }
        })
      },
      // 保存编辑
      saveEdit() {
        this.form.content = this.$refs.ueditor.getUEContent();
        this.$refs.form.validate(valid => {
          if (valid) {
            let labelArr = this.form.label;
            for (let i = 0; i < labelArr.length; i++) {
              labelArr[i] = "#" + labelArr[i]
            }
            this.form.label = labelArr.join(" ")
            if (this.isAdd) {
              this.$post("/other/insertNews", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.$router.push("/news")
                }
              })
            } else {
              this.$post("/other/updateNews", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.$router.push("/news")

                }
              })
            }
          }

        })
      },
      // 分页导航
      handlePageChange(val) {
        this.PageNumber = val;
        this.getNews();
      }
    },
    components: {
      UEditor
    }
  };
</script>

<style lang="scss" scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-search {
    width: 200px;
  }

  .handle-select {
    width: 400px;
  }

  .handle-input {
    width: 400px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .img {
    max-width: 200px;
    max-height: 100px;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
</style>