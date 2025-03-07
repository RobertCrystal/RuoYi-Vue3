<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务价格" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入服务价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属分类" prop="catgory">
        <el-input
          v-model="queryParams.catgory"
          placeholder="请输入所属分类"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="摘要" prop="resume">
        <el-input
          v-model="queryParams.resume"
          placeholder="请输入摘要"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信号码" prop="weChat">
        <el-input
          v-model="queryParams.weChat"
          placeholder="请输入微信号码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务商名称" prop="providerName">
        <el-input
          v-model="queryParams.providerName"
          placeholder="请输入服务商名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="pubdate">
        <el-date-picker clearable
          v-model="queryParams.pubdate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发布时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发布人id" prop="pubAccountId">
        <el-input
          v-model="queryParams.pubAccountId"
          placeholder="请输入发布人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否推荐：1.推荐；2.不推荐" prop="recommend">
        <el-input
          v-model="queryParams.recommend"
          placeholder="请输入是否推荐：1.推荐；2.不推荐"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="浏览数量" prop="browseNum">
        <el-input
          v-model="queryParams.browseNum"
          placeholder="请输入浏览数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-date-picker clearable
          v-model="queryParams.createdTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间" prop="updatedTime">
        <el-date-picker clearable
          v-model="queryParams.updatedTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['farm:work:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['farm:work:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['farm:work:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['farm:work:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="图片文件id" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="服务价格" align="center" prop="price" />
      <el-table-column label="所属分类" align="center" prop="catgory" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="微信号码" align="center" prop="weChat" />
      <el-table-column label="服务商名称" align="center" prop="providerName" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="发布时间" align="center" prop="pubdate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.pubdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人id" align="center" prop="pubAccountId" />
      <el-table-column label="上架状态：1.已上架；2.未上架" align="center" prop="pushStatus" />
      <el-table-column label="是否推荐：1.推荐；2.不推荐" align="center" prop="recommend" />
      <el-table-column label="浏览数量" align="center" prop="browseNum" />
      <el-table-column label="创建时间" align="center" prop="createdTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['farm:work:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['farm:work:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改农事服务对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="workRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片文件id" prop="image">
          <image-upload v-model="form.image"/>
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
        <el-form-item label="微信号码" prop="weChat">
          <el-input v-model="form.weChat" placeholder="请输入微信号码" />
        </el-form-item>
        <el-form-item label="服务商名称" prop="providerName">
          <el-input v-model="form.providerName" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发布时间" prop="pubdate">
          <el-date-picker clearable
            v-model="form.pubdate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布人id" prop="pubAccountId">
          <el-input v-model="form.pubAccountId" placeholder="请输入发布人id" />
        </el-form-item>
        <el-form-item label="是否推荐：1.推荐；2.不推荐" prop="recommend">
          <el-input v-model="form.recommend" placeholder="请输入是否推荐：1.推荐；2.不推荐" />
        </el-form-item>
        <el-form-item label="浏览数量" prop="browseNum">
          <el-input v-model="form.browseNum" placeholder="请输入浏览数量" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdTime">
          <el-date-picker clearable
            v-model="form.createdTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedTime">
          <el-date-picker clearable
            v-model="form.updatedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择更新时间">
          </el-date-picker>
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

<script setup name="Work">
import { listWork, getWork, delWork, addWork, updateWork } from "@/api/farm/work";

const { proxy } = getCurrentInstance();

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
    pushStatus: null,
    recommend: null,
    browseNum: null,
    createdTime: null,
    updatedTime: null
  },
  rules: {
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
    pushStatus: null,
    recommend: null,
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
    open.value = true;
    title.value = "修改农事服务";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["workRef"].validate(valid => {
    if (valid) {
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
