<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="课程标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入课程标题" clearable @keyup.enter="handleQuery" style="width: 120px;" />
      </el-form-item>
      <!-- <el-form-item label="专家" prop="expertId">
        <el-input v-model="queryParams.expertId" placeholder="请输入专家" clearable @keyup.enter="handleQuery" style="width: 100px;" />
      </el-form-item>
      <el-form-item label="所属领域" prop="fieldCode">
        <el-input v-model="queryParams.fieldCode" placeholder="请输入所属领域" clearable @keyup.enter="handleQuery" style="width: 120px;" />
      </el-form-item> -->
      <el-form-item label="所属分类" prop="serviceCatgoryCode">
        <el-select v-model="queryParams.serviceCatgoryCode" placeholder="请选择所属分类" clearable style="width: 150px;">
          <el-option v-for="dict in sevice_catgory" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['farm:course:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['farm:course:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['farm:course:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['farm:course:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" align="center" prop="id" />
      <el-table-column label="课程标题" align="center" prop="title" />
      <el-table-column label="文章摘要" align="center" prop="resume" show-overflow-tooltip
        class-name="description-column" />
      <el-table-column label="专家" align="center" prop="expertName" />
      <el-table-column label="所属领域" align="center" prop="expertField">
        <template #default="scope">
          <dict-tag :options="expert_field" :value="scope.row.expertField"/>
        </template>
      </el-table-column>
      <el-table-column label="课程封面图片" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="正文" align="center" prop="content" show-overflow-tooltip class-name="description-column" />
      <el-table-column label="所属分类" align="center" prop="serviceCatgoryCode">
        <template #default="scope">
          <dict-tag :options="sevice_catgory" :value="scope.row.serviceCatgoryCode" />
        </template>
      </el-table-column>
      <el-table-column label="所属品类" align="center" prop="produceCategoryId" />
      <el-table-column label="视频文件" align="center" prop="video" />
      <el-table-column label="课程类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :options="course_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="recommend">
        <template #default="scope">
          <dict-tag :options="recommend" :value="scope.row.recommend" />
        </template>
      </el-table-column>
      <el-table-column label="发布状态 " align="center" prop="publishStatus">
        <template #default="scope">
          <dict-tag :options="publish_status" :value="scope.row.publishStatus" />
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览数量" align="center" prop="browseNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['farm:course:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['farm:course:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改知识课程对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="courseRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入课程标题" />
        </el-form-item>
        <el-form-item label="文章摘要" prop="resume">
          <el-input v-model="form.resume" placeholder="请输入文章摘要" />
        </el-form-item>
        <el-form-item label="专家" prop="expertId">
          <el-input v-model="form.expertId" placeholder="请输入专家" />
        </el-form-item>
        <el-form-item label="所属领域" prop="fieldCode">
          <el-input v-model="form.fieldCode" placeholder="请输入所属领域" />
        </el-form-item>
        <el-form-item label="课程封面图片" prop="image">
          <image-upload v-model="form.image" />
        </el-form-item>
        <el-form-item label="正文">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="所属分类" prop="serviceCatgoryCode">
          <el-select v-model="form.serviceCatgoryCode" placeholder="请选择所属分类">
            <el-option v-for="dict in sevice_catgory" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属品类" prop="produceCategoryId">
          <el-input v-model="form.produceCategoryId" placeholder="请输入所属品类" />
        </el-form-item>
        <el-form-item label="视频文件" prop="video">
          <el-input v-model="form.video" placeholder="请输入视频文件" />
        </el-form-item>
        <el-form-item label="课程类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择课程类型">
            <el-option v-for="dict in course_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐" prop="recommend">
          <el-select v-model="form.recommend" placeholder="请选择是否推荐">
            <el-option v-for="dict in recommend" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态 " prop="publishStatus">
          <el-select v-model="form.publishStatus" placeholder="请选择发布状态 ">
            <el-option v-for="dict in publish_status" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker clearable v-model="form.publishTime" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择发布时间">
          </el-date-picker>
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

<script setup name="Course">
import { listCourse, getCourse, delCourse, addCourse, updateCourse } from "@/api/farm/course";

const { proxy } = getCurrentInstance();
const { course_type, recommend, publish_status, sevice_catgory, expert_field } = proxy.useDict('course_type', 'recommend', 'publish_status', 'sevice_catgory', 'expert_field');

const courseList = ref([]);
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
    expertId: null,
    fieldCode: null,
    serviceCatgoryCode: null,
  },
  rules: {
    title: [
      { required: true, message: "课程标题不能为空", trigger: "blur" }
    ],
    expertId: [
      { required: true, message: "专家不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询知识课程列表 */
function getList() {
  loading.value = true;
  listCourse(queryParams.value).then(response => {
    courseList.value = response.rows;
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
    resume: null,
    expertId: null,
    fieldCode: null,
    image: null,
    content: null,
    serviceCatgoryCode: null,
    produceCategoryId: null,
    video: null,
    type: null,
    recommend: null,
    publishStatus: null,
    publishTime: null,
    browseNum: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("courseRef");
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
  title.value = "添加知识课程";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCourse(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改知识课程";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["courseRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCourse(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCourse(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除知识课程编号为"' + _ids + '"的数据项？').then(function () {
    return delCourse(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('farm/course/export', {
    ...queryParams.value
  }, `course_${new Date().getTime()}.xlsx`)
}

getList();
</script>
