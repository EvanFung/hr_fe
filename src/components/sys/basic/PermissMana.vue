<template>
    <div>
        <div class="permission-mgmt-tool">
            <el-input size="small" placeholder="Please input role in English" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="Please input role in Chinese" v-model="role.nameZh">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-plus">
                添加角色
            </el-button>
        </div>
        <div>
            <el-collapse accordion class="permission-mgmt-collapse" @change="change">
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r, index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0;color: #ff0000;" icon="el-icon-delete"
                                type="text"></el-button>
                        </div>
                        <div>
                            <div>
                                <el-tree show-checkbox node-key="id" ref="tree" :key="index" :data="allmenus"
                                    :props="defaultProps"></el-tree>
                            </div>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button>取消修改</el-button>
                                <el-button type="primary">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>

        </div>
    </div>
</template>
<script>
export default {
    name: 'PermissMana',
    data() {
        return {
            activeName: '1',
            role: {
                name: '',
                nameZh: '',
            },
            roles: [],
            allmenus: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    mounted() {
        this.initRoles();
    },
    methods: {
        initRoles() {
            this.getRequest("/system/basic/permiss/").then(resp => {
                if (resp) {
                    this.roles = resp;
                }
            })
        },
        change(name) {
            if (name) {
                this.initAllMenu();
            }
        },
        initAllMenu() {
            this.getRequest("/system/basic/permiss/menus").then(resp => {
                if (resp) {
                    this.allmenus = resp;
                }
            });
        }
    }
}
</script>
<style>
.permission-mgmt-tool {
    display: flex;
    justify-content: flex-start;
}

.permission-mgmt-tool .el-input {
    width: 300px;
    margin-right: 6px;
}

.permission-mgmt-collapse {
    margin-top: 10px;
    width: 700px;
}
</style>