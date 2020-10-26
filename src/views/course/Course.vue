<template>
  <div class="container">
    <!-- 课程列表 -->
    <div v-if="type==0">
      <h3>课程列表</h3>
      <el-divider></el-divider>
      <div class="handle-box">
        <span>课程状态：</span>
        <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>课程类型：</span>
        <el-select v-model="couType" placeholder="请选择类型" class="handle-search mr10">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,index) in dictionarysList" :key="index" :label="item.dicName" :value="item.dicId">
          </el-option>
        </el-select>
        <span>课程名称：</span>
        <el-input v-model="couName" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getCourse">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCourses">新建</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="couTypeName" label="课程类型" align="center"></el-table-column>
        <el-table-column prop="couName" label="课程名称" align="center"></el-table-column>
        <el-table-column label="课程封面" align="center" width="200">
          <template slot-scope="scope">
            <img :src="scope.row.cover" style="max-width: 180px;max-height: 100px;"></img>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="学习人数" align="center"></el-table-column>

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
            <el-button type="primary" size="mini" @click="updateCourse(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
          :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,1)"
          @size-change="handleSizeChange($event,1)"></el-pagination>
      </div>
    </div>
    <!-- 添加课程信息 -->
    <div v-else-if="type==1">
      <div style="display: flex;align-items: center;">
        <img src="../../assets/img/goback.png" @click="$router.push('/course')" class="mr10">
        <h3>添加课程</h3>
      </div>
      <el-divider></el-divider>
      <course-form :form="form" :stateList="stateList" :dictionarysList="dictionarysList"
        @saveEdit="saveEditCourse(form)"></course-form>
    </div>
    <div v-else-if="type==2">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="../../assets/img/goback.png" @click="$router.push('/course')" class="mr10">
        <h3>编辑课程</h3>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 课程信息 -->
        <el-tab-pane label="课程信息" name="c1">
          <course-form :form="form" :stateList="stateList" :dictionarysList="dictionarysList"
            @saveEdit="saveEditCourse(form)"></course-form>
        </el-tab-pane>
        <!-- 课程目录 -->
        <el-tab-pane label="课程目录" name="c2">
          <div class="handle-box">
            <span>目录状态：</span>
            <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
              <el-option label="全部" value="all"></el-option>
              <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-button type="primary" class="handle-del mr10" @click="getCatalogue">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCatalogue">新建</el-button>
          </div>
          <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="catName" label="课程目录" align="center"></el-table-column>
            <el-table-column label="课程类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.catType==1">视频</span>
                <span v-else>图文</span>
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
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,2)"
              @size-change="handleSizeChange($event,1)"></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 评论列表 -->
        <el-tab-pane label="评论列表" name="c3">
          <span>评论状态：</span>
          <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
            <el-option label="全部" value="all"></el-option>
            <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" class="handle-del mr10" @click="getCourseComment">搜索</el-button>
          <div style="display: flex;margin-top: 10px;" v-for="(el,index) in courseComment" :key="index">
            <img :src="el.headportrait" style="width: 50px;height: 50px;" class="mr10">
            <div style="width: 100%;">
              <div style="width: 100%;display: flex;line-height: 50px;justify-content: space-between;">
                <div>
                  <span class="mr10">{{el.nickname}}</span>
                </div>
              </div>
              <div v-html="el.content"></div>
              <div v-if="el.dyType==1">
                <video v-for="(item,index) in el.picture" style="width: 200px;height: 100px;" :key="index" :src="item"
                  controls></video>
              </div>
              <div v-else>
                <imgstyle="width: 200px;height: 100px;" v-for="(item,index) in el.picture" :key="index"
                  :src="item"></el-image>
              </div>
              <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
                <el-button type="primary" class="handle-del mr10" @click="updateCourseCommentState(el)">
                  <span v-if="el.state==1">下架</span>
                  <span v-else>上架</span>
                </el-button>
              </div>
            </div>
            <el-divider></el-divider>
          </div>


          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,3)"
              @size-change="handleSizeChange($event,1)"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else-if="type==3">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="../../assets/img/goback.png" @click="$router.go(-1)" class="mr10">
        <h3 v-if="query.catId">修改目录</h3>
        <h3 v-else>添加目录</h3>
      </div>
      <el-divider></el-divider>
      <catalogue-form :form="form" :stateList="stateList" :dictionarysList="dictionarysList"
        @saveEdit="saveEditCatalogue"></catalogue-form>
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
        courseComment: [],
        query: {},
        tabIndex: '',
        loading:false,
        form: {
          cover: "",

        },
        stateList: [
          { id: "1", name: "上架" },
          { id: "2", name: "下架" }
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
      handleClick(tab) {
        this.PageNumber = 1;
        this.PageSize = 10;
        this.tabIndex = tab.index;
        if (tab.index == 0) {
          this.getCourseInfo()
        } else if (tab.index == 1) {
          this.getCatalogue()
        } else {
          this.getCourseComment()
        }
      },
      getType() {
        this.query = this.$route.query;
        this.tableData=[]
        if (this.query.type) {
          this.type = this.query.type;
        } else {
          this.type = 0;
          this.getCourse();
        }
        if (this.type == 1) {
          this.form = {
            cover: "",
          }
        } else if (this.type == 2) {
          if (this.tabIndex == 0) {
            this.getCourseInfo()
          } else if (this.tabIndex == 1) {
            this.getCatalogue()
          } else {
            this.getCourseComment()
          }
        } else if (this.type == 3) {
          console.log(99)
          this.getCatalogueInfo()
        } else if (this.type == 4) {
          this.getCourseComment();
        }
      },
      updateState(row) {
        let state;
        if (row.state == 1) {
          state = 2
        } else {
          state = 1
        }
        return state;
      },
      //获取课程类型
      getAllDictionary() {
        this.$post("/other/getAllDictionary", {
          dicType: "3"
        }).then(res => {
          if (res.code = 200) {
            this.dictionarysList = res.data;
          }
        })
      },
      //获取课程列表
      getCourse() {
        this.loading=true;
        this.$post("/course/getCourse", {
          state: this.state,
          couType: this.couType,
          couName: this.couName,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.loading=false;
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取课程信息
      getCourseInfo() {
        this.$post("/course/showCourse", {
          couId: this.$route.query.couId,
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      //获取目录
      getCatalogue() {
        this.loading=true;
        this.$post("/course/getCatalogue", {
          state: this.state,
          couId: this.$route.query.couId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.loading=false;
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取目录详情
      getCatalogueInfo() {
        this.$post("/course/showCatalogue", {
          catId: this.query.catId,
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      //获取评论
      getCourseComment() {
        this.$post("/course/getCourseComment", {
          state: this.state,
          couId: this.$route.query.couId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.courseComment = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      addCourses() {
        this.$router.push({ path: '/course', query: { type: 1 } })
       
      },
      updateCourse(row) {
        this.$router.push({ path: '/course', query: { type: 2, couId: row.couId } })
      },
      addCatalogue() {
        this.$router.push({ path: '/course', query: { type: 3, couId: this.query.couId } })
        this.form={}
       this.$set(this.form,"content","")
      },
      //触发编辑目录按钮
      updateCatalogue(row) {
        this.$router.push({ path: '/course', query: { type: 3, couId: this.query.couId, catId: row.catId } })
      },
      //修改课程状态
      updateCourseState(row) {
        this.$post("/course/updateCourseState", {
          couId: row.couId,
          state: this.updateState(row)
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getCourse()
          }
        })
      },
      //修改目录状态
      updateCatalogueState(row) {
        this.$post("/course/updateCatalogueState", {
          catId: row.catId,
          state: this.updateState(row)
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getCatalogue()
          }
        })
      },
      //修改评论状态
      updateCourseCommentState(row) {
        this.$post("/course/updateCourseState", {
          state: this.updateState(row),
          ccId: row.ccId
        }).then(res => {
          if (res.code == 200) {
            this.$message.msg(res.msg);
            this.getCourseComment()
          }
        })
      },
      // 修改/添加课程
      saveEditCourse(form) {
        if (this.query.couId) {
          this.$post("/course/updateCourse", this.form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$router.go(-1)
            }
          })
        } else {
          this.$post("/course/insertCourse", form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$router.go(-1)
            }
          })
        }
      },
      //修改/添加目录
      saveEditCatalogue(form) {
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
      handlePageChange(val, type) {
        this.PageNumber = val;
        this.handleType(type)
      },
      handleSizeChange(val, type) {
        this.PageSize = val;
        this.handleType(type)
      },
      handleType(type) {
        if (type == 1) {
          this.getCourse();
        } else if (type == 2) {
          this.getCatalogue()
        } else if (type == 3) {
          this.getCourseComment()
        }
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

  .img100 {
    height: 100px;
    width: 100px;
    border-radius: 50%;
  }
</style>