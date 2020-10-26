<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="140px">
    <h2>拍品基本信息</h2>
    <el-form-item label="拍品状态：" class="line-width" prop="status">
      <el-select v-model="form.status" placeholder="请选择拍品状态" class="handle-input mr10">
        <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拍卖公司：" prop="organCode" class="line-width">
      <el-select v-model="form.organCode" filterable placeholder="请选择拍卖公司" class="handle-input mr10">
        <el-option v-for="(item,index) in companyList" :key="index" :label="item.simpleName" :value="item.organCode">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拍品分类：" prop="classCode" class="line-width">
      
      <el-cascader v-model="classCode" placeholder="请选择拍品分类" filterable clearable @expand-change="handleChange" :options="options"
        :props="propClassList" class="handle-input  mr10">
      </el-cascader>
    </el-form-item>
    <el-form-item label="拍卖会标题：" prop="name" class="line-width">
      <el-input v-model="form.name" placeholder="请输入拍卖会标题" class="handle-input"></el-input>
    </el-form-item>

    <el-form-item label="Lot号：" prop="tlNumber" class="line-width">
      <el-input v-model="form.tlNumber" placeholder="请输入Lot号" class="handle-input"></el-input>
    </el-form-item>

    <el-form-item label="拍卖时间：" prop="listiconDate" class="line-width">
      <el-input v-model="form.listiconDate" placeholder="请输入拍卖时间" class="handle-input"></el-input>
    </el-form-item>

    <el-form-item label="成交价：" prop="listiconPrice" class="line-width">
      <el-input v-model="form.listiconPrice" placeholder="请输入成交价" class="handle-input"></el-input>
    </el-form-item>

    <el-form-item label="拍品列表封面：" prop="coverPic" class="personal-icon">
      <label for="coverPic" icon="el-icon-plus">
        <img v-if="form.coverPic" :src="form.coverPic" class="img">
        <img v-else src="~assets/img/headportrait.png" class="img">
        <input style="display: none" id="coverPic" ref="coverPic" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange($event,1)" />
      </label>
    </el-form-item>
    <el-form-item label="拍品详情图片：" prop="logoUrl" class="personal-icon">
      <label for="logoUrl" icon="el-icon-plus">
        <img v-if="form.logoUrl" :src="form.logoUrl" class="img" />
        <img v-else src="~assets/img/headportrait.png" class="img">
        <input style="display: none" id="logoUrl" ref="logoUrl" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange($event,2)" />
      </label>
    </el-form-item>

    <el-form-item label="展示属性：" class="" prop="attribute">
      <el-table :data="form.attribute" border style="width: 1000px">
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.text"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.$index"  type="primary" size="mini" @click="delAttributeLine(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="addAttributeLine()">添加</el-button>
    </el-form-item>
    <el-form-item label="列表展示信息：" class="" prop="extraInfo">
      <el-table :data="form.extraInfo" border style="width: 1000px">
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.text"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.$index"  type="primary" size="mini" @click="delExtraInfoLine(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="addExtraInfoLine()">添加</el-button>
    </el-form-item>
    <el-form-item label="详情展示信息：" class="" prop="extraInfo2">
      <el-table :data="form.extraInfo2" border style="width: 1000px">
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.text"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.$index" type="primary" size="mini" @click="delExtraInfo2Line(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button  type="primary" size="mini" @click="addExtraInfo2Line()">添加</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="$router.push({ path: '/auction', query: { rtype: 2, sessionCode: $route.query.sessionCode,specialCode:$route.query.specialCode } })">返回</el-button>
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
      propClassList: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        rules: {
          name: [{ required: true, message: "请输入拍品名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入拍卖会排序", trigger: "blur" }],
          tlNumber: [{ required: true, message: "请输入Lot号", trigger: "blur" }],
          status: [{ required: true, message: "请选择拍品状态", trigger: "blur" }],
          organCode:[{ required: true, message: "请选择拍卖公司", trigger: "blur" }],
          logoUrl: [{ required: true, message: "请上传拍品详情图片", trigger: "blur" }],
          coverPic: [{ required: true, message: "请上传拍品列表图片", trigger: "blur" }],
          listiconPrice: [{ required: true, message: "请输入成交价", trigger: "blur" }],
          listiconDate: [{ required: true, message: "请输入拍卖时间", trigger: "blur" }],
        },
        classCode: [],
        options: []
      }
    },
    watch: {
      form() {
        this.classCode.push(this.form.classCodeOne, this.form.classCodeTwo)
        this.handleChange([this.form.classCodeOne])
      }
    },
    mounted() {
      this.getOneClassList()
    },
    methods: {

      getOneClassList() {
        this.$post("/market/getAllArtClassList", {
          type: 1,
        }).then(res => {
          if (res.code == 200) {
            this.options = res.data;
            this.options.forEach((item, index) => {
              this.$set(this.options[index], 'children', [])
            })
          }
        })
      },
      //获取二级分类
      handleChange(val) {
        console.log(val[0])
        this.$post("/market/getAllArtClassList", {
          type: 2,
          superior: val[0]
        }).then(res => {
          if (res.code == 200) {
            for (let i = 0; i < this.options.length; i++) {
              if (this.options[i].classCode === val[0]) {
                this.$set(this.options[i], 'children', res.data)
                break;
              }
            }

          }
        })
      },

      addExtraInfo2Line() {
        var newLine = { type: "", label: "", text: "" };
        this.form.extraInfo2.push(newLine)
      },
      addAttributeLine() {
        var newLine = { type: "", label: "", text: "" };
        this.form.attribute.push(newLine)
      },
      addExtraInfoLine() {
        var newLine = { type: "", label: "", text: "" };
        this.form.extraInfo.push(newLine)
      },
      delExtraInfoLine(index, row) {
        this.form.extraInfo.splice(index, 1)
      },
      delAttributeLine(index, row) {
        this.form.attribute.splice(index, 1)
      },
      delExtraInfo2Line(index, row) {
        this.form.extraInfo2.splice(index, 1)
      },
      //上传图片
      handleFileChange(e, ind) {
        console.log(e, ind)
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            if (ind == 1) {
              this.form.coverPic = res.data;
            } else {
              this.form.logoUrl = res.data;
            }
          }
        });
      },
      // 保存编辑
      saveEdit() {
 
        var result = true
          var message = []
          this.form.attribute.forEach((item, index) => {
            let no = index + 1
            if (item.label == '') {
              result = result && false
              message.push('展示属性 第' + no + '行：标题不能为空')
            }
            if (item.text == '') {
              result = result && false
              message.push('展示属性 第' + no + '行：内容不能为空')
            }
          })
          this.form.extraInfo .forEach((item, index) => {
            let no = index + 1
            if (item.label == '') {
              result = result && false
              message.push('列表展示信息 第' + no + '行：标题不能为空')
            }
            if (item.text == '') {
              result = result && false
              message.push('列表展示信息 第' + no + '行：内容不能为空')
            }
          })
          this.form.extraInfo2 .forEach((item, index) => {
            let no = index + 1
            if (item.label == '') {
              result = result && false
              message.push('详情展示信息 第' + no + '行：标题不能为空')
            }
            if (item.text == '') {
              result = result && false
              message.push('详情展示信息 第' + no + '行：内容不能为空')
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
            this.form.classCodeOne = this.classCode[0];
            this.form.classCodeTwo = this.classCode[1];

            this.form.sessionCode = this.$route.query.sessionCode;
            this.form.specialCode = this.$route.query.specialCode;

            if (this.$route.query.id) {
              this.$post("/market/updateLot", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push({ path: '/auction', query: { rtype: 2, sessionCode: this.$route.query.sessionCode,specialCode:this.$route.query.specialCode } })
                  // this.$router.push("/auction")
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/market/insertLot", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push({ path: '/auction', query: { rtype: 2, sessionCode: this.$route.query.sessionCode,specialCode:this.$route.query.specialCode } })

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
  .handle-input {
    width: 400px;
    display: inline-block;
  }

  .line-width {
    display: inline-block;
  }

  .img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .el-form h2 {

    font-weight: 400;
    font-size: 18px;
    padding: 5px 0 15px;
  }
</style>