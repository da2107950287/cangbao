<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.child">
                    <el-submenu :index="item.path" :key="item.path">
                        <template slot="title">
                            <i :class="item.icon" class="iconfont"></i>
                            

                         
                            <span slot="title" style="margin-left: 8px;">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.child">
                            <el-submenu v-if="subItem.child" :index="subItem.path" :key="subItem.path">
                                <template slot="title">{{ subItem.name }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.child" :key="i" :index="threeItem.path">
                                    {{ threeItem.name }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.path" :key="subItem.path">{{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.path">
                        <i :class="item.icon" class="iconfont"></i>
                        <!-- <img :src="item.icon" alt=""> -->

                        <span slot="title" style="margin-left: 8px;">{{ item.name }} </span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>

    </div>
</template>

<script>
    import bus from '../common/bus';
    import { getPower } from "../../utils/data.js"
    export default {
        data() {
            return {
                collapse: false,
                items: []
              
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('', '');//返回当前路由
            }
        },
        created() {
            this.getItems()
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        },
        methods: {
            getItems() {
                console.log(getPower())
                let mock = getPower()
                mock.forEach((v, i) => {
                    // v.icon = "el-icon-menu"
                    if (!v.path) {
                        v.path = String(i)
                    }
                });
                this.items = mock;
                console.log(mock)
            }
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    
    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 200px;
    }

    .sidebar>ul {
        height: 100%;
    }

   
</style>