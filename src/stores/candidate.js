import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { mockAiParse } from '@/utils/mock-ai.js'
import { runScreening } from '@/utils/mock-screening.js'

const STORAGE_KEY = 'recruitpulse_candidates'

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function makeBlank() {
  return {
    id: '',
    name: '',
    phone: '',
    chatRecords: [],
    resumeFileName: '',
    resumeFileContent: '',
    structuredData: {
      gender: '',
      age: null,
      email: '',
      education: [],
      work: [],
      project: [],
    },
    parseStatus: 'none',
    screeningStatus: 'pending',
    screeningScore: null,
    screeningFeedback: null,
    interviewStatus: 'pending',
    selectedInterviewSlot: null,
    interviewResult: '',
    interviewEvaluation: '',
    createdAt: new Date().toISOString().slice(0, 10),
  }
}

const MOCK = [
  {
    id: 'm1',
    name: '张三',
    phone: '13800000001',
    chatRecords: [
      { role: 'hr', content: '张三你好，我是XX公司的HR小王，在Boss直聘上看到你的简历，想聊聊Java开发岗位，方便吗？', time: '2026-06-20 10:00', type: 'chat' },
      { role: 'candidate', content: '你好王老师，方便的，我对贵公司很感兴趣', time: '2026-06-20 10:02', type: 'chat' },
      { role: 'hr', content: '好的，那你先发一下简历吧，我看看详细情况', time: '2026-06-20 10:03', type: 'chat' },
      { role: 'candidate', content: '[文件] 简历.pdf', time: '2026-06-20 10:04', type: 'file' },
      { role: 'hr', content: '收到了，我看你之前在阿里做过3年Java开发，能具体说说你负责的项目吗？有没有高并发相关的经验？', time: '2026-06-20 10:06', type: 'chat' },
      { role: 'candidate', content: '好的，我的经历如下：\n\n【教育经历】\n浙江大学 计算机科学与技术 硕士 2017-2020\n杭州电子科技大学 软件工程 本科 2014-2017\n\n【工作经历】\n阿里巴巴 Java开发工程师 2020.06-2023.08\n负责电商核心链路后端开发，主导秒杀模块重构，QPS从2000提升至10000\n\n字节跳动 后端开发实习生 2019.06-2019.09\n参与广告投放系统后端开发\n\n【项目经历】\n电商秒杀系统重构 2022.03-2022.09 核心开发\n引入Redis缓存预热+布隆过滤器防穿透，微服务架构', time: '2026-06-20 10:08', type: 'resume' },
      { role: 'hr', content: '经验很匹配！你期望薪资大概多少？最快什么时候能入职？', time: '2026-06-20 10:11', type: 'chat' },
      { role: 'candidate', content: '期望25k-35k，离职交接中，大概2周内可以入职', time: '2026-06-20 10:13', type: 'chat' },
      { role: 'hr', content: '好的，我这边整理一下推给面试官，有消息企微联系你', time: '2026-06-20 10:15', type: 'chat' },
    ],
    resumeFileName: '张三_Java开发.pdf',
    resumeFileContent: `张三 | 男 | 28岁 | 13800000001 | zhangsan@example.com
教育经历：
浙江大学 计算机科学与技术 硕士 2017-2020
杭州电子科技大学 软件工程 本科 2014-2017
工作经历：
阿里巴巴 Java开发工程师 2020.06-2023.08
负责电商核心链路后端开发，主导秒杀模块重构，QPS提升40%
字节跳动 后端开发实习生 2019.06-2019.09
项目经历：
电商秒杀系统重构 2022.03-2022.09 核心开发
将单体架构拆分为微服务，引入Redis缓存预热与布隆过滤器防穿透`,
    structuredData: {
      gender: '男',
      age: 28,
      email: 'zhangsan@example.com',
      education: [
        { school: '浙江大学', major: '计算机科学与技术', period: '2017-2020' },
        { school: '杭州电子科技大学', major: '软件工程', period: '2014-2017' },
      ],
      work: [
        { company: '阿里巴巴', role: 'Java开发工程师', period: '2020.06-2023.08', content: '负责电商核心链路后端开发，主导秒杀模块重构，QPS提升40%。参与双11大促全链路压测与优化，保障系统零故障。' },
        { company: '字节跳动', role: '后端开发实习生', period: '2019.06-2019.09', content: '参与广告投放系统后端开发，使用Go语言编写数据处理Pipeline。' },
      ],
      project: [
        { name: '电商秒杀系统重构', period: '2022.03-2022.09', role: '核心开发', content: '将单体架构拆分为微服务，引入Redis缓存预热与布隆过滤器防穿透，QPS从2000提升至10000，接口RT从200ms降至30ms。' },
      ],
    },
    parseStatus: 'done',
    screeningStatus: 'passed',
    screeningScore: 88,
    screeningFeedback: null,
    interviewStatus: 'pending',
    selectedInterviewSlot: null,
    interviewResult: '',
    interviewEvaluation: '',
    createdAt: '2026-06-20',
  },
  {
    id: 'm2',
    name: '李四',
    phone: '13900000002',
    chatRecords: [
      { role: 'hr', content: '李四你好，我是XX公司HR小刘，收到了你投递的前端开发简历，方便聊几句吗？', time: '2026-06-21 14:00', type: 'chat' },
      { role: 'candidate', content: '刘老师好，方便的，我有5年前端经验，目前在字节跳动', time: '2026-06-21 14:02', type: 'chat' },
      { role: 'hr', content: '好的，你能先把简历发我一份吗？我这边系统里需要存档', time: '2026-06-21 14:03', type: 'chat' },
      { role: 'candidate', content: '[文件] 简历.pdf', time: '2026-06-21 14:04', type: 'file' },
      { role: 'hr', content: '谢谢！你技术栈主要用哪些？有没有带过人或者做过从0到1的项目？', time: '2026-06-21 14:06', type: 'chat' },
      { role: 'candidate', content: '我的详细情况：\n\n【教育经历】\n上海交通大学 软件工程 本科 2015-2019\n\n【工作经历】\n字节跳动 高级前端开发 2019.07-2024.03\n负责飞书文档前端架构，主导编辑器核心模块重构，带领3人小组完成低代码搭建平台从0到1\n\n【项目经历】\n企业级低代码平台 2022.01-2023.06 项目负责人\n基于Vue3+TypeScript从零搭建，支持组件拖拽、数据源绑定、在线部署，服务200+内部用户', time: '2026-06-21 14:08', type: 'resume' },
      { role: 'hr', content: '有低代码经验太好了，我们正好需要这方面的人。期望薪资范围是？', time: '2026-06-21 14:10', type: 'chat' },
      { role: 'candidate', content: '30k-40k吧，具体看岗位级别', time: '2026-06-21 14:12', type: 'chat' },
      { role: 'hr', content: '收到，我尽快推进，有消息通知你', time: '2026-06-21 14:14', type: 'chat' },
    ],
    resumeFileName: '李四_前端开发.pdf',
    resumeFileContent: `李四 | 男 | 30岁 | 13900000002 | lisi@example.com
教育经历：
上海交通大学 软件工程 本科 2015-2019
工作经历：
字节跳动 高级前端开发 2019.07-2024.03
负责飞书文档前端架构，主导编辑器核心模块重构
带领3人小组完成低代码搭建平台从0到1
腾讯 前端开发实习生 2018.06-2018.09
项目经历：
企业级低代码平台 2022.01-2023.06 项目负责人
基于Vue3+TypeScript从零搭建，支持组件拖拽、数据源绑定、在线部署
服务200+内部用户，提升运营页面搭建效率80%`,
    structuredData: {
      gender: '男',
      age: 30,
      email: 'lisi@example.com',
      education: [{ school: '上海交通大学', major: '软件工程', period: '2015-2019' }],
      work: [
        { company: '字节跳动', role: '高级前端开发', period: '2019.07-2024.03', content: '负责飞书文档前端架构，主导编辑器核心模块重构。带领3人小组完成低代码搭建平台从0到1。' },
        { company: '腾讯', role: '前端开发实习生', period: '2018.06-2018.09', content: '参与TAPD项目管理工具前端开发。' },
      ],
      project: [
        { name: '企业级低代码平台', period: '2022.01-2023.06', role: '项目负责人', content: '基于Vue3+TypeScript从零搭建，支持组件拖拽、数据源绑定、在线部署。服务200+内部用户，提升运营页面搭建效率80%。' },
      ],
    },
    parseStatus: 'done',
    screeningStatus: 'passed',
    screeningScore: 82,
    screeningFeedback: null,
    interviewStatus: 'scheduled',
    selectedInterviewSlot: '2026-06-28 14:00-15:00',
    interviewResult: '',
    interviewEvaluation: '',
    createdAt: '2026-06-21',
  },
  {
    id: 'm3',
    name: '王五',
    phone: '13700000003',
    chatRecords: [
      { role: 'hr', content: '王五你好，我是XX公司HR小李，你的简历我们收到了，想进一步了解下', time: '2026-06-22 09:00', type: 'chat' },
      { role: 'candidate', content: '李老师好，我之前在美团做产品经理，对贵司的产品岗很有兴趣', time: '2026-06-22 09:02', type: 'chat' },
      { role: 'hr', content: '方便再发一下最新简历吗？我这边系统归档用', time: '2026-06-22 09:03', type: 'chat' },
      { role: 'candidate', content: '[文件] 简历.docx', time: '2026-06-22 09:04', type: 'file' },
      { role: 'hr', content: '收到了。你之前在美团具体负责什么产品？有没有从0到1的经验？', time: '2026-06-22 09:05', type: 'chat' },
      { role: 'candidate', content: '我的情况如下：\n\n【教育经历】\n南京大学 信息管理与信息系统 本科 2017-2021\n\n【工作经历】\n美团 产品经理 2021.07-2025.04\n负责商家端SaaS系统，从0到1搭建商家后台管理模块，月活商家从500增长至3000，商家满意度提升35%\n\n【项目经历】\n商家SaaS系统重构 2023.03-2024.01 产品负责人\n重新设计商家后台信息架构，NPS从32提升至58，商家留存率提升20%', time: '2026-06-22 09:08', type: 'resume' },
      { role: 'hr', content: '有SaaS产品经验很难得，期望薪资大概多少？', time: '2026-06-22 09:10', type: 'chat' },
      { role: 'candidate', content: '期望20k-28k，可以沟通', time: '2026-06-22 09:11', type: 'chat' },
      { role: 'hr', content: '好的，我整理后推给业务部门，有反馈第一时间通知你', time: '2026-06-22 09:12', type: 'chat' },
    ],
    resumeFileName: '王五_产品经理.docx',
    resumeFileContent: `王五 | 女 | 27岁 | 13700000003 | wangwu@example.com
教育经历：
南京大学 信息管理与信息系统 本科 2017-2021
工作经历：
美团 产品经理 2021.07-2025.04
负责商家端SaaS系统，从0到1搭建商家后台管理模块
主导需求调研、竞品分析、PRD撰写、项目推进全流程
月活商家从500增长至3000，商家满意度提升35%
项目经历：
商家SaaS系统重构 2023.03-2024.01 产品负责人
重新设计商家后台信息架构，优化核心操作流程
NPS从32提升至58，商家留存率提升20%`,
    structuredData: {
      gender: '女',
      age: 27,
      email: 'wangwu@example.com',
      education: [{ school: '南京大学', major: '信息管理与信息系统', period: '2017-2021' }],
      work: [
        { company: '美团', role: '产品经理', period: '2021.07-2025.04', content: '负责商家端SaaS系统，从0到1搭建商家后台管理模块。主导需求调研、竞品分析、PRD撰写、项目推进全流程。月活商家从500增长至3000，商家满意度提升35%。' },
      ],
      project: [
        { name: '商家SaaS系统重构', period: '2023.03-2024.01', role: '产品负责人', content: '重新设计商家后台信息架构，优化核心操作流程。NPS从32提升至58，商家留存率提升20%。' },
      ],
    },
    parseStatus: 'done',
    screeningStatus: 'passed',
    screeningScore: 76,
    screeningFeedback: null,
    interviewStatus: 'completed',
    selectedInterviewSlot: '2026-06-26 10:00-11:00',
    interviewResult: '',
    interviewEvaluation: '',
    createdAt: '2026-06-22',
  },
  {
    id: 'm4',
    name: '赵六',
    phone: '13600000004',
    chatRecords: [
      { role: 'hr', content: '赵六你好，我这边是XX公司HR，收到了你的测试开发简历', time: '2026-06-23 10:00', type: 'chat' },
      { role: 'candidate', content: '你好，我之前在百度做QA，对贵司的测试开发岗很有兴趣', time: '2026-06-23 10:02', type: 'chat' },
      { role: 'candidate', content: '我的情况：\n\n【教育经历】\n华中科技大学 计算机科学与技术 本科 2016-2020\n\n【工作经历】\n百度 测试开发工程师 2020.07-2024.12\n负责搜索业务线质量保障，搭建自动化测试框架，覆盖率从40%提升至85%\n引入性能测试体系，提前发现线上瓶颈3次\n\n【项目经历】\n自动化测试平台 2022.05-2023.08 核心开发\n基于Python+Selenium+Pytest搭建，集成CI/CD流水线', time: '2026-06-23 10:05', type: 'resume' },
    ],
    resumeFileName: '',
    resumeFileContent: '',
    structuredData: {
      gender: '男',
      age: 28,
      email: 'zhaoliu@example.com',
      education: [{ school: '华中科技大学', major: '计算机科学与技术', period: '2016-2020' }],
      work: [
        { company: '百度', role: '测试开发工程师', period: '2020.07-2024.12', content: '负责搜索业务线质量保障，搭建自动化测试框架，覆盖率从40%提升至85%。引入性能测试体系，提前发现线上瓶颈3次。' },
      ],
      project: [
        { name: '自动化测试平台', period: '2022.05-2023.08', role: '核心开发', content: '基于Python+Selenium+Pytest搭建，集成CI/CD流水线，测试效率提升60%。' },
      ],
    },
    parseStatus: 'done',
    screeningStatus: 'passed',
    screeningScore: 72,
    screeningFeedback: null,
    interviewStatus: 'passed',
    selectedInterviewSlot: '2026-06-24 15:00-16:00',
    interviewResult: 'passed',
    interviewEvaluation: '自动化测试经验丰富，技术栈匹配，沟通表达清晰，建议录用。薪资期望在预算范围内。',
    createdAt: '2026-06-23',
  },
  {
    id: 'm5',
    name: '孙七',
    phone: '13500000005',
    chatRecords: [
      { role: 'hr', content: '孙七你好，我们在拉勾上收到了你的简历，想聊聊运营岗', time: '2026-06-24 11:00', type: 'chat' },
      { role: 'candidate', content: '好的，我之前在网易做内容运营3年，对贵司的用户增长方向很感兴趣', time: '2026-06-24 11:03', type: 'chat' },
      { role: 'candidate', content: '【教育经历】\n中国传媒大学 新闻学 本科 2017-2021\n\n【工作经历】\n网易 高级内容运营 2021.09-2025.02\n负责网易新闻客户端内容运营，DAU从80w提升至150w\n策划热点专题活动50+场，平均参与率28%\n\n【项目经历】\n用户增长专项 2023.06-2024.02 核心成员\n通过内容矩阵+社群运营，新增注册用户120w+', time: '2026-06-24 11:06', type: 'resume' },
    ],
    resumeFileName: '',
    resumeFileContent: '',
    structuredData: {
      gender: '女',
      age: 27,
      email: 'sunqi@example.com',
      education: [{ school: '中国传媒大学', major: '新闻学', period: '2017-2021' }],
      work: [
        { company: '网易', role: '高级内容运营', period: '2021.09-2025.02', content: '负责网易新闻客户端内容运营，DAU从80w提升至150w。策划热点专题活动50+场，平均参与率28%。' },
      ],
      project: [
        { name: '用户增长专项', period: '2023.06-2024.02', role: '核心成员', content: '通过内容矩阵+社群运营，新增注册用户120w+，获客成本降低35%。' },
      ],
    },
    parseStatus: 'done',
    screeningStatus: 'passed',
    screeningScore: 65,
    screeningFeedback: null,
    interviewStatus: 'failed',
    selectedInterviewSlot: '2026-06-25 16:00-17:00',
    interviewResult: 'failed',
    interviewEvaluation: '运营经验丰富但偏向内容方向，与当前用户增长岗位的技能要求存在偏差。缺乏数据驱动增长的实际案例，建议转推荐内容运营岗位。',
    createdAt: '2026-06-24',
  },
]

export const useCandidateStore = defineStore('candidate', () => {
  const candidates = ref(loadAll())

  const pendingScreening = computed(() => candidates.value.filter(c => c.screeningStatus === 'pending'))
  const passedScreening = computed(() => candidates.value.filter(c => c.screeningStatus === 'passed'))
  const pendingInterview = computed(() => candidates.value.filter(c => c.screeningStatus === 'passed' && c.interviewStatus === 'pending'))
  const scheduledInterviews = computed(() => candidates.value.filter(c => c.interviewStatus === 'scheduled').sort((a, b) => (a.selectedInterviewSlot || '').localeCompare(b.selectedInterviewSlot || '')))
  const pendingEvaluation = computed(() => candidates.value.filter(c => c.interviewStatus === 'completed'))
  const completedInterviews = computed(() => candidates.value.filter(c => ['passed', 'failed'].includes(c.interviewStatus)))
  const passedInterview = computed(() => candidates.value.filter(c => c.interviewStatus === 'passed'))

  function loadAll() { return [...MOCK] }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates.value)) }

  function getById(id) { return candidates.value.find(c => c.id === id) }

  function addCandidate(name, phone) {
    if (!name || !phone) return { ok: false, msg: '姓名和手机号不能为空' }
    if (!/^1[3-9]\d{9}$/.test(phone)) return { ok: false, msg: '手机号格式不正确' }
    const exists = candidates.value.find(c => c.phone === phone)
    if (exists) return { ok: false, msg: '该手机号已存在' }
    const c = makeBlank()
    c.id = makeId()
    c.name = name
    c.phone = phone
    candidates.value.unshift(c)
    save()
    return { ok: true, msg: '录入成功' }
  }

  function removeCandidate(id) { candidates.value = candidates.value.filter(c => c.id !== id); save() }

  function importChatRecords(id, records) {
    const c = getById(id)
    if (!c) return
    c.chatRecords = records
    save()
  }

  function importResume(id, fileName, content) {
    const c = getById(id)
    if (!c) return
    c.resumeFileName = fileName
    c.resumeFileContent = content
    save()
  }

  function aiParse(id) {
    const c = getById(id)
    if (!c) return

    // 从两个来源汇总简历文本：1) 独立简历文件  2) 聊天记录中标记为 resume 的消息
    const parts = []
    if (c.resumeFileContent) parts.push(c.resumeFileContent)

    const resumeMsgs = c.chatRecords.filter(r => r.type === 'resume')
    if (resumeMsgs.length) {
      parts.push(resumeMsgs.map(r => r.content).join('\n'))
    }

    const sourceText = parts.join('\n')
    c.structuredData = mockAiParse(sourceText)
    c.parseStatus = 'done'
    save()
  }

  function updateStructuredData(id, data) {
    const c = getById(id)
    if (!c) return
    c.structuredData = { ...c.structuredData, ...data }
    save()
  }

  function doScreening(query) {
    const eligible = candidates.value.filter(c => c.parseStatus === 'done')
    runScreening(eligible, query)
    save()
    return [...eligible].sort((a, b) => (b.screeningScore || 0) - (a.screeningScore || 0))
  }

  function passScreening(id) {
    const c = getById(id)
    if (!c) return
    c.screeningStatus = 'passed'
    c.interviewStatus = 'pending'
    save()
  }

  function eliminateScreening(id, reason) {
    const c = getById(id)
    if (!c) return
    c.screeningStatus = 'eliminated'
    c.screeningFeedback = reason || ''
    save()
  }

  function scheduleInterview(id, slot) {
    const c = getById(id)
    if (!c) return
    c.selectedInterviewSlot = slot
    c.interviewStatus = 'scheduled'
    save()
  }

  function completeInterview(id) {
    const c = getById(id)
    if (!c) return
    c.interviewStatus = 'completed'
    save()
  }

  function passInterview(id, evaluation) {
    const c = getById(id)
    if (!c) return
    c.interviewStatus = 'passed'
    c.interviewResult = 'passed'
    c.interviewEvaluation = evaluation || ''
    save()
  }

  function failInterview(id, evaluation) {
    const c = getById(id)
    if (!c) return
    c.interviewStatus = 'failed'
    c.interviewResult = 'failed'
    c.interviewEvaluation = evaluation || ''
    save()
  }

  watch(candidates, save, { deep: true })

  return {
    candidates, pendingScreening, passedScreening, pendingInterview,
    scheduledInterviews, pendingEvaluation, completedInterviews, passedInterview,
    addCandidate, removeCandidate, importChatRecords, importResume,
    aiParse, updateStructuredData, doScreening,
    passScreening, eliminateScreening,
    scheduleInterview, completeInterview, passInterview, failInterview,
    getById,
  }
})
