<template>
  <div class="container">
    <div v-if="rtype==0">
      <div class="handle-box">
        <span>分析师名称：</span>
        <el-input v-model="name" placeholder="请输入关键字" clearable class="handle-select mr10"></el-input>
        <el-button type="primary" class="handle-del mr10" @click="getTopArtists">搜索</el-button>
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

        <el-table-column label="成交额" align="center">
          <template slot-scope="scope">{{scope.row.cje}}{{scope.row.cjeUnit}} </template>
        </el-table-column>

        <el-table-column prop="cjl" label="成交量" align="center"></el-table-column>

        <el-table-column prop="spl" label="上拍量" align="center"></el-table-column>
        <el-table-column prop="orders" label="排序" align="center"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateTypelist(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" class="red" @click="deleteTypelist(scope.row)">删除
            </el-button>
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
        <img src="~assets/img/goback.png" @click="$router.push('/artAnalyst')" class="mr10">
        <h3 v-if="query.id">修改分析师</h3>
        <h3 v-else>添加分析师</h3>
      </div>
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <h2>基本信息</h2>
        <el-form-item label="分析师名称：" class="inline-width mr10" prop="name">
          <el-input v-model="form.name" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="生日：" class="inline-width mr10" prop="thedDeath">
          <el-date-picker v-model="form.thedDeath" value-format="yyyy-MM-dd" class="handle-input" type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上拍量：" class="inline-width mr10" prop="spl">
          <el-input v-model="form.spl" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交量：" size="small" class="inline-width mr10" prop="cjl">
          <el-input v-model="form.cjl" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交额：" class="inline-width mr10" prop="cje">
          <el-input v-model="form.cje" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="成交额单位：" class="inline-width mr10" prop="cjeUni">
          <el-input v-model="form.cjeUnit" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="orders">
          <el-input v-model="form.orders" class="handle-input"></el-input>
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
        <!-- <el-form-item label="拍卖指数：" style="margin-bottom: 20px;" class="inline-width" prop="youhua"> -->
        <el-form ref="form" :rules="rules" :model="form.youhua" label-width="120px">
          <el-form-item label="当季：" class="inline-width mr10" prop="orders">
            <el-input v-model="form.youhua.curr" placeholder="请输入类型排序" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="上季" class="inline-width mr10" prop="orders">
            <el-input v-model="form.youhua.prev" placeholder="请输入类型排序" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="比上季：" class="inline-width mr10" prop="change">
            <el-input v-model="form.youhua.change" placeholder="请输入类型名称" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="变化类型：" class="inline-width mr10" prop="changeType">
            <el-select v-model="form.youhua.changeType" placeholder="请选择类型" class="handle-select mr10">

              <el-option v-for="(item,index) in changeTypeList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="变化类型：" class="" prop="changeType">
            <el-table :data="form.youhua.xData" border style="width: 500px">
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
                  <el-button type="primary" size="mini" @click="delYouhuaLine(scope.$index,scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="mini" @click="addYouhuaLine()">添加</el-button>

          </el-form-item>
        </el-form>
        <!-- </el-form-item> -->
        <h2>艺+综合指数</h2>
        <el-form ref="form" :rules="rules" :model="form.artronExponent" label-width="120px" style="height: auto;">
          <el-form-item label="当季：" class="inline-width mr10" prop="orders">
            <el-input v-model="form.artronExponent.curr" placeholder="请输入类型排序" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="上季" class="inline-width mr10" prop="orders">
            <el-input v-model="form.artronExponent.prev" placeholder="请输入类型排序" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="比上季：" class="inline-width mr10" prop="change">
            <el-input v-model="form.artronExponent.change" placeholder="请输入类型名称" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="变化类型：" class="inline-width mr10" prop="changeType">
            <el-select v-model="form.artronExponent.changeType" placeholder="请选择类型" class="handle-select mr10">

              <el-option v-for="(item,index) in changeTypeList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="变化类型：" class="">
            <el-table :data="form.artronExponent.xData" border style="width: 500px">
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
                  <el-button type="primary" size="mini" @click="delartronExponentLine(scope.$index,scope.row)">删除
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
        // youhua: {},
        form: {
          headPortrait: "",
          youhua: {
            // xData: [{ name: "", value: "" }]
            xData: []

          },
          artronExponent: {
            xData: []
          }
        },
        editVisible: false,
        isAdd: 0,
        title: '',
        changeTypeList: [
          { id: 1, name: "增加" },
          { id: 2, name: "减少" },
          { id: 3, name: "不变" },
        ],
        rules: {
          // name: [{ required: true, message: "请选择类型", trigger: "blur" }],
          // // artronExponent: [{ required: true, message: "请输入名称", trigger: "blur" }],
          // cje: [{ required: true, message: "请输入排序", trigger: "blur" }],
          // cjeUnit: [{ required: true, message: "请输入排序", trigger: "blur" }],
          // cjl: [{ required: true, message: "请输入排序", trigger: "blur" }],
          // headPortrait: [{ required: true, message: "请输入排序", trigger: "blur" }],
          // orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
          // spl: [{ required: true, message: "请输入排序", trigger: "blur" }],
          // thedDeath: [{ required: true, message: "请输入排序", trigger: "blur" }],
          // cje: [{ required: true, message: "请输入排序", trigger: "blur" }],
          // cje: [{ required: true, message: "请输入排序", trigger: "blur" }],

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
            // xData: [{ name: "", value: "" }]
            xData: []
          },
          artronExponent: {
            xData: []
          }
        }
      },
      // 保存编辑
      saveEdit() {
        console.log(this.form)
        console.log(JSON.stringify(this.form))
        // this.$refs.form.validate(valid => {
        //   if (valid) {
        // console.log(this.form.youhua.xData.join(","))
        this.form.youhua=JSON.stringify(this.form.youhua)
        this.form.artronExponent=JSON.stringify(this.form.artronExponent)
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

        //   }

        // })

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
    height: 100px;
    border-radius: 50%;
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