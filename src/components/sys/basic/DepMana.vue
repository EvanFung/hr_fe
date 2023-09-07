<template>
    <div style="width: 500px;">
        <el-input placeholder="请输入部门名称进行搜索..." prefix-icon="el-icon-search" v-model="filterText">
        </el-input>
        <el-tree v-loading="loading" element-loading-text="loging" element-loading-spinner="el-icon-loading"
            element-loading-backgroun="rgba(0,0,0,0,0.8)" :data="deps" :props="defaultProps" :expand-on-click-node="false"
            :filter-node-method="filterNode" ref="tree">
            <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%;"
                slot-scope="{ node, data }">
                <span>{{ data.name }}</span>
                <span>
                    <el-button type="primary" size="mini" class="depBtn" @click="() => showAddDepView(data)">
                        添加部门
                    </el-button>
                    <el-button type="danger" size="mini" class="depBtn" @click="() => deleteDep(data)">
                        删除部门
                    </el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog title="添加部门" :visible.sync="dialogVisible" width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>上级部门</el-tag>
                        </td>
                        <td>{{ pname }}</td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>部门名称</el-tag>
                        </td>
                        <td>
                            <el-input v-model="dep.name" placeholder="请输入部门名称..."></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddDep">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'DepMana',
    data() {
        return {
            loading: false,
            deps: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            filterText: '',
            dialogVisible: false,
            dep: {
                name: '',
                parentId: -1
            },
            pname: '',
            deps: [],
        }
    },
    mounted() {
        this.initDeps();
    },
    methods: {
        initDep() {
            this.dep = {
                name: '',
                parentId: -1
            }
            this.pname = '';
        },
        initDeps() {
            this.loading = true;
            this.getRequest("/system/basic/department/").then(resp => {
                this.loading = false;
                if (resp) {
                    this.deps = resp;
                }
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        showAddDepView(data) {
            this.pname = data.name;
            this.dep.parentId = data.id;
            this.dialogVisible = true;
        },
        deleteDep(data) {

        },
        addDep2Deps(deps, dep) {
            for (let i = 0; i < deps.length; i++) {
                let d = deps[i];
                if (d.id == dep.parentId) {
                    d.children = d.children.concat(dep);
                    if (d.children.length > 0) {
                        d.parent = true;
                    }
                    return;
                } else {
                    this.addDep2Deps(d.children, dep);
                }
            }
        },
        doAddDep() {
            this.postRequest("/system/basic/department/", this.dep).then(resp => {
                if (resp) {
                    this.addDep2Deps(this.deps, resp.obj);
                    this.dialogVisible = false;
                    this.initDep();
                }
            })
        },
        removeDepFromDeps(p, deps, id) {
            for (let i = 0; i < deps.length; i++) {
                let d = deps[i];
                if (d.id == id) {
                    deps.splice(i, 1);
                    if (deps.length == 0) {
                        p.parent = false;
                    }
                    return;
                } else {
                    this.removeDepFromDeps(d, d.children, id);
                }
            }
        },
        deleteDep(data) {
            if (data.parent) {
                this.$message.error("You cannot delete a parent department!");
            } else {
                this.$confirm('Are you sure to delete ' + data.name + ' department', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/department/" + data.id).then(resp => {
                        if (resp) {
                            this.removeDepFromDeps(null, this.deps, data.id);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });
            }
        },
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
}
</script>
<style>
.depBtn {
    padding: 2px;
}
</style>