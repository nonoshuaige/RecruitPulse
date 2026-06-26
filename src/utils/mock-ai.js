/**
 * 模拟 AI 结构化解析
 * 仅解析简历文本，不处理聊天记录。
 * 学历上限 2 条，工作上限 2 条，项目上限 2 条。
 */
export function mockAiParse(text) {
  if (!text) return makeEmpty()

  const result = makeEmpty()
  result.gender = extractGender(text)
  result.age = extractAge(text)
  result.email = extractEmail(text)

  // 只解析"教育经历"之后、"工作经历"之间的内容
  const eduSection = sectionBetween(text, /教育[经历背景]*[：:]\s*/, /工作[经历经验]*[：:]\s*/)
  result.education = extractEducation(eduSection || text).slice(0, 2)

  // 只解析"工作经历"之后、"项目经历"之间的内容
  const workSection = sectionBetween(text, /工作[经历经验]*[：:]\s*/, /项目[经历经验]*[：:]\s*/)
  result.work = extractWork(workSection || text).slice(0, 2)

  // 只解析"项目经历"之后的内容
  const projSection = text.split(/项目[经历经验]*[：:]\s*/)[1] || ''
  result.project = extractProject(projSection || text).slice(0, 2)

  return result
}

function makeEmpty() {
  return { gender: '', age: null, email: '', education: [], work: [], project: [] }
}

/** 截取两个正则标记之间的文本 */
function sectionBetween(text, startRe, endRe) {
  const parts = text.split(startRe)
  if (parts.length < 2) return ''
  const after = parts[1]
  const endMatch = after.match(endRe)
  if (endMatch) return after.slice(0, endMatch.index).trim()
  return after.trim()
}

// ─── 性别 ───
function extractGender(text) {
  if (/男/.test(text) && !/女/.test(text)) return '男'
  if (/女/.test(text) && !/男/.test(text)) return '女'
  return ''
}

// ─── 年龄 ───
function extractAge(text) {
  const m = text.match(/(\d{2})\s*岁/) || text.match(/年龄[：:]\s*(\d{2})/)
  if (m) {
    const age = parseInt(m[1])
    return (age >= 18 && age <= 65) ? age : null
  }
  return null
}

// ─── 邮箱 ───
function extractEmail(text) {
  const m = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
  return m ? m[1] : ''
}

// ─── 学历（只提取本科/硕士/博士层级，跳过高中等） ───
function extractEducation(text) {
  const lines = text.split('\n').filter(l => l.trim())
  const result = []
  const seen = new Set()

  for (const line of lines) {
    const m = line.match(/([一-龥]+(?:大学|学院))\s*[|｜\s]*\s*(\S+)?\s*(\d{4}\s*[-~—至到]\s*\d{4})?/)
    if (!m) continue
    const school = m[1]
    const major = m[2] || ''
    const period = m[3] ? m[3].replace(/\s+/g, '') : ''

    // 去重：同一学校不重复
    if (seen.has(school)) continue
    seen.add(school)

    if (school) {
      result.push({ school, major, period })
    }
  }

  return result
}

// ─── 工作经历 ───
function extractWork(text) {
  const lines = text.split('\n').filter(l => l.trim())
  const result = []

  for (const line of lines) {
    // 匹配模式：公司名 岗位 时间段
    const pattern = /([一-龥A-Za-z]+(?:公司|科技|集团|网络|有限|股份)?)\s+([一-龥A-Za-z]+(?:工程师|经理|主管|专员|实习生|负责人|开发|总监))\s*(\d{4}\.\d{2}\s*[-~—至到]\s*\d{4}\.\d{2}|\d{4}\s*[-~—至到]\s*\d{4})?/
    const m = line.match(pattern)
    if (m) {
      result.push({
        company: m[1],
        role: m[2],
        period: m[3] ? m[3].replace(/\s+/g, '') : '',
        content: '',
      })
      if (result.length >= 2) break
    }
  }

  // 将跟在公司行后面的非公司行作为 content 填充
  for (let i = 0; i < result.length; i++) {
    const companyIdx = lines.findIndex(l => l.includes(result[i].company))
    if (companyIdx >= 0 && companyIdx + 1 < lines.length) {
      const nextLine = lines[companyIdx + 1].trim()
      if (!/(公司|科技|集团|网络|银行)/.test(nextLine) && nextLine.length > 10) {
        result[i].content = nextLine
      }
    }
  }

  return result
}

// ─── 项目经历 ───
function extractProject(text) {
  const lines = text.split('\n').filter(l => l.trim())
  const result = []

  for (const line of lines) {
    // "项目名 时间段 角色"
    const m = line.match(/([一-龥A-Za-z]+(?:系统|平台|项目|重构|建设))\s+(\d{4}\.\d{2}\s*[-~—至到]\s*\d{4}\.\d{2}|\d{4}\s*[-~—至到]\s*\d{4})?\s*([一-龥]+(?:开发|负责|主导|参与|设计|架构|管理|负责人))?/)
    if (m) {
      result.push({
        name: m[1],
        period: m[2] ? m[2].replace(/\s+/g, '') : '',
        role: m[3] || '',
        content: '',
      })
      if (result.length >= 2) break
    }
  }

  return result
}
