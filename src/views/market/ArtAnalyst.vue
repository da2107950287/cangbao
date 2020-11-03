<template>
  <div class="container">
    <div v-if="rtype==0">
      <div class="handle-box">
        <span>分析师名称：</span>
        <el-input v-model="name" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="searchTopArtists">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addTypelists">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="分析师名称" align="center"></el-table-column>
        <el-table-column prop="name" label="头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.headPortrait" style="max-width: 180px;max-height: 100px;"></img>
          </template>
        </el-table-column>
        <el-table-column label="成交额" width="120" align="center">
          <template slot-scope="scope">{{scope.row.cje}}{{scope.row.cjeUnit}} </template>
        </el-table-column>
        <el-table-column prop="cjl" label="成交量" width="120" align="center"></el-table-column>
        <el-table-column prop="spl" label="上拍量" width="120" align="center"></el-table-column>
        <el-table-column prop="orders" label="排序" width="120" align="center"></el-table-column>
        <el-table-column prop="thedDeath" label="生日" width="120" align="center"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateTypelist(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
          :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event)"
          @size-change="handleSizeChange($event)"></el-pagination>
      </div>

    </div>
    <div v-else-if="rtype==1">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <img src="~assets/img/goback.png" @click="$router.push('/artAnalyst')" style="width: 25px;height: 25px;"
          class="mr10">
        <h3 v-if="query.id">修改分析师</h3>
        <h3 v-else>添加分析师信息</h3>
      </div>
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <h2>基本信息</h2>
        <el-form-item label="分析师名称：" class="inline-width mr10" prop="name">
          <el-input v-model="form.name" placeholder="请输入分析师名称" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="生日：" class="inline-width mr10" prop="thedDeath">
          <el-date-picker v-model="form.thedDeath" value-format="yyyy-MM-dd" class="handle-input" type="date"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上拍量：" class="inline-width mr10" prop="spl">
          <el-input v-model="form.spl" placeholder="请输入上拍量" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交量：" size="small" class="inline-width mr10" prop="cjl">
          <el-input v-model="form.cjl" placeholder="请输入成交量" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交额：" class="inline-width mr10" prop="cje">
          <el-input v-model="form.cje" placeholder="请输入成交额" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交额单位：" class="inline-width mr10" prop="cjeUnit">
          <el-input v-model="form.cjeUnit" placeholder="请输入成交额单位" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="orders">
          <el-input v-model="form.orders" placeholder="请输入排序" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="图片：" class="inline-width " prop="headPortrait">
          <label for="inputId" icon="el-icon-plus">
            <img v-if="form.headPortrait" :src="form.headPortrait" class="img">
            <img v-else src="~assets/img/headportrait.png" alt="" class="img">
            <input style="display: none" id="inputId" ref="input" type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
          </label>
        </el-form-item>
        <h2>拍卖指数</h2>
        <el-form ref="form" :rules="rules1" :model="form.youhua" label-width="120px">
          <el-form-item label="当季：" class="inline-width mr10" prop="curr">
            <el-input v-model="form.youhua.curr" placeholder="" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="上季" class="inline-width mr10" prop="prev">
            <el-input v-model="form.youhua.prev" placeholder="" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="比上季：" class="inline-width mr10" prop="change">
            <el-input v-model="form.youhua.change" placeholder="" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="变化类型：" class="inline-width mr10" prop="changeType">
            <el-select v-model="form.youhua.changeType" placeholder="请选择类型" class="handle-select mr10">
              <el-option v-for="(item,index) in changeTypeList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="变化类型：" class="">
            <el-table :data="form.youhua.xData" border style="width: 800px">
              <el-table-column prop="name" label="名称" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="数量" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.$index" type="primary" size="mini"
                    @click="delYouhuaLine(scope.$index,scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="mini" @click="addYouhuaLine()">添加</el-button>
          </el-form-item>
        </el-form>
        <h2>艺+综合指数</h2>
        <el-form ref="form" :rules="rules2" :model="form.artronExponent" label-width="120px" style="height: auto;">
          <el-form-item label="当季：" class="inline-width mr10" prop="curr">
            <el-input v-model="form.artronExponent.curr" placeholder="" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="上季" class="inline-width mr10" prop="prev">
            <el-input v-model="form.artronExponent.prev" placeholder="" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="比上季：" class="inline-width mr10" prop="change">
            <el-input v-model="form.artronExponent.change" placeholder="" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="变化类型：" class="inline-width mr10" prop="changeType">
            <el-select v-model="form.artronExponent.changeType" placeholder="请选择类型" class="handle-select mr10">
              <el-option v-for="(item,index) in changeTypeList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="变化类型：" class="">
            <el-table :data="form.artronExponent.xData" border style="width: 800px">
              <el-table-column prop="name" label="名称" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="数量" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.$index" type="primary" size="mini"
                    @click="delartronExponentLine(scope.$index,scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="mini" @click="addartronExponentLine()">添加</el-button>
          </el-form-item>
        </el-form>
        <el-form-item>
          <el-button @click="$router.push('/artAnalyst')">返回</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: "all",
        rtype: "",
        query: {},
        name: "",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {
          headPortrait: "",
          youhua: {
            xData: [{ name: "", value: "" }]
          },
          artronExponent: {
            xData: [{ name: "", value: "" }]
          }
        },
        editVisible: false,
        isAdd: 0,
        title: '',
        changeTypeList: [
          { id: "1", name: "增加" },
          { id: "2", name: "减少" },
          { id: "3", name: "不变" },
        ],
        rules: {
          name: [{ required: true, message: "请输入分析师名称", trigger: "blur" }],
          cje: [{ required: true, message: "请输入成交额", trigger: "blur" }],
          cjeUnit: [{ required: true, message: "请输入成交额单位", trigger: "blur" }],
          cjl: [{ required: true, message: "请输入成交量", trigger: "blur" }],
          headPortrait: [{ required: true, message: "请上传头像", trigger: "blur" }],
          orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
          spl: [{ required: true, message: "请输入上拍量", trigger: "blur" }],
          thedDeath: [{ required: true, message: "请输入生日", trigger: "blur" }],
        },
        rules1: {
          curr: [{ required: true, message: "1", trigger: "blur" }],
          change: [{ required: true, message: "", trigger: "blur" }],
          changeType: [{ required: true, message: "", trigger: "blur" }],
          prev: [{ required: true, message: "", trigger: "blur" }],
        },
        rules2: {
          curr: [{ required: true, message: "", trigger: "blur" }],
          change: [{ required: true, message: "", trigger: "blur" }],
          changeType: [{ required: true, message: "", trigger: "blur" }],
          prev: [{ required: true, message: "", trigger: "blur" }],
        },

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
      addYouhuaLine() {
        var newLine = { name: "", value: "" };
        this.form.youhua.xData.push(newLine)
      },
      delYouhuaLine(index, row) {
        this.form.youhua.xData.splice(index, 1)
      },
      addartronExponentLine() {
        var newLine = { name: "", value: "" };
        this.form.artronExponent.xData.push(newLine)
      },
      delartronExponentLine(index, row) {
        this.form.artronExponent.xData.splice(index, 1)
      },
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.headPortrait = res.data;
          }
        });
      },
      getType() {
        this.query = this.$route.query;
        if (this.query.rtype) {
          this.rtype = this.query.rtype;
        } else {
          this.rtype = 0;
          this.getTopArtists();
        }
        console.log(this.rtype)
        if (this.query.id) {
          this.getTopArtistsInfo()
        }
      },

      getTopArtistsInfo() {
        this.$post("/market/showTopArtists", {
          artCode: this.query.id,
        }).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        })
      },
      searchTopArtists() {
        this.PageNumber = 1;
        this.PageSize = 10;
        this.getTopArtists()
      },
      //获取数据
      getTopArtists() {
        this.$post("/market/getTopArtists", {
          name: this.name,
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
        this.$router.push({ path: "/artAnalyst", query: { rtype: 1 } })
        this.form = {
          headPortrait: "",
          headPortrait: "",
          youhua: {
            xData: [{ name: "", value: "" }]

          },
          artronExponent: {
            xData: [{ name: "", value: "" }]

          }
        }
      },
      // 保存编辑
      saveEdit() {
        var result = true
        var message = []
        this.form.youhua.xData.forEach((item, index) => {
          let no = index + 1
          if (item.name == '') {
            result = result && false
            message.push('拍卖指数 第' + no + '行：名称不能为空')
          }
          if (item.value == '') {
            result = result && false
            message.push('拍卖指数 第' + no + '行：数量不能为空')
          }
        })
        this.form.artronExponent.xData.forEach((item, index) => {
          let no = index + 1
          if (item.name == '') {
            result = result && false
            message.push('艺+综合指数 第' + no + '行：名称不能为空')
          }
          if (item.value == '') {
            result = result && false
            message.push('艺+综合指数 第' + no + '行：数量不能为空')
          }
        })
        if (!result) {
            var temp = '';
            message.forEach(v => {
              temp += `<div>${v}</div>`;
            })
            this.$alert(`${temp}`,"警告",{
              dangerouslyUseHTMLString: true
            });
          }
        this.$refs.form.validate(valid => {
          if (valid && result) {
            if (this.query.id) {
              this.$post("/market/updateTopArtists", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/artAnalyst")
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/market/insertTopArtists", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/artAnalyst")
                  this.$message.success(res.msg)
                }
              })
            }
          }
        })



      },
      updateTypelist(row) {
        console.log(row)
        this.$router.push({ path: "/artAnalyst", query: { rtype: 1, id: row.artCode } })

      },
      // 删除操作
      deleteTypelist(row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$post("/other/deleteTypelist", {
            dicId: row.dicId
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.getTopArtists()
            }
          })
        })
      },
      // 分页导航
      handlePageChange(val) {
        console.log(val)
        this.PageNumber = val;
        this.getTopArtists();
      },
      handleSizeChange(val) {
        this.PageSize = val;
        this.getTopArtists();
      }
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

  .handle-search {
    width: 300px;
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
    /* height: 100px;
    border-radius: 50%; */
  }

  .inline-width {
    display: inline-block;
  }

  .el-form h2 {

    font-weight: 400;
    font-size: 18px;
    padding: 5px 0 15px;
  }
</style>