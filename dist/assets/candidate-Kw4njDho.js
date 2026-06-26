import{aE as M,K as z,r as X,g}from"./index-DA8A2h22.js";function O(e){if(!e)return I();const t=I();t.gender=_(e),t.age=$(e),t.email=Z(e);const r=D(e,/教育[经历背景]*[：:]\s*/,/工作[经历经验]*[：:]\s*/);t.education=Q(r||e).slice(0,2);const i=D(e,/工作[经历经验]*[：:]\s*/,/项目[经历经验]*[：:]\s*/);t.work=B(i||e).slice(0,2);const s=e.split(/项目[经历经验]*[：:]\s*/)[1]||"";return t.project=H(s||e).slice(0,2),t}function I(){return{gender:"",age:null,email:"",education:[],work:[],project:[]}}function D(e,t,r){const i=e.split(t);if(i.length<2)return"";const s=i[1],a=s.match(r);return a?s.slice(0,a.index).trim():s.trim()}function _(e){return/男/.test(e)&&!/女/.test(e)?"男":/女/.test(e)&&!/男/.test(e)?"女":""}function $(e){const t=e.match(/(\d{2})\s*岁/)||e.match(/年龄[：:]\s*(\d{2})/);if(t){const r=parseInt(t[1]);return r>=18&&r<=65?r:null}return null}function Z(e){const t=e.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);return t?t[1]:""}function Q(e){const t=e.split(`
`).filter(s=>s.trim()),r=[],i=new Set;for(const s of t){const a=s.match(/([一-龥]+(?:大学|学院))\s*[|｜\s]*\s*(\S+)?\s*(\d{4}\s*[-~—至到]\s*\d{4})?/);if(!a)continue;const d=a[1],f=a[2]||"",p=a[3]?a[3].replace(/\s+/g,""):"";i.has(d)||(i.add(d),d&&r.push({school:d,major:f,period:p}))}return r}function B(e){const t=e.split(`
`).filter(i=>i.trim()),r=[];for(const i of t){const s=/([一-龥A-Za-z]+(?:公司|科技|集团|网络|有限|股份)?)\s+([一-龥A-Za-z]+(?:工程师|经理|主管|专员|实习生|负责人|开发|总监))\s*(\d{4}\.\d{2}\s*[-~—至到]\s*\d{4}\.\d{2}|\d{4}\s*[-~—至到]\s*\d{4})?/,a=i.match(s);if(a&&(r.push({company:a[1],role:a[2],period:a[3]?a[3].replace(/\s+/g,""):"",content:""}),r.length>=2))break}for(let i=0;i<r.length;i++){const s=t.findIndex(a=>a.includes(r[i].company));if(s>=0&&s+1<t.length){const a=t[s+1].trim();!/(公司|科技|集团|网络|银行)/.test(a)&&a.length>10&&(r[i].content=a)}}return r}function H(e){const t=e.split(`
`).filter(i=>i.trim()),r=[];for(const i of t){const s=i.match(/([一-龥A-Za-z]+(?:系统|平台|项目|重构|建设))\s+(\d{4}\.\d{2}\s*[-~—至到]\s*\d{4}\.\d{2}|\d{4}\s*[-~—至到]\s*\d{4})?\s*([一-龥]+(?:开发|负责|主导|参与|设计|架构|管理|负责人))?/);if(s&&(r.push({name:s[1],period:s[2]?s[2].replace(/\s+/g,""):"",role:s[3]||"",content:""}),r.length>=2))break}return r}function K(e,t){t||(t="");const r=L(t);e.forEach(i=>{var u;const s=G(i);let a=50;/(本科|硕士|博士|研究生)/.test(s)&&(a+=15),/(阿里|腾讯|字节|百度|美团|华为|网易|京东|快手|拼多多|滴滴|小米)/.test(s)&&(a+=15);const d=s.match(/(\d+)\s*年/);d&&parseInt(d[1])>=3&&(a+=15),a=y(a+k(0,10),30,100);let f=50;r.forEach(h=>{s.includes(h)&&(f+=8)}),f=y(f+k(0,10),30,100);let p=70;(((u=i.structuredData)==null?void 0:u.work)||[]).forEach(h=>{const S=R(h.period);S>=2?p+=10:S<1&&(p-=15)}),p=y(p+k(0,10),30,100),i.screeningScore=Math.round(a*.35+f*.45+p*.2),i._screeningDetail={hardScore:a,expScore:f,stabilityScore:p,reason:V(i,r),risks:U(i)}})}function L(e){return e.split(/[,，\s、。]+/).map(t=>t.trim()).filter(t=>t.length>=2)}function G(e){return JSON.stringify(e.structuredData).toLowerCase()}function y(e,t,r){return Math.max(t,Math.min(r,e))}function k(e,t){return Math.floor(Math.random()*(t-e+1))+e}function R(e){if(!e)return 1;const t=e.match(/(\d{4}).*?(\d{4})/);return t?parseInt(t[2])-parseInt(t[1]):1}function V(e,t){var f,p,l,u;const r=e.structuredData,i=[],s=((f=r.work)==null?void 0:f.length)||0;s>=2&&i.push(`${s}段工作经历`),/(阿里|腾讯|字节|百度|美团|华为)/.test(JSON.stringify(r.work))&&i.push("有大厂背景");const a=(p=r.education)==null?void 0:p[0];a&&/(大学|学院)/.test(a.school)&&i.push(`${a.school}学历`);const d=((l=r.project)==null?void 0:l.length)||0;return d>0&&i.push(`${d}个相关项目`),(u=r.work)==null||u.forEach(h=>{const S=R(h.period);S>=2&&i.push(`${h.company}稳定${S}年`)}),t.forEach(h=>{JSON.stringify(r).includes(h)&&(i.some(S=>S.includes(h))||i.push(`匹配"${h}"`))}),i.slice(0,3).join("，")||"基本条件匹配"}function U(e){var a;const t=[],r=e.structuredData;(!r.age||r.age<22)&&t.push("年龄信息待确认"),r.email||t.push("缺少邮箱联系方式"),(a=r.education)!=null&&a.length||t.push("学历信息缺失");const i=r.work||[];return i.filter(d=>R(d.period)<1).length>=2&&t.push("短期经历较多，稳定性待确认"),i.length===0&&t.push("工作经历缺失"),t.length===0&&t.push("暂无明显风险点"),t.join("；")}const Y="recruitpulse_candidates";function W(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}function q(){return{id:"",name:"",phone:"",chatRecords:[],resumeFileName:"",resumeFileContent:"",structuredData:{gender:"",age:null,email:"",education:[],work:[],project:[]},parseStatus:"none",screeningStatus:"pending",screeningScore:null,screeningFeedback:null,interviewStatus:"pending",selectedInterviewSlot:null,interviewResult:"",interviewEvaluation:"",createdAt:new Date().toISOString().slice(0,10)}}const ee=[{id:"m1",name:"张三",phone:"13800000001",chatRecords:[{role:"hr",content:"张三你好，我是XX公司的HR小王，在Boss直聘上看到你的简历，想聊聊Java开发岗位，方便吗？",time:"2026-06-20 10:00",type:"chat"},{role:"candidate",content:"你好王老师，方便的，我对贵公司很感兴趣",time:"2026-06-20 10:02",type:"chat"},{role:"hr",content:"好的，那你先发一下简历吧，我看看详细情况",time:"2026-06-20 10:03",type:"chat"},{role:"candidate",content:"[文件] 简历.pdf",time:"2026-06-20 10:04",type:"file"},{role:"hr",content:"收到了，我看你之前在阿里做过3年Java开发，能具体说说你负责的项目吗？有没有高并发相关的经验？",time:"2026-06-20 10:06",type:"chat"},{role:"candidate",content:`好的，我的经历如下：

【教育经历】
浙江大学 计算机科学与技术 硕士 2017-2020
杭州电子科技大学 软件工程 本科 2014-2017

【工作经历】
阿里巴巴 Java开发工程师 2020.06-2023.08
负责电商核心链路后端开发，主导秒杀模块重构，QPS从2000提升至10000

字节跳动 后端开发实习生 2019.06-2019.09
参与广告投放系统后端开发

【项目经历】
电商秒杀系统重构 2022.03-2022.09 核心开发
引入Redis缓存预热+布隆过滤器防穿透，微服务架构`,time:"2026-06-20 10:08",type:"resume"},{role:"hr",content:"经验很匹配！你期望薪资大概多少？最快什么时候能入职？",time:"2026-06-20 10:11",type:"chat"},{role:"candidate",content:"期望25k-35k，离职交接中，大概2周内可以入职",time:"2026-06-20 10:13",type:"chat"},{role:"hr",content:"好的，我这边整理一下推给面试官，有消息企微联系你",time:"2026-06-20 10:15",type:"chat"}],resumeFileName:"张三_Java开发.pdf",resumeFileContent:`张三 | 男 | 28岁 | 13800000001 | zhangsan@example.com
教育经历：
浙江大学 计算机科学与技术 硕士 2017-2020
杭州电子科技大学 软件工程 本科 2014-2017
工作经历：
阿里巴巴 Java开发工程师 2020.06-2023.08
负责电商核心链路后端开发，主导秒杀模块重构，QPS提升40%
字节跳动 后端开发实习生 2019.06-2019.09
项目经历：
电商秒杀系统重构 2022.03-2022.09 核心开发
将单体架构拆分为微服务，引入Redis缓存预热与布隆过滤器防穿透`,structuredData:{gender:"男",age:28,email:"zhangsan@example.com",education:[{school:"浙江大学",major:"计算机科学与技术",period:"2017-2020"},{school:"杭州电子科技大学",major:"软件工程",period:"2014-2017"}],work:[{company:"阿里巴巴",role:"Java开发工程师",period:"2020.06-2023.08",content:"负责电商核心链路后端开发，主导秒杀模块重构，QPS提升40%。参与双11大促全链路压测与优化，保障系统零故障。"},{company:"字节跳动",role:"后端开发实习生",period:"2019.06-2019.09",content:"参与广告投放系统后端开发，使用Go语言编写数据处理Pipeline。"}],project:[{name:"电商秒杀系统重构",period:"2022.03-2022.09",role:"核心开发",content:"将单体架构拆分为微服务，引入Redis缓存预热与布隆过滤器防穿透，QPS从2000提升至10000，接口RT从200ms降至30ms。"}]},parseStatus:"done",screeningStatus:"passed",screeningScore:88,screeningFeedback:null,interviewStatus:"pending",selectedInterviewSlot:null,interviewResult:"",interviewEvaluation:"",createdAt:"2026-06-20"},{id:"m2",name:"李四",phone:"13900000002",chatRecords:[{role:"hr",content:"李四你好，我是XX公司HR小刘，收到了你投递的前端开发简历，方便聊几句吗？",time:"2026-06-21 14:00",type:"chat"},{role:"candidate",content:"刘老师好，方便的，我有5年前端经验，目前在字节跳动",time:"2026-06-21 14:02",type:"chat"},{role:"hr",content:"好的，你能先把简历发我一份吗？我这边系统里需要存档",time:"2026-06-21 14:03",type:"chat"},{role:"candidate",content:"[文件] 简历.pdf",time:"2026-06-21 14:04",type:"file"},{role:"hr",content:"谢谢！你技术栈主要用哪些？有没有带过人或者做过从0到1的项目？",time:"2026-06-21 14:06",type:"chat"},{role:"candidate",content:`我的详细情况：

【教育经历】
上海交通大学 软件工程 本科 2015-2019

【工作经历】
字节跳动 高级前端开发 2019.07-2024.03
负责飞书文档前端架构，主导编辑器核心模块重构，带领3人小组完成低代码搭建平台从0到1

【项目经历】
企业级低代码平台 2022.01-2023.06 项目负责人
基于Vue3+TypeScript从零搭建，支持组件拖拽、数据源绑定、在线部署，服务200+内部用户`,time:"2026-06-21 14:08",type:"resume"},{role:"hr",content:"有低代码经验太好了，我们正好需要这方面的人。期望薪资范围是？",time:"2026-06-21 14:10",type:"chat"},{role:"candidate",content:"30k-40k吧，具体看岗位级别",time:"2026-06-21 14:12",type:"chat"},{role:"hr",content:"收到，我尽快推进，有消息通知你",time:"2026-06-21 14:14",type:"chat"}],resumeFileName:"李四_前端开发.pdf",resumeFileContent:`李四 | 男 | 30岁 | 13900000002 | lisi@example.com
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
服务200+内部用户，提升运营页面搭建效率80%`,structuredData:{gender:"男",age:30,email:"lisi@example.com",education:[{school:"上海交通大学",major:"软件工程",period:"2015-2019"}],work:[{company:"字节跳动",role:"高级前端开发",period:"2019.07-2024.03",content:"负责飞书文档前端架构，主导编辑器核心模块重构。带领3人小组完成低代码搭建平台从0到1。"},{company:"腾讯",role:"前端开发实习生",period:"2018.06-2018.09",content:"参与TAPD项目管理工具前端开发。"}],project:[{name:"企业级低代码平台",period:"2022.01-2023.06",role:"项目负责人",content:"基于Vue3+TypeScript从零搭建，支持组件拖拽、数据源绑定、在线部署。服务200+内部用户，提升运营页面搭建效率80%。"}]},parseStatus:"done",screeningStatus:"passed",screeningScore:82,screeningFeedback:null,interviewStatus:"scheduled",selectedInterviewSlot:"2026-06-28 14:00-15:00",interviewResult:"",interviewEvaluation:"",createdAt:"2026-06-21"},{id:"m3",name:"王五",phone:"13700000003",chatRecords:[{role:"hr",content:"王五你好，我是XX公司HR小李，你的简历我们收到了，想进一步了解下",time:"2026-06-22 09:00",type:"chat"},{role:"candidate",content:"李老师好，我之前在美团做产品经理，对贵司的产品岗很有兴趣",time:"2026-06-22 09:02",type:"chat"},{role:"hr",content:"方便再发一下最新简历吗？我这边系统归档用",time:"2026-06-22 09:03",type:"chat"},{role:"candidate",content:"[文件] 简历.docx",time:"2026-06-22 09:04",type:"file"},{role:"hr",content:"收到了。你之前在美团具体负责什么产品？有没有从0到1的经验？",time:"2026-06-22 09:05",type:"chat"},{role:"candidate",content:`我的情况如下：

【教育经历】
南京大学 信息管理与信息系统 本科 2017-2021

【工作经历】
美团 产品经理 2021.07-2025.04
负责商家端SaaS系统，从0到1搭建商家后台管理模块，月活商家从500增长至3000，商家满意度提升35%

【项目经历】
商家SaaS系统重构 2023.03-2024.01 产品负责人
重新设计商家后台信息架构，NPS从32提升至58，商家留存率提升20%`,time:"2026-06-22 09:08",type:"resume"},{role:"hr",content:"有SaaS产品经验很难得，期望薪资大概多少？",time:"2026-06-22 09:10",type:"chat"},{role:"candidate",content:"期望20k-28k，可以沟通",time:"2026-06-22 09:11",type:"chat"},{role:"hr",content:"好的，我整理后推给业务部门，有反馈第一时间通知你",time:"2026-06-22 09:12",type:"chat"}],resumeFileName:"王五_产品经理.docx",resumeFileContent:`王五 | 女 | 27岁 | 13700000003 | wangwu@example.com
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
NPS从32提升至58，商家留存率提升20%`,structuredData:{gender:"女",age:27,email:"wangwu@example.com",education:[{school:"南京大学",major:"信息管理与信息系统",period:"2017-2021"}],work:[{company:"美团",role:"产品经理",period:"2021.07-2025.04",content:"负责商家端SaaS系统，从0到1搭建商家后台管理模块。主导需求调研、竞品分析、PRD撰写、项目推进全流程。月活商家从500增长至3000，商家满意度提升35%。"}],project:[{name:"商家SaaS系统重构",period:"2023.03-2024.01",role:"产品负责人",content:"重新设计商家后台信息架构，优化核心操作流程。NPS从32提升至58，商家留存率提升20%。"}]},parseStatus:"done",screeningStatus:"passed",screeningScore:76,screeningFeedback:null,interviewStatus:"completed",selectedInterviewSlot:"2026-06-26 10:00-11:00",interviewResult:"",interviewEvaluation:"",createdAt:"2026-06-22"},{id:"m4",name:"赵六",phone:"13600000004",chatRecords:[{role:"hr",content:"赵六你好，我这边是XX公司HR，收到了你的测试开发简历",time:"2026-06-23 10:00",type:"chat"},{role:"candidate",content:"你好，我之前在百度做QA，对贵司的测试开发岗很有兴趣",time:"2026-06-23 10:02",type:"chat"},{role:"candidate",content:`我的情况：

【教育经历】
华中科技大学 计算机科学与技术 本科 2016-2020

【工作经历】
百度 测试开发工程师 2020.07-2024.12
负责搜索业务线质量保障，搭建自动化测试框架，覆盖率从40%提升至85%
引入性能测试体系，提前发现线上瓶颈3次

【项目经历】
自动化测试平台 2022.05-2023.08 核心开发
基于Python+Selenium+Pytest搭建，集成CI/CD流水线`,time:"2026-06-23 10:05",type:"resume"}],resumeFileName:"",resumeFileContent:"",structuredData:{gender:"男",age:28,email:"zhaoliu@example.com",education:[{school:"华中科技大学",major:"计算机科学与技术",period:"2016-2020"}],work:[{company:"百度",role:"测试开发工程师",period:"2020.07-2024.12",content:"负责搜索业务线质量保障，搭建自动化测试框架，覆盖率从40%提升至85%。引入性能测试体系，提前发现线上瓶颈3次。"}],project:[{name:"自动化测试平台",period:"2022.05-2023.08",role:"核心开发",content:"基于Python+Selenium+Pytest搭建，集成CI/CD流水线，测试效率提升60%。"}]},parseStatus:"done",screeningStatus:"passed",screeningScore:72,screeningFeedback:null,interviewStatus:"passed",selectedInterviewSlot:"2026-06-24 15:00-16:00",interviewResult:"passed",interviewEvaluation:"自动化测试经验丰富，技术栈匹配，沟通表达清晰，建议录用。薪资期望在预算范围内。",createdAt:"2026-06-23"},{id:"m5",name:"孙七",phone:"13500000005",chatRecords:[{role:"hr",content:"孙七你好，我们在拉勾上收到了你的简历，想聊聊运营岗",time:"2026-06-24 11:00",type:"chat"},{role:"candidate",content:"好的，我之前在网易做内容运营3年，对贵司的用户增长方向很感兴趣",time:"2026-06-24 11:03",type:"chat"},{role:"candidate",content:`【教育经历】
中国传媒大学 新闻学 本科 2017-2021

【工作经历】
网易 高级内容运营 2021.09-2025.02
负责网易新闻客户端内容运营，DAU从80w提升至150w
策划热点专题活动50+场，平均参与率28%

【项目经历】
用户增长专项 2023.06-2024.02 核心成员
通过内容矩阵+社群运营，新增注册用户120w+`,time:"2026-06-24 11:06",type:"resume"}],resumeFileName:"",resumeFileContent:"",structuredData:{gender:"女",age:27,email:"sunqi@example.com",education:[{school:"中国传媒大学",major:"新闻学",period:"2017-2021"}],work:[{company:"网易",role:"高级内容运营",period:"2021.09-2025.02",content:"负责网易新闻客户端内容运营，DAU从80w提升至150w。策划热点专题活动50+场，平均参与率28%。"}],project:[{name:"用户增长专项",period:"2023.06-2024.02",role:"核心成员",content:"通过内容矩阵+社群运营，新增注册用户120w+，获客成本降低35%。"}]},parseStatus:"done",screeningStatus:"passed",screeningScore:65,screeningFeedback:null,interviewStatus:"failed",selectedInterviewSlot:"2026-06-25 16:00-17:00",interviewResult:"failed",interviewEvaluation:"运营经验丰富但偏向内容方向，与当前用户增长岗位的技能要求存在偏差。缺乏数据驱动增长的实际案例，建议转推荐内容运营岗位。",createdAt:"2026-06-24"}],ne=M("candidate",()=>{const e=X(p()),t=g(()=>e.value.filter(n=>n.screeningStatus==="pending")),r=g(()=>e.value.filter(n=>n.screeningStatus==="passed")),i=g(()=>e.value.filter(n=>n.screeningStatus==="passed"&&n.interviewStatus==="pending")),s=g(()=>e.value.filter(n=>n.interviewStatus==="scheduled").sort((n,o)=>(n.selectedInterviewSlot||"").localeCompare(o.selectedInterviewSlot||""))),a=g(()=>e.value.filter(n=>n.interviewStatus==="completed")),d=g(()=>e.value.filter(n=>["passed","failed"].includes(n.interviewStatus))),f=g(()=>e.value.filter(n=>n.interviewStatus==="passed"));function p(){return[...ee]}function l(){localStorage.setItem(Y,JSON.stringify(e.value))}function u(n){return e.value.find(o=>o.id===n)}function h(n,o){if(!n||!o)return{ok:!1,msg:"姓名和手机号不能为空"};if(!/^1[3-9]\d{9}$/.test(o))return{ok:!1,msg:"手机号格式不正确"};if(e.value.find(w=>w.phone===o))return{ok:!1,msg:"该手机号已存在"};const m=q();return m.id=W(),m.name=n,m.phone=o,e.value.unshift(m),l(),{ok:!0,msg:"录入成功"}}function S(n){e.value=e.value.filter(o=>o.id!==n),l()}function j(n,o){const c=u(n);c&&(c.chatRecords=o,l())}function A(n,o,c){const m=u(n);m&&(m.resumeFileName=o,m.resumeFileContent=c,l())}function F(n){const o=u(n);if(!o)return;const c=[];o.resumeFileContent&&c.push(o.resumeFileContent);const m=o.chatRecords.filter(v=>v.type==="resume");m.length&&c.push(m.map(v=>v.content).join(`
`));const w=c.join(`
`);o.structuredData=O(w),o.parseStatus="done",l()}function C(n,o){const c=u(n);c&&(c.structuredData={...c.structuredData,...o},l())}function E(n){const o=e.value.filter(c=>c.parseStatus==="done");return K(o,n),l(),[...o].sort((c,m)=>(m.screeningScore||0)-(c.screeningScore||0))}function P(n){const o=u(n);o&&(o.screeningStatus="passed",o.interviewStatus="pending",l())}function x(n,o){const c=u(n);c&&(c.screeningStatus="eliminated",c.screeningFeedback=o||"",l())}function N(n,o){const c=u(n);c&&(c.selectedInterviewSlot=o,c.interviewStatus="scheduled",l())}function b(n){const o=u(n);o&&(o.interviewStatus="completed",l())}function T(n,o){const c=u(n);c&&(c.interviewStatus="passed",c.interviewResult="passed",c.interviewEvaluation=o||"",l())}function J(n,o){const c=u(n);c&&(c.interviewStatus="failed",c.interviewResult="failed",c.interviewEvaluation=o||"",l())}return z(e,l,{deep:!0}),{candidates:e,pendingScreening:t,passedScreening:r,pendingInterview:i,scheduledInterviews:s,pendingEvaluation:a,completedInterviews:d,passedInterview:f,addCandidate:h,removeCandidate:S,importChatRecords:j,importResume:A,aiParse:F,updateStructuredData:C,doScreening:E,passScreening:P,eliminateScreening:x,scheduleInterview:N,completeInterview:b,passInterview:T,failInterview:J,getById:u}});export{ne as u};
