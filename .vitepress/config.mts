import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE = 'https://www.chatgpt-chinese-guide.com'

function normalizeRoute(value: string): string {
  let route = (value || '').trim().replace(/^https?:\/\/[^/]+/i, '')
  route = route.split(/[?#]/)[0]
  if (!route || route === '/') return '/'
  if (!route.startsWith('/')) route = `/${route}`
  route = route.replace(/\/index(?:\.html)?$/, '/')
  route = route.replace(/\.html$/, '')
  route = route.replace(/\/$/, '')
  return route || '/'
}

function loadSeoGrades(): Map<string, string> {
  const grades = new Map<string, string>()
  try {
    const raw = readFileSync(resolve(process.cwd(), '.vitepress', 'seo-grades.json'), 'utf-8')
      .replace(/^\uFEFF/, '')
    const data = JSON.parse(raw) as { grades?: Record<string, string[]> }
    for (const [grade, routes] of Object.entries(data.grades || {})) {
      if (!Array.isArray(routes)) continue
      for (const route of routes) {
        grades.set(normalizeRoute(route), grade)
      }
    }
  } catch {
    // Keep the site buildable if the optional recovery map is unavailable.
  }
  return grades
}

const seoGrades = loadSeoGrades()
const sectionIndexRoutes = new Set(['/', '/disclaimer', '/chatgpt', '/guides', '/blog'])

function isIndexableRoute(value: string): boolean {
  const route = normalizeRoute(value)
  if (sectionIndexRoutes.has(route)) return true
  const grade = seoGrades.get(route)
  return grade === 'A' || grade === 'B' || grade === 'C'
}

const recoverySidebar = {
  '/chatgpt/': [
    {
      text: '核心教程',
      collapsed: false,
      items: [
        { text: '什么是 ChatGPT？', link: '/chatgpt/what-is-chatgpt' },
        { text: 'ChatGPT 新手完整教程', link: '/chatgpt/chatgpt-chinese-complete-tutorial-register-to-master-april-2026' },
        { text: 'ChatGPT 2026 使用指南', link: '/chatgpt/chatgpt-2026-05-guide' },
        { text: 'ChatGPT 怎么用？完整教程', link: '/chatgpt/chatgpt-how-to-use-complete-guide-2026-05' },
        { text: 'ChatGPT Prompt 完整指南', link: '/chatgpt/chatgpt-prompt-complete-guide-2026-may' },
      ],
    },
    {
      text: '专题评测',
      collapsed: false,
      items: [
        { text: 'AI 工具模型横评', link: '/chatgpt/chatgpt-ai-tools-ranking-five-models-comparison-april-2026' },
        { text: 'ChatGPT 写代码实测', link: '/chatgpt/chatgpt-ai-coding-guide-gpt54-claude46-april-2026' },
        { text: 'AI 论文写作指南', link: '/chatgpt/ai-lunwen-xiezuo-chatgpt-claude-jiangchong-runse-2026' },
        { text: 'AI 图片商业设计实测', link: '/chatgpt/chatgpt-images-2-chinese-commercial-design-prompts-2026' },
      ],
    },
  ],
  '/guides/': [
    {
      text: 'OpenAI 开发',
      collapsed: false,
      items: [
        { text: '快速开始', link: '/guides/chatgpt-dev/quickstart.html' },
        { text: 'OpenAI API 指南', link: '/guides/chatgpt-dev/openai-api-guide.html' },
        { text: 'Prompt 工程', link: '/guides/chatgpt-dev/prompt-engineering.html' },
        { text: '文本生成', link: '/guides/chatgpt-dev/text-generation.html' },
        { text: '图像生成', link: '/guides/chatgpt-dev/image-generation.html' },
        { text: '视觉理解', link: '/guides/chatgpt-dev/vision.html' },
      ],
    },
  ],
  '/blog/': [
    {
      text: '精选文章',
      collapsed: false,
      items: [
        { text: 'ChatGPT Prompt 工程指南', link: '/blog/chatgpt-prompt-engineering-guide.html' },
        { text: '大模型未来趋势', link: '/blog/future-of-llm-2025.html' },
      ],
    },
  ],
}

const recoveryThemeOverrides = {
  sidebar: recoverySidebar,
  // 恢复期关闭本地搜索，避免所有历史文章标题被打包进前端搜索索引。
  search: undefined,
} as any

export default defineConfig({
  // 1. 网站元数据
  title: "ChatGPT教程 | 中文AI使用指南 | 模型评测与Prompt技巧",
  description: "独立中文AI教程与工具评测中心。提供ChatGPT入门指南、模型对比、Prompt技巧、AI图片生成教程与安全使用建议，2026年持续更新。",
  lang: 'zh-CN',
  mpa: true,
  
  // 2. 关键 SEO 配置 (你漏掉的部分)
  // 自动生成 sitemap，Bing 爬虫全靠它来抓取你的页面
  sitemap: {
    hostname: SITE,
    transformItems: (items) => {
      return items.filter(item => {
        const route = normalizeRoute(item.url || '')
        return isIndexableRoute(route)
      }).map(item => {
        const url = item.url || ''
        const route = normalizeRoute(url)
        const grade = seoGrades.get(route)
        let priority = 0.6
        let changefreq: 'daily' | 'weekly' | 'monthly' = 'monthly'
        if (route === '/') {
          priority = 1.0
          changefreq = 'weekly'
        } else if (sectionIndexRoutes.has(route)) {
          priority = 0.8
          changefreq = 'weekly'
        } else if (grade === 'A') {
          priority = 0.9
          changefreq = 'weekly'
        } else if (grade === 'B') {
          priority = 0.75
          changefreq = 'monthly'
        } else if (grade === 'C') {
          priority = 0.55
          changefreq = 'monthly'
        }
        return {
          ...item,
          changefreq,
          priority,
          // 不覆盖 lastmod；VitePress 默认会用 git/文件 mtime
        }
      })
    }
  },
  // 显示最后更新时间，搜索引擎喜欢新鲜内容
  lastUpdated: true,

  // 3. Head 配置
  head: [
    ['meta', { name: 'msvalidate.01', content: '283F4ED132291BB65C882E27214A15B8' }],
    // 站点级 keywords / og（首页/未指定页面的 fallback；内页会被 transformHead 覆盖）
    ['meta', { name: 'keywords', content: 'ChatGPT,ChatGPT教程,ChatGPT使用指南,OpenAI,Claude,Gemini,AI工具评测,Prompt教程,AI图片生成' }],
    ['meta', { name: 'author', content: 'ChatGPT使用指南' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ChatGPT 使用指南' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: 'https://www.chatgpt-chinese-guide.com/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://www.chatgpt-chinese-guide.com/og-image.png' }],
    // 移动端可访问性：允许缩放（搜索引擎对 user-scalable=no 会扣 a11y 分）
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
    ['meta', { name: 'theme-color', content: '#10a37f' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    ['link', { rel: 'icon', href: '/logo.svg' }],
    [
      'script',
      { type: 'application/ld+json' },
      `{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ChatGPT使用指南",
        "url": "https://www.chatgpt-chinese-guide.com",
        "description": "独立中文AI教程与工具评测中心，提供ChatGPT入门指南、模型对比、Prompt技巧、AI图片生成教程与安全使用建议",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.chatgpt-chinese-guide.com/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }`
    ],
    [
      'script',
      { type: 'application/ld+json' },
      `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "ChatGPT新手怎么入门？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ChatGPT新手建议先了解官方服务、账号安全、数据隐私和基础提问方式，再从低风险场景开始练习。本站提供完整的新手入门教程和使用技巧。"
            }
          },
          {
            "@type": "Question",
            "name": "ChatGPT能用来做什么？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ChatGPT可用于写作辅助、代码编程、论文润色、翻译、数据分析、创意策划等。GPT-5.4还支持图片识别、文件分析、深度推理等高级功能。"
            }
          },
          {
            "@type": "Question",
            "name": "GPT-5.4、Claude 4.6、Gemini 3.5 Pro哪个更好？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "各有所长：GPT-5.4适合复杂分析和推理；Claude 4.6中文写作和长文处理表现优秀；Gemini 3.5 Pro多模态能力突出。建议根据使用场景、隐私要求和预算选择。"
            }
          },
          {
            "@type": "Question",
            "name": "ChatGPT Plus值得订阅吗？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ChatGPT Plus是否值得订阅取决于使用频率、预算和对官方功能的需求。建议优先查看OpenAI官方订阅说明，再结合自己的场景决定。"
            }
          }
        ]
      }`
    ],
    [
      'script',
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?2e3f5c9f50c34190ae43b4c3dd61195e";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();`
    ],
  ],

  // 4. 死链检查 (建议先设为 true，等文章都写好了再去掉，不然报错很烦)
  ignoreDeadLinks: true,

  // 5. 每页动态 SEO meta
  //    恢复模式：每页 canonical 指向自身，避免全站被搜索引擎识别为重复/门页集合。
  //    按历史 Bing 表现恢复 A/B/C 页面索引，D 档零展示页面继续 noindex,follow。
  transformHead({ pageData }) {
    const SITE_NAME = 'ChatGPT 使用指南'
    const DEFAULT_OG_IMAGE = `${SITE}/og-image.png`

    const rel = (pageData.relativePath || '')
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '')
    const url = rel ? `${SITE}/${rel}` : `${SITE}/`
    const route = normalizeRoute(url)
    const isHome = !rel || rel === ''
    const isArticle = !isHome && /^(chatgpt|guides|blog)\//.test(rel)
    const isIndexAllowed = isIndexableRoute(route)

    const fm = pageData.frontmatter || {}
    const pageTitle: string =
      fm.title ||
      pageData.title ||
      (isHome ? 'ChatGPT 使用指南 | 中文AI教程与工具评测' : '')
    const pageDesc: string =
      fm.description ||
      pageData.description ||
      (isHome
        ? '独立中文AI教程与工具评测中心：ChatGPT新手入门、GPT / Claude / Gemini 模型对比、Prompt 指南、AI图片生成教程与安全使用建议，2026 年持续更新。'
        : '')

    const ogImage: string = fm.image || fm.ogImage || DEFAULT_OG_IMAGE
    const lastUpdatedMs =
      (pageData as any).lastUpdated || (fm.date ? Date.parse(fm.date) : undefined)
    const datePublishedISO = fm.date
      ? new Date(fm.date).toISOString()
      : lastUpdatedMs
      ? new Date(lastUpdatedMs).toISOString()
      : undefined
    const dateModifiedISO = lastUpdatedMs
      ? new Date(lastUpdatedMs).toISOString()
      : datePublishedISO

    const head: any[] = [
      ['link', { rel: 'canonical', href: url }],
      // og:url 仍然用当前页面，因为这是社交分享时的回链
      ['meta', { property: 'og:url', content: url }],
    ]

    if (isIndexAllowed) {
      head.push(['meta', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' }])
    } else {
      head.push(['meta', { name: 'robots', content: 'noindex,follow,max-snippet:-1,max-image-preview:large' }])
    }

    if (pageTitle) {
      head.push(['meta', { property: 'og:title', content: pageTitle }])
      head.push(['meta', { name: 'twitter:title', content: pageTitle }])
    }
    if (pageDesc) {
      head.push(['meta', { name: 'description', content: pageDesc }])
      head.push(['meta', { property: 'og:description', content: pageDesc }])
      head.push(['meta', { name: 'twitter:description', content: pageDesc }])
    }
    if (ogImage) {
      head.push(['meta', { property: 'og:image', content: ogImage }])
      head.push(['meta', { name: 'twitter:image', content: ogImage }])
    }

    // 内页 og:type = article，并附带发布/修改时间
    if (isArticle) {
      head.push(['meta', { property: 'og:type', content: 'article' }])
      if (datePublishedISO) {
        head.push(['meta', { property: 'article:published_time', content: datePublishedISO }])
      }
      if (dateModifiedISO) {
        head.push(['meta', { property: 'article:modified_time', content: dateModifiedISO }])
      }

      // Article JSON-LD（给 Bing/Google 富搜索结果用）
      const articleSchema: any = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pageTitle,
        description: pageDesc,
        url,
        image: ogImage,
        inLanguage: 'zh-CN',
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE,
          logo: { '@type': 'ImageObject', url: `${SITE}/logo.svg` },
        },
      }
      if (datePublishedISO) articleSchema.datePublished = datePublishedISO
      if (dateModifiedISO) articleSchema.dateModified = dateModifiedISO
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(articleSchema),
      ])

      // BreadcrumbList JSON-LD
      const parts = rel.split('/')
      const sectionMap: Record<string, string> = {
        chatgpt: 'ChatGPT 教程',
        guides: '使用指南',
        blog: 'Blog',
      }
      const items: any[] = [
        { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` },
      ]
      let acc = SITE
      parts.forEach((seg, i) => {
        acc += '/' + seg
        const isLast = i === parts.length - 1
        const name =
          i === 0
            ? sectionMap[seg] || seg
            : isLast
            ? pageTitle || seg
            : seg
        items.push({
          '@type': 'ListItem',
          position: i + 2,
          name,
          item: acc,
        })
      })
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items,
        }),
      ])
    } else {
      head.push(['meta', { property: 'og:type', content: 'website' }])
    }

    return head
  },


  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ChatGPT使用指南',
    
    // 开启最后更新时间的显示文本
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 1. 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'ChatGPT介绍', link: '/chatgpt/' },
      { text: 'ChatGPT使用指南', link: '/guides/' },
      { text: '免责声明', link: '/disclaimer' },
      { text: 'OpenAI API文档', link: 'https://platform.openai.com/docs' },
    ],

    // 2. 侧边栏
    sidebar: {
      '/chatgpt/': [
        {
          text: '入门教程',
          collapsed: false,
          items: [
            { text: 'ChatGPT官方服务中文指南2026：GPT-5.5国内使用教程与第三方AI工具推荐（低门槛）', link: '/chatgpt/chatgpt-guanwang-zhongwen-ban-gpt55-guonei-jiaocheng-2026' },
            { text: 'ChatGPT提示词完全指南2026年5月最新版（黄金7要素+25大进阶技巧+60个实战模板+全场景FAQ）', link: '/chatgpt/chatgpt-prompt-ultimate-guide-2026-05-511' },
            { text: 'ChatGPT提示词终极指南2026年5月最新版（黄金7要素+30大进阶技巧+80个实战模板+全场景FAQ）', link: '/chatgpt/chatgpt-prompt-ultimate-guide-2026-05-510-2' },
            { text: 'ChatGPT提示词完全指南2026年5月最新版：黄金7要素公式+25大进阶技巧+60个实战模板+FAQ', link: '/chatgpt/chatgpt-prompt-ultimate-guide-2026-05-510' },
            { text: 'ChatGPT提示词终极指南2026年5月最新版｜黄金7要素公式+30大进阶技巧+80个实战模板+完整FAQ', link: '/chatgpt/chatgpt-prompt-ultimate-guide-2026-05-509' },
            { text: 'ChatGPT提示词终极指南：从入门到精通的完整教程（2026年5月最新）', link: '/chatgpt/chatgpt-prompt-engineering-ultimate-guide-2026-05' },
            { text: 'ChatGPT提示词大全2026最新指南：100+高效Prompt模板与万能公式（新手到高手完整教程）', link: '/chatgpt/chatgpt-prompt-complete-guide-2026-may' },
            { text: 'ChatGPT提示词终极指南2026年5月最新版｜50+实战模板+黄金公式+进阶技巧全解析', link: '/chatgpt/chatgpt-prompt-ultimate-guide-2026-05' },
            { text: 'ChatGPT使用教程：2026年5月最新完整入门到精通指南（新手必看）', link: '/chatgpt/chatgpt-shiyong-jiaocheng-2026-05' },
            { text: 'ChatGPT使用教程完整版【2026年05月最新】从注册到精通的保姆级指南', link: '/chatgpt/auto-article-1778165145818' },
            { text: '什么是ChatGPT？', link: '/chatgpt/what-is-chatgpt' },
            { text: 'ChatGPT怎么用？完整使用教程', link: '/chatgpt/chatgpt-how-to-use-complete-guide-2026-05' },
            { text: 'ChatGPT中文教程完整教程', link: '/chatgpt/chatgpt-chinese-complete-tutorial-register-to-master-april-2026' },
            { text: 'ChatGPT注册教程2026', link: '/chatgpt/chatgpt-zhuce-jiaocheng-2026-04' },
            { text: 'ChatGPT官网使用指南2026', link: '/chatgpt/chatgpt-guanwang-rukou-guonei-zhuce-mianfei-2026' },
            { text: 'ChatGPT官方网址使用指南', link: '/chatgpt/chatgpt-official' },
            { text: 'ChatGPT国内能用吗？', link: '/chatgpt/chatgpt-guonei-neng-yong-ma-6zhong-fangfa-shice-2026' },
            { text: 'ChatGPT网页版使用指南', link: '/chatgpt/chatgpt-wangyeban-zaixian-shiyong-zhinan-2026' },
            { text: 'ChatGPT下载安装教程', link: '/chatgpt/chatgpt-xiazai-jiaocheng-2026-04' },
            { text: 'ChatGPT手机版使用教程', link: '/chatgpt/chatgpt-mobile-guide-android-ios' },
          ]
        },
        {
          text: '场景应用',
          collapsed: false,
          items: [
            { text: 'ChatGPT AI能做什么？', link: '/chatgpt/what-can-chatgpt-ai-do-use-cases-guide' },
            { text: 'AI论文写作指南', link: '/chatgpt/ai-lunwen-xiezuo-chatgpt-claude-jiangchong-runse-2026' },
            { text: 'AI编程工具实测', link: '/chatgpt/ai-biancheng-gongju-shice-gpt-claude-deepseek-2026' },
            { text: 'ChatGPT写代码教程', link: '/chatgpt/chatgpt-ai-coding-guide-gpt54-claude46-april-2026' },
            { text: 'AI副业赚钱实战指南', link: '/chatgpt/chatgpt-ai-fuye-zhuanqian-shizhan-zhinan-2026' },
          ]
        },
        {
          text: '模型专区',
          collapsed: false,
          items: [
            { text: 'GPT-5.4国内使用教程', link: '/chatgpt/gpt-5-4-guonei-zenme-yong-zhongwen-ban-jiaocheng-2026' },
            { text: 'GPT-5.5发布解析', link: '/chatgpt/gpt-5-5-release-china-usage-guide-april-2026' },
            { text: 'Claude 4.6国内使用指南', link: '/chatgpt/claude-guonei-zenme-yong-claude46-zhongwen-ban-jiaocheng-2026' },
            { text: 'Claude Opus 4.7发布', link: '/chatgpt/claude-opus-47-release-upgrade-guide-april-2026' },
            { text: 'Gemini 3.1 Pro使用教程', link: '/chatgpt/gemini-3-1-pro-guonei-zenme-yong-zhongwen-ban-jiaocheng-2026' },
            { text: 'Grok官网使用指南与使用指南', link: '/chatgpt/grok-guanwang-rukou-guonei-shiyong-zhinan-2026' },
            { text: 'ChatGPT vs Claude 深度对比', link: '/chatgpt/chatgpt-vs-claude' },
          ]
        },
        {
          text: '平台推荐',
          collapsed: false,
          items: [
            { text: 'ChatGPT第三方AI工具实测推荐', link: '/chatgpt/chatgpt-jingxiang-wangzhan-shice-tuijian-bipkeng-2026' },
            { text: '5大AI平台实测排名', link: '/chatgpt/chatgpt-zhongwen-ban-nage-haoyong-5da-pingtai-shice-paiming-2026' },
            { text: 'AI工具推荐排行榜', link: '/chatgpt/chatgpt-ai-tools-ranking-five-models-comparison-april-2026' },
            { text: 'ChatGPT替代品评测', link: '/chatgpt/chatgpt-tidaipin-guonei-keyong-ai-gongju-pingce-2026' },
          ]
        },
        {
          text: '图片生成',
          collapsed: true,
            items: [
              { text: 'GPT Image 2 完全指南', link: '/chatgpt/chatgpt-image-generation-guide-gpt-image-2-2026' },
              { text: 'Images 2.0 中文商业设计实测', link: '/chatgpt/chatgpt-images-2-chinese-commercial-design-prompts-2026' },
              { text: 'Images 2.0 八大场景实测', link: '/chatgpt/chatgpt-images-2-0-gpt-image-2-wanzheng-jiaocheng-2026' },
            ]
          },
        {
          text: '常见问题',
          collapsed: true,
          items: [
            { text: 'ChatGPT打不开怎么办？', link: '/chatgpt/chatgpt-not-working-fix-guide' },
            { text: 'ChatGPT常见问题解决方案', link: '/chatgpt/chatgpt-faq-solutions' },
            { text: 'ChatGPT免费使用全攻略', link: '/chatgpt/chatgpt-free-guide' },
          ]
        },
        {
          text: 'ChatGPT 教程',
          collapsed: true,
          items: [
            { text: 'ChatGPT 2026年04月最新使用指南：国内访问、注册、报错排查与中文教程选择全教程', link: '/chatgpt/chatgpt-2026-04-guide' },
            { text: 'ChatGPT 2026年04月最新使用指南：国内访问、注册、中文教程使用指南、常见问题一次讲清', link: '/chatgpt/chatgpt-2026-04-latest-guide' },
            { text: 'ChatGPT 2026年05月最新使用指南：国内访问、注册、常见问题与完整教程', link: '/chatgpt/chatgpt-2026-05-guide' },
            { text: 'ChatGPT 国内怎么使用？2026年05月最新官网+第三方AI工具完整教程', link: '/chatgpt/chatgpt-2026-05-latest-guide' },
            { text: 'ChatGPT 国内中文教程使用指南，支持GPT-5.2，GPT-5【2026年2月最新更新】', link: '/chatgpt/chatgpt-5.2-chinese' },
            { text: 'ChatGPT 中文教程：2026年免费使用指南与第三方AI工具推荐（支持 GPT5、GPT-4o、o3…', link: '/chatgpt/chatgpt-china-guide-2026' },
            { text: 'ChatGPT 中文教程国内便捷访问指南：低门槛，免费体验 GPT-5.1 与 Claude 4.5…', link: '/chatgpt/chatgpt-china-mirror-guide-2026' },
            { text: 'ChatGPT官方网址使用指南（官网网址登录使用指南）及国内便捷访问指南 | ChatGPT中文教程', link: '/chatgpt/chatgpt-chinese-access-recommendation' },
            { text: 'ChatGPT 中文教程免费：国内使用指南（支持 GPT-5、GPT-4o，低门槛）【2026年…', link: '/chatgpt/chatgpt-chinese-gpt' },
            { text: '国内免费使用 GPT 最新指南（支持GPT-5，低门槛）', link: '/chatgpt/chatgpt-chinese-guide' },
            { text: 'ChatGPT官方网址使用指南（官网网址登录使用指南）及国内使用指南 | ChatGPT中文教程', link: '/chatgpt/chatgpt-chinese-official' },
            { text: 'ChatGPT 中国版使用指南：2026 最新教程与国内便捷访问使用指南 (ChatGPT China …', link: '/chatgpt/chatgpt-chinese' },
            { text: '2026年3月重磅更新！ChatGPT中文教程首发支持 GPT-5.3、Gemini 3.1 Pr…', link: '/chatgpt/chatgpt-cn-gpt5-3-gemini-3-1-pro-update-2026' },
            { text: 'ChatGPT 完整指南：国内使用教程、注册方法与中文教程推荐（2026年04月最新）', link: '/chatgpt/chatgpt-complete-guide-china-2026-april' },
            { text: 'ChatGPT 生图功能全攻略：gpt-image-1 国内使用教程（2026年4月最新）', link: '/chatgpt/chatgpt-gpt4o-image-generation-guonei-jiaocheng-2026' },
            { text: 'ChatGPT 官方服务中文指南：GPT-5.4 国内使用完全攻略（低门槛）2026年4月最新', link: '/chatgpt/chatgpt-gpt5-guanwang-wanzheng-gonglue-2026' },
            { text: 'ChatGPT官网使用指南与使用全指南（2026年04月最新）', link: '/chatgpt/chatgpt-guanwang-2026-04' },
            { text: 'ChatGPT官网打不开怎么办？2026年4月国内替代方案与解决办法', link: '/chatgpt/chatgpt-guanwang-dabukao-guonei-tidai-jiejue-2026' },
            { text: 'ChatGPT官网地址使用指南（2026年4月最新登录指南）', link: '/chatgpt/chatgpt-guanwang-dizhi-2026-04' },
            { text: 'ChatGPT官网使用指南2026 | OpenAI官方网站访问指南与国内使用方法', link: '/chatgpt/chatgpt-guanwang-rukou-2026-04' },
            { text: 'ChatGPT官网使用指南 2026——国内直接访问完整指南（低门槛）', link: '/chatgpt/chatgpt-guanwang-rukou-2026-april-418' },
            { text: 'ChatGPT官网使用指南 2026 | 国内访问完整指南（含GPT-5.4最新模型）', link: '/chatgpt/chatgpt-guanwang-rukou-2026-april' },
            { text: 'ChatGPT官网使用指南地址是什么？2026年4月国内访问ChatGPT完整指南（附低门槛方案）', link: '/chatgpt/chatgpt-guanwang-rukou-dizhi-guonei-fangwen-zhinan-2026' },
            { text: 'ChatGPT官网使用指南｜2026年4月国内ChatGPT中文教程使用指南（低门槛直达GPT-5.4）', link: '/chatgpt/chatgpt-guanwang-rukou-guonei-zhongwen-ban-shiyong-zhinan-2026' },
            { text: 'ChatGPT国内中文教程使用指南：官网使用指南、注册教程、模型对比与稳定使用方法【2026年04月最新】', link: '/chatgpt/chatgpt-guide-cn-2026-04' },
            { text: 'ChatGPT 完整使用指南：2026年新手快速入门（支持 GPT-4o / GPT-5.2） …', link: '/chatgpt/chatgpt-guide-for-beginners' },
            { text: 'ChatGPT官网终极指南：国内如何轻松使用 GPT（支持GPT-5 & GPT-4o）', link: '/chatgpt/chatgpt-guide' },
            { text: 'ChatGPT 国内怎么使用？2026年05月最新官网与第三方AI工具完整指南', link: '/chatgpt/chatgpt-guonei-zenme-yong-guide-2026-05' },
            { text: 'ChatGPT 国内中文教程完整使用指南【2026年04月最新】含GPT-5.4注册教程', link: '/chatgpt/chatgpt-guonei-zhongwen-ban-shiyong-zhinan-2026-04' },
            { text: 'ChatGPT 国内中文教程使用指南 2026【含GPT-5.4最新模型】', link: '/chatgpt/chatgpt-guonei-zhongwenban-shiyong-zhinan-2026-04' },
            { text: 'ChatGPT怎么用？2026年05月最新新手教程：从打开使用指南到高效提问一次讲清', link: '/chatgpt/chatgpt-how-to-use-2026-05-505' },
            { text: 'ChatGPT怎么用？2026年05月最新新手到进阶完整教程', link: '/chatgpt/chatgpt-how-to-use-2026-05-506' },
            { text: 'ChatGPT怎么用？2026年05月最新新手教程：注册、提问、写作、办公、编程与国内使用指南', link: '/chatgpt/chatgpt-how-to-use-2026-05' },
            { text: 'ChatGPT怎么用？2026年05月最新完整使用教程（新手到进阶全攻略）', link: '/chatgpt/chatgpt-how-to-use-complete-guide-2026-05-504' },
            { text: 'ChatGPT怎么用？2026年05月最新新手教程：从打开到高效提问一次讲清楚', link: '/chatgpt/chatgpt-how-to-use-guide-2026-05-507-2' },
            { text: 'ChatGPT怎么用？2026年05月最新新手教程：从打开使用指南到高效提问一次讲清楚', link: '/chatgpt/chatgpt-how-to-use-guide-2026-05-507' },
            { text: 'ChatGPT怎么用？2026年05月最新完整使用教程（新手到高手）', link: '/chatgpt/chatgpt-how-to-use-guide-2026-05' },
            { text: 'ChatGPT Images 2.0 深度测评：GPT-image-2实测对比，文字渲染终于能打了', link: '/chatgpt/chatgpt-images-2-gpt-image-2-update-april-2026' },
            { text: 'ChatGPT中文教程国内便捷访问推荐：稳定、高速、免费体验 | ChatGPT中文教程', link: '/chatgpt/chatgpt-mirror-sites-collection' },
            { text: 'ChatGPT第三方AI工具有哪些？2026稳定可用平台推荐与避坑指南', link: '/chatgpt/chatgpt-mirror-sites-recommendation-and-anti-scam-guide-2026' },
            { text: 'ChatGPT 官方网址使用指南及国内使用 GPT-5.2 教程（官网网址登录使用指南） | ChatG…', link: '/chatgpt/chatgpt-official-2025' },
            { text: 'ChatGPT官网使用指南 2026 — 国内便捷访问访问完整指南（低门槛）', link: '/chatgpt/chatgpt-official-entrance-2026-april' },
            { text: 'ChatGPT官方网址使用指南（官网网址登录使用指南）- ChatGPT中文教程 (2026 使用指南)', link: '/chatgpt/chatgpt-official-entry' },
            { text: 'ChatGPT官方网址使用指南（官网网址登录使用指南）- ChatGPT中文教程 (2026 指南)', link: '/chatgpt/chatgpt-official-guide' },
            { text: 'ChatGPT 官方服务中文指南国内使用指南（支持GPT-5.2 & GPT-4o）【2026年1月持…', link: '/chatgpt/chatgpt-official-website' },
            { text: 'ChatGPT 与 ChatGPT中文教程：2026 官方最新介绍与国内使用终极指南 (支持GPT…', link: '/chatgpt/chatgpt-ultimate-guide-2026' },
            { text: 'ChatGPT网页版使用指南（2026年4月最新）| 国内访问方法+平台推荐', link: '/chatgpt/chatgpt-wangye-ban-shiyong-zhinan-2026-04' },
            { text: 'ChatGPT网页版登录与下载防坑指南：2026国内第三方AI工具与最新版本全解析', link: '/chatgpt/chatgpt-web-version-vs-download-anti-scam-guide-2026' },
            { text: 'ChatGPT下载安装教程2026：电脑/手机/网页版全平台使用指南（低门槛+国内便捷访问）', link: '/chatgpt/chatgpt-xiazai-anzhuang-jiaocheng-dianno-shouji-2026' },
            { text: 'ChatGPT怎么用？2026年05月最新完整使用教程（小白入门到精通）', link: '/chatgpt/chatgpt-zenme-yong-2026-05' },
            { text: 'ChatGPT中文教程 2026年最新使用指南：低门槛的完整教程', link: '/chatgpt/chatgpt-zhongwen-ban-2026-04' },
            { text: 'ChatGPT中文教程 2026完整使用指南（低门槛·支持GPT-5.4）', link: '/chatgpt/chatgpt-zhongwen-ban-2026' },
            { text: 'ChatGPT中文教程免费体验完整攻略：2026年4月国内便捷访问GPT-5.4低门槛', link: '/chatgpt/chatgpt-zhongwen-ban-mianfei-tiyan-wanzheng-gonglue-2026' },
            { text: 'ChatGPT中文教程哪个好用？2026年4月5大平台实测对比（稳定性/模型/价格全方位评分）', link: '/chatgpt/chatgpt-zhongwen-ban-nage-haoyong-5da-pingtai-shice-2026-april' },
            { text: 'ChatGPT中文教程完整使用指南 2026年04月最新 | 低门槛国内直接访问', link: '/chatgpt/chatgpt-zhongwen-ban-shiyong-zhinan-2026-04' },
            { text: 'ChatGPT中文教程完整指南：2026年4月国内免费使用教程（低门槛）', link: '/chatgpt/chatgpt-zhongwen-guonei-shiyong-zhinan-2026-april' },
            { text: 'ChatGPT中文教程 2026完整指南｜低门槛直接使用GPT-5.4', link: '/chatgpt/chatgpt-zhongwenban-2026-april' },
            { text: 'ChatGPT中文教程怎么用？2026年最好用的国内ChatGPT工具推荐', link: '/chatgpt/chatgpt-zhongwenban-guonei-gongju-tuijian-2026-04' },
            { text: 'ChatGPT注册教程2026：国内低门槛，3分钟搞定中文教程账号（4月实测可用）', link: '/chatgpt/chatgpt-zhuce-guonei-wuxu-fanqiang-2026-4' },
            { text: 'ChatGPT注册教程2026：官网注册+国内第三方AI工具完整指南（低门槛）', link: '/chatgpt/chatgpt-zhuce-jiaocheng-2026-04-418' },
            { text: '2026最新 ChatGPT中文教程使用指南（国内免费使用 GPT-4o / GPT-5）', link: '/chatgpt/china-guide' },
            { text: 'Claude 4.6 国内使用完整指南（2026年4月）', link: '/chatgpt/claude-4-6-guonei-shiyong-2026-04-419-2' },
            { text: 'Claude 4.6 国内使用完整指南（2026年4月最新）', link: '/chatgpt/claude-4-6-guonei-shiyong-2026-04-419' },
            { text: 'Claude 4.6 国内使用完整指南（2026年最新）', link: '/chatgpt/claude-4-6-guonei-shiyong-2026-04' },
            { text: 'GPT-5.4 教程：功能详解、国内使用方法与最佳实践（2026年4月）', link: '/chatgpt/gpt-5-4-jiaocheng-2026-04' },
            { text: 'ChatGPT 官方服务中文指南国内使用超全指南（支持 GPT-4o / GPT-5.2）｜国内直接访…', link: '/chatgpt/gpt5-chatgpt-guide' },
            { text: 'ChatGPT网页版怎么打开？无需下载的在线使用方法', link: '/chatgpt/how-to-open-chatgpt-web-version-online-guide' },
            { text: 'ChatGPT中文教程怎么用？2026最新使用指南（新手必看）', link: '/chatgpt/how-to-use-chatgpt-chinese-version-beginner-guide-2026' },
            { text: '国内如何使用 ChatGPT：2026年新手保姆级教程 | ChatGPT中文教程', link: '/chatgpt/how-to-use-chatgpt' },
            { text: 'ChatGPT 国内怎么使用？（官网 + 第三方AI工具完整方案）', link: '/chatgpt/how-to-use-gpt' },
            { text: 'OpenAI ChatGPT国内中文教程使用指南（GPT-5.4，2026年4月最新）', link: '/chatgpt/openai-chatgpt-guonei-zhongwen-ban-shiyong-zhinan-2026' },
          ]
        },
      ],
      '/guides/': [
        {
          text: '使用指南',
          collapsed: false,
          items: [
            { text: '新手入门', link: '/guides/getting-started.html' },
            { text: '常见问题', link: '/guides/faq.html' }
          ]
        },
        {
          text: 'DeepSeek教程',
          collapsed: true,
          items: [
            { text: 'DeepSeek 中文教程', link: '/guides/deepseek/DeepSeek_Chinese.html' },
            { text: 'DeepSeek 中文官网', link: '/guides/deepseek/DeepSeek_guide.html' }
          ]
        },
        {
          text: 'OpenAI 开发',
          collapsed: true,
          items: [
            { text: 'ChatGPT 开发指南', link: '/guides/chatgpt-dev/index.html' },
            { text: 'OpenAI Platform 文档概览', link: '/guides/chatgpt-dev/openai-platform-overview.html' },
            { text: 'OpenAI API 开发指南', link: '/guides/chatgpt-dev/openai-api-guide.html' },
            { text: 'OpenAI API 快速入门', link: '/guides/chatgpt-dev/quickstart.html' },
            { text: '文本生成指南', link: '/guides/chatgpt-dev/text-generation.html' },
            { text: 'Prompt Engineering 指南', link: '/guides/chatgpt-dev/prompt-engineering.html' },
            { text: 'Assistants API 指南', link: '/guides/chatgpt-dev/assistants.html' },
            { text: 'Embeddings 嵌入指南', link: '/guides/chatgpt-dev/embeddings.html' },
            { text: 'Vision 视觉指南', link: '/guides/chatgpt-dev/vision.html' },
            { text: '图像生成指南', link: '/guides/chatgpt-dev/image-generation.html' },
            { text: '语音 (Speech) 指南', link: '/guides/chatgpt-dev/speech.html' },
            { text: '微调 (Fine-tuning) 指南', link: '/guides/chatgpt-dev/fine-tuning.html' }
          ]
        },
        {
          text: 'Gemini教程',
          collapsed: true,
          items: [
            { text: 'Google Gemini 中文使用指南', link: '/guides/gemini/index.html' },
            { text: '什么是 Google Gemini？', link: '/guides/gemini/what-is-gemini.html' },
            { text: 'Gemini 中文教程注册与使用', link: '/guides/gemini/gemini-usage.html' },
            { text: 'Gemini 3 vs GPT-5 对比', link: '/guides/gemini/gemini-vs-gpt5.html' },
            { text: 'Gemini API 申请指南', link: '/guides/gemini/gemini-api-guide.html' },
            { text: 'Gemini 3 Pro 国内使用', link: '/guides/gemini/gemini-3pro.html' },
            { text: 'Gemini 提示词工程指南', link: '/guides/gemini/gemini-prompt-guide.html' }
          ]
        },
        {
          text: '使用指南',
          collapsed: true,
          items: [
            { text: 'ChatGPT-5 正式上线，国内如何使用？（2026终极指南）', link: '/guides/chatgpt/2026-chatgpt-how-to-use' },
            { text: '用 ChatGPT 写周报的 5 个实用方法：告别内卷，一键生成老板爱看的工作汇报', link: '/guides/chatgpt/5-practical-ways-to-write-weekly-reports-with-chatgpt' },
            { text: 'Chat GPT 官网地址发布：GPT-5 中文教程国内注册与使用全攻略（含 Gemini/Cla…', link: '/guides/chatgpt/chat-gpt-official-address-gpt5-cn-register' },
            { text: 'ChatGPT 5.2 最新模型使用指南！国内可用 ChatGPT 中文教程使用指南推荐', link: '/guides/chatgpt/chatgpt-5-2-cn-guide-entry' },
            { text: 'ChatGPT 5.4 震撼发布！国内怎么用？GPT-5.4 官网注册与中文教程便捷访问保姆级教程', link: '/guides/chatgpt/chatgpt-5-4-release-and-china-usage-guide-2026' },
            { text: 'ChatGPT新手使用指南（2026最新）｜从零开始学习ChatGPT', link: '/guides/chatgpt/chatgpt-beginner-guide' },
            { text: '新手如何入门ChatGPT | ChatGPT中文教程', link: '/guides/chatgpt/chatgpt-beginner-start-guide-2026' },
            { text: 'ChatGPT 5.2 最新模型使用指南！国内可用 ChatGPT 中文教程使用指南推荐 (2026更新)', link: '/guides/chatgpt/chatgpt-china-5.2-guide' },
            { text: 'ChatGPT 中国国内使用方法：2026 官网访问、注册及使用详细步骤', link: '/guides/chatgpt/chatgpt-china-access-registration-usage-detailed-steps' },
            { text: 'ChatGPT 中文教程：免费使用指南与第三方AI工具推荐（支持 GPT5、GPT-4o、o1、o3、o…', link: '/guides/chatgpt/chatgpt-china-guide' },
            { text: '2026 ChatGPT 中国官方使用指南来了？最新 ChatGPT 中文教程使用指南 (官方同步)', link: '/guides/chatgpt/chatgpt-china-official-2026' },
            { text: 'ChatGPT 中国官网使用指南在哪里？2026 官方中文教程使用指南 (ChatGPT Offici…', link: '/guides/chatgpt/chatgpt-china-official' },
            { text: 'ChatGPT 中国版：免费使用指南与第三方AI工具推荐（持续更新，低门槛）', link: '/guides/chatgpt/chatgpt-china' },
            { text: 'ChatGPT 中文教程 5.2 使用指南：国内便捷访问与 OpenAI 官网注册全攻略', link: '/guides/chatgpt/chatgpt-chinese-5.2-guide' },
            { text: '2026最新ChatGPT中文教程国内使用指南：免费连接ChatGPT官网的5种方法（含GPT-4o）', link: '/guides/chatgpt/chatgpt-chinese-free-access-top5' },
            { text: 'ChatGPT 中文教程：免费使用指南与第三方AI工具推荐（支持 GPT-5.2, GPT-4o，低门槛）', link: '/guides/chatgpt/chatgpt-chinese-gpt5-complete-guide-2026' },
            { text: 'ChatGPT 中文指南：2026 年最新 ChatGPT 官网使用教程与国内便捷访问技巧', link: '/guides/chatgpt/chatgpt-chinese-guide-2026' },
            { text: 'ChatGPT 中文指南：2026最新ChatGPT官网使用教程与国内便捷访问技巧 (终极版)', link: '/guides/chatgpt/chatgpt-chinese-guide-ultimate-2026' },
            { text: 'ChatGPT 中文指南：2026最新ChatGPT官网使用教程与国内便捷访问技巧', link: '/guides/chatgpt/chatgpt-chinese-guide' },
            { text: 'ChatGPT 中文教程：免费使用指南与第三方AI工具推荐（支持 GPT-5，低门槛）【2026年1月…', link: '/guides/chatgpt/chatgpt-chinese' },
            { text: 'ChatGPT 中文教程国内使用指南与 GPT-5.2、GPT-5、GPT-4o 深度使用教程 (20…', link: '/guides/chatgpt/chatgpt-cn-entry-gpt-deep-guide' },
            { text: 'ChatGPT 中文教程国内使用指南与 GPT-4o 深度使用教程 (2026年最新)', link: '/guides/chatgpt/chatgpt-cn-entry-gpt4o-deep-guide' },
            { text: 'ChatGPT 国内使用指南：支持 GPT-5，免费使用 ChatGPT 中文教程~【1月更新】', link: '/guides/chatgpt/chatgpt-cn-free-guide-2026' },
            { text: 'ChatGPT 中文教程：GPT5 国内使用教程~（支持 GPT-5、GPT-4o）【1月更新】', link: '/guides/chatgpt/chatgpt-cn-gpt5-usage-guide-dec' },
            { text: 'ChatGPT中文教程使用指南：2026年最新ChatGPT官网使用指南与国内第三方AI工具推荐 (CN Gui…', link: '/guides/chatgpt/chatgpt-cn-guide' },
            { text: 'ChatGPT中文教程站 (CN Site)：2026年国内唯一推荐的便捷访问网址与第三方AI工具大全', link: '/guides/chatgpt/chatgpt-cn-site' },
            { text: 'ChatGPT 国内使用解决方案：2026年1月最新指南 (ChatGPT Domestic A…', link: '/guides/chatgpt/chatgpt-domestic-access-solutions-2026' },
            { text: 'ChatGPT 中文教程免费还是收费？2026年最新价格表与省钱技巧', link: '/guides/chatgpt/chatgpt-free-vs-plus-pricing-guide-2026' },
            { text: 'ChatGPT上线全新GPT5.2模型！国内ChatGPT官网使用指南及使用指南！(官方同步)', link: '/guides/chatgpt/chatgpt-gpt5-2-official-guide-cn' },
            { text: 'ChatGPT 新手入门指南：2026 从零开始的保姆级教程 (Beginners Guide)', link: '/guides/chatgpt/chatgpt-guide-for-beginners' },
            { text: 'ChatGPT 官网国内使用指南：2026 从注册到精通的保姆级教程 (ChatGPT Guide)', link: '/guides/chatgpt/chatgpt-guide' },
            { text: 'ChatGPT 第三方AI工具完全上手指南【2026年1月持续更新】', link: '/guides/chatgpt/chatgpt-mirrors-site' },
            { text: 'ChatGPT官方网址使用指南及国内使用GPT-5教程（2026官网登录使用指南）', link: '/guides/chatgpt/chatgpt-official-2026' },
            { text: 'ChatGPT官网使用指南：2026年国内使用ChatGPT中文教程与OpenAI官网注册教程（支持G…', link: '/guides/chatgpt/chatgpt-official-access-guide-2026' },
            { text: 'ChatGPT 官方国内使用指南及使用教程【完整指南】(2026 Official Access T…', link: '/guides/chatgpt/chatgpt-official-access-tutorial-complete-guide' },
            { text: '2026 ChatGPT 官网地址及国内使用指南：支持 GPT-4o 与 GPT-5 (Offi…', link: '/guides/chatgpt/chatgpt-official-address-cn-guide-2026' },
            { text: 'ChatGPT官方服务中文指南使用指南：国内便捷访问 GPT-5/GPT-4o 详细使用教程（2026最新版）', link: '/guides/chatgpt/chatgpt-official-cn-entry-gpt5-4o-guide' },
            { text: 'ChatGPT 官网使用指南与 GPT-5.2/Grok 3 聚合使用教程 (2026最新版)', link: '/guides/chatgpt/chatgpt-official-entry-gpt5-2-tutorial' },
            { text: 'ChatGPT Official Entry：OpenAI GPT-5.2 官方使用指南与双平台使用…', link: '/guides/chatgpt/chatgpt-official-entry-openai-gpt5-2-usage' },
            { text: 'ChatGPT Official Entry：2026年官网使用指南发布与国内"全能聚合版"推荐', link: '/guides/chatgpt/chatgpt-official-entry' },
            { text: 'ChatGPT 官网 GPT-4o 使用指南：国内便捷访问使用指南与多模态实战教程 (2026 官方版)', link: '/guides/chatgpt/chatgpt-official-gpt4o-guide' },
            { text: '2026 ChatGPT 官方 GPT-5.2 深度使用指南：解锁 System 2 慢思考与模…', link: '/guides/chatgpt/chatgpt-official-gpt5-2-usage-2026' },
            { text: '2026 ChatGPT 官方 GPT-5 深度用法与 AI 绘图/PPT 实战指南 (含 Mi…', link: '/guides/chatgpt/chatgpt-official-gpt5-usage-2026' },
            { text: '2026 ChatGPT 官方指南：GPT-5.2 System 2 深度用法与聚合平台实战', link: '/guides/chatgpt/chatgpt-official-guide-2026-gpt5.2' },
            { text: '2026 ChatGPT 官方指南：官方使用指南、GPT-5 深度用法与聚合平台推荐', link: '/guides/chatgpt/chatgpt-official-guide-2026' },
            { text: 'ChatGPT 官方指南：GPT-5.2 (System 2) 官方使用指南与国内无限制接入方案', link: '/guides/chatgpt/chatgpt-official-guide-gpt5-2-entry' },
            { text: 'ChatGPT 官网登录使用指南指南：国内便捷访问 ChatGPT 中文教程与账号注册全攻略 (2025)', link: '/guides/chatgpt/chatgpt-official-login-entry-guide-2026' },
            { text: 'ChatGPT 官网使用指南与国内使用指南 (2026年3月最新)', link: '/guides/chatgpt/chatgpt-official-website-and-domestic-guide-2026' },
            { text: 'ChatGPT官网进不去？2026最新 ChatGPT中文教程 便捷访问使用全攻略 (支持GPT-5.2)', link: '/guides/chatgpt/chatgpt-official-website-chinese-version-guide' },
            { text: 'ChatGPT官方网址使用指南 ｜ 国内GPT-5.4 使用教程（官网网址登录使用指南）', link: '/guides/chatgpt/chatgpt-official-website-entry-and-domestic-gpt5-4-tutorial' },
            { text: 'ChatGPT 官网链接 (2026 Official URL)：官方使用指南发布与国内"无广告"聚…', link: '/guides/chatgpt/chatgpt-official-website-url' },
            { text: 'ChatGPT Official Login：2026 官网登录使用指南指南与企业级 AI 聚合平台…', link: '/guides/chatgpt/chatgpt-official-website' },
            { text: 'ChatGPT 论文润色 Prompt 教程（2026最新）｜论文修改、降重与学术表达优化指南', link: '/guides/chatgpt/chatgpt-paper-polishing-prompts' },
            { text: 'ChatGPT Prompt 教程（2026最新）｜高质量提示词模板与实战示例', link: '/guides/chatgpt/chatgpt-prompt-guide' },
            { text: 'ChatGPT 2026 新手教程：从零开始的 AI 全能指南 (ChatGPT Tutorial)', link: '/guides/chatgpt/chatgpt-tutorial' },
            { text: 'ChatGPT怎么用？2026年办公实战指南：8个真实场景手把手教你用AI提效300%', link: '/guides/chatgpt/chatgpt-zenme-yong-bangong-shizhan-2026' },
            { text: 'ChatGPT 中文指南：2026 国内最佳 AI 使用方案 (Chinese Guide)', link: '/guides/chatgpt/chinese-guide' },
            { text: 'Claude 4.6 国内怎么用？2026年最强文字 AI 低门槛便捷访问教程', link: '/guides/chatgpt/claude-4-6-china-usage-guide-2026' },
            { text: 'DeepSeek V3 vs ChatGPT GPT-5.4：2026年深度对比，国内用哪个更好？', link: '/guides/chatgpt/deepseek-v3-vs-chatgpt-gpt5-which-is-better-2026' },
            { text: 'GPT-5.2 / Claude 4.5 国内深度评测与使用指南：第三方AI工具 vs GPT…', link: '/guides/chatgpt/gpt-5-2-china-usage-review-guide' },
            { text: 'GPT-5.2 功能深度解析：2026 年 System 2 推理架构与最佳实践', link: '/guides/chatgpt/gpt-5-2-features-deep-dive-2026' },
            { text: 'GPT-5.4 Thinking vs Gemini 3.1 Pro：哪个更适合复杂任务？', link: '/guides/chatgpt/gpt-5-4-thinking-vs-gemini-3-1-pro-complex-tasks' },
            { text: 'GPT-5 官方发布日期与功能概览 (Features 2026)', link: '/guides/chatgpt/gpt-5-official-release-date-features-2026' },
            { text: 'ChatGPT 中国版使用指南：2026 国内稳定使用 GPT-5/4o 的官方第三方AI工具方案', link: '/guides/chatgpt/gpt-chatgpt-china' },
            { text: 'GPT-5.2 官方指南：2026 深度推理模型详解与国内企业级接入', link: '/guides/chatgpt/gpt5-2-chatgpt-official-guide-2026' },
            { text: 'GPT-5 ChatGPT 官方指南：2026 年国内使用全攻略 (官方聚合版)', link: '/guides/chatgpt/gpt5-chatgpt-guide' },
            { text: 'OpenAI ChatGPT 官方指南：2026 国内接入 GPT-5 与企业级 API 使用全攻略', link: '/guides/chatgpt/openai-chatgpt-guide' },
            { text: 'OpenAI 第三方AI工具 ChatGPT 国内免费指南 (12月/1月更新)', link: '/guides/chatgpt/openai-mirror-chatgpt-cn-free-guide-dec' },
            { text: 'OpenAI Official Entry：ChatGPT 中文教程第三方AI工具评测与 2026 最佳技…', link: '/guides/chatgpt/openai-official-entry-chatgpt-mirror-2026' },
            { text: 'Prompt Tips：2026 提示词工程进阶指南 (从入门到精通)', link: '/guides/chatgpt/prompt-tips' },
            { text: 'ChatGPT国内使用指南：2026年最新ChatGPT官网注册与中文教程使用全教程', link: '/guides/chatgpt/use-chatgpt-china-method-2026' },
            { text: '在中国使用 ChatGPT 的最佳方法 (2026 实操教程)：告别封号与繁琐注册', link: '/guides/chatgpt/use-chatgpt-china-method' },
            { text: 'ChatGPT 是什么？2026 终极入门指南与国内最佳使用方案', link: '/guides/chatgpt/what-is-chatgpt' },
            { text: '全网爆火的"赛博养虾"到底是什么？Open Claw 与手机端 Agent 深度科普', link: '/guides/chatgpt/what-is-open-claw-and-mobile-ai-agent-explained' },
            { text: 'ChatGPT 适合哪些人？办公、写作、编程场景深度分析 (附2026多模型协同流)', link: '/guides/chatgpt/who-needs-chatgpt-office-writing-coding-scenarios' },
          ]
        }
      ],
      '/blog/': [
        {
          text: '使用指南',
          collapsed: false,
          items: [
            { text: '新手入门', link: '/blog/guides/getting-started.html' },
            { text: '常见问题', link: '/blog/guides/faq.html' }
          ]
        },
        {
          text: 'ChatGPT 官网与基础',
          collapsed: false,
          items: [
            { text: 'ChatGPT官网使用指南与登录注册全教程', link: '/blog/chatgpt.html' },
            { text: 'ChatGPT官方网址使用指南', link: '/blog/chatgpt-official.html' },
            { text: 'ChatGPT官方网址登录指南', link: '/blog/chatgpt-official-guide.html' },
            { text: '2025 AI展望：ChatGPT与大模型未来', link: '/blog/future-of-llm-2025.html' },
          ]
        },
        {
          text: '模型资讯与评测',
          collapsed: false,
          items: [
            { text: 'ChatGPT 5.4 发布与使用教程', link: '/blog/chatgpt-cn/chatgpt-5-4-release-and-china-usage-guide-2026.html' },
            { text: 'GPT-5.4 Thinking 是什么？', link: '/blog/chatgpt-cn/what-is-gpt-5-4-thinking-model-introduction-2026.html' },
            { text: 'GPT-5.4 Thinking vs Gemini 3.1 Pro', link: '/blog/chatgpt-cn/gpt-5-4-thinking-vs-gemini-3-1-pro-complex-tasks.html' },
            { text: '2026旗舰AI全横评', link: '/blog/chatgpt-cn/gpt-5-4-claude-4-6-gemini-3-1-pro-grok-4-2-china-guide-2026.html' },
            { text: 'GPT-5.3 vs Claude vs Gemini', link: '/blog/chatgpt-cn/gpt5-3-vs-claude4-6-vs-gemini3-1-pro-china-guide.html' },
            { text: 'DeepSeek V3 vs ChatGPT', link: '/blog/chatgpt-cn/deepseek-v3-vs-chatgpt-gpt5-which-is-better-2026.html' },
            { text: 'ChatGPT免费版 vs Plus', link: '/blog/chatgpt-cn/chatgpt-free-vs-plus-difference-feature-comparison.html' },
            { text: 'ChatGPT适合哪些人？', link: '/blog/chatgpt-cn/who-needs-chatgpt-office-writing-coding-scenarios.html' },
            { text: '赛博养虾/Open Claw 科普', link: '/blog/chatgpt-cn/what-is-open-claw-and-mobile-ai-agent-explained.html' },
            { text: 'GPT Image 1.5 全攻略', link: '/blog/chatgpt-cn/chatgpt-chinese-gpt-image-1-5-guide.html' },
            { text: 'GPT Image 1.5 发布', link: '/blog/chatgpt-cn/chatgpt-official-gpt-image-1-5-release.html' },
          ]
        },
        {
          text: '实用技巧',
          collapsed: false,
          items: [
            { text: 'ChatGPT写作技巧：10个Prompt模板', link: '/blog/chatgpt-cn/chatgpt-writing-skills-prompt-templates-2026.html' },
            { text: 'ChatGPT办公实战：8个场景', link: '/blog/chatgpt-cn/chatgpt-zenme-yong-bangong-shizhan-2026.html' },
            { text: 'ChatGPT写周报5个方法', link: '/blog/chatgpt-cn/5-practical-ways-to-write-weekly-reports-with-chatgpt.html' },
            { text: 'ChatGPT Prompt教程', link: '/blog/chatgpt-cn/chatgpt-prompt-guide.html' },
            { text: '论文润色Prompt教程', link: '/blog/chatgpt-cn/chatgpt-paper-polishing-prompts.html' },
            { text: '程序员如何用ChatGPT提效', link: '/blog/chatgpt-coding-assistant.html' },
            { text: '提示词工程进阶指南', link: '/blog/chatgpt-prompt-engineering-guide.html' },
          ]
        },
        {
          text: 'AI写作专栏',
          collapsed: true,
          items: [
            { text: '写作基础教程', link: '/blog/writing/basics.html' },
            { text: '小红书写作', link: '/blog/writing/xiaohongshu.html' },
            { text: '论文写作', link: '/blog/writing/academic.html' },
          ]
        },
        {
          text: '博客',
          collapsed: true,
          items: [
            { text: 'ChatGPT官网使用指南_ChatGPT官方登录网址与注册使用全教程', link: '/blog/chatgpt-cn/2025-chatgpt-official' },
            { text: 'ChatGPT官网：GPT-5 正式上线，国内如何使用？（2026终极指南）', link: '/blog/chatgpt-cn/2026-gpt5-how-to-use' },
            { text: 'ChatGPT 5.2 国内如何使用？ChatGPT官方服务中文指南使用指南与功能评测', link: '/blog/chatgpt-cn/chatgpt-5-2-guide-2025' },
            { text: 'ChatGPT国内使用教程：2026年最新官网使用指南与访问方法完整指南', link: '/blog/chatgpt-cn/chatgpt-china-access-guide-2026' },
            { text: 'ChatGPT 中文教程：官网使用指南与国内使用指南（支持 GPT-5 / GPT-4o）', link: '/blog/chatgpt-cn/chatgpt-chinese-official-entry-and-gpt5-gpt4o-guide' },
            { text: 'ChatGPT 中文教程使用网站推荐与详细教程 (2026最新)', link: '/blog/chatgpt-cn/chatgpt-chinese-usage-websites' },
            { text: 'ChatGPT 中国国内使用方法：访问、注册及使用详细步骤指南(2026最新)', link: '/blog/chatgpt-cn/chatgpt-cn-register' },
            { text: 'ChatGPT 免费使用指南：GPT-5 新手快速入门教程【2026年3月更新】', link: '/blog/chatgpt-cn/chatgpt-free-usage-and-gpt5-beginner-guide-2026' },
            { text: 'ChatGPT上线全新GPT5.2模型！国内ChatGPT官网使用指南及使用指南！', link: '/blog/chatgpt-cn/chatgpt-gpt5-2-official-guide-cn' },
            { text: 'ChatGPT官网使用指南 2026：新手从零入门，国内低门槛便捷访问GPT-5.4完整攻略', link: '/blog/chatgpt-cn/chatgpt-guanwang-roukou-xinshourumen-2026' },
            { text: 'ChatGPT 官网使用指南网页版直达链接与登录方法 (2026最新)', link: '/blog/chatgpt-cn/chatgpt-guide' },
            { text: 'ChatGPT官网使用指南（官方登录&中文教程）- 2026最新可用指南', link: '/blog/chatgpt-cn/chatgpt-official-web-entry' },
            { text: 'ChatGPT 中文教程免费：国内使用指南（支持 GPT-5、GPT-4o，低门槛）', link: '/blog/chatgpt-cn/chatgpt' },
            { text: 'ChatGPT 5.2 官网发布？GPT-5.2 模型参数与性能深度解析 (2026最新)', link: '/blog/chatgpt-cn/gpt5-2-official-parameters-2025' },
            { text: 'GPT-5.2 vs Gemini 3：谁是2025年最强AI模型？参数与实测深度对比', link: '/blog/chatgpt-cn/gpt5-2-vs-gemini-3' },
            { text: 'OpenAI官网发布GPT-5最新消息？ChatGPT中文教程使用指南与国内使用指南', link: '/blog/chatgpt-cn/gpt5-official-news-2025' },
            { text: 'ChatGPT 中文教程怎么使用？2026 最新GPT-5.4国内使用指南', link: '/blog/chatgpt-cn/how-to-use-chatgpt-chinese-version-gpt-5-4-guide-2026' },
            { text: 'GPT-5 发布：OpenAI ChatGPT 国内使用教程、官网使用指南及 GPT-5.1 注册攻略', link: '/blog/chatgpt-cn/openai-gpt5-2025' },
          ]
        }
      ]
    },

    footer: {
      message: '免责声明：本站是独立中文AI教程与工具评测网站，与 OpenAI、Anthropic、Google、xAI 等官方机构无隶属或代理关系。',
      copyright: 'Copyright © 2025-2026 ChatGPT使用指南'
    },

    ...recoveryThemeOverrides
  }
})
