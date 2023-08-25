<template>
    <div>
        <div>
            <el-input size="small" placeholder="添加职位" prefix-icon="el-icon-search" v-model="pos.name"
                class="add-post-input">
            </el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addPositions"
                @keydown.enter.native="addPositions">添加</el-button>
        </div>
        <div class="post-mana-main">
            <el-table :data="positions" :border="true" style="width: 100%" stripe size="small"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="编号" width="55">
                </el-table-column>
                <el-table-column prop="name" label="职位名称" width="200">
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="120">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" size="small" style="margin-top:10px;" :disabled="multipleSelection.length == 0"
                @click="deleteMany">Batch
                delete</el-button>
        </div>
        <el-dialog title="修改职位" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input class="update-pos-input" v-model="updatePos.name"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
                <el-button size="small" type="primary" @click="doUpdate">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            pos: {
                name: ''
            },
            positions: [],
            dialogVisible: false,
            updatePos: {
                name: '',
            },
            multipleSelection: [],
        }
    },
    mounted() {
        this.initPositions();
    },
    methods: {
        initPositions() {
            this.getRequest('/system/basic/pos/').then(resp => {
                if (resp) {
                    this.positions = resp;
                }
            })
        },
        showEditView(index, row) {
            Object.assign(this.updatePos, row);
            this.dialogVisible = true;
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm(`This will permanently delete the ${row.name}. Continue?`, 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.deleteRequest(`/system/basic/pos/${row.id}`).then(resp => {
                    if (resp) {
                        this.initPositions();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Delete canceled'
                });
            });
        },
        doUpdate() {
            this.putRequest(`/system/basic/pos/`, this.updatePos).then(resp => {
                if (resp) {
                    this.initPositions();
                    this.updatePos.name = '';
                    this.dialogVisible = false;
                }
            });
        },
        addPositions() {
            if (this.pos.name) {
                this.postRequest('/system/basic/pos/', this.pos).then(resp => {
                    if (resp) {
                        this.initPositions();
                        this.pos.name = '';
                    }
                })
            } else {
                this.$message.error('请输入职位名称');
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val);
        },
        deleteMany() {
            this.$confirm(`This will permanently delete ${this.multipleSelection.length} records. Continue?`, 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                let ids = '?';
                this.multipleSelection.forEach(item => {
                    ids += 'ids=' + item.id + '&';
                });
                this.deleteRequest(`/system/basic/pos/${ids}`).then(resp => {
                    if (resp) {
                        this.initPositions();
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
.add-post-input {
    width: 300px;
    margin-right: 5px;
}

.post-mana-main {
    margin-top: 10px;
}

.update-pos-input {
    width: 300px;
    margin-left: 10px;
}
</style>