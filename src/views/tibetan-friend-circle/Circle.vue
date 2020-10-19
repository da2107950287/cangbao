<template>
  <div class="container">
    <div v-if="type==0">
      <h3>藏友圈列表</h3>
      <el-divider></el-divider>
      <div class="handle-box">
        <span>状态：</span>
        <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
          <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span>类型：</span>
        <el-select v-model="cirType" placeholder="请选择圈子类型" class="handle-search  mr10">
          <el-option v-for="(item,index) in dictionaryList" :key="index" :label="item.dicName" :value="item.dicId">
          </el-option>
        </el-select>
        <span>藏友圈名称：</span>
        <el-input v-model="cirName" placeholder="请输入关键字" class="handle-search mr10" clearable></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getCircle">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addCircle">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="cirType" label="圈子类型" align="center"></el-table-column>
        <el-table-column prop="cirName" label="圈子名称" align="center"></el-table-column>
        <el-table-column prop="number" label="圈子人数" align="center"></el-table-column>
        <el-table-column prop="dynamicNumber" label="动态数量" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state==0">待审核</span>
            <span v-else-if="scope.row.state==1">上架</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateCircleState(scope.row)">修改状态</el-button>
            <el-button type="primary" size="mini" @click="updateCircle(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
          :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,1)"
          @size-change="handleSizeChange($event,1)"></el-pagination>
      </div>
    </div>
    <div v-if="type==1">
      <div style="display: flex;align-items: center;">
        <img src="../../assets/img/goback.png" @click="$router.push('/circle')" class="mr10">
        <h3>添加圈子</h3>
      </div>
      <el-divider></el-divider>
      <circle-form :form="form" :dictionaryList="dictionaryList" @saveEdit="saveEdit"></circle-form>
    </div>
    <div v-if="type==2">
      <div style="display: flex;align-items: center;" class="mb20">
        <img src="../../assets/img/goback.png" @click="$router.push('/circle')" class="mr10">
        <h3>编辑圈子</h3>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="圈子详情" name="first">
          <circle-form :form="form" :dictionaryList="dictionaryList" @saveEdit="saveEdit"></circle-form>
        </el-tab-pane>
        <el-tab-pane label="圈子动态" name="second">
          <div class="handle-box">
            <span>状态：</span>
            <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
              <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <span>动态类型：</span>
            <el-select v-model="dyType" placeholder="请选择圈子类型" class="handle-search  mr10">
              <el-option v-for="(item,index) in dyTypeList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-button type="primary" class="handle-del mr10" @click="getDynamic">搜索</el-button>
          </div>
          <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="nickname" label="动态发布者" align="center"></el-table-column>
            <el-table-column prop="cirName" label="圈子名称" align="center"></el-table-column>
            <el-table-column prop="" label="发布者头像" align="center">
              <template slot-scope="scope">
                <el-image :src="scope.row.headportrait" class="img60"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="" label="发布图片/视频" align="center" width="200">
              <template slot-scope="scope">
                <video v-if="scope.row.dyType==1" style="width: 180px;height: 100px;" :src="scope.row.picture"
                  controls></video>
                <el-image v-else-if="scope.row.dyType==2" style="width: 180px;height: 100px;" :src="scope.row.picture">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="发布内容" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="commentNumber" label="评论数量" align="center"></el-table-column>
            <el-table-column prop="clickNumber" label="点击数量" align="center"></el-table-column>
            <el-table-column prop="collNumber" label="收藏数量" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state==0">待审核</span>
                <span v-else-if="scope.row.state==1">上架</span>
                <span v-else>下架</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="updateDynamicState(scope.row)">
                  <span v-if="scope.row.state==1">下架</span>
                  <span v-else>上架</span>
                </el-button>
                <el-button type="primary" size="mini" @click="updateDynamic(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteDynamic(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,2)"
              @size-change="handleSizeChange($event,2)"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="打赏排行榜" name="third">
          <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="nickname" label="用户名" align="center"></el-table-column>
            <el-table-column label="用户头像" align="center">
              <template slot-scope="scope">
                <el-image :src="scope.row.headportrait" class="img60"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="crMoney" label="打赏金额" align="center"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
              :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event,3)"
              @size-change="handleSizeChange($event,3)"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="type==3">
      <div style="display: flex;align-items: center;" class="mb20">
        <img src="../../assets/img/goback.png" style="width: 28px;height: 28px;" @click="$router.go(-1)" class="mr10">
        <h3>动态详情</h3>
      </div>
      <el-divider></el-divider>
      <div>
        <div style="display: flex;">
          <img :src="dynamicInfo.headportrait" style="width: 50px;height: 50px;" class="mr10">
          <div style="width: 100%;">
            <div style="width: 100%;display: flex;line-height: 50px;justify-content: space-between;">
              <div>{{dynamicInfo.nickname}}</div>
              <div>{{dynamicInfo.commentNumber}} 回复</div>
            </div>
            <div v-html="dynamicInfo.content"></div>
            <div v-if="dynamicInfo.dyType==1">
              <video v-for="(item,index) in dynamicInfo.picture" style="width: 200px;height: 100px;" :key="index"
                :src="item" controls></video>
            </div>
            <div v-else>
              <el-image style="width: 200px;height: 100px;" v-for="(item,index) in dynamicInfo.picture" :key="index"
                :src="item"></el-image>
            </div>
          </div>
        </div>
      </div>
      <h3>评论列表</h3>
      <el-divider></el-divider>
      <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
        <el-option v-for="(item,index) in stateselect" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getOneDynamicComment">搜索</el-button>
      <div style="display: flex;margin-top: 10px;" v-for="(el,index) in oneComment" :key="index">
        <img :src="el.headportrait" style="width: 50px;height: 50px;" class="mr10">
        <div style="width: 100%;">
          <div style="width: 100%;display: flex;line-height: 50px;justify-content: space-between;">
            <div>
              <span class="mr10">{{el.nickname}}</span>
            </div>
            <div>{{el.replyNumber}} 回复</div>
          </div>
          <div v-html="el.content"></div>
          <div v-if="el.dyType==1">
            <video v-for="(item,index) in el.picture" style="width: 200px;height: 100px;" :key="index"
              :src="item" controls></video>
          </div>
          <div v-else>
            <el-image style="width: 200px;height: 100px;" v-for="(item,index) in el.picture" :key="index"
              :src="item"></el-image>
          </div>
          
          <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
            <el-button type="primary" class="handle-del mr10" @click="updateDynamicCommentState(el,1)">
              <span v-if="el.state==1">下架</span>
              <span v-else>上架</span>
            </el-button>
            <el-button type="primary" class="handle-del mr10" @click="replay(el.dc2Id)">回复列表</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type==4">
      <div style="display: flex;align-items: center;" class="mb20">
        <img src="../../assets/img/goback.png" style="width: 28px;height: 28px;" @click="$router.go(-1)" class="mr10">
        <h3>回复列表</h3>
      </div>
      <el-divider></el-divider>
      <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
        <el-option v-for="(item,index) in stateselect" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getTwoDynamicComment">搜索</el-button>
      <div style="display: flex;margin-top: 10px;" v-for="(el,index) in twoComment" :key="index">
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
            <el-image style="width: 200px;height: 100px;" v-for="(item,index) in el.picture" :key="index" :src="item"></el-image>
          </div>
          <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
            <el-button type="primary" class="handle-del mr10" @click="updateDynamicCommentState(el,2)">
              <span v-if="el.state==1">下架</span>
              <span v-else>上架</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="修改圈子状态" center :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="圈子状态：" prop="state">
          <el-radio v-model="form.state" label="0">待审核</el-radio>
          <el-radio v-model="form.state" label="1">上架</el-radio>
          <el-radio v-model="form.state" label="2">下架</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEditState">确 定</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import CircleForm from "components/circle/CircleForm.vue";
  import DynamicForm from "components/circle/DynamicForm.vue"
  export default {
    data() {
      return {
        type: 0,
        query: {},
        tabIndex: "",
        dynamicInfo: {},
        oneComment: {},
        twoComment: {},
        dyType: "all",//动态类型
        state: "all",//状态
        activeName: "first",
        activeDy: "dy1",
        editVisible: false,
        cirType: "",//圈子类型
        cirName: "",//圈子名称
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {
          cirCover: '',
          cirUrl: ''
        },
        title: '',
        dictionaryList: [],
        statesList: [
          { id: "all", name: "全部" },
          { id: "0", name: "待审核" },
          { id: "1", name: "上架" },
          { id: "2", name: "下架" },
        ],
        dyTypeList: [
          { id: "all", name: "全部" },
          { id: "1", name: "视频 " },
          { id: "2", name: "图片" },
        ],
        stateselect: [
          { id: "all", name: "全部" },
          { id: "1", name: "上架" },
          { id: "2", name: "下架" },
        ]

      };
    },
    watch: {
      $route(to, form) {
        this.getType()
      }
    },
    created() {
      this.getAllDictionary()
      this.getType()
    },
    methods: {
      updateDynamicCommentState(row, ind) {
        console.log(ind)
        let state;
        if (row.state == 1) {
          state = 2
        } else if (row.state == 2) {
          state = 1
        }
        this.$post("/circle/updateDynamicCommentState", {
          dc2Id: row.dc2Id,
          state
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            if (ind == 1) {
              this.getOneDynamicComment()
            } else {
              this.getTwoDynamicComment();
            }

          }
        })
      },
      replay(dc2Id) {
        this.$router.push({ path: "/circle", query: { type: 4, dc2Id } })
      },
      handleClick(tab) {
        this.PageNumber = 1;
        this.PageSize = 10;
        this.tabIndex = tab.index;
        if (this.query.type == 2) {
          if (tab.index == 0) {
            this.getCircleInfo()
          } else if (tab.index == 1) {
            this.getDynamic()
          } else {
            this.getRewardList()
          }
        } else {
          if (tab.index == 0) {
            this.getCircleInfo()
          } else if (tab.index == 1) {
            this.getDynamic();
          }
        }

      },
      //获取动态详情
      getDynamicInfo() {
        this.$post("/circle/showDynamic", {
          dyId: this.query.dyId
        }).then(res => {
          if (res.code == 200) {
            this.dynamicInfo = res.data;
            this.dynamicInfo.picture = this.dynamicInfo.picture.split(",")
          }
        })
      },
      //获取一级评论
      getOneDynamicComment() {
        this.$post("/circle/getOneDynamicComment", {
          state: this.state,
          dyId: this.query.dyId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.oneComment = res.data.list;
          }
        })
      },
      getTwoDynamicComment() {
        this.$post("/circle/getTwoDynamicComment", {
          state: this.state,
          dc2Id: this.query.dc2Id,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.twoComment = res.data.list;
          }
        })
      },
      goBack() {
        this.$router.push("/circle")
      },
      getType() {
        this.tableData = []
        this.query = this.$route.query;
        if (this.query.type) {
          this.type = this.query.type
        } else {
          this.type = 0;
          this.getCircle()
        }
        if (this.type == 2) {//圈子列表
          if (this.tabIndex == 0) {
            this.getCircleInfo()
          } else if (this.tabIndex == 1) {
            this.getDynamic()
          } else {
            this.getRewardList()
          }
        } else if (this.type == 3) {
          this.getDynamicInfo()
          this.getOneDynamicComment()
        } else if (this.type == 4) {
          this.getTwoDynamicComment()
        }
      },
      //获取圈子列表
      getCircle() {
        this.$post("/circle/getCircle", {
          state: this.state,
          cirType: this.cirType,
          cirName: this.cirName,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取圈子类型
      getAllDictionary() {
        this.$post("/other/getAllDictionary", {
          dicType: "2"
        }).then(res => {
          if (res.code == 200) {
            this.dictionaryList = res.data;
          }
        })
      },
      //获取圈子详情
      getCircleInfo() {
        this.$post("/circle/showCircle", {
          cirId: this.query.cirId
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data
          }
        })
      },
      seeRewardList(row) {
        this.$router.replace({ path: "/circle", query: { type: 2, cirId: row.cirId } })
      },
      seeDynamicList(row) {
        this.$router.replace({ path: "/circle", query: { type: 3, cirId: row.cirId } })
      },
      //获取动态列表
      getDynamic() {
        this.$post("/circle/getDynamic", {
          state: this.state,
          dyType: this.dyType,
          cirId: this.query.cirId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.tableData.forEach((el, ind) => {
              el.picture = el.picture.split(",")[0]
            });
            this.pageTotal = res.data.count;
          }
        })
      },
      //获取打赏排行榜
      getRewardList() {
        this.$post("/circle/getCircleUser", {
          cirId: this.query.cirId,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },
      addCircle() {
        this.$router.push({ path: "/circle", query: { type: 1 } })
        // this.editVisible = true;
        // this.isAdd = 1;
        // this.title = "添加数据字典";
      },
      updateCircleState(row) {
        this.editVisible = true;
        this.form = row;

      },
      updateDynamic(row) {
        this.$router.push({ path: "/circle", query: { type: 3, dyId: row.dyId } })
      },
      //修改动态状态
      updateDynamicState(row) {
        console.log(row)
        let state;
        if (row.state == 1) {
          state = 2
        } else if (row.state == 2) {
          state = 1
        }
        this.$post("/circle/updateDynamicState", {
          dyId: row.dyId,
          state
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.getDynamic();
          }
        })
      },
      //删除动态
      deleteDynamic(index, row) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$post("/circle/updateDynamicState", {
            dyId: this.dyId,
            state: 3
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.getDynamic()
            }
          })
        })
      },
      saveEditState() {
        this.$post("/circle/updateCircleState", {
          cirId: this.form.cirId,
          state: this.form.state,
        }).then(res => {
          if (res.code == 200) {
            this.editVisible = false
            this.$message.success(res.msg);
            this.getCircle()
          }
        })
      },
      // 保存编辑
      saveEdit() {
        if (this.query.cirId) {
          this.$post("/circle/insertCircle", this.form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$router.go(-1)
            }
          })
        } else {
          this.$post("/circle/insertCircle", this.form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$router.go(-1)
            }
          })
        }

      },
      updateCircle(row) {
        this.$router.push({ path: "/circle", query: { type: 2, cirId: row.cirId } })

      },
      goback() {
        this.$router.go(-1)
      },
      // 分页导航
      handlePageChange(val, type) {
        console.log(type, val)
        this.PageNumber = val;
        this.handleType(type)
      },
      handleSizeChange(val, type) {
        this.PageSize = val;
        this.handleType(type)
      },
      handleType(type) {
        if (type == 1) {
          this.getCircle();
        } else if (type == 2) {
          this.getDynamic()
        } else {

        }
      }
    },
    components: {
      CircleForm,
      DynamicForm
    }

  };
</script>

<style lang="scss" scoped>
  .mb20 {
    margin-bottom: 20px;
  }

  .img60 {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-search {
    width: 200px;
  }

  .handle-select {
    width: 300px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }
</style>