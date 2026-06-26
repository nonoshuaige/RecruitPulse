export function runScreening(candidates, query) {
  if (!query) query = ''
  const keywords = extractKeywords(query)

  candidates.forEach(c => {
    const allText = buildSearchText(c)

    let hardScore = 50
    if (/(本科|硕士|博士|研究生)/.test(allText)) hardScore += 15
    if (/(阿里|腾讯|字节|百度|美团|华为|网易|京东|快手|拼多多|滴滴|小米)/.test(allText)) hardScore += 15
    const yearMatch = allText.match(/(\d+)\s*年/)
    if (yearMatch && parseInt(yearMatch[1]) >= 3) hardScore += 15
    hardScore = clamp(hardScore + rand(0, 10), 30, 100)

    let expScore = 50
    keywords.forEach(kw => {
      if (allText.includes(kw)) expScore += 8
    })
    expScore = clamp(expScore + rand(0, 10), 30, 100)

    let stabilityScore = 70
    const workArr = c.structuredData?.work || []
    workArr.forEach(w => {
      const years = estimateYears(w.period)
      if (years >= 2) stabilityScore += 10
      else if (years < 1) stabilityScore -= 15
    })
    stabilityScore = clamp(stabilityScore + rand(0, 10), 30, 100)

    c.screeningScore = Math.round(hardScore * 0.35 + expScore * 0.45 + stabilityScore * 0.20)

    c._screeningDetail = {
      hardScore,
      expScore,
      stabilityScore,
      reason: generateReason(c, keywords),
      risks: generateRisks(c),
    }
  })
}

function extractKeywords(query) {
  return query
    .split(/[,，\s、。]+/)
    .map(k => k.trim())
    .filter(k => k.length >= 2)
}

function buildSearchText(c) {
  return JSON.stringify(c.structuredData).toLowerCase()
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function estimateYears(period) {
  if (!period) return 1
  const m = period.match(/(\d{4}).*?(\d{4})/)
  if (m) return parseInt(m[2]) - parseInt(m[1])
  return 1
}

function generateReason(c, keywords) {
  const data = c.structuredData
  const points = []

  const workLen = data.work?.length || 0
  if (workLen >= 2) points.push(`${workLen}段工作经历`)
  if (/(阿里|腾讯|字节|百度|美团|华为)/.test(JSON.stringify(data.work))) points.push('有大厂背景')

  const edu = data.education?.[0]
  if (edu && /(大学|学院)/.test(edu.school)) points.push(`${edu.school}学历`)

  const projectLen = data.project?.length || 0
  if (projectLen > 0) points.push(`${projectLen}个相关项目`)

  data.work?.forEach(w => {
    const years = estimateYears(w.period)
    if (years >= 2) points.push(`${w.company}稳定${years}年`)
  })

  keywords.forEach(kw => {
    if (JSON.stringify(data).includes(kw)) {
      if (!points.some(p => p.includes(kw))) points.push(`匹配"${kw}"`)
    }
  })

  return points.slice(0, 3).join('，') || '基本条件匹配'
}

function generateRisks(c) {
  const risks = []
  const data = c.structuredData

  if (!data.age || data.age < 22) risks.push('年龄信息待确认')
  if (!data.email) risks.push('缺少邮箱联系方式')
  if (!data.education?.length) risks.push('学历信息缺失')

  const workArr = data.work || []
  const shortTerms = workArr.filter(w => estimateYears(w.period) < 1)
  if (shortTerms.length >= 2) risks.push('短期经历较多，稳定性待确认')
  if (workArr.length === 0) risks.push('工作经历缺失')

  if (risks.length === 0) risks.push('暂无明显风险点')
  return risks.join('；')
}
