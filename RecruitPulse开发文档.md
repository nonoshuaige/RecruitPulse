# RecruitPulse 智能招聘系统 — 前端开发说明书

> 版本：v3.1（纯前端版）
> 最后更新：2026-06-26
> 技术栈：Vue 3 + Vite + Vant 4 + Pinia + ECharts
> 设计原则：**四 Tab 底部导航、localStorage 持久化、纯前端 mock、零后端依赖**

---

## 一、系统概述

### 1.1 四 Tab 架构

```
┌──────────────────────────────────────────────────────┐
│                    RecruitPulse                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    主内容区（路由切换）                  │
│         /import    /screening    /process    /data    │
│                                                      │
├────────────┬────────────┬────────────┬───────────────┤
│   📥 导入   │  🔍 筛选   │  📋 流程   │   📊 数据      │
└────────────┴────────────┴────────────┴───────────────┘
```

### 1.2 四 Tab 职责

| Tab | 路由 | 核心功能 |
|-----|------|---------|
| 导入 | `/import` | 录入候选人（姓名+手机号）、导入 JSON 聊天记录、模拟 AI 解析 |
| 筛选 | `/screening` | 候选人卡片展示、搜索栏输入筛选条件、模拟打分排序、通过/淘汰 |
| 流程 | `/process` | 面试官录入空闲时间、候选人选时间、待预约→已预约→待评价→已完成四阶段流转 |
| 数据 | `/data` | 待筛选/待预约/已通过 人数统计图表 |

### 1.3 数据流

```
[导入 Tab]                       [筛选 Tab]                  [流程 Tab]                [数据 Tab]
录入候选人 ──> localStorage      读取候选人列表              已通过筛选的候选人          读取全部候选人
导入聊天记录 ──> store           输入筛选条件                 面试官填入空闲时段          按状态分组统计
模拟AI解析 ──> store            模拟AI打分排序               候选人选时间                渲染ECharts图表
                                查看结构化信息               面试完成 → 评价
                                通过/淘汰                   通过/淘汰
```

---

## 二、技术栈与环境

### 2.1 纯前端技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| Node.js | 20 LTS | 运行环境 |
| Vue | 3.4+ (Composition API) | 前端框架 |
| Vite | 5.x | 构建工具 |
| Vue Router | 4.x | Hash 路由 |
| Pinia | 2.x | 状态管理 + localStorage 持久化 |
| Vant | 4.x | 移动端 UI 组件库 |
| ECharts | 5.x | 数据 Tab 图表 |
| uuid | 4.x | 生成候选人 ID |

### 2.2 零后端依赖

- 所有数据存储在 **Pinia + localStorage**
- AI 解析由**前端 mock 函数**模拟
- 文件读取使用 **HTML5 FileReader API**
- 无任何 HTTP 请求

---

## 三、路由与页面结构

### 3.1 路由表

```javascript
// router/index.js
const routes = [
  { path: '/',           redirect: '/import' },
  { path: '/import',     name: 'Import',     component: () => import('@/views/ImportView.vue') },
  { path: '/screening',  name: 'Screening',  component: () => import('@/views/ScreeningView.vue') },
  { path: '/screening/:id', name: 'ScreeningDetail', component: () => import('@/views/ScreeningDetail.vue') },
  { path: '/process',    name: 'Process',    component: () => import('@/views/ProcessView.vue') },
  { path: '/process/:id', name: 'ProcessDetail', component: () => import('@/views/ProcessDetail.vue') },
  { path: '/data',       name: 'Data',       component: () => import('@/views/DataView.vue') },
]
```

### 3.2 页面组件树

```
App.vue
├── 顶部标题栏（显示当前Tab名称）
├── <router-view />（主内容区）
│   ├── ImportView.vue
│   │   ├── 新增候选人弹窗
│   │   └── 候选人卡片列表
│   │       └── CandidateImportCard.vue（每条一个卡片）
│   │           ├── 基本信息展示
│   │           ├── 导入聊天记录按钮 → JSON文件选择
│   │           ├── AI解析按钮
│   │           └── 结构化信息展示+编辑
│   │
│   ├── ScreeningView.vue
│   │   ├── 搜索栏（筛选条件输入）
│   │   ├── 筛选按钮
│   │   └── 候选人卡片列表（按分数排序）
│   │       └── ScreeningCard.vue
│   │           ├── 姓名、学历摘要、分数
│   │           └── 点击进入 ScreeningDetail.vue
│   │
│   ├── ScreeningDetail.vue（候选人结构化信息全览）
│   │   ├── 基本信息
│   │   ├── 学历/工作/项目 JSON 展示
│   │   ├── 通过/淘汰按钮
│   │   └── 理由输入框
│   │
│   ├── ProcessView.vue
│   │   ├── 面试官空闲时间录入区
│   │   ├── 状态 Tab（待预约 / 已预约 / 待评价 / 已完成）
│   │   └── 面试者列表
│   │       └── InterviewCard.vue
│   │           ├── 候选人姓名+岗位
│   │           ├── 预约时间 / 评价状态
│   │           └── 点击进入 ProcessDetail.vue
│   │
│   ├── ProcessDetail.vue
│   │   ├── 候选人信息摘要
│   │   ├── 选择面试时间（从面试官空闲时段中选）
│   │   ├── 标记面试完成 → 待评价
│   │   ├── 面试评价表单
│   │   └── 通过/不通过按钮 + 理由
│   │
│   └── DataView.vue
│       ├── KPI 数字卡片（x3）
│       └── ECharts 饼图
│
└── 底部 TabBar（van-tabbar，4个Tab）
```

---

## 四、Pinia 状态管理 — 核心数据结构

### 4.1 Store 总览

```
stores/
├── candidate.js    # 候选人核心数据 + CRUD
├── process.js      # 面试流程（空闲时间 + 面试状态）
└── app.js          # 全局状态（当前 Tab 等）
```

### 4.2 候选人 Store `stores/candidate.js`

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// 初始 mock 数据（开发调试用）
const MOCK_CANDIDATES = [
  {
    id: '1',
    name: '张三',
    phone: '13800000001',
    // 聊天记录（JSON 数组）
    chatRecords: [
      { role: 'hr', content: '你好，看到你投递了Java岗位，方便聊聊吗？', time: '2026-06-20 10:00' },
      { role: 'candidate', content: '你好，方便，我之前在阿里做了3年后端', time: '2026-06-20 10:02' },
      { role: 'hr', content: '好的，能简单介绍一下你的项目经验吗？', time: '2026-06-20 10:05' },
      { role: 'candidate', content: '我主导过电商秒杀系统的重构，QPS从2k提升到10k，主要用Java和Redis', time: '2026-06-20 10:08' },
      { role: 'hr', content: '你期望的薪资范围是？', time: '2026-06-20 10:10' },
      { role: 'candidate', content: '25k-35k吧，具体可以聊', time: '2026-06-20 10:12' },
    ],
    // 简历文件信息
    resumeFileName: '张三_Java开发.pdf',
    resumeFileContent: `
      张三 | 男 | 28岁 | 13800000001 | zhangsan@example.com
      教育经历：
      浙江大学 计算机科学与技术 本科 2014-2018
      工作经历：
      阿里巴巴 Java开发工程师 2020.06-2023.08
      负责电商核心链路后端开发，主导秒杀模块重构，QPS提升40%
      参与双11大促全链路压测与优化
      字节跳动 后端开发实习生 2019.06-2019.09
      参与广告投放系统后端开发
      项目经历：
      电商秒杀系统重构 2022.03-2022.09 核心开发
      将单体架构拆分为微服务，引入Redis缓存预热与布隆过滤器防穿透
      QPS从2000提升至10000
    `,
    // AI 解析后的结构化数据
    structuredData: {
      gender: '男',
      age: 28,
      email: 'zhangsan@example.com',
      education: [
        { school: '浙江大学', major: '计算机科学与技术', period: '2014-2018' },
      ],
      work: [
        {
          company: '阿里巴巴',
          role: 'Java开发工程师',
          period: '2020.06-2023.08',
          content: '负责电商核心链路后端开发，主导秒杀模块重构，QPS提升40%，参与双11大促全链路压测与优化',
        },
        {
          company: '字节跳动',
          role: '后端开发实习生',
          period: '2019.06-2019.09',
          content: '参与广告投放系统后端开发',
        },
      ],
      project: [
        {
          name: '电商秒杀系统重构',
          period: '2022.03-2022.09',
          role: '核心开发',
          content: '将单体架构拆分为微服务，引入Redis缓存预热与布隆过滤器防穿透，QPS从2000提升至10000',
        },
      ],
    },
    parseStatus: 'done',      // 'none' | 'done'
    // 筛选状态
    screeningStatus: 'pending', // 'pending' | 'passed' | 'eliminated'
    screeningScore: null,
    screeningReason: '',        // 淘汰理由
    // 面试状态（四阶段：pending → scheduled → completed → passed/failed）
    interviewStatus: 'pending', // 'pending' | 'scheduled' | 'completed' | 'passed' | 'failed'
    selectedInterviewSlot: null, // 候选人选定的面试时间
    interviewResult: '',        // 'passed' | 'failed'
    interviewEvaluation: '',    // 面试评价理由
    createdAt: '2026-06-25',
  },
  // ... 更多 mock 候选人
]

export const useCandidateStore = defineStore('candidate', () => {
  // ---- 状态 ----
  const candidates = ref(loadFromStorage())

  // ---- 计算属性 ----
  const pendingScreening = computed(() =>
    candidates.value.filter(c => c.screeningStatus === 'pending')
  )
  const passedScreening = computed(() =>
    candidates.value.filter(c => c.screeningStatus === 'passed')
  )
  const pendingInterview = computed(() =>
    candidates.value.filter(c =>
      c.screeningStatus === 'passed' && c.interviewStatus === 'pending'
    )
  )
  const scheduledInterviews = computed(() =>
    candidates.value.filter(c => c.interviewStatus === 'scheduled')
      .sort((a, b) => (a.selectedInterviewSlot || '').localeCompare(b.selectedInterviewSlot || ''))
  )
  const pendingEvaluation = computed(() =>
    candidates.value.filter(c => c.interviewStatus === 'completed')
  )
  const completedInterviews = computed(() =>
    candidates.value.filter(c =>
      ['passed', 'failed'].includes(c.interviewStatus)
    )
  )
  const passedInterview = computed(() =>
    candidates.value.filter(c => c.interviewStatus === 'passed')
  )

  // ---- 方法 ----
  function addCandidate(name, phone) { ... }
  function removeCandidate(id) { ... }

  // 导入聊天记录（解析 JSON 文件）
  function importChatRecords(id, records) { ... }

  // 导入简历文件（读取文本内容）
  function importResume(id, fileName, content) { ... }

  // 模拟 AI 解析
  function aiParse(id) { ... }

  // 更新结构化数据
  function updateStructuredData(id, data) { ... }

  // 筛选：通过 / 淘汰
  function passScreening(id) { ... }
  function eliminateScreening(id, reason) { ... }

  // 面试：预约 / 评价
  function scheduleInterview(id, slot) { ... }
  function completeInterview(id) { ... }
  function passInterview(id, evaluation) { ... }
  function failInterview(id, evaluation) { ... }

  // ---- 持久化 ----
  function saveToStorage() {
    localStorage.setItem('recruitpulse_candidates', JSON.stringify(candidates.value))
  }
  function loadFromStorage() {
    const data = localStorage.getItem('recruitpulse_candidates')
    return data ? JSON.parse(data) : [...MOCK_CANDIDATES]
  }

  // 监听变化自动保存
  watch(candidates, saveToStorage, { deep: true })

  return { candidates, pendingScreening, passedScreening, pendingInterview,
           scheduledInterviews, completedInterviews, passedInterview,
           addCandidate, removeCandidate, importChatRecords, importResume,
           aiParse, updateStructuredData, passScreening, eliminateScreening,
           scheduleInterview, completeInterview, passInterview, failInterview }
})
```

### 4.3 流程 Store `stores/process.js`

```javascript
export const useProcessStore = defineStore('process', () => {
  // 面试官录入的空闲时间
  const interviewerSlots = ref(loadSlots())

  function addSlots(date, timeRanges) {
    // timeRanges: ['09:00-10:00', '14:00-15:00']
    const existing = interviewerSlots.value.find(s => s.date === date)
    if (existing) {
      existing.slots = [...new Set([...existing.slots, ...timeRanges])]
    } else {
      interviewerSlots.value.push({ date, slots: timeRanges })
    }
    saveSlots()
  }

  function removeSlot(date, slot) { ... }

  return { interviewerSlots, addSlots, removeSlot }
})
```

---

## 五、逐 Tab 详细设计

---

### 5.1 Tab 1：导入 (`ImportView.vue`)

#### 5.1.1 页面布局

```
┌──────────────────────────────────────┐
│              候选人导入                │
├──────────────────────────────────────┤
│          [ ＋ 新增候选人 ]             │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │ 张三  13800000001               │  │
│  │ 解析状态: ✅ 已完成              │  │
│  │                                │  │
│  │ [📥 导入聊天记录(JSON)]          │  │
│  │ [🤖 AI 智能解析]                │  │
│  │                                │  │
│  │ ── 解析结果 ──                  │  │
│  │ 性别: 男  年龄: 28              │  │
│  │ 学历: 浙大 计算机 2014-2018     │  │
│  │ 工作: 阿里 Java 2020-2023 ...   │  │
│  │ [展开查看全部 ▼] [✏️编辑]       │  │
│  │                         [🗑️删除]│  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 李四  13900000002               │  │
│  │ 解析状态: ⏳ 未解析              │  │
│  │ [📥 导入聊天记录(JSON)]          │  │
│  │ [🤖 AI 智能解析]                │  │
│  │                         [🗑️删除]│  │
│  └────────────────────────────────┘  │
│                                      │
│  ...更多候选人卡片...                  │
└──────────────────────────────────────┘
```

#### 5.1.2 新增候选人弹窗

点击 [＋ 新增候选人] 弹出 `van-dialog`：

```
┌──────────────────────────────┐
│        新增候选人              │
│                               │
│  姓名 *                       │
│  ┌───────────────────────┐   │
│  │ 请输入姓名              │   │
│  └───────────────────────┘   │
│                               │
│  手机号 *                     │
│  ┌───────────────────────┐   │
│  │ 请输入手机号            │   │
│  └───────────────────────┘   │
│                               │
│      [取消]    [确认录入]      │
└──────────────────────────────┘
```

#### 5.1.3 导入聊天记录（JSON 文件）

点击 [📥 导入聊天记录(JSON)] → 触发 `<input type="file" accept=".json">` → FileReader 读取

**JSON 文件格式规范：**

```json
[
  { "role": "hr",         "content": "你好，方便聊聊吗？",       "time": "2026-06-20 10:00" },
  { "role": "candidate",  "content": "好的，我之前在阿里做后端",  "time": "2026-06-20 10:02" },
  { "role": "hr",         "content": "能介绍一下你的项目吗？",    "time": "2026-06-20 10:05" },
  { "role": "candidate",  "content": "我主导过秒杀系统重构...",  "time": "2026-06-20 10:08" }
]
```

**代码逻辑：**

```javascript
// CandidateImportCard.vue
const handleImportChat = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const records = JSON.parse(event.target.result)
      // 校验格式
      if (!Array.isArray(records)) throw new Error('必须是数组')
      records.forEach(r => {
        if (!['hr', 'candidate'].includes(r.role)) throw new Error('role 必须为 hr 或 candidate')
        if (!r.content) throw new Error('content 不能为空')
      })
      candidateStore.importChatRecords(props.candidate.id, records)
      showToast('聊天记录导入成功')
    } catch (err) {
      showToast('JSON 格式错误: ' + err.message)
    }
  }
  reader.readAsText(file)
}
```

#### 5.1.4 模拟 AI 解析

点击 [🤖 AI 智能解析] → 从聊天记录中**本地模拟**提取结构化信息：

```javascript
// stores/candidate.js 中的 aiParse 方法
function aiParse(id) {
  const c = candidates.value.find(c => c.id === id)
  if (!c) return

  // 从聊天记录中提取文本
  const fullText = c.chatRecords.map(r => r.content).join('\n')

  // 模拟解析逻辑（基于正则 + 关键词匹配）
  c.structuredData = {
    gender:   extractGender(fullText),
    age:      extractAge(fullText),
    email:    extractEmail(fullText),
    education: extractEducation(fullText),
    work:     extractWork(fullText),
    project:  extractProject(fullText),
  }
  c.parseStatus = 'done'
  saveToStorage()
}

// 示例提取函数
function extractGender(text) {
  if (/男/.test(text) && !/女/.test(text)) return '男'
  if (/女/.test(text) && !/男/.test(text)) return '女'
  return ''
}

function extractAge(text) {
  const match = text.match(/(\d{2})\s*岁/)
  return match ? parseInt(match[1]) : null
}

function extractEmail(text) {
  const match = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
  return match ? match[1] : ''
}

function extractEducation(text) {
  // 匹配 "学校名 专业 时间段" 的模式
  const educations = []
  const lines = text.split('\n')
  for (const line of lines) {
    // 简单匹配：包含"大学"或"学院"的行
    if (/(大学|学院|高中)/.test(line)) {
      const parts = line.trim().split(/\s+/)
      educations.push({
        school: parts[0] || '',
        major: parts[1] || '',
        period: parts[2] || '',
      })
    }
  }
  return educations
}
// ... work 和 project 同理，基于关键词匹配
```

#### 5.1.5 结构化信息展示与编辑

解析完成后，卡片展开显示结构化数据。点击 [展开查看全部 ▼] 弹出完整表单：

```
┌──────────────────────────────────────┐
│        张三 - 结构化信息              │
│                                      │
│  性别: [男]    年龄: [28]             │
│  邮箱: [zhangsan@example.com]        │
│                                      │
│  📚 学历                              │
│  ┌─ 学校: [浙江大学          ]       │
│  │  专业: [计算机科学与技术   ]       │
│  │  时间: [2014-2018        ]       │
│  │                            [删除] │
│  └─────────────────────────────      │
│  [+ 添加学历]                         │
│                                      │
│  💼 工作经历                          │
│  ┌─ 公司: [阿里巴巴          ]       │
│  │  岗位: [Java开发工程师    ]       │
│  │  时间: [2020.06-2023.08  ]       │
│  │  内容: [负责电商核心链路... ]       │
│  │                            [删除] │
│  └─────────────────────────────      │
│  [+ 添加工作]                         │
│                                      │
│  📋 项目经历  ([+ 添加] 同理)         │
│                                      │
│           [取消]    [保存]            │
└──────────────────────────────────────┘
```

每项动态数组用 `v-for` 渲染，通过 `DynamicArrayForm.vue` 组件封装：

```vue
<!-- components/DynamicArrayForm.vue -->
<template>
  <div class="dynamic-array">
    <div v-for="(item, index) in modelValue" :key="index" class="array-item">
      <slot name="item" :item="item" :index="index">
        <!-- 默认渲染：每个字段一个 van-field -->
        <van-field v-for="key in Object.keys(item)"
          :key="key" :label="fieldLabels[key]"
          v-model="item[key]" />
      </slot>
      <van-button size="small" type="danger" @click="remove(index)">删除</van-button>
    </div>
    <van-button size="small" type="primary" @click="add">＋ 添加</van-button>
  </div>
</template>
```

---

### 5.2 Tab 2：筛选 (`ScreeningView.vue` + `ScreeningDetail.vue`)

#### 5.2.1 筛选列表页布局

```
┌──────────────────────────────────────┐
│              AI 智能筛选               │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │ 🔍 输入筛选条件，如：            │  │
│  │ 有电商高并发经验的Java后端，      │  │
│  │ 大厂背景，稳定性好...            │  │
│  └────────────────────────────────┘  │
│           [ 🤖 开始智能筛选 ]         │
├──────────────────────────────────────┤
│  筛选结果（按匹配度降序）              │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ #1 张三  综合评分: 88           │  │
│  │ 浙大 | 计算机 | 2014-2018       │  │
│  │ 阿里 Java 2020-2023             │  │
│  │ 理由: 3年电商重构经验，稳定2.5年 │  │
│  │              [查看详情 →]       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ #2 李四  综合评分: 82           │  │
│  │ 上交 | 软件工程 | 2015-2019     │  │
│  │ 字节 后端 2019-2023             │  │
│  │ 理由: 大厂经历4年，有高并发经验  │  │
│  │              [查看详情 →]       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ...更多卡片...                      │
└──────────────────────────────────────┘
```

#### 5.2.2 模拟筛选打分逻辑

```javascript
// stores/candidate.js
function runScreening(query) {
  const keywords = query.toLowerCase()
  const targetList = candidates.value.filter(c => c.parseStatus === 'done')

  targetList.forEach(c => {
    const allText = JSON.stringify(c.structuredData).toLowerCase()

    // 硬性匹配度：基于关键词命中
    let hardScore = 50
    if (/本科|硕士|博士/.test(allText)) hardScore += 20
    if (/大厂|阿里|腾讯|字节|百度|美团|华为/.test(allText)) hardScore += 15
    if (/\d+\s*年/.test(allText)) hardScore += 10
    hardScore = Math.min(100, hardScore + Math.floor(Math.random() * 10))

    // 经验匹配度：关键词加权
    let expScore = 50
    keywords.split(/[,，\s]+/).forEach(kw => {
      if (allText.includes(kw)) expScore += 10
    })
    expScore = Math.min(100, expScore + Math.floor(Math.random() * 10))

    // 稳定性评估：工作时间段推导
    let stabilityScore = 70
    const workPeriods = c.structuredData.work.map(w => w.period)
    workPeriods.forEach(p => {
      const years = estimateYears(p)
      if (years >= 2) stabilityScore += 10
      else if (years < 1) stabilityScore -= 15
    })
    stabilityScore = Math.min(100, Math.max(30, stabilityScore + Math.floor(Math.random() * 10)))

    c.screeningScore = Math.round(hardScore * 0.35 + expScore * 0.45 + stabilityScore * 0.20)
    c._screeningDetail = {
      hardScore, expScore, stabilityScore,
      reason: generateReason(c, query),
      risks: generateRisks(c),
    }
  })

  // 按分数降序排序
  targetList.sort((a, b) => b.screeningScore - a.screeningScore)

  return targetList
}

function estimateYears(period) {
  const match = period.match(/(\d{4}).*?(\d{4})/)
  if (match) return parseInt(match[2]) - parseInt(match[1])
  return 1
}
```

#### 5.2.3 筛选详情页 (`ScreeningDetail.vue`)

点击卡片 [查看详情 →] 进入：

```
┌──────────────────────────────────────┐
│  ← 返回       张三 - 筛选详情         │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │      综合评分: 88 分            │  │
│  │  硬性匹配: 95 | 经验: 85 | 稳定:85│  │
│  │  理由: 3年电商重构，完全符合      │  │
│  │  风险: 未发现量化调优指标        │  │
│  └────────────────────────────────┘  │
│                                      │
│  📋 基本信息                          │
│  姓名: 张三  性别: 男  年龄: 28       │
│  手机: 13800000001  邮箱: zs@xx.com  │
│                                      │
│  📚 学历                              │
│  ┌─ 浙江大学 计算机科学 2014-2018     │
│                                      │
│  💼 工作经历                          │
│  ┌─ 阿里 Java开发 2020.06-2023.08    │
│  │  负责电商核心链路，主导秒杀重构     │
│  └─ 字节 后端实习 2019.06-2019.09    │
│  │  参与广告投放系统开发              │
│                                      │
│  📋 项目经历                          │
│  ┌─ 电商秒杀系统重构 2022.03-2022.09 │
│  │  核心开发 | QPS 2k→10k            │
│                                      │
│  📝 原始聊天记录                      │
│  ┌─ HR: 你好，方便聊聊吗？  10:00    │
│  │  候选人: 好的，我在阿里做过后端     │
│  │  HR: 介绍下项目？        10:05    │
│  │  候选人: 主导秒杀重构...  10:08   │
│  └────────────────────────────────┘  │
│                                      │
│  ──────── 操作区 ────────             │
│  淘汰理由（选填）:                     │
│  ┌────────────────────────────────┐  │
│  │                              │  │
│  └────────────────────────────────┘  │
│                                      │
│    [ ❌ 淘汰 ]      [ ✅ 通过筛选 ]    │
└──────────────────────────────────────┘
```

**通过流程：** `candidate.screeningStatus = 'passed'` → 自动进入 Tab 3 的「待预约」列表

**淘汰流程：** `candidate.screeningStatus = 'eliminated'` + `candidate.screeningReason = '...'`

---

### 5.3 Tab 3：流程 (`ProcessView.vue` + `ProcessDetail.vue`)

#### 5.3.1 流程列表页布局

```
┌──────────────────────────────────────┐
│              面试流程                  │
├──────────────────────────────────────┤
│  📅 面试官空闲时间                     │
│  ┌────────────────────────────────┐  │
│  │ 日期: [2026-06-26] [2026-06-27]│  │
│  │ 时段:                          │  │
│  │ ☑ 09:00-10:00   ☑ 14:00-15:00 │  │
│  │ ☐ 10:00-11:00   ☑ 15:00-16:00 │  │
│  │ ☐ 11:00-12:00   ☐ 16:00-17:00 │  │
│  └────────────────────────────────┘  │
│  [ 保存空闲时间 ]                      │
├──────────────────────────────────────┤
│  [待预约(3)] [已预约(2)] [待评价(2)] [已完成(5)]│  ← van-tabs
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │ 张三  Java开发                  │  │
│  │ 状态: 待预约                    │  │
│  │ 可选时段:                       │  │
│  │ ○ 6/26 09:00-10:00             │  │
│  │ ○ 6/26 14:00-15:00             │  │
│  │ ○ 6/27 10:00-11:00             │  │
│  │ [确认预约]                      │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 李四  产品经理                  │  │
│  │ 状态: 已预约 📅 6/28 14:00-15:00│  │
│  │         [查看详情 →]           │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 王五  Java开发                  │  │
│  │ 状态: 待评价 📅 6/26 10:00-11:00│  │
│  │         [查看详情 →]           │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 赵六  测试开发                  │  │
│  │ 状态: ✅ 已通过                 │  │
│  │ 💬 自动化测试经验丰富，建议录用   │  │
│  │         [查看详情 →]           │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

#### 5.3.2 面试官空闲时间录入

```vue
<!-- ProcessView.vue 顶部区域 -->
<template>
  <div class="slots-section">
    <van-cell title="面试官空闲时间" is-link @click="showSlotPicker = true"
      :value="slotSummary" />

    <van-popup v-model:show="showSlotPicker" position="bottom" round
      :style="{ height: '60%' }">
      <div class="slot-picker">
        <h3>选择日期</h3>
        <van-checkbox-group v-model="selectedDates">
          <!-- 未来7天日期 -->
          <van-checkbox v-for="d in next7Days" :key="d" :name="d">
            {{ formatDate(d) }}
          </van-checkbox>
        </van-checkbox-group>

        <h3>选择时段</h3>
        <van-checkbox-group v-model="selectedTimeSlots">
          <van-checkbox name="09:00-10:00">09:00-10:00</van-checkbox>
          <van-checkbox name="10:00-11:00">10:00-11:00</van-checkbox>
          <van-checkbox name="11:00-12:00">11:00-12:00</van-checkbox>
          <van-checkbox name="14:00-15:00">14:00-15:00</van-checkbox>
          <van-checkbox name="15:00-16:00">15:00-16:00</van-checkbox>
          <van-checkbox name="16:00-17:00">16:00-17:00</van-checkbox>
        </van-checkbox-group>

        <van-button block type="primary" @click="saveSlots">保存空闲时间</van-button>
      </div>
    </van-popup>
  </div>
</template>
```

#### 5.3.3 候选人选时间（模拟）

在「待预约」Tab 中，候选人状态为 `interviewStatus === 'pending'` 且 `screeningStatus === 'passed'`：

```javascript
// 候选人选择一个时段 → 状态变为"已预约"
function selectSlot(candidateId, slot) {
  const c = candidateStore.candidates.find(c => c.id === candidateId)
  c.selectedInterviewSlot = slot
  c.interviewStatus = 'scheduled'
  showToast(`${c.name} 已预约 ${slot}`)
}
```

#### 5.3.4 面试详情与评价 (`ProcessDetail.vue`)

详情页按面试状态展示不同内容：

**已预约状态** — 显示面试时间 + "模拟面试完成"按钮：

```
📅 面试时间: 2026-06-28 14:00-15:00
⏰ 等待预约
[ 模拟面试完成，开始评价 ]    ← 点击后 interviewStatus → 'completed'
```

**待评价状态** — 显示面试时间 + 评价表单：

```
📅 面试时间: 2026-06-26 10:00-11:00
评价内容:
┌────────────────────────────────┐
│                              │
└────────────────────────────────┘
[ ❌ 不通过 ]    [ ✅ 通过 ]
```

**已完成状态** — 显示结果 + 评价内容：

```
✅ 面试通过（或 ❌ 面试不通过）
📅 面试时间: 2026-06-24 15:00-16:00
💬 评价: 自动化测试经验丰富，技术栈匹配，建议录用。
```

状态流转方法：

```javascript
function handleMarkCompleted() {
  store.completeInterview(id)  // 'scheduled' → 'completed'
}

function handlePass() {
  store.passInterview(id, evaluation)   // 'completed' → 'passed' + 评价
}

function handleFail() {
  store.failInterview(id, evaluation)   // 'completed' → 'failed' + 评价
}
```

#### 5.3.5 四个状态 Tab 的数据筛选

```javascript
// ProcessView.vue
const activeTab = ref(0)  // 0:待预约, 1:已预约, 2:待评价, 3:已完成

const displayList = computed(() => {
  const store = useCandidateStore()
  if (activeTab.value === 0) {
    // 待预约：筛选通过 且 面试状态为 pending
    return store.candidates.filter(c =>
      c.screeningStatus === 'passed' && c.interviewStatus === 'pending'
    )
  } else if (activeTab.value === 1) {
    // 已预约：按面试时间排序
    return store.candidates.filter(c =>
      c.interviewStatus === 'scheduled'
    ).sort((a, b) => a.selectedInterviewSlot?.localeCompare(b.selectedInterviewSlot))
  } else if (activeTab.value === 2) {
    // 待评价：面试已完成，等待填写评价
    return store.candidates.filter(c =>
      c.interviewStatus === 'completed'
    )
  } else {
    // 已完成：已通过/未通过
    return store.candidates.filter(c =>
      ['passed', 'failed'].includes(c.interviewStatus)
    )
  }
})
```

**「已预约」列表按时间排序**，方便面试官按当天时间顺序面试。

---

### 5.4 Tab 4：数据 (`DataView.vue`)

#### 5.4.1 页面布局

```
┌──────────────────────────────────────┐
│              招聘数据看板              │
├──────────────────────────────────────┤
│  ┌────────┬────────┬────────┐        │
│  │ 待筛选  │ 待预约  │ 已通过  │        │
│  │   5    │   3    │   2    │        │
│  └────────┴────────┴────────┘        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │      候选人状态分布（饼图）      │  │
│  │       (ECharts Pie)           │  │
│  │   待筛选 5 | 待预约 3 | 已通过 2│  │
│  │   已淘汰 1 | 面试失败 0         │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

#### 5.4.2 KPI 卡片

```vue
<template>
  <div class="kpi-row">
    <div class="kpi-card kpi-pending">
      <div class="kpi-num">{{ stats.pendingScreening }}</div>
      <div class="kpi-label">待筛选</div>
    </div>
    <div class="kpi-card kpi-interview">
      <div class="kpi-num">{{ stats.pendingInterview }}</div>
      <div class="kpi-label">待预约</div>
    </div>
    <div class="kpi-card kpi-passed">
      <div class="kpi-num">{{ stats.passedInterview }}</div>
      <div class="kpi-label">已通过</div>
    </div>
  </div>
</template>

<script setup>
import { useCandidateStore } from '@/stores/candidate'
import { computed } from 'vue'

const store = useCandidateStore()
const stats = computed(() => ({
  pendingScreening: store.candidates.filter(c => c.screeningStatus === 'pending').length,
  pendingInterview: store.candidates.filter(c =>
    c.screeningStatus === 'passed' && c.interviewStatus === 'pending'
  ).length,
  passedInterview: store.candidates.filter(c => c.interviewStatus === 'passed').length,
}))
</script>
```

#### 5.4.3 ECharts 饼图

```javascript
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'

const chartRef = ref(null)

function initChart() {
  const chart = echarts.init(chartRef.value)
  const store = useCandidateStore()

  const data = [
    { value: store.candidates.filter(c => c.screeningStatus === 'pending').length, name: '待筛选' },
    { value: store.pendingInterview.length, name: '待预约' },
    { value: store.passedInterview.length, name: '已通过' },
    { value: store.candidates.filter(c => c.screeningStatus === 'eliminated').length, name: '已淘汰' },
    { value: store.candidates.filter(c => c.interviewStatus === 'failed').length, name: '面试不通过' },
  ].filter(d => d.value > 0)

  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data,
      label: { formatter: '{b}\n{c}人' },
    }],
  })
}
```

---

## 六、前端目录结构

```
recruitpulse-frontend/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.js
    ├── App.vue                        # 顶部标题 + router-view + 底部TabBar
    ├── router/
    │   └── index.js                   # 4 个路由 + redirect
    ├── stores/
    │   ├── candidate.js               # 核心候选人数据 store
    │   └── process.js                 # 面试官空闲时间 store
    ├── utils/
    │   ├── mock-ai.js                 # 模拟 AI 解析函数（extractGender等）
    │   ├── mock-screening.js          # 模拟筛选打分函数
    │   └── storage.js                 # localStorage 工具
    ├── components/
    │   ├── CandidateImportCard.vue    # 导入Tab中的候选人卡片
    │   ├── ScreeningCard.vue          # 筛选Tab中的候选人卡片
    │   ├── InterviewCard.vue          # 流程Tab中的面试卡片
    │   ├── DynamicArrayForm.vue       # 动态数组表单（学历/工作/项目通用）
    │   ├── StructuredDataView.vue     # 结构化信息只读展示
    │   ├── SlotPicker.vue             # 面试时间选择器
    │   └── KpiCard.vue                # KPI 数字卡片
    └── views/
        ├── ImportView.vue             # Tab1: 导入
        ├── ScreeningView.vue          # Tab2: 筛选列表
        ├── ScreeningDetail.vue        # Tab2: 筛选详情+通过/淘汰
        ├── ProcessView.vue            # Tab3: 面试流程列表
        ├── ProcessDetail.vue          # Tab3: 面试详情+评价
        └── DataView.vue               # Tab4: 数据看板
```

---

## 七、App.vue 骨架代码

```vue
<!-- App.vue -->
<template>
  <div class="app">
    <header class="app-header">
      <h2>{{ tabTitle }}</h2>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item to="/import"    icon="add-o">      导入</van-tabbar-item>
      <van-tabbar-item to="/screening" icon="search">     筛选</van-tabbar-item>
      <van-tabbar-item to="/process"   icon="todo-list-o">流程</van-tabbar-item>
      <van-tabbar-item to="/data"      icon="chart-trending-o">数据</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = computed({
  get: () => {
    const map = { '/import': 0, '/screening': 1, '/process': 2, '/data': 3 }
    return map[route.path] ?? 0
  },
  set: () => {},
})

const tabTitle = computed(() => {
  const map = { '/import': '候选人导入', '/screening': 'AI 智能筛选',
                '/process': '面试流程', '/data': '数据看板' }
  return map[route.path] || 'RecruitPulse'
})
</script>

<style>
.app { max-width: 480px; margin: 0 auto; min-height: 100vh; display: flex;
       flex-direction: column; background: #f7f8fa; }
.app-header { padding: 16px; background: #fff; text-align: center;
              border-bottom: 1px solid #ebedf0; }
.app-main { flex: 1; overflow-y: auto; padding-bottom: 60px; }
</style>
```

---

## 八、开发启动步骤

### 8.1 创建项目

```bash
npm create vite@latest recruitpulse-frontend -- --template vue
cd recruitpulse-frontend
npm install
npm install vant@4 vue-router@4 pinia@2 uuid@4
npm install echarts   # 数据Tab图表
```

### 8.2 配置 Vant 按需引入（推荐）

```javascript
// vite.config.js
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    vue(),
    AutoImport({ resolvers: [VantResolver()] }),
    Components({ resolvers: [VantResolver()] }),
  ],
}
```

或者全量引入（简单）：

```javascript
// main.js
import 'vant/lib/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

### 8.3 启动开发服务

```bash
npm run dev
# → http://localhost:5173
```

### 8.4 目录创建命令

```bash
mkdir -p src/{router,stores,utils,components,views}
```

---

## 九、数据流转全链路总结

```
Tab1: 导入
  录入姓名+手机号 ──> 导入聊天记录JSON
        │
        ▼
  模拟AI解析 ──> 结构化数据填入 store ──> 用户可编辑确认
        │
        ▼ (parseStatus = 'done')
Tab2: 筛选
  输入筛选条件 ──> 模拟打分排序 ──> 卡片展示
        │
        ├── 通过 ──> screeningStatus = 'passed' ──> 进入流程池
        └── 淘汰 ──> screeningStatus = 'eliminated'
        │
        ▼ (screeningStatus = 'passed')
Tab3: 流程（四阶段流转）
  面试官录入空闲时间 ──> 待预约列表显示候选人
        │
        ├── 候选人选时间 ──> interviewStatus = 'scheduled'（已预约）
        ├── 面试完成 ──> interviewStatus = 'completed'（待评价）
        ├── 面试官评价
        │     ├── 通过 ──> interviewStatus = 'passed'
        │     └── 不通过 ──> interviewStatus = 'failed'
        │
        ▼ (所有数据实时写入 localStorage)
Tab4: 数据
  读取 store 中全部候选人 ──> 按状态分组计数 ──> KPI卡片 + ECharts饼图
```

---

## 附 A：后续可扩展方向

| 方向 | 说明 |
|------|------|
| 接入真实智谱 API | 替换 `mock-ai.js` 为真实 HTTP 调用 |
| 接入后端 Spring Boot | 将 Pinia store 替换为 REST API 调用 |
| PDF 文本解析 | 引入 `pdfjs-dist` 解析 PDF 文本内容 |
| 多轮面试 | 在候选人数据中增加 `interviewRounds` 数组 |
| 企微真实集成 | 替换模拟卡片为企微 JS-SDK 调用 |

---

## 附 B：开发顺序建议

1. **架子搭建**：Vite 项目 + 路由 + Pinia + Vant 引入 + `App.vue` 底部 TabBar
2. **Store 初始化**：`candidate.js` 含 mock 数据 + localStorage 读写
3. **Tab1 导入**：`ImportView.vue` + `CandidateImportCard.vue` + 文件导入 + 模拟 AI
4. **Tab2 筛选**：`ScreeningView.vue` + `ScreeningDetail.vue` + 模拟打分
5. **Tab3 流程**：`ProcessView.vue` + `ProcessDetail.vue` + 空闲时间 + 状态流转
6. **Tab4 数据**：`DataView.vue` + ECharts 饼图
7. **打磨**：组件复用抽取、样式统一、边界情况处理

---

*本文档随前端开发迭代更新。*
