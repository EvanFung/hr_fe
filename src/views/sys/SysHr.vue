<template>
    <div>
        <div style="margin-top: 10px;display: flex;justify-content: left;">
            <el-input v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search"
                style="width: 400px;margin-right: 10px" @keydown.enter.native="doSearch"></el-input>
            <el-button icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
        </div>
        <div class="hr-container">
            <el-card class="hr-card" v-for="(hr, index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{ hr.name }}</span>
                    <el-button style="float: right; padding: 3px 0;color: #e30007;" type="text" icon="el-icon-delete"
                        @click="deleteHr(hr)"></el-button>
                </div>
                <div>
                    <div class="img-container">
                        <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
                    </div>
                    <div class="userinfo-container">
                        <div>用户名：{{ hr.name }}</div>
                        <div>手机号码：{{ hr.phone }}</div>
                        <div>电话号码：{{ hr.telephone }}</div>
                        <div>地址：{{ hr.address }}</div>
                        <div>用户状态：
                            <el-switch v-model="hr.enabled" active-text="启用" active-color="#13ce66" inactive-color="#ff4949"
                                inactive-text="禁用" @change="enabledChange(hr)">
                            </el-switch>
                        </div>
                        <div>用户角色：
                            <el-tag type="success" style="margin-right: 4px" v-for="(role, indexj) in hr.roles"
                                :key="indexj">{{ role.nameZh }}
                            </el-tag>
                            <el-popover placement="right" title="角色列表" @show="showPop(hr)" @hide="hidePop(hr)" width="200"
                                trigger="click">
                                <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                    <el-option v-for="(r, indexk) in allroles" :key="indexk" :label="r.nameZh"
                                        :value="r.id">
                                    </el-option>
                                </el-select>
                                <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
                            </el-popover>
                        </div>
                        <div>备注：{{ hr.remark }}</div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
export default {
    name: "SysHr",
    data() {
        return {
            keywords: '',
            hrs: [],
            selectedRoles: [],
            allroles: [],
        }
    },
    mounted() {
        this.initHrs();
    },
    methods: {
        initHrs() {
            this.getRequest("/system/hr/?keywords=" + this.keywords).then(resp => {
                if (resp) {
                    this.hrs = resp;
                }
            })
        },
        initAllRoles() {
            this.getRequest("/system/hr/roles/").then(resp => {
                if (resp) {
                    this.allroles = resp;
                }
            });
        },
        enabledChange(hr) {
            delete hr.roles;
            this.putRequest("/system/hr/", hr).then(resp => {
                if (resp) {
                    this.initHrs();
                }
            })
        },
        showPop(hr) {
            this.initAllRoles();
            let roles = hr.roles;
            this.selectedRoles = []
            roles.forEach(r => {
                this.selectedRoles.push(r.id);
            })
        },
        hidePop(hr) {
            let roles = [];
            Object.assign(roles, hr.roles);
            let flag = false;
            if (roles.length != this.selectedRoles.length) {
                flag = true;
            } else {
                for (let i = 0; i < roles.length; i++) {
                    let role = roles[i];
                    for (let j = 0; j < this.selectedRoles.length; j++) {
                        let sr = this.selectedRoles[j];
                        if (role.id == sr) {
                            roles.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
                if (roles.length != 0) {
                    flag = true;
                }
            }
            if (flag) {
                let url = '/system/hr/role?hrid=' + hr.id;
                this.selectedRoles.forEach(sr => {
                    url += '&rids=' + sr;
                });
                this.putRequest(url).then(resp => {
                    if (resp) {
                        this.initHrs();
                    }
                });
            }
        },
        doSearch() {
            this.initHrs();
        },
        deleteHr(hr) {
            this.$confirm('This will permanently delete the HR. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.deleteRequest("/system/hr/" + hr.id).then(resp => {
                    if (resp) {
                        this.initHrs();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Delete canceled'
                });
            });
        }
    }
}
</script>

<style>
.hr-container {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
}

.hr-card {
    width: 350px;
    margin-bottom: 20px;
    margin-right: 2rem;
}

.userface-img {
    width: 72px;
    height: 72px;
    border-radius: 72px;
}

.img-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.userinfo-container div {
    font-size: 12px;
    color: #409eff;
}

.userinfo-container {
    margin-top: 20px;
}
</style>