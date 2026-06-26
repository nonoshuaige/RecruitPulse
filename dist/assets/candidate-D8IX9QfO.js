import{aE as b,K as J,r as M,g as S}from"./index-COSglno5.js";function z(e){if(!e)return I();const t=I();t.gender=O(e),t.age=_(e),t.email=$(e);const n=j(e,/教育[经历背景]*[：:]\s*/,/工作[经历经验]*[：:]\s*/);t.education=X(n||e).slice(0,2);const r=j(e,/工作[经历经验]*[：:]\s*/,/项目[经历经验]*[：:]\s*/);t.work=Z(r||e).slice(0,2);const c=e.split(/项目[经历经验]*[：:]\s*/)[1]||"";return t.project=B(c||e).slice(0,2),t}function I(){return{gender:"",age:null,email:"",education:[],work:[],project:[]}}function j(e,t,n){const r=e.split(t);if(r.length<2)return"";const c=r[1],s=c.match(n);return s?c.slice(0,s.index).trim():c.trim()}function O(e){return/男/.test(e)&&!/女/.test(e)?"男":/女/.test(e)&&!/男/.test(e)?"女":""}function _(e){const t=e.match(/(\d{2})\s*岁/)||e.match(/年龄[：:]\s*(\d{2})/);if(t){const n=parseInt(t[1]);return n>=18&&n<=65?n:null}return null}function $(e){const t=e.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);return t?t[1]:""}function X(e){const t=e.split(`
`).filter(c=>c.trim()),n=[],r=new Set;for(const c of t){const s=c.match(/([一-龥]+(?:大学|学院))\s*[|｜\s]*\s*(\S+)?\s*(\d{4}\s*[-~—至到]\s*\d{4})?/);if(!s)continue;const l=s[1],m=s[2]||"",u=s[3]?s[3].replace(/\s+/g,""):"";r.has(l)||(r.add(l),l&&n.push({school:l,major:m,period:u}))}return n}function Z(e){const t=e.split(`
`).filter(r=>r.trim()),n=[];for(const r of t){const c=/([一-龥A-Za-z]+(?:公司|科技|集团|网络|有限|股份)?)\s+([一-龥A-Za-z]+(?:工程师|经理|主管|专员|实习生|负责人|开发|总监))\s*(\d{4}\.\d{2}\s*[-~—至到]\s*\d{4}\.\d{2}|\d{4}\s*[-~—至到]\s*\d{4})?/,s=r.match(c);if(s&&(n.push({company:s[1],role:s[2],period:s[3]?s[3].replace(/\s+/g,""):"",content:""}),n.length>=2))break}for(let r=0;r<n.length;r++){const c=t.findIndex(s=>s.includes(n[r].company));if(c>=0&&c+1<t.length){const s=t[c+1].trim();!/(公司|科技|集团|网络|银行)/.test(s)&&s.length>10&&(n[r].content=s)}}return n}function B(e){const t=e.split(`
`).filter(r=>r.trim()),n=[];for(const r of t){const c=r.match(/([一-龥A-Za-z]+(?:系统|平台|项目|重构|建设))\s+(\d{4}\.\d{2}\s*[-~—至到]\s*\d{4}\.\d{2}|\d{4}\s*[-~—至到]\s*\d{4})?\s*([一-龥]+(?:开发|负责|主导|参与|设计|架构|管理|负责人))?/);if(c&&(n.push({name:c[1],period:c[2]?c[2].replace(/\s+/g,""):"",role:c[3]||"",content:""}),n.length>=2))break}return n}function K(e,t){t||(t="");const n=L(t);e.forEach(r=>{var g;const c=Q(r);let s=50;/(本科|硕士|博士|研究生)/.test(c)&&(s+=15),/(阿里|腾讯|字节|百度|美团|华为|网易|京东|快手|拼多多|滴滴|小米)/.test(c)&&(s+=15);const l=c.match(/(\d+)\s*年/);l&&parseInt(l[1])>=3&&(s+=15),s=y(s+k(0,10),30,100);let m=50;n.forEach(f=>{c.includes(f)&&(m+=8)}),m=y(m+k(0,10),30,100);let u=70;(((g=r.structuredData)==null?void 0:g.work)||[]).forEach(f=>{const h=R(f.period);h>=2?u+=10:h<1&&(u-=15)}),u=y(u+k(0,10),30,100),r.screeningScore=Math.round(s*.35+m*.45+u*.2),r._screeningDetail={hardScore:s,expScore:m,stabilityScore:u,reason:G(r,n),risks:H(r)}})}function L(e){return e.split(/[,，\s、。]+/).map(t=>t.trim()).filter(t=>t.length>=2)}function Q(e){return JSON.stringify(e.structuredData).toLowerCase()}function y(e,t,n){return Math.max(t,Math.min(n,e))}function k(e,t){return Math.floor(Math.random()*(t-e+1))+e}function R(e){if(!e)return 1;const t=e.match(/(\d{4}).*?(\d{4})/);return t?parseInt(t[2])-parseInt(t[1]):1}function G(e,t){var m,u,d,g;const n=e.structuredData,r=[],c=((m=n.work)==null?void 0:m.length)||0;c>=2&&r.push(`${c}段工作经历`),/(阿里|腾讯|字节|百度|美团|华为)/.test(JSON.stringify(n.work))&&r.push("有大厂背景");const s=(u=n.education)==null?void 0:u[0];s&&/(大学|学院)/.test(s.school)&&r.push(`${s.school}学历`);const l=((d=n.project)==null?void 0:d.length)||0;return l>0&&r.push(`${l}个相关项目`),(g=n.work)==null||g.forEach(f=>{const h=R(f.period);h>=2&&r.push(`${f.company}稳定${h}年`)}),t.forEach(f=>{JSON.stringify(n).includes(f)&&(r.some(h=>h.includes(f))||r.push(`匹配"${f}"`))}),r.slice(0,3).join("，")||"基本条件匹配"}function H(e){var s;const t=[],n=e.structuredData;(!n.age||n.age<22)&&t.push("年龄信息待确认"),n.email||t.push("缺少邮箱联系方式"),(s=n.education)!=null&&s.length||t.push("学历信息缺失");const r=n.work||[];return r.filter(l=>R(l.period)<1).length>=2&&t.push("短期经历较多，稳定性待确认"),r.length===0&&t.push("工作经历缺失"),t.length===0&&t.push("暂无明显风险点"),t.join("；")}const V="recruitpulse_candidates";function Y(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}function W(){return{id:"",name:"",phone:"",chatRecords:[],resumeFileName:"",resumeFileContent:"",structuredData:{gender:"",age:null,email:"",education:[],work:[],project:[]},parseStatus:"none",screeningStatus:"pending",screeningScore:null,screeningFeedback:null,interviewStatus:"pending",selectedInterviewSlot:null,interviewResult:"",interviewEvaluation:"",createdAt:new Date().toISOString().slice(0,10)}}const U=[{id:"m1",name:"张三",phone:"13800000001",chatRecords:[{role:"hr",content:"张三你好，我是XX公司的HR小王，在Boss直聘上看到你的简历，想聊聊Java开发岗位，方便吗？",time:"2026-06-20 10:00",type:"chat"},{role:"candidate",content:"你好王老师，方便的，我对贵公司很感兴趣",time:"2026-06-20 10:02",type:"chat"},{role:"hr",content:"好的，那你先发一下简历吧，我看看详细情况",time:"2026-06-20 10:03",type:"chat"},{role:"candidate",content:"[文件] 简历.pdf",time:"2026-06-20 10:04",type:"file"},{role:"hr",content:"收到了，我看你之前在阿里做过3年Java开发，能具体说说你负责的项目吗？有没有高并发相关的经验？",time:"2026-06-20 10:06",type:"chat"},{role:"candidate",content:`好的，我的经历如下：

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
将单体架构拆分为微服务，引入Redis缓存预热与布隆过滤器防穿透`,structuredData:{gender:"男",age:28,email:"zhangsan@example.com",education:[{school:"浙江大学",major:"计算机科学与技术",period:"2017-2020"},{school:"杭州电子科技大学",major:"软件工程",period:"2014-2017"}],work:[{company:"阿里巴巴",role:"Java开发工程师",period:"2020.06-2023.08",content:"负责电商核心链路后端开发，主导秒杀模块重构，QPS提升40%。参与双11大促全链路压测与优化，保障系统零故障。"},{company:"字节跳动",role:"后端开发实习生",period:"2019.06-2019.09",content:"参与广告投放系统后端开发，使用Go语言编写数据处理Pipeline。"}],project:[{name:"电商秒杀系统重构",period:"2022.03-2022.09",role:"核心开发",content:"将单体架构拆分为微服务，引入Redis缓存预热与布隆过滤器防穿透，QPS从2000提升至10000，接口RT从200ms降至30ms。"}]},parseStatus:"done",screeningStatus:"pending",screeningScore:null,screeningFeedback:null,interviewStatus:"pending",selectedInterviewSlot:null,interviewResult:"",interviewEvaluation:"",createdAt:"2026-06-20"},{id:"m2",name:"李四",phone:"13900000002",chatRecords:[{role:"hr",content:"李四你好，我是XX公司HR小刘，收到了你投递的前端开发简历，方便聊几句吗？",time:"2026-06-21 14:00",type:"chat"},{role:"candidate",content:"刘老师好，方便的，我有5年前端经验，目前在字节跳动",time:"2026-06-21 14:02",type:"chat"},{role:"hr",content:"好的，你能先把简历发我一份吗？我这边系统里需要存档",time:"2026-06-21 14:03",type:"chat"},{role:"candidate",content:"[文件] 简历.pdf",time:"2026-06-21 14:04",type:"file"},{role:"hr",content:"谢谢！你技术栈主要用哪些？有没有带过人或者做过从0到1的项目？",time:"2026-06-21 14:06",type:"chat"},{role:"candidate",content:`我的详细情况：

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
服务200+内部用户，提升运营页面搭建效率80%`,structuredData:{gender:"男",age:30,email:"lisi@example.com",education:[{school:"上海交通大学",major:"软件工程",period:"2015-2019"}],work:[{company:"字节跳动",role:"高级前端开发",period:"2019.07-2024.03",content:"负责飞书文档前端架构，主导编辑器核心模块重构。带领3人小组完成低代码搭建平台从0到1。"},{company:"腾讯",role:"前端开发实习生",period:"2018.06-2018.09",content:"参与TAPD项目管理工具前端开发。"}],project:[{name:"企业级低代码平台",period:"2022.01-2023.06",role:"项目负责人",content:"基于Vue3+TypeScript从零搭建，支持组件拖拽、数据源绑定、在线部署。服务200+内部用户，提升运营页面搭建效率80%。"}]},parseStatus:"done",screeningStatus:"pending",screeningScore:null,screeningFeedback:null,interviewStatus:"pending",selectedInterviewSlot:null,interviewResult:"",interviewEvaluation:"",createdAt:"2026-06-21"},{id:"m3",name:"王五",phone:"13700000003",chatRecords:[{role:"hr",content:"王五你好，我是XX公司HR小李，你的简历我们收到了，想进一步了解下",time:"2026-06-22 09:00",type:"chat"},{role:"candidate",content:"李老师好，我之前在美团做产品经理，对贵司的产品岗很有兴趣",time:"2026-06-22 09:02",type:"chat"},{role:"hr",content:"方便再发一下最新简历吗？我这边系统归档用",time:"2026-06-22 09:03",type:"chat"},{role:"candidate",content:"[文件] 简历.docx",time:"2026-06-22 09:04",type:"file"},{role:"hr",content:"收到了。你之前在美团具体负责什么产品？有没有从0到1的经验？",time:"2026-06-22 09:05",type:"chat"},{role:"candidate",content:`我的情况如下：

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
NPS从32提升至58，商家留存率提升20%`,structuredData:{gender:"女",age:27,email:"wangwu@example.com",education:[{school:"南京大学",major:"信息管理与信息系统",period:"2017-2021"}],work:[{company:"美团",role:"产品经理",period:"2021.07-2025.04",content:"负责商家端SaaS系统，从0到1搭建商家后台管理模块。主导需求调研、竞品分析、PRD撰写、项目推进全流程。月活商家从500增长至3000，商家满意度提升35%。"}],project:[{name:"商家SaaS系统重构",period:"2023.03-2024.01",role:"产品负责人",content:"重新设计商家后台信息架构，优化核心操作流程。NPS从32提升至58，商家留存率提升20%。"}]},parseStatus:"done",screeningStatus:"pending",screeningScore:null,screeningFeedback:null,interviewStatus:"pending",selectedInterviewSlot:null,interviewResult:"",interviewEvaluation:"",createdAt:"2026-06-22"}],ee=b("candidate",()=>{const e=M(m()),t=S(()=>e.value.filter(i=>i.screeningStatus==="pending")),n=S(()=>e.value.filter(i=>i.screeningStatus==="passed")),r=S(()=>e.value.filter(i=>i.screeningStatus==="passed"&&i.interviewStatus==="pending")),c=S(()=>e.value.filter(i=>i.interviewStatus==="scheduled").sort((i,o)=>(i.selectedInterviewSlot||"").localeCompare(o.selectedInterviewSlot||""))),s=S(()=>e.value.filter(i=>["completed","passed","failed"].includes(i.interviewStatus))),l=S(()=>e.value.filter(i=>i.interviewStatus==="passed"));function m(){return[...U]}function u(){localStorage.setItem(V,JSON.stringify(e.value))}function d(i){return e.value.find(o=>o.id===i)}function g(i,o){if(!i||!o)return{ok:!1,msg:"姓名和手机号不能为空"};if(!/^1[3-9]\d{9}$/.test(o))return{ok:!1,msg:"手机号格式不正确"};if(e.value.find(v=>v.phone===o))return{ok:!1,msg:"该手机号已存在"};const p=W();return p.id=Y(),p.name=i,p.phone=o,e.value.unshift(p),u(),{ok:!0,msg:"录入成功"}}function f(i){e.value=e.value.filter(o=>o.id!==i),u()}function h(i,o){const a=d(i);a&&(a.chatRecords=o,u())}function A(i,o,a){const p=d(i);p&&(p.resumeFileName=o,p.resumeFileContent=a,u())}function D(i){const o=d(i);if(!o)return;const a=[];o.resumeFileContent&&a.push(o.resumeFileContent);const p=o.chatRecords.filter(w=>w.type==="resume");p.length&&a.push(p.map(w=>w.content).join(`
`));const v=a.join(`
`);o.structuredData=z(v),o.parseStatus="done",u()}function E(i,o){const a=d(i);a&&(a.structuredData={...a.structuredData,...o},u())}function F(i){const o=e.value.filter(a=>a.parseStatus==="done");return K(o,i),u(),[...o].sort((a,p)=>(p.screeningScore||0)-(a.screeningScore||0))}function x(i){const o=d(i);o&&(o.screeningStatus="passed",o.interviewStatus="pending",u())}function C(i,o){const a=d(i);a&&(a.screeningStatus="eliminated",a.screeningFeedback=o||"",u())}function P(i,o){const a=d(i);a&&(a.selectedInterviewSlot=o,a.interviewStatus="scheduled",u())}function N(i,o){const a=d(i);a&&(a.interviewStatus="passed",a.interviewResult="passed",a.interviewEvaluation=o||"",u())}function T(i,o){const a=d(i);a&&(a.interviewStatus="failed",a.interviewResult="failed",a.interviewEvaluation=o||"",u())}return J(e,u,{deep:!0}),{candidates:e,pendingScreening:t,passedScreening:n,pendingInterview:r,scheduledInterviews:c,completedInterviews:s,passedInterview:l,addCandidate:g,removeCandidate:f,importChatRecords:h,importResume:A,aiParse:D,updateStructuredData:E,doScreening:F,passScreening:x,eliminateScreening:C,scheduleInterview:P,passInterview:N,failInterview:T,getById:d}});export{ee as u};
