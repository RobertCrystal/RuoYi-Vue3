<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="摘要" prop="resume">
        <el-input v-model="queryParams.resume" placeholder="请输入摘要" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['farm:work:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['farm:work:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['farm:work:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['farm:work:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="图片" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="服务价格" align="center" prop="price" />
      <el-table-column label="所属分类" align="center" prop="catgory" />
      <el-table-column label="摘要" align="center" prop="resume" show-overflow-tooltip class-name="description-column" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="微信号" align="center" prop="weChat" />
      <el-table-column label="服务商名称" align="center" prop="providerName" />
      <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip class-name="description-column" />
      <el-table-column label="发布时间" align="center" prop="pubdate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.pubdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" align="center" prop="pubAccountId" />
      <el-table-column label="上架状态" align="center" prop="pushStatus">
        <template #default="scope">
          <dict-tag :options="push_status" :value="scope.row.pushStatus ? scope.row.pushStatus.split(',') : []" />
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="recommend">
        <template #default="scope">
          <dict-tag :options="recommend" :value="scope.row.recommend ? scope.row.recommend.split(',') : []" />
        </template>
      </el-table-column>
      <el-table-column label="浏览数量" align="center" prop="browseNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['farm:work:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['farm:work:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改农事服务对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="workRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <image-upload v-model="form.image" />
        </el-form-item>
        <el-form-item label="服务价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入服务价格" />
        </el-form-item>
        <el-form-item label="所属分类" prop="catgory">
          <el-input v-model="form.catgory" placeholder="请输入所属分类" />
        </el-form-item>
        <el-form-item label="摘要" prop="resume">
          <el-input v-model="form.resume" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="微信号" prop="weChat">
          <el-input v-model="form.weChat" placeholder="请输入微信号" />
        </el-form-item>
        <el-form-item label="服务商名称" prop="providerName">
          <el-input v-model="form.providerName" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发布人" prop="pubAccountId">
          <el-input v-model="form.pubAccountId" placeholder="请输入发布人" />
        </el-form-item>
        <el-form-item label="上架状态" prop="pushStatus">
          <el-checkbox-group v-model="form.pushStatus">
            <el-checkbox v-for="dict in push_status" :key="dict.value" :label="dict.value">
              {{ dict.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否推荐" prop="recommend">
          <el-checkbox-group v-model="form.recommend">
            <el-checkbox v-for="dict in recommend" :key="dict.value" :label="dict.value">
              {{ dict.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="浏览数量" prop="browseNum">
          <el-input v-model="form.browseNum" placeholder="请输入浏览数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.description-column .cell {
  /* 确保单行显示 */
  white-space: nowrap;
  /* 超出部分隐藏 */
  overflow: hidden;
  /* 超出部分用...表示 */
  text-overflow: ellipsis;
}
</style>

<script setup name="Work">
import { listWork, getWork, delWork, addWork, updateWork } from "@/api/farm/work";

const { proxy } = getCurrentInstance();
const { recommend, push_status } = proxy.useDict('recommend', 'push_status');

const workList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    resume: null,
    pushStatus: null,
    recommend: null,
  },
  rules: {
    title: [
      { required: true, message: "标题不能为空", trigger: "blur" }
    ],
    pushStatus: [
      { required: true, message: "上架状态：1.已上架；2.未上架不能为空", trigger: "blur" }
    ],
    recommend: [
      { required: true, message: "是否推荐：1.推荐；2.不推荐不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询农事服务列表 */
function getList() {
  loading.value = true;
  listWork(queryParams.value).then(response => {
    workList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    title: null,
    image: null,
    price: null,
    catgory: null,
    resume: null,
    phone: null,
    weChat: null,
    providerName: null,
    description: null,
    pubdate: null,
    pubAccountId: null,
    pushStatus: [],
    recommend: [],
    browseNum: null,
    createdTime: null,
    updatedTime: null
  };
  proxy.resetForm("workRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加农事服务";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getWork(_id).then(response => {
    form.value = response.data;
    form.value.pushStatus = form.value.pushStatus.split(",");
    form.value.recommend = form.value.recommend.split(",");
    open.value = true;
    title.value = "修改农事服务";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["workRef"].validate(valid => {
    if (valid) {
      form.value.pushStatus = form.value.pushStatus.join(",");
      form.value.recommend = form.value.recommend.join(",");
      if (form.value.id != null) {
        updateWork(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addWork(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除农事服务编号为"' + _ids + '"的数据项？').then(function() {
    return delWork(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('farm/work/export', {
    ...queryParams.value
  }, `work_${new Date().getTime()}.xlsx`)
}

getList();
</script>
