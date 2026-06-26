const templates = [
  {
    school: '浙江大学',
    major: '计算机科学与技术',
    degree: '硕士',
    eduPeriod: '2018-2021',
    company1: '阿里巴巴',
    role1: 'Java开发工程师',
    period1: '2021.07-2024.06',
    content1: '负责电商核心链路后端开发，主导秒杀模块重构，QPS从2000提升至10000。参与双11大促全链路压测，保障系统零故障。',
    company2: '网易',
    role2: '后端开发实习生',
    period2: '2020.06-2020.09',
    content2: '参与云音乐推荐系统后端开发，使用Spring Boot + Redis优化接口响应时间。',
    projectName: '电商秒杀系统重构',
    projectPeriod: '2022.06-2023.03',
    projectRole: '核心开发',
    projectContent: '将单体拆分为微服务，引入Redis缓存预热+布隆过滤器防穿透，QPS提升5倍，RT从200ms降至30ms。',
    gender: '男', age: 28, email: 'zhangsan_dev@example.com',
  },
  {
    school: '上海交通大学',
    major: '软件工程',
    degree: '本科',
    eduPeriod: '2016-2020',
    company1: '字节跳动',
    role1: '高级前端开发',
    period1: '2020.07-2025.03',
    content1: '负责飞书文档前端架构，主导编辑器核心模块重构，带领3人小组完成低代码平台从0到1。',
    company2: '腾讯',
    role2: '前端开发实习生',
    period2: '2019.06-2019.09',
    content2: '参与TAPD项目管理工具前端开发，使用React+TypeScript重构核心模块。',
    projectName: '企业级低代码平台',
    projectPeriod: '2022.01-2023.12',
    projectRole: '项目负责人',
    projectContent: '基于Vue3+TypeScript从零搭建，支持组件拖拽、数据源绑定、在线部署，服务200+内部用户。',
    gender: '男', age: 31, email: 'lisi_fe@example.com',
  },
  {
    school: '南京大学',
    major: '信息管理与信息系统',
    degree: '本科',
    eduPeriod: '2017-2021',
    company1: '美团',
    role1: '产品经理',
    period1: '2021.07-2024.04',
    content1: '负责商家端SaaS系统，从0到1搭建商家后台管理模块，月活商家从500增长至3000，满意度提升35%。',
    company2: '',
    role2: '',
    period2: '',
    content2: '',
    projectName: '商家SaaS系统重构',
    projectPeriod: '2023.03-2024.01',
    projectRole: '产品负责人',
    projectContent: '重新设计商家后台信息架构，NPS从32提升至58，商家留存率提升20%。',
    gender: '女', age: 27, email: 'wangwu_pm@example.com',
  },
  {
    school: '华中科技大学',
    major: '计算机科学与技术',
    degree: '本科',
    eduPeriod: '2016-2020',
    company1: '百度',
    role1: '测试开发工程师',
    period1: '2020.07-2024.12',
    content1: '负责搜索业务线质量保障，搭建自动化测试框架，覆盖率从40%提升至85%，引入性能测试体系。',
    company2: '京东',
    role2: 'QA实习生',
    period2: '2019.07-2019.12',
    content2: '参与电商平台接口自动化测试，编写测试用例200+条，发现线上缺陷15个。',
    projectName: '自动化测试平台',
    projectPeriod: '2022.05-2023.08',
    projectRole: '核心开发',
    projectContent: '基于Python+Selenium+Pytest搭建，集成CI/CD流水线，测试效率提升60%。',
    gender: '男', age: 29, email: 'zhaoliu_qa@example.com',
  },
  {
    school: '中国传媒大学',
    major: '新闻学',
    degree: '本科',
    eduPeriod: '2017-2021',
    company1: '小红书',
    role1: '高级内容运营',
    period1: '2021.09-2025.02',
    content1: '负责社区内容运营，DAU从80w提升至180w，策划热点专题活动60+场，平均参与率32%。',
    company2: '',
    role2: '',
    period2: '',
    content2: '',
    projectName: '用户增长专项',
    projectPeriod: '2023.06-2024.02',
    projectRole: '核心成员',
    projectContent: '通过内容矩阵+社群运营，新增注册用户150w+，获客成本降低35%。',
    gender: '女', age: 27, email: 'sunqi_op@example.com',
  },
  {
    school: '北京大学',
    major: '数据科学',
    degree: '硕士',
    eduPeriod: '2019-2022',
    company1: '腾讯',
    role1: '数据工程师',
    period1: '2022.07-2025.05',
    content1: '负责微信支付数据仓库建设，设计ETL流程处理日均10TB数据，搭建实时数据看板。',
    company2: '快手',
    role2: '数据开发实习生',
    period2: '2021.06-2021.09',
    content2: '参与短视频推荐特征工程，开发用户画像标签系统，覆盖2亿+用户。',
    projectName: '实时数据看板',
    projectPeriod: '2023.01-2023.10',
    projectRole: '技术负责人',
    projectContent: '基于Flink+Kafka+ClickHouse搭建实时计算链路，数据延迟从分钟级降至秒级。',
    gender: '男', age: 30, email: 'liuqi_de@example.com',
  },
  {
    school: '武汉大学',
    major: '网络空间安全',
    degree: '本科',
    eduPeriod: '2016-2020',
    company1: '奇安信',
    role1: '安全工程师',
    period1: '2020.07-2024.08',
    content1: '负责漏洞扫描平台维护，发现并修复高危漏洞200+个，主导内部安全培训体系建设。',
    company2: '绿盟科技',
    role2: '安全实习生',
    period2: '2019.07-2019.12',
    content2: '参与Web应用防火墙规则开发，编写检测规则150+条。',
    projectName: '自动化漏洞扫描平台',
    projectPeriod: '2022.03-2023.06',
    projectRole: '项目负责人',
    projectContent: '基于Python+Django从零搭建，集成Nuclei+Xray引擎，扫描效率提升10倍。',
    gender: '女', age: 29, email: 'zhouba_sec@example.com',
  },
  {
    school: '复旦大学',
    major: '电子与信息工程',
    degree: '硕士',
    eduPeriod: '2017-2021',
    company1: '华为',
    role1: '嵌入式开发工程师',
    period1: '2021.07-2025.03',
    content1: '负责鸿蒙OS IoT芯片驱动开发，优化功耗管理模块，待机时长提升40%。',
    company2: '',
    role2: '',
    period2: '',
    content2: '',
    projectName: '智能家居网关',
    projectPeriod: '2022.09-2023.12',
    projectRole: '核心开发',
    projectContent: '基于Hi3861芯片开发Zigbee网关，支持50+设备并发连接，功耗降低30%。',
    gender: '男', age: 30, email: 'wujiu_iot@example.com',
  },
]

function pad(n) { return String(n).padStart(2, '0') }

function now() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function timeStr(h, m) {
  return `${now()} ${pad(h)}:${pad(m)}`
}

// HR last names for variety
const hrNames = ['王老师', '刘老师', '李老师', '张老师', '陈老师', '赵老师']
const hrCompanies = ['XX科技', 'YY互联', 'ZZ在线', 'AA网络', 'BB信息', 'CC数据']
const platforms = ['Boss直聘', '猎聘', '拉勾', '脉脉', '智联招聘']

export function generateMockChat(candidateName) {
  const t = templates[Math.floor(Math.random() * templates.length)]
  const hrName = hrNames[Math.floor(Math.random() * hrNames.length)]
  const company = hrCompanies[Math.floor(Math.random() * hrCompanies.length)]
  const platform = platforms[Math.floor(Math.random() * platforms.length)]

  const startHour = 9 + Math.floor(Math.random() * 8)
  let m = 0
  const t0 = () => timeStr(startHour, pad(m))
  const tn = () => { m += Math.floor(Math.random() * 3) + 1; return timeStr(startHour, pad(m)) }

  const records = [
    { role: 'hr', content: `${candidateName}你好，我是${company}的HR${hrName}，在${platform}上看到你的简历，想聊聊相关岗位，方便吗？`, time: t0(), type: 'chat' },
    { role: 'candidate', content: `${hrName}好，方便的，我对贵公司很感兴趣`, time: tn(), type: 'chat' },
    { role: 'hr', content: '好的，那你先发一下简历吧，我看看详细情况', time: tn(), type: 'chat' },
    { role: 'candidate', content: '[文件] 简历.pdf', time: tn(), type: 'file' },
    { role: 'hr', content: '收到了，能具体说说你之前的工作经历和项目经验吗？', time: tn(), type: 'chat' },
  ]

  // Build resume message
  let resume = ''
  // Personal info header for AI parser
  resume += `${t.gender}，${t.age}岁，${t.email}\n\n`
  // Education
  resume += `【教育经历】\n${t.school} ${t.major} ${t.degree} ${t.eduPeriod}\n`
  // add second education if applicable
  if (t.degree === '硕士') {
    const bSchools = ['杭州电子科技大学', '合肥工业大学', '西安电子科技大学', '南京邮电大学']
    const bMajors = ['软件工程', '计算机科学与技术', '信息工程', '通信工程']
    const bSchool = bSchools[Math.floor(Math.random() * bSchools.length)]
    const bMajor = bMajors[Math.floor(Math.random() * bMajors.length)]
    resume += `${bSchool} ${bMajor} 本科 2014-2018\n`
  }
  resume += '\n【工作经历】\n'
  resume += `${t.company1} ${t.role1} ${t.period1}\n${t.content1}\n`
  if (t.company2) {
    resume += `\n${t.company2} ${t.role2} ${t.period2}\n${t.content2}\n`
  }
  resume += '\n【项目经历】\n'
  resume += `${t.projectName} ${t.projectPeriod} ${t.projectRole}\n${t.projectContent}`

  records.push({ role: 'candidate', content: resume, time: tn(), type: 'resume' })

  // Follow-up messages
  records.push({ role: 'hr', content: '经验很匹配！你期望薪资大概多少？最快什么时候能入职？', time: tn(), type: 'chat' })
  const salaries = ['25k-35k', '20k-30k', '30k-45k', '18k-25k', '28k-38k']
  const salary = salaries[Math.floor(Math.random() * salaries.length)]
  records.push({ role: 'candidate', content: `期望${salary}，离职交接中，大概2周内可以入职`, time: tn(), type: 'chat' })
  records.push({ role: 'hr', content: '好的，我这边整理一下推给面试官，有消息企微联系你', time: tn(), type: 'chat' })

  return records
}
