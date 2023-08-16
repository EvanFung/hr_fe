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
                <el-aside width="200px">aside</el-aside>
                <el-main>Main</el-main>
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
                    this.$router.replace('/');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                });
            }
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
</style>