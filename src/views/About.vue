<template>
  <div>
    <editor-bar :value="content" v-model="content"></editor-bar>
    <div @click="ad">sdsd</div>
  </div>
</template>
<script>
  import EditorBar from "@/components/wangeditor/WangEditor.vue"
  export default {
    data() {
      return {
        content: ''
      }
    },
    methods: {
      ad() {
        console.log(this.content)
      }
    },
    components: {
      EditorBar
    }
  }
</script>