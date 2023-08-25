<template>
    <div>
        <el-container>
            <el-header class="home-header">
                <div class="title">
                    HR
                </div>
                <div>
                    <el-dropdown class="user-info" @command="commandHandler">
                        <span class="el-dropdown-link">
                            {{ user.obj.name }} <i><img :src="user.obj.userface" alt="" /></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="setting">设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px" class="aside-menu">
                    <el-menu @select="menuClick" unique-opened>
                        <el-submenu :index="index + ''" v-for="(item, index) in this.routes" v-if="!item.hidden"
                            :key="index">
                            <template slot="title">
                                <i :class="item.iconCls" style="color:#409eff;margin-right:5px;"></i>
                                <span>{{ item.name }}</span>
                            </template>
                            <el-menu-item :index="child.path" v-for="(child, index) in item.children" :key="child.path">
                                {{ child.name }}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path != '/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div v-if="this.$router.currentRoute.path == '/home'">
                        Welcome to HR Management System
                    </div>
                    <router-view class="home-route-view" />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            user: JSON.parse(window.sessionStorage.getItem('user'))
        }
    },
    computed: {
        routes() {
            return this.$store.state.routes;
        }
    },
    methods: {
        commandHandler(command) {
            if (command == 'logout') {
                this.$confirm('确定退出登录吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getRequest("/logout");
                    window.sessionStorage.removeItem('user');
                    this.$store.commit('initRoutes', []);
                    this.$router.replace('/');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                });
            }
        },
        menuClick(index) {
            this.$router.push(index).catch(() => { });;
        }
    }
}
</script>

<style>
.home-header {
    background-color: #409EFF;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
}

.home-header .title {
    font-size: 30px;
    font-weight: bold;
    color: #fff
}

.home-header .user-info {
    color: #fff;
    cursor: pointer;
}

.el-dropdown-link img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-left: 10px;
}

.el-dropdown-link {
    display: flex;
    align-items: center;
}

.home-route-view {
    margin-top: 15px;
}

.aside-menu {
    background-color: #fff;
    box-sizing: border-box;
    padding: 15px;
    height: 100%;
    overflow: auto;
}
</style>