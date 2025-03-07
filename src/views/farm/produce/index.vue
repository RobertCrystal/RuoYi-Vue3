<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="农产品名称" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入农产品名称" clearable @keyup.enter="handleQuery" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="卖点摘要" prop="resume">
        <el-input v-model="queryParams.resume" placeholder="请输入卖点摘要" clearable @keyup.enter="handleQuery" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="上架状态" prop="pushStatus">
        <el-select v-model="queryParams.pushStatus" placeholder="请选择上架状态" clearable style="width: 150px;">
          <el-option v-for="dict in push_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否推荐" prop="recommend">
        <el-select v-model="queryParams.recommend" placeholder="请选择是否推荐" clearable style="width: 150px;">
          <el-option v-for="dict in recommend" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['farm:produce:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['farm:produce:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['farm:produce:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['farm:produce:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="produceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" align="center" prop="id" />
      <el-table-column label="农产品名称" align="center" prop="title" />
      <el-table-column label="图片" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="卖点摘要" align="center" prop="resume" />
      <el-table-column label="农产品类型" align="center" prop="produceType" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="上架时间" align="center" prop="pushTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.pushTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" align="center" prop="pushStatus">
        <template #default="scope">
          <dict-tag :options="push_status" :value="scope.row.pushStatus" />
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="recommend">
        <template #default="scope">
          <dict-tag :options="recommend" :value="scope.row.recommend" />
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="accountId" />
      <el-table-column label="浏览量" align="center" prop="browseNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['farm:produce:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['farm:produce:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改农产品对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="produceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="农产品名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入农产品名称" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <image-upload v-model="form.image" />
        </el-form-item>
        <el-form-item label="卖点摘要" prop="resume">
          <el-input v-model="form.resume" placeholder="请输入卖点摘要" />
        </el-form-item>
        <el-form-item label="所属品类" prop="catgory">
          <el-input v-model="form.catgory" placeholder="请输入所属品类" />
        </el-form-item>
        <el-form-item label="所属商户" prop="providerName">
          <el-input v-model="form.providerName" placeholder="请输入所属商户" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="上架状态" prop="pushStatus">
          <el-select v-model="form.pushStatus" placeholder="请选择上架状态">
            <el-option v-for="dict in push_status" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐" prop="recommend">
          <el-select v-model="form.recommend" placeholder="请选择是否推荐">
            <el-option v-for="dict in recommend" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品详情" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="创建人" prop="accountId">
          <el-input v-model="form.accountId" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="浏览量" prop="browseNum">
          <el-input v-model="form.browseNum" placeholder="请输入浏览量" />
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

<script setup name="Produce">
import { listProduce, getProduce, delProduce, addProduce, updateProduce } from "@/api/farm/produce";

const { proxy } = getCurrentInstance();
const { recommend, push_status } = proxy.useDict('recommend', 'push_status');

const produceList = ref([]);
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
      { required: true, message: "农产品名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询农产品列表 */
function getList() {
  loading.value = true;
  listProduce(queryParams.value).then(response => {
    produceList.value = response.rows;
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
    resume: null,
    catgory: null,
    produceType: null,
    providerName: null,
    price: null,
    pushTime: null,
    pushStatus: null,
    recommend: null,
    description: null,
    accountId: null,
    browseNum: null,
    createdTime: null,
    updatedTime: null
  };
  proxy.resetForm("produceRef");
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
  title.value = "添加农产品";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getProduce(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改农产品";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["produceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProduce(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProduce(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除农产品编号为"' + _ids + '"的数据项？').then(function () {
    return delProduce(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('farm/produce/export', {
    ...queryParams.value
  }, `produce_${new Date().getTime()}.xlsx`)
}

getList();
</script>
