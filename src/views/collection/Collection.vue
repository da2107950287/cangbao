<template>
  <div class="container">
    <!-- 藏品列表 -->
    <div v-if="type==0">
      <h3>藏品列表</h3>
      <el-divider></el-divider>
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
          <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>类别：</span>
        <el-select v-model="category" placeholder="请选择类型" class="handle-search mr10">
          <el-option label="全部" value=""> </el-option>
          <el-option v-for="(item,index) in categorys" :key="index" :label="item.ccName" :value="item.ccId">
          </el-option>
        </el-select>
        <span>年份：</span>
        <el-select v-model="year" placeholder="请选择类型" class="handle-search mr10">
          <el-option label="全部" value=""> </el-option>
          <el-option v-for="(item,index) in years" :key="index" :label="item.cyName" :value="item.cyId">
          </el-option>
        </el-select>
        <span>区域：</span>
        <el-select v-model="region" placeholder="请选择类型" class="handle-search mr10">
          <el-option label="全部" value=""> </el-option>
          <el-option v-for="(item,index) in regions" :key="index" :label="item.crName" :value="item.crId">
          </el-option>
        </el-select>
        <span>名称：</span>
        <el-input v-model="collName" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getCollection">搜索</el-button>
        <!-- <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCollections">新建</el-button> -->
      </div>
      <el-table v-loading="loading"  :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="collTime" label="发布时间" align="center"></el-table-column>
        <el-table-column prop="collName" label="藏品名称" align="center"></el-table-column>
        <el-table-column prop="guaranteePrice" label="担保价" align="center"></el-table-column>
        <el-table-column prop="size" label="尺寸" align="center"></el-table-column>
        <el-table-column prop="years" label="年份" align="center"></el-table-column>
        <el-table-column prop="region" label="区域" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini" @click="updateCourseState(scope.row)">
              <span v-if="scope.row.state==1">下架</span>
              <span v-else>上架</span>
            </el-button> -->
            <el-button type="primary" size="mini" @click="updateCollection(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
          :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,1)"
          @size-change="handleSizeChange($event,1)"></el-pagination>
      </div>
    </div>
    <div v-else-if="type==2">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="../../assets/img/goback.png" @click="$router.push('/collection')" class="mr10">
        <h3>查看藏品</h3>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 藏品信息 -->
        <el-tab-pane label="藏品信息" name="c1">
          <collection-form :form="form" @saveEdit="saveEditCollection(form)">
          </collection-form>
        </el-tab-pane>
        <!-- 评论列表 -->
        <el-tab-pane label="评论列表" name="c2">
          <span>评论状态：</span>
          <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
            <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" class="handle-del mr10" @click="getOneCollComment">搜索</el-button>
          <div style="display: flex;margin-top: 10px;" v-for="(el,index) in oneCollComment" :key="index">
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
                <el-image style="width: 200px;height: 100px;" v-for="(item,index) in el.picture" :key="index"
                  :src="item"></el-image>
              </div>
              <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
                <!-- <el-button type="primary" class="handle-del mr10" @click="updateDynamicCommentState(el,1)">
                  <span v-if="el.state==1">下架</span>
                  <span v-else>上架</span>
                </el-button> -->
                <el-button type="primary" class="handle-del mr10" @click="replay(el.ccId)">回复列表</el-button>
              </div>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,3)"
              @size-change="handleSizeChange($event,2)"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else-if="type==3">
      <div style="display: flex;align-items: center;" class="mb20">
        <img src="../../assets/img/goback.png" style="width: 28px;height: 28px;" @click="$router.go(-1)" class="mr10">
        <h3>回复列表</h3>
      </div>
      <el-divider></el-divider>
      <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
        <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getTwoCollComment">搜索</el-button>
      <div style="display: flex;margin-top: 10px;" v-for="(el,index) in twoCollComment" :key="index">
        <img :src="el.headportrait" style="width: 50px;height: 50px;" class="mr10">
        <div style="width: 100%;">
          <div style="width: 100%;display: flex;line-height: 50px;">
            <div class="mr10">{{el.nickname}}</div>
          </div>
          <div v-html="el.content"></div>
          <div v-if="el.dyType==1">
            <video v-for="(item,index) in el.picture" style="width: 200px;height: 100px;" :key="index" :src="item"
              controls></video>
          </div>
          <div v-else>
            <el-image style="width: 200px;height: 100px;" v-for="(item,index) in el.picture" :key="index" :src="item">
            </el-image>
          </div>
          <!-- <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
            <el-button type="primary" class="handle-del mr10" @click="updateDynamicCommentState(el,2)">
              <span v-if="el.state==1">下架</span>
              <span v-else>上架</span>
            </el-button>
          </div> -->
        </div>
      </div>
      <el-divider></el-divider>
      <div class="pagination">
        <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
          :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,3)"
          @size-change="handleSizeChange($event,3)"></el-pagination>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
  import CollectionForm from "components/collection/CollectionForm.vue"
  // import CatalogueForm from "components/collection/CatalogueForm.vue"
  export default {
    data() {
      return {
        loading:false,
        activeName: 'c1',
        type: 0,
        state: "all",
        collName: "",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        oneCollComment: [],
        twoCollComment: [],
        query: {},
        tabIndex: '',
        form: {},
        statesList: [
          { id: "all", name: "全部" },
          { id: 1, name: "上架" },
          { id: 2, name: "下架" }
        ],
        years: [],
        categorys: [],
        regions: [],
        year: "",
        category: "",
        region: "",
        collName: ""
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
      //获取藏品搜索条件
      getCollType() {
        this.$post("/circle/getCollType", {}).then(res => {
          if (res.code == 200) {
            this.years = res.data.years
            this.categorys = res.data.category;
            this.regions = res.data.region;
          }
        })
      },
      //获取藏品列表
      getCollection() {
        this.loading=true;
        this.$post("/circle/getCollection", {
          state: this.state,
          collName: this.collName,
          category: this.category,
          years: this.year,
          region: this.region,
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
      handleClick(tab) {
        this.PageNumber = 1;
        this.PageSize = 10;
        this.tabIndex = tab.index;
        if (tab.index == 0) {
          this.getCollectionInfo()
        } else if (tab.index == 1) {
          this.getOneCollComment()
        }
      },
      getType() {
        this.query = this.$route.query;
        if (this.query.type) {
          this.type = this.query.type;
        } else {
          this.type = 0;
          this.getCollType()
          this.getCollection();

        }
        if (this.type == 2) {
          if (this.tabIndex == 0) {
            this.getCollectionInfo()
          } else if (this.tabIndex == 1) {
            this.getOneCollComment()
          }
        } else if (this.type == 3) {
          this.getTwoCollComment()
        }
      },
     

      //获取藏品信息
      getCollectionInfo() {
        this.$post("/circle/showCollection", {
          collId: this.$route.query.collId,
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
            this.form.picture = this.form.picture.split(",")
          }
        })
      },
      //获取一级评论
      getOneCollComment() {
        this.$post("/circle/getOneCollComment", {
          state: this.state,
          collId: this.$route.query.collId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.oneCollComment = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取二级评论
      getTwoCollComment() {
        this.$post("/circle/getTwoCollComment", {
          state: this.state,
          ccId: this.$route.query.ccId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {

            this.twoCollComment = res.data.list;
            this.pageTotal = res.data.count;
            console.log(res.data)

          }
        })
      },
      replay(ccId) {
        this.$router.push({ path: "/collection", query: { type: 3, ccId } })
      },
      updateCollection(row) {
        this.$router.push({ path: '/collection', query: { type: 2, collId: row.collId } })
      },
      addCatalogue() {
        this.form = {
          catType: "1",
          state: "1"
        }
        this.$router.push({ path: '/collection', query: { type: 3, couId: this.query.couId } })
      },
      //触发编辑目录按钮
      updateCatalogue(row) {
        this.$router.push({ path: '/collection', query: { type: 3, couId: this.query.couId, catId: row.catId } })
      },
      //修改藏品状态
      updateCollectionState(row) {
       let state = row.state ^ 3

        this.$post("/collection/updateCollectionState", {
          couId: row.couId,
          state
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getCollection()
          }
        })
      },

      //修改评论状态
      updateCollectionCommentState(row) {
       let state = row.state ^ 3

        this.$post("/collection/updateCollectionState", {
          state,
          ccId: row.ccId
        }).then(res => {
          if (res.code == 200) {
            this.$message.msg(res.msg);
            this.getOneCollComment()
          }
        })
      },
      // 修改/添加藏品
      saveEditCollection(form) {
        if (this.query.couId) {
          this.$post("/collection/updateCollection", this.form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$router.go(-1)
            }
          })
        } else {
          this.$post("/collection/insertCollection", form).then(res => {
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
          this.$post("/collection/updateCatalogue", this.form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$router.go(-1)
            }
          })
        } else {
          this.$post("/collection/insertCatalogue", form).then(res => {
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
          this.getCollection();
        } else if (type == 2) {
          this.getOneCollComment()
        } else if (type == 3) {
          this.getTwoCollComment()
        }
      }
    },
    components: {
      CollectionForm,
      // CatalogueForm
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