<template>
  <div class="container">
    <div v-if="!this.$route.query.isAdd">
      <div class="handle-box">
        <span>位置：</span>
        <el-select v-model="position" placeholder="请选择位置" class="handle-select mr10">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,index) in positionList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span>状态：</span>
        <el-select v-model="state" placeholder="请选择状态" class="handle-select mr10">
          <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" class="handle-del mr10" @click="searchBanner">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addBanners">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.purl" lazy class="img"></el-image>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="positions" label="位置" align="center"></el-table-column> -->
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">已推荐</span>
            <span v-else>未推荐</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateState(scope.row)">
              <span v-if="scope.row.state==1">取消推荐</span>
              <span v-else>推荐</span>
            </el-button>
            <el-button type="primary" size="mini" @click="updateBanners(scope.row)">查看</el-button>
            <!-- <el-button type="danger" size="mini" class="red" @click="delete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
          :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event)"
          @size-change="handleSizeChange($event)"></el-pagination>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <div v-else-if="this.$route.query.isAdd">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.push('/banners')" class="mr10"
          style="width: 25px;height: 25px;">
        <h3 v-if="$route.query.banId">编辑banner信息</h3>
        <h3 v-else>添加banner</h3>
      </div>
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="位置：" prop="positions">
          <el-select v-model="form.positions" placeholder="请选择位置" class="handle-input mr10">
            <el-option v-for="(item,index) in positionList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题：" prop="title">
          <el-input v-model="form.title" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="头像：" prop="purl" class="personal-icon">
          <label for="inputId" icon="el-icon-plus">
            <img v-if="form.purl" :src="form.purl" />
            <img v-else src="~assets/img/headportrait.png" alt="">
            <input style="display: none" id="inputId" ref="input" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
          </label>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <UEditor ref="ueditor"></UEditor>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.push('/banners')">返 回</el-button>
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
        position: "",
        state: "all",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {
          purl: ""
        },
        rules: {
          positions: [{ required: true, message: "请选择位置", trigger: "blur" }],
          title: [{ required: true, message: "请输入标题", trigger: "blur" }],
          purl: [{ required: true, message: "请上传图片", trigger: "blur" }],
          content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        },
        positionList: [
          { id: "1", name: '首页' },
          { id: "2", name: '市场' },
          { id: "3", name: '课程' }
        ],
        statesList: [
          { id: "all", name: '全部' },
          { id: "1", name: '已推荐' },
          { id: "2", name: '未推荐' }
        ]
      };
    },
    watch: {
      $route(to, form) {
        this.getBannerInfo()
      }
    },
    mounted() {
      this.getBanner();
      this.getBannerInfo()
    },
    methods: {
      //搜索banners
      searchBanner() {
        this.PageNumber = 1;
        this.PageSize = 10;
        this.getBanner()
      },
      //获取banner列表
      getBanner() {
        this.$post("/other/getBanner", {
          positions: this.position,
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
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.purl = res.data;
          }
        });
      },
      //修改状态
      updateState(row) {
        let state = row.state ^ 3;
        this.$post("/other/updateBannerState", {
          banId: row.banId,
          state
        }).then(res => {
          if (res.code == 200) {
            this.getBanner()
            this.$message.success("操作成功")
          }
        })
      },
      //触发添加按钮
      addBanners() {
        this.$router.push({ path: "/banners",query:{isAdd:true} });
        this.form = {
          purl: ""
        }
      },
      //触发编辑按钮
      updateBanners(row) {
        this.$router.push({ path: "/banners", query: { banId: row.banId,isAdd:false } });
      },
      getBannerInfo() {
        if (this.$route.query.banId) {
          this.$post("/other/showBanner", { banId: this.$route.query.banId }).then(res => {
            if (res.code == 200) {
              this.form = res.data;
              this.$refs.ueditor.setUEContent(res.data.content)
            }
          })
        }
      },
      // 保存编辑
      saveEdit() {
        this.form.content = this.$refs.ueditor.getUEContent();
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.$route.query.banId) {
              this.$post("/other/updateBanner", this.form).then(res => {
                if (res.code) {
                  this.getBanner()
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/other/insertBanner", this.form).then(res => {
                if (res.code == 200) {
                  this.getBanner()
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
        this.getBanner();
      },
      handleSizeChange(val) {
        this.PageSize = val;
        this.getBanner()
      },
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

  .handle-select {
    width: 200px;
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