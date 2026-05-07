import { defineConfig } from 'vitepress'

export default defineConfig({
  // 1. 网站元数据
  title: "ChatGPT教程 | ChatGPT中文版使用指南 | ChatGPT官网入门攻略",
  description: "最全面的ChatGPT中文使用教程与评测中心。提供ChatGPT官网入门指南、中文版平台排名、GPT-5.4模型对比、镜像站避坑攻略，2026年持续更新。",
  lang: 'zh-CN',
  
  // 2. 关键 SEO 配置 (你漏掉的部分)
  // 自动生成 sitemap，Bing 爬虫全靠它来抓取你的页面
  sitemap: {
    hostname: 'https://www.chatgpt-chinese-guide.com',
    transformItems: (items) => {
      return items.map(item => ({
        ...item,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      }))
    }
  },
  // 显示最后更新时间，搜索引擎喜欢新鲜内容
  lastUpdated: true,

  // 3. Head 配置
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'msvalidate.01', content: '283F4ED132291BB65C882E27214A15B8' }],
    // SEO 关键词
    ['meta', { name: 'keywords', content: 'ChatGPT,ChatGPT中文版,ChatGPT教程,ChatGPT官网,ChatGPT使用指南,ChatGPT镜像网站,GPT-5.4,OpenAI,AI使用教程' }],
    ['meta', { name: 'author', content: 'ChatGPT使用指南' }],
    ['meta', { name: 'robots', content: 'index,follow' }],
    ['meta', { property: 'og:title', content: 'ChatGPT教程 | ChatGPT中文版使用指南 | ChatGPT官网入门攻略' }],
    ['meta', { property: 'og:description', content: '最全面的ChatGPT中文使用教程与评测中心。ChatGPT官网入门指南、中文版平台排名、GPT-5.4模型对比。' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://www.chatgpt-chinese-guide.com' }],
    ['meta', { property: 'og:image', content: 'https://www.chatgpt-chinese-guide.com/og-image.png' }],
    ['link', { rel: 'canonical', href: 'https://www.chatgpt-chinese-guide.com' }],
    [
      'script',
      { type: 'application/ld+json' },
      `{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ChatGPT使用指南",
        "url": "https://www.chatgpt-chinese-guide.com",
        "description": "ChatGPT中文版使用教程与评测中心，提供入门指南、模型对比、镜像站评测等独立客观内容",
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
              "text": "ChatGPT新手建议从镜像站开始体验，无需翻墙和海外手机号。先熟悉基础对话功能，再尝试GPT-5.4的深度思考模式。本站提供完整的新手入门教程和使用技巧。"
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
              "text": "各有所长：GPT-5.4推理能力最强，适合复杂分析；Claude 4.6中文写作和长文处理表现优秀；Gemini 3.5 Pro多模态能力突出。建议根据使用场景选择，也可使用支持多模型的镜像站灵活切换。"
            }
          },
          {
            "@type": "Question",
            "name": "ChatGPT Plus值得订阅吗？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ChatGPT Plus每月20美元，提供GPT-5.4完整权限。如果预算有限，国内镜像站提供更灵活的按量付费方案，价格通常低于官方订阅，且无需国外信用卡。"
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
    // 移动端优化 (推荐加上)
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
  ],

  // 4. 死链检查 (建议先设为 true，等文章都写好了再去掉，不然报错很烦)
  ignoreDeadLinks: true,

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
      { text: '🔌 API调用', link: 'https://www.zeoapi.com/register?aff=Pe3N' },
    ],

    // 2. 侧边栏
    sidebar: {
      '/chatgpt/': [
        {
          text: '入门教程',
          collapsed: false,
          items: [
            { text: 'ChatGPT使用教程完整版【2026年05月最新】从注册到精通的保姆级指南', link: '/chatgpt/auto-article-1778165145818' },
            { text: '什么是ChatGPT？', link: '/chatgpt/what-is-chatgpt' },
            { text: 'ChatGPT怎么用？完整使用教程', link: '/chatgpt/chatgpt-how-to-use-complete-guide-2026-05' },
            { text: 'ChatGPT中文版完整教程', link: '/chatgpt/chatgpt-chinese-complete-tutorial-register-to-master-april-2026' },
            { text: 'ChatGPT注册教程2026', link: '/chatgpt/chatgpt-zhuce-jiaocheng-2026-04' },
            { text: 'ChatGPT官网入口2026', link: '/chatgpt/chatgpt-guanwang-rukou-guonei-zhuce-mianfei-2026' },
            { text: 'ChatGPT官方网址入口', link: '/chatgpt/chatgpt-official' },
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
            { text: 'Grok官网入口与使用指南', link: '/chatgpt/grok-guanwang-rukou-guonei-shiyong-zhinan-2026' },
            { text: 'ChatGPT vs Claude 深度对比', link: '/chatgpt/chatgpt-vs-claude' },
          ]
        },
        {
          text: '平台推荐',
          collapsed: false,
          items: [
            { text: 'ChatGPT镜像站实测推荐', link: '/chatgpt/chatgpt-jingxiang-wangzhan-shice-tuijian-bipkeng-2026' },
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
            { text: 'DeepSeek 中文版', link: '/guides/deepseek/DeepSeek_Chinese.html' },
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
            { text: 'Gemini 中文版注册与使用', link: '/guides/gemini/gemini-usage.html' },
            { text: 'Gemini 3 vs GPT-5 对比', link: '/guides/gemini/gemini-vs-gpt5.html' },
            { text: 'Gemini API 申请指南', link: '/guides/gemini/gemini-api-guide.html' },
            { text: 'Gemini 3 Pro 国内使用', link: '/guides/gemini/gemini-3pro.html' },
            { text: 'Gemini 提示词工程指南', link: '/guides/gemini/gemini-prompt-guide.html' }
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
        }
      ]
    },

    footer: {
      message: 'Powered by ChatGPT中文版',
      copyright: 'Copyright © 2025-2026 ChatGPT中文版'
    },

    search: {
      provider: 'local'
    }
  }
})
