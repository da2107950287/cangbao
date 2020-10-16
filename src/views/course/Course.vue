<template>
  <div class="container">
    <!-- 课程列表 -->
    <div v-if="type==0">
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
          <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>课程类型：</span>
        <el-select v-model="couType" placeholder="请选择类型" class="handle-search mr10">
          <el-option v-for="(item,index) in dictionarysList" :key="index" :label="item.dicName" :value="item.dicId">
          </el-option>
        </el-select>
        <span>课程名称：</span>
        <el-input v-model="couName" placeholder="请输入关键字" class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getData">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCourses">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="couType" label="课程类型" align="center"></el-table-column>
        <el-table-column prop="couName" label="课程名" align="center"></el-table-column>
        <el-table-column label="课程封面" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateCourseState(scope.row)">
              <span v-if="scope.row.state==1">下架</span>
              <span v-else>上架</span>
            </el-button>
            <el-button type="primary" size="mini" @click="seeCourseComment(scope.row)">查看评论</el-button>

            <el-button type="primary" size="mini" @click="updateCourse(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
          :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <!-- 添加课程信息 -->
    <div v-else-if="type==1">
      <h3>添加课程信息</h3>
      <el-divider></el-divider>
      <course-form :form="form" :dictionarysList="dictionarysList" @saveEdit="saveEditCourse(form)"></course-form>
    </div>
    <div v-else-if="type==2">
      <el-tabs v-model="activeName" type="card">
        <!-- 课程信息 -->
        <el-tab-pane label="课程信息" name="c1">
          <course-form :form="form" :dictionarysList="dictionarysList" @saveEdit="saveEditCourse(form)"></course-form>
        </el-tab-pane>
        <!-- 课程目录 -->
        <el-tab-pane label="课程目录" name="c2">
          <div class="handle-box">
            <span>状态：</span>
            <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
              <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-button type="primary" class="handle-del mr10" @click="getData">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCatalogue">新建</el-button>
          </div>
          <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="catName" label="课程目录" align="center"></el-table-column>
            <el-table-column label="课程类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.catType==1">图文</span>
                <span v-else>视频</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-else>下架</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="updateCatalogueState(scope.row)">
                  <span v-if="scope.row.state==1">下架</span>
                  <span v-else>上架</span>
                </el-button>
                <el-button type="primary" size="mini" @click="updateCatalogue(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
              :total="pageTotal" @current-change="handlePageChange"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="评论列表" name="c3">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else-if="type==3">
      <h3 v-if="query.catId">修改目录</h3>
      <h3 v-else>添加目录</h3>
      <el-divider></el-divider>
      <catalogue-form :form="form" :dictionarysList="dictionarysList" @saveEdit="saveEditCatalogue"></catalogue-form>
    </div>
    <div v-else-if="type==4">
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
          <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" class="handle-del mr10" @click="getData">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="catName" label="课程目录" align="center"></el-table-column>
        <el-table-column label="课程类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.catType==1">图文</span>
            <span v-else>视频</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateCatalogueState(scope.row)">
              <span v-if="scope.row.state==1">下架</span>
              <span v-else>上架</span>
            </el-button>
            <el-button type="primary" size="mini" @click="updateCatalogue(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
          :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import CourseForm from "components/course/CourseForm.vue"
  import CatalogueForm from "components/course/CatalogueForm.vue"
  export default {
    data() {
      return {
        activeName: 'c1',
        type: 0,
        state: "all",
        couType: "",
        couName: "",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        dictionarysList: [],
        query: {},
        form: {
          cover: ''
        },
        editVisible: false,
        isAdd: false,
        title: '',
        statesList: [
          { id: "all", name: "全部" },
          { id: 1, name: "上架" },
          { id: 2, name: "下架" }
        ],
      };
    },
    watch: {
      $route(to, form) {
        this.getType()
      }
    },
    created() {
      this.getType()
      this.getAllDictionary();
    },
    methods: {
      getType() {
        this.query = this.$route.query;
        if (this.query.type) {
          this.type = this.query.type;
        } else {
          this.type = 0;
          this.getData();
        }
        if (this.type == 2) {
          this.getCatalogue();
          this.getCourseInfo();
        } else if (this.type == 3) {
          this.getCatalogueInfo()
        }else if(this.type==4){
          this.getCourseComment();
        }
      },
      //获取数据
      getData() {
        this.$post("/course/getCourse", {
          state: this.state,
          couType: this.couType,
          couName: this.couName,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      getCatalogue() {
        this.$post("/course/getCatalogue", {
          state: this.state,
          couId: this.$route.query.couId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      getCourseInfo() {
        this.$post("/course/showCourse", {
          couId: this.$route.query.couId,
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      getCatalogueInfo() {
        this.$post("/course/showCatalogue", {
          catId: this.$route.query.catId,
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      getCourseComment(){
        console.log(8989)
        this.$post("/course/getCourseComment", {
          state: this.state,
          couId: this.$route.query.couId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取课程数据字典
      getAllDictionary() {
        this.$post("/other/getAllDictionary", {
          dicType: "3"
        }).then(res => {
          if (res.code = 200) {
            this.dictionarysList = res.data;
          }
        })
      },
      addCourses() {
        this.$router.push({ path: '/course', query: { type: 1 } })
      },
      updateCourse(row) {
        this.$router.push({ path: '/course', query: { type: 2, couId: row.couId } })
      },
      updateCourseState(row) {
        let state;
        if (row.state == 1) {
          state = 2
        } else {
          state = 1
        }
        this.$post("/course/updateCourseState", {
          couId: row.couId,
          state
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getData()
          }
        })
      },
      seeCourseComment(row){
        this.$router.push({ path: '/course', query: { type: 4, couId: row.couId } })
      },
      addCatalogue(){
        this.form={
          catType:"1",
          state:"1"
        }
        this.$router.push({ path: '/course', query: { type: 3, couId:this.query.couId} })
      },
      //触发编辑目录按钮
      updateCatalogue(row) {
        this.$router.push({ path: '/course', query: { type: 3, couId:this.query.couId, catId: row.catId } })
      },
      //修改目录状态
      updateCatalogueState(row){
        let state;
        if (row.state == 1) {
          state = 2
        } else {
          state = 1
        }
        this.$post("/course/updateCatalogueState", {
          catId: row.catId,
          state
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getCatalogue()
          }
        })
      },
      // 保存课程
      saveEditCourse(form) {
        if (this.query.couId) {
          this.$post("/course/updateCourse", this.form).then(res => {
            if (res.code == 200) {
              // this.getData()
              this.$message.success(res.msg)
              this.$router.go(-1)
            }
          })
        } else {
          this.$post("/course/insertCourse", form).then(res => {
            if (res.code == 200) {
              // this.getData()
              this.$message.success(res.msg)
              this.$router.go(-1)

            }
          })
        }


      },
      //编辑目录编辑
      saveEditCatalogue(form){
        if (this.query.catId) {
          this.$post("/course/updateCatalogue", this.form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$router.go(-1)

            }
          })
        } else {
          this.$post("/course/insertCatalogue", form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$router.go(-1)

            }
          })
        }
      },

   
      // 分页导航
      handlePageChange(val) {
        this.PageNumber = val;
        this.getData();
      }
    },
    components: {
      CourseForm,
      CatalogueForm
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

  img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
  }
</style>