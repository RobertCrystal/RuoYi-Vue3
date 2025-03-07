<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="专家名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入专家名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属领域" prop="fieldCode">
        <el-input
          v-model="queryParams.fieldCode"
          placeholder="请输入所属领域"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="专家简介" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入专家简介"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属机构" prop="organization">
        <el-input
          v-model="queryParams.organization"
          placeholder="请输入所属机构"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="专家等级" prop="levelCode">
        <el-input
          v-model="queryParams.levelCode"
          placeholder="请输入专家等级"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker clearable
          v-model="queryParams.publishTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发布时间">
        </el-date-picker>
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
          v-hasPermi="['farm:expert:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['farm:expert:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['farm:expert:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['farm:expert:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="expertList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="专家名称" align="center" prop="name" />
      <el-table-column label="所属领域" align="center" prop="fieldCode" />
      <el-table-column label="专家简介" align="center" prop="description" />
      <el-table-column label="头像图片id" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="所属机构" align="center" prop="organization" />
      <el-table-column label="专家等级" align="center" prop="levelCode" />
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布状态：1.已发布；2.未发布" align="center" prop="publishStatus" />
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['farm:expert:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['farm:expert:remove']">删除</el-button>
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

    <!-- 添加或修改知识专家对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="expertRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="专家名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入专家名称" />
        </el-form-item>
        <el-form-item label="所属领域" prop="fieldCode">
          <el-input v-model="form.fieldCode" placeholder="请输入所属领域" />
        </el-form-item>
        <el-form-item label="专家简介" prop="description">
          <el-input v-model="form.description" placeholder="请输入专家简介" />
        </el-form-item>
        <el-form-item label="头像图片id" prop="image">
          <image-upload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="所属机构" prop="organization">
          <el-input v-model="form.organization" placeholder="请输入所属机构" />
        </el-form-item>
        <el-form-item label="专家等级" prop="levelCode">
          <el-input v-model="form.levelCode" placeholder="请输入专家等级" />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker clearable
            v-model="form.publishTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布时间">
          </el-date-picker>
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

<script setup name="Expert">
import { listExpert, getExpert, delExpert, addExpert, updateExpert } from "@/api/farm/expert";

const { proxy } = getCurrentInstance();

const expertList = ref([]);
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
    name: null,
    fieldCode: null,
    description: null,
    image: null,
    organization: null,
    levelCode: null,
    publishTime: null,
    publishStatus: null,
    recommend: null,
    browseNum: null,
    createdTime: null,
    updatedTime: null
  },
  rules: {
    name: [
      { required: true, message: "专家名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询知识专家列表 */
function getList() {
  loading.value = true;
  listExpert(queryParams.value).then(response => {
    expertList.value = response.rows;
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
    name: null,
    fieldCode: null,
    description: null,
    image: null,
    organization: null,
    levelCode: null,
    publishTime: null,
    publishStatus: null,
    recommend: null,
    browseNum: null,
    createdTime: null,
    updatedTime: null
  };
  proxy.resetForm("expertRef");
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
  title.value = "添加知识专家";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getExpert(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改知识专家";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["expertRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateExpert(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addExpert(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除知识专家编号为"' + _ids + '"的数据项？').then(function() {
    return delExpert(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('farm/expert/export', {
    ...queryParams.value
  }, `expert_${new Date().getTime()}.xlsx`)
}

getList();
</script>
