<template>
  <div class="container">
    <div class="handle-box">
      <span>新闻公司：</span>
      <el-input v-model="newsName" clearable class="handle-search mr10"></el-input>
      <span>新闻标题：</span>
      <el-input v-model="newsTitle" clearable class="handle-search mr10"></el-input>
      <span>状态：</span>
      <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
        <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getData">搜索</el-button>
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
          <el-button type="primary" size="mini" @click="updateNews(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
        :total="pageTotal" @current-change="handlePageChange"></el-pagination>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="title" center :visible.sync="editVisible" width="800">
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
          <editor-bar :value="form.content" v-model="form.content"></editor-bar>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import EditorBar from "@/components/wangeditor/WangEditor.vue";
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
      editVisible() {
        if (!this.editVisible) {
          this.form = {
            newsPurl: "",
            label: [],
          }
        } else {
          this.getAllDictionary()
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      //获取数据
      getData() {
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
      //获取标签
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
        this.editVisible = true;
        this.isAdd = true;
        this.title = "添加新闻";
      },
      updateNews(row) {
        this.editVisible = true;
        this.title = "编辑新闻";
        this.isAdd = false;
        this.$post("/other/showNews", {
          newsId: row.newsId
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
            let labelArr= this.form.label.split(" ")
            for (let i = 0; i < labelArr.length; i++) {
              console.log(labelArr[i])
              labelArr[i] = labelArr[i].replace(/#/,"")
            }
            this.form.label=labelArr
          }
        })
      },
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("myfile", file);
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
            this.getData()
          }
        })
      },
      // 保存编辑
      saveEdit() {

        this.$refs.form.validate(valid => {
          if (valid) {
            this.editVisible = false;
            let labelArr = this.form.label;
            for (let i = 0; i < labelArr.length; i++) {
              labelArr[i] = "#" + labelArr[i]
            }
            this.form.label=labelArr.join(" ")
            console.log(this.form)

            if (this.isAdd) {
              this.$post("/other/insertNews", this.form).then(res => {
                if (res.code == 200) {
                  this.getData()
                  this.$message.success(res.msg)
                }
              })
            } else {
              console.log(this.form)
              this.$post("/other/updateNews", this.form).then(res => {
                if (res.code == 200) {
                  this.getData()
                  this.$message.success(res.msg)
                }
              })
            }
          }

        })
      },
      // 分页导航
      handlePageChange(val) {
        this.PageNumber = val;
        this.getData();
      }
    },
    components: {
      EditorBar
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
    width: 100px;
    height: 50px;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
</style>