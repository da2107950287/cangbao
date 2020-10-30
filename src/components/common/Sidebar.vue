<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.child">
                    <el-submenu :index="item.path" :key="item.path">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.name }}</span>
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
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import mock from "../../utils/data.js"
    export default {
        data() {
            return {
                collapse: false,
                items: []
                // items: [
                //     {
                //         icon: 'el-icon-s-home',
                //         path: 'dashboard',
                //         name: '系统首页'
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         name: '课程',
                //         path: "22",
                //         child: [
                //             {
                //                 path: "course",
                //                 name: "课程管理"
                //             }
                //         ]
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         name: '藏品',
                //         path: '11',
                //         child: [
                //             {

                //                 path: 'collection',
                //                 name: '藏品管理'
                //             },
                //             {
                //                 path: 'collRegion',
                //                 name: '藏品区域管理'
                //             },
                //             {
                //                 path: 'collYears',
                //                 name: '藏品年份管理'
                //             },
                //             {
                //                 path: 'collCategory',
                //                 name: '藏品类别管理'
                //             }]

                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         name: '藏友圈',
                //         path: '1',
                //         child: [
                //             {

                //                 path: 'circle',
                //                 name: '藏友圈管理'
                //             }
                //         ]

                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         path: '33',
                //         name: '拍卖会',
                //         child: [
                //             {
                //                 path: 'auction',
                //                 name: '拍卖会管理'
                //             },
                //             {
                //                 path: 'auctionYear',
                //                 name: '拍卖会年份管理'
                //             },
                //             {
                //                 path: 'auctionCategory',
                //                 name: '拍卖会类别管理'
                //             },

                //             {
                //                 path: 'auctionCompany',
                //                 name: '拍卖公司管理'
                //             },
                //         ]
                //     },

                //     {
                //         icon: 'el-icon-menu',
                //         path: '2',
                //         name: '市场',
                //         child: [
                //             {

                //                 path: 'marketType',
                //                 name: '报告类型管理'
                //             },
                //             {

                //                 path: 'marketReport',
                //                 name: '市场报告管理'
                //             },
                //             {
                //                 path: 'artAnalyst',
                //                 name: '艺术分析师管理'
                //             },


                //             // {
                //             //     path:'specialAuction',
                //             //     name:'拍卖专场管理'  

                //             // }
                //         ]
                //     },

                //     {
                //         icon: 'el-icon-menu',
                //         path: '3',
                //         name: '用户',
                //         child: [
                //             {

                //                 path: 'user',
                //                 name: '用户管理'
                //             }
                //         ]
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         path: 'systemMsg',
                //         name: '系统消息'
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         path: 'news',
                //         name: '新闻管理'
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         path: 'banners',
                //         name: 'banner管理'
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         path: '7',
                //         name: '系统设置',
                //         child: [
                //             {
                //                 path: 'role',
                //                 name: '角色管理'
                //             },
                //             {
                //                 path: 'manager',
                //                 name: '管理员管理'
                //             },
                //             {
                //                 path: 'dictionary',
                //                 name: '数据字典'
                //             },
                //             {
                //                 path: 'document',
                //                 name: '文档管理'
                //             },
                //             {
                //                 path: 'systemUpdate',
                //                 name: '系统更新'
                //             },
                //         ]
                //     },
                //     {
                //         icon: 'el-icon-user-solid',
                //         path: '8',
                //         name: '个人中心',
                //         child: [
                //             {
                //                 path: 'personalInfo',
                //                 name: '个人信息'
                //             },
                //             {
                //                 path: 'updatePassword',
                //                 name: '修改密码'
                //             },
                //         ]
                //     }
                // ]

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
                mock.forEach((v, i) => {
                    v.icon="el-icon-menu"
                    if (!v.path) {
                        v.path = String(i)
                    }
                });
                this.items = mock;
                console.log(this.items)
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
        width: 250px;
    }

    .sidebar>ul {
        height: 100%;
    }
</style>