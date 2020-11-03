<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="140px">
    <h2>拍卖会基本信息</h2>
    <el-form-item label="拍卖会标题：" prop="name">
      <el-input v-model="form.name" placeholder="请输入拍卖会标题" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖公司：" prop="organCode">
      <el-select v-model="form.organCode" @change="onSelectedDrug($event)" filterable placeholder="请选择拍卖公司"
        class="handle-input mr10">
        <el-option v-for="(item,index) in companyList" :key="index" :label="item.simpleName" :value="item.organCode">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拍卖时间：" prop="auctionTime">
      <el-input v-model="form.auctionTime" placeholder="请输入拍卖时间" class="handle-input">
      </el-input>
      <span style="font-size: 14px;"> 例如2020-01-01或者2020-01-01 ~ 2020-01-31</span>

    </el-form-item>
    <el-form-item label="拍卖会状态：" prop="status">
      <el-select v-model="form.status" placeholder="请选择拍卖会状态" class="handle-input mr10">
        <el-option v-for="(item,index) in stateList" :key="item.name" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拍卖会排序：" prop="orders">
      <el-input v-model="form.orders" placeholder="请选择拍卖会排序" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会成交率：" prop="dealRate">
      <el-input v-model="form.dealRate" placeholder="请输入拍卖会成交率" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会成交总额：" prop="dealTotal">
      <el-input v-model="form.dealTotal" placeholder="请输入拍卖会成交总额" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会图片：" prop="picUrl">
      <label for="inputId" icon="el-icon-plus">
        <img v-if="form.picUrl" :src="form.picUrl" class="img" />
        <img v-else src="~assets/img/headportrait.png" class="img" alt="">
        <input style="display: none" id="inputId" ref="input" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
      </label>
    </el-form-item>
    <h2>其他描述信息</h2>
    <el-form-item label="变化类型：" class="">
      <el-table :data="form.detailExtraInfo" style="width: 1000px">
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" required placeholder="请输入标题"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.text" required placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.$index" type="primary" size="mini" @click="delAuctionLine(scope.$index,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="addAuctionLine()">添加</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="$router.push('/auction')">返回</el-button>
      <el-button type="primary" @click="saveEdit">确 定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      companyList: {
        type: Array,
        default() {
          return []
        }
      },
      stateList: {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        rules: {
          auctionTime: [{ required: true, message: "请输入拍卖时间", trigger: "blur" }],
          dealRate: [{ required: true, message: "请输入成交率", trigger: "blur" }],
          dealTotal: [{ required: true, message: "请输入成交总额", trigger: "blur" }],
          organCode: [{ required: true, message: "请选择拍卖公司", trigger: "blur" }],
          name: [{ required: true, message: "请输入拍卖会标题", trigger: "blur" }],
          orders: [{ required: true, message: "请输入拍卖会排序", trigger: "blur" }],
          picUrl: [{ required: true, message: "请上传拍卖会图片", trigger: "blur" }],
          status: [{ required: true, message: "请选择拍卖会状态", trigger: "blur" }],

        }
      }
    },
    methods: {
      addAuctionLine() {
        var newLine = { type: "text", label: "", text: "" };
        this.form.detailExtraInfo.push(newLine)
      },
      delAuctionLine(index, row) {
        this.form.detailExtraInfo.splice(index, 1)
      },
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.picUrl = res.data;
          }
        });
      },
      onSelectedDrug(id) {
        let obj = {};
        obj = this.companyList.find(item => {
          return item.organCode == id;
        })
        this.form.simpleName = obj.simpleName;
        console.log(this.form)
      },
      // 保存编辑
      saveEdit() {
        var result = true
        var message = []
        this.form.detailExtraInfo.forEach((item, index) => {
          let no = index + 1
          if (item.label == '') {
            result = result && false
            message.push('第' + no + '行：标题不能为空')
          }
          if (item.text == '') {
            result = result && false
            message.push('第' + no + '行：内容不能为空')
          }
        })
        if (!result) {
          var temp = '';
          message.forEach(v => {
            temp += `<div>${v}</div>`;
          })
          this.$alert(`${temp}`, "警告", {
            dangerouslyUseHTMLString: true
          });
        }
        this.$refs.form.validate(valid => {

          if (valid && result) {
            console.log(this.form)
            if (this.$route.query.sessionCode) {
              
              this.$post("/market/updateAuction", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/auction")
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/market/insertAuction", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/auction")
                  this.$message.success(res.msg)
                }
              })
            }
          }
        })
      },
    }
  }
</script>
<style scoped>
  ul li {
    list-style: none;
  }

  .handle-input {
    width: 400px;
    display: inline-block;
  }

  .img {
    width: 100px;
    /* height: 100px; */
    /* border-radius: 50%; */
  }

  .el-form h2 {

    font-weight: 400;
    font-size: 18px;
    padding: 5px 0 15px;
  }
</style>