<template>
  <div>
    <script id="editor" type="text/plain"></script>

  </div>
</template>

<script>
  import '../../public/ueditor/ueditor.config.js'
  import '../../public/ueditor/ueditor.all.js'
  import '../../public/ueditor/lang/zh-cn/zh-cn.js'
  import '../../public/ueditor/jquery-2.2.3.min.js'


  export default {
    name: "UEditor",

    data() {
      return {
        editor: null,
        config: {
          autoHeightEnabled: false,
          autoFloatEnabled: true,
          initialContent: '',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          autoClearinitialContent: true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: 1000,
          initialFrameHeight: 400,
          BaseUrl: '',
          UEDITOR_HOME_URL: 'ueditor/',
          //启用自动保存
          enableAutoSave: false,
          autosave: false
        },
      }
    },
    mounted() {
      //初始化UE
      const _this = this;
      this.editor = UE.delEditor("editor");
      this.editor = UE.getEditor('editor', this.config);
    },
    destoryed() {
      this.editor.destory();
    },
    methods: {
      setUEContent(defaultMsg) {
        this.editor.ready( ()=> {
          console.log(defaultMsg)
          this.editor.setContent(defaultMsg)
        })
      },
      getUEContent() {
        return this.editor.getContent();
      }

    }
  }
</script>