<template>
    <div>
        <div>
            <el-input size="small" v-model="jl.name" style="width: 300px;" prefix-icon="el-icon-plus" place-holder="添加职称">
            </el-input>
            <el-select v-model="jl.titleLevel" placeholder="Select" size="small" style="margin-left: 5px;margin-right: 5px">
                <el-option v-for="item in titlelevels" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            <el-button icon="el-icon-plus" type="primary" size="small" @click="addJobLevel">
                添加
            </el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table v-loading="loading" element-loading-text="loging" element-loading-spinner="el-icon-loading"
                element-loading-backgroun="rgba(0,0,0,0,0.8)" :data="jls" :border="true" size="small" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="id" label="编号" width="55">
                </el-table-column>
                <el-table-column prop="name" label="职称名称" width="150">
                </el-table-column>
                <el-table-column prop="titleLevel" label="职称级别">
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间">
                </el-table-column>
                <el-table-column prop="enabled" label="是否启用">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="small" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger"
                                @click="deleteHandler(scope.$index, scope.row)">删除</el-button>
                        </div>
                    </template>

                </el-table-column>
            </el-table>
            <el-button type="danger" size="small" style="margin-top: 10px" :disabled="multipleSelection.length == 0"
                @click="deleteMany">批量删除
            </el-button>
        </div>
        <el-dialog title="修改职称" :visible.sync="dialogVisible" width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>职称名</el-tag>
                        </td>
                        <td>
                            <el-input size="small" v-model="updateJl.name"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>职称级别</el-tag>
                        </td>
                        <td>
                            <el-select v-model="updateJl.titleLevel" placeholder="职称等级" size="small"
                                style="margin-left: 5px;margin-right: 5px">
                                <el-option v-for="item in titlelevels" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>是否启用</el-tag>
                        </td>
                        <td>
                            <el-switch v-model="updateJl.enabled" active-text="启用" inactive-text="禁用">
                            </el-switch>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'JobLevelMana',
    data() {
        return {
            loading: false,
            jl: {
                name: '',
                titleLevel: '',
            },
            titlelevels: ['员级', '初级', '中级', '高级', '副高级', '正高级'],
            jls: [],
            dialogVisible: false,
            updateJl: {
                name: '',
                titleLevel: '',
                enabled: false
            },
            multipleSelection: [],
        }
    },
    mounted() {
        this.initJls();
    },
    methods: {
        initJls() {
            this.loading = true;
            this.getRequest("/system/basic/joblevel/").then(resp => {
                this.loading = false;
                if (resp) {
                    this.jls = resp;
                }
            })
        },
        addJobLevel() {
            if (this.jl.name == '' || this.jl.titleLevel == '') {
                this.$message({
                    type: 'error',
                    message: '职称名称和职称级别不能为空！'
                })
                return;
            }
            this.postRequest("/system/basic/joblevel/", this.jl).then(resp => {
                if (resp) {
                    this.initJls();
                    this.jl.name = '';
                    this.jl.titeLevel = '';
                }
            })
        },
        deleteHandler(index, row) {
            this.$confirm(`This will permanently delete the ${row.name}. Continue?`, 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.deleteRequest(`/system/basic/joblevel/${row.id}`).then(resp => {
                    if (resp) {
                        this.initJls();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Delete canceled'
                });
            });
        },
        showEditView(index, data) {
            Object.assign(this.updateJl, data);
            this.dialogVisible = true;
        },
        doUpdate() {
            this.putRequest(`/system/basic/joblevel/`, this.updateJl).then(resp => {
                if (resp) {
                    this.initJls();
                    this.updateJl.name = '';
                    this.updateJl.titleLevel = '';
                    this.updateJl.enabled = false;
                    this.dialogVisible = false;
                }
            });
        },
        deleteMany() {
            this.$confirm(`This will permanently delete the ${this.multipleSelection.length} items. Continue?`,
                'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                let ids = '?';
                this.multipleSelection.forEach(item => {
                    ids += 'ids=' + item.id + '&';
                })
                this.deleteRequest("/system/basic/joblevel/" + ids).then(resp => {
                    if (resp) {
                        this.initJls();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Delete canceled'
                });
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }

    }
}
</script>