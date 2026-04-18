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
    ],

    // 2. 侧边栏 (基于你提供的源码提供的真·全量数据)
    sidebar: {
      // --- ChatGPT介绍板块 ---
      '/chatgpt/': [
        {
          text: 'ChatGPT介绍',
          collapsed: false,
          items: [
            { text: 'ChatGPT 官网中文版：GPT-5.4 国内使用完全攻略（2026年4月）', link: '/chatgpt/chatgpt-gpt5-guanwang-wanzheng-gonglue-2026' },
            { text: 'ChatGPT官网入口 2026——国内直接访问完整指南（无需翻墙）', link: '/chatgpt/chatgpt-guanwang-rukou-2026-april-418' },
            { text: 'ChatGPT注册教程2026：官网注册+国内镜像完整指南（无需翻墙）', link: '/chatgpt/chatgpt-zhuce-jiaocheng-2026-04-418' },
            { text: 'Claude 4.6 国内使用完整指南（2026年最新）', link: '/chatgpt/claude-4-6-guonei-shiyong-2026-04' },
            { text: 'OpenAI ChatGPT国内中文版使用指南（GPT-5.4，2026年4月最新）', link: '/chatgpt/openai-chatgpt-guonei-zhongwen-ban-shiyong-zhinan-2026' },
            { text: 'ChatGPT官网入口 2026 | 国内访问完整指南（含GPT-5.4最新模型）', link: '/chatgpt/chatgpt-guanwang-rukou-2026-april' },
            { text: 'Claude Opus 4.7正式发布！2026年4月最新升级内容全解析（附国内使用方法）', link: '/chatgpt/claude-opus-47-release-upgrade-guide-april-2026' },
            { text: 'ChatGPT注册教程2026：国内用户完整注册与使用指南', link: '/chatgpt/chatgpt-zhuce-jiaocheng-2026-04' },
            { text: 'ChatGPT国内能用吗？2026年4月亲测6种访问方法（免费+付费全覆盖）', link: '/chatgpt/chatgpt-guonei-neng-yong-ma-6zhong-fangfa-shice-2026.html' },
            { text: 'AI论文写作指南2026：用ChatGPT和Claude写论文的正确方法（附降重+润色Prompt）', link: '/chatgpt/ai-lunwen-xiezuo-chatgpt-claude-jiangchong-runse-2026.html' },
            { text: 'ChatGPT替代品有哪些？2026年4月国内可用的5个AI工具深度评测', link: '/chatgpt/chatgpt-tidaipin-guonei-keyong-ai-gongju-pingce-2026.html' },
            { text: 'AI编程工具实测2026：用ChatGPT/Claude/DeepSeek写代码，谁是程序员最佳搭档？', link: '/chatgpt/ai-biancheng-gongju-shice-gpt-claude-deepseek-2026.html' },
            { text: 'ChatGPT注册教程2026：国内无需翻墙，3分钟搞定中文版账号（4月实测可用）', link: '/chatgpt/chatgpt-zhuce-guonei-wuxu-fanqiang-2026-4.html' },
            { text: 'Gemini 3.1 Pro国内怎么用？2026年4月最新Google Gemini中文版使用教程（免翻墙）', link: '/chatgpt/gemini-3-1-pro-guonei-zenme-yong-zhongwen-ban-jiaocheng-2026.html' },
            { text: 'Grok官网入口：国内Grok使用保姆级指南（2026年最新）', link: '/chatgpt/grok-guanwang-rukou-guonei-shiyong-zhinan-2026.html' },
            { text: 'ChatGPT官网入口｜2026年4月国内ChatGPT中文版使用指南（免翻墙直达GPT-5.4）', link: '/chatgpt/chatgpt-guanwang-rukou-guonei-zhongwen-ban-shiyong-zhinan-2026.html' },
            { text: 'GPT-5.4国内怎么用？2026年4月最新GPT-5.4中文版使用教程', link: '/chatgpt/gpt-5-4-guonei-zenme-yong-zhongwen-ban-jiaocheng-2026.html' },
            { text: 'ChatGPT网页版在线使用指南：2026年4月国内免翻墙直接对话GPT-5.4', link: '/chatgpt/chatgpt-wangyeban-zaixian-shiyong-zhinan-2026.html' },
            { text: 'ChatGPT官网打不开怎么办？2026年4月国内替代方案与解决办法', link: '/chatgpt/chatgpt-guanwang-dabukao-guonei-tidai-jiejue-2026.html' },
            { text: 'ChatGPT镜像网站哪个好？2026年4月实测稳定平台推荐与避坑指南', link: '/chatgpt/chatgpt-jingxiang-wangzhan-shice-tuijian-bipkeng-2026.html' },
            { text: 'ChatGPT中文版免费体验完整攻略：2026年4月国内直连GPT-5.4无需翻墙', link: '/chatgpt/chatgpt-zhongwen-ban-mianfei-tiyan-wanzheng-gonglue-2026.html' },
            { text: '2026年国内AI工具推荐排行榜：ChatGPT/DeepSeek/Gemini/Grok/Claude五大模型横评', link: '/chatgpt/chatgpt-ai-tools-ranking-five-models-comparison-april-2026.html' },
            { text: 'ChatGPT中文版怎么用？2026年4月最新完整教程：从注册到精通GPT-5.4只需10分钟', link: '/chatgpt/chatgpt-chinese-complete-tutorial-register-to-master-april-2026.html' },
            { text: 'ChatGPT中文版哪个好用？2026年3月国内5大AI平台实测排名（含GPT-5.4真实体验）', link: '/chatgpt/chatgpt-zhongwen-ban-nage-haoyong-5da-pingtai-shice-paiming-2026.html' },
            { text: 'ChatGPT官网入口在哪？2026年国内注册使用全流程（免翻墙+免费体验GPT-5.4）', link: '/chatgpt/chatgpt-guanwang-rukou-guonei-zhuce-mianfei-2026.html' },
            { text: 'ChatGPT 中文版：国内免费使用指南', link: '/chatgpt/chatgpt-chinese-gpt.html' },
            { text: 'ChatGPT打不开怎么办？2026年常见问题与解决方法', link: '/chatgpt/chatgpt-not-working-fix-guide.html' },
            { text: 'ChatGPT中文版怎么用？2026最新使用指南（新手必看）', link: '/chatgpt/how-to-use-chatgpt-chinese-version-beginner-guide-2026.html' },
            { text: 'ChatGPT网页版登录与下载防坑指南：2026国内镜像网站与最新版本全解析', link: '/chatgpt/chatgpt-web-version-vs-download-anti-scam-guide-2026.html' },
            { text: 'ChatGPT网页版怎么打开？无需下载的在线使用方法', link: '/chatgpt/how-to-open-chatgpt-web-version-online-guide.html' },
            { text: 'ChatGPT镜像网站有哪些？2026稳定可用平台推荐与避坑指南', link: '/chatgpt/chatgpt-mirror-sites-recommendation-and-anti-scam-guide-2026.html' },
            { text: 'ChatGPT AI能做什么？写作、翻译、编程和办公场景全解析', link: '/chatgpt/what-can-chatgpt-ai-do-use-cases-guide.html' },
            { text: '2026最新 ChatGPT中文版使用指南（国内免费使用 GPT-4o / GPT-5）', link: '/chatgpt/china-guide.html' },


            
            { text: '国内免费使用 GPT 最新指南', link: '/chatgpt/chatgpt-chinese-guide.html' },
            { text: '国内如何使用 ChatGPT？', link: '/chatgpt/chatgpt-guide.html' },
            { text: 'ChatGPT 常见问题解决方案', link: '/chatgpt/chatgpt-faq-solutions.html' },
            { text: 'ChatGPT 免费使用全攻略', link: '/chatgpt/chatgpt-free-guide.html' },
            { text: 'ChatGPT 怎么用？新手教学', link: '/chatgpt/what-is-chatgpt.html' },
            { text: 'ChatGPT vs Claude 深度对比', link: '/chatgpt/chatgpt-vs-claude.html' },
            { text: '国内如何使用 ChatGPT', link: '/chatgpt/how-to-use-chatgpt.html' },
            { text: 'ChatGPT 官网中文版国内使用指南（支持GPT-5 & GPT-4o）【2025年10月持续更新】', link: '/chatgpt/chatgpt-official-website.html' },
            { text: 'ChatGPT 官网 中文版国内使用超全指南', link: '/chatgpt/gpt5-chatgpt-guide.html' },
            { text: 'ChatGPT 新手入门指南', link: '/chatgpt/chatgpt-guide-for-beginners.html' },
            { text: 'ChatGPT官方网址入口及国内使用GPT-5教程', link: '/chatgpt/chatgpt-official-2025.html' },
            { text: 'ChatGPT官方网址入口（官网网址登录入口）- ChatGPT中文版', link: '/chatgpt/chatgpt-chinese-official.html' },
            { text: 'ChatGPT官网入口及ChatGPT中文版国内使用教程(2025最新)', link: '/chatgpt/chatgpt-official-entry.html' },
            { text: 'ChatGPT官方网址入口', link: '/chatgpt/chatgpt-official.html' },
            { text: 'ChatGPT官方网址入口指南', link: '/chatgpt/chatgpt-official-guide.html' },
            { text: 'ChatGPT中文版国内直连推荐', link: '/chatgpt/chatgpt-chinese-access-recommendation.html' },
            { text: 'ChatGPT国内如何使用', link: '/chatgpt/how-to-use-gpt.html' },
            { text: 'ChatGPT中文版', link: '/chatgpt/chatgpt-chinese.html' },
            { text: 'ChatGPT 中文版国内直连指南：无需翻墙，免费体验 GPT-5.1 与 Claude 4.5 (2026最新版)', link: '/chatgpt/chatgpt-china-mirror-guide-2026.md' },
            { text: 'ChatGPT 中文版：2026年免费使用指南与镜像网站推荐（支持 GPT5、GPT-4o，无需翻墙）', link: '/chatgpt/chatgpt-china-guide-2026.html' },
            { text: 'ChatGPT 与 ChatGPT中文版：2026 官方最新介绍与国内使用终极指南 (支持GPT-5.2)', link: '/chatgpt/chatgpt-ultimate-guide-2026.html' },
            { text: 'ChatGPT 国内中文版使用指南，支持GPT-5.2，GPT-5', link: '/chatgpt/chatgpt-5.2-chinese.html' },
            { text: '2026年3月重磅更新！ChatGPT中文版首发支持 GPT-5.3、Gemini 3.1 Pro 与 Claude 4.6', link: '/chatgpt/chatgpt-cn-gpt5-3-gemini-3-1-pro-update-2026.html' },
            { text: '2025最新ChatGPT镜像网站与聚合站大全', link: '/chatgpt/chatgpt-mirror-sites-collection.html' },
            { text: 'ChatGPT手机怎么用？2026年国内安卓+苹果完整使用教程（免翻墙）', link: '/chatgpt/chatgpt-mobile-guide-android-ios.html' }
          ]
        }
      ],

      // --- 使用指南板块 (巨量数据) ---
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
          text: 'ChatGPT教程',
          collapsed: true,
          items: [
            { text: 'ChatGPT怎么用？2026年办公实战指南：8个真实场景手把手教你用AI提效300%', link: '/guides/chatgpt/chatgpt-zenme-yong-bangong-shizhan-2026.html' },
	    { text: 'Claude 4.6 国内怎么用？2026年最强文字 AI 免翻墙直连教程', link: '/guides/chatgpt/claude-4-6-china-usage-guide-2026.html' },
            { text: '新手如何入门 ChatGPT | ChatGPT中文版完整指南（2026最新）', link: '/guides/chatgpt/chatgpt-beginner-start-guide-2026.html' },
            { text: 'ChatGPT 5.4 震撼发布！国内怎么用？GPT-5.4 官网注册与中文版直连保姆级教程', link: '/guides/chatgpt/chatgpt-5-4-release-and-china-usage-guide-2026.html' },
            { text: '用 ChatGPT 写周报的 5 个实用方法：告别内卷，一键生成老板爱看的工作汇报', link: '/guides/chatgpt/5-practical-ways-to-write-weekly-reports-with-chatgpt.html' },
            { text: 'GPT-5.4 Thinking vs Gemini 3.1 Pro：哪个更适合复杂任务？', link: '/guides/chatgpt/gpt-5-4-thinking-vs-gemini-3-1-pro-complex-tasks.html' },
            { text: 'DeepSeek V3 vs ChatGPT GPT-5.4：2026年深度对比，国内用哪个更好？', link: '/guides/chatgpt/deepseek-v3-vs-chatgpt-gpt5-which-is-better-2026.html' },
            { text: 'ChatGPT 适合哪些人？办公、写作、编程场景分析', link: '/guides/chatgpt/who-needs-chatgpt-office-writing-coding-scenarios.html' },
            { text: '全网爆火的“赛博养虾”到底是什么？Open Claw 与手机端 Agent 深度科普', link: '/guides/chatgpt/what-is-open-claw-and-mobile-ai-agent-explained.html' },
            { text: 'ChatGPT 官网入口与国内使用指南 (2026年3月最新)', link: '/guides/chatgpt/chatgpt-official-website-and-domestic-guide-2026.html' },
            { text: 'ChatGPT新手使用指南（2026最新）｜从零开始学习ChatGPT', link: '/guides/chatgpt/chatgpt-beginner-guide.html' },
            { text: 'ChatGPT Prompt 教程（2026最新）｜高质量提示词模板与实战示例', link: '/guides/chatgpt/chatgpt-prompt-guide.html' },
            { text: 'ChatGPT 论文润色 Prompt 教程（2026最新）｜论文修改、降重与学术表达优化指南', link: '/guides/chatgpt/chatgpt-paper-polishing-prompts.html' },
            { text: 'ChatGPT官方网址入口 ｜ 国内GPT-5.4 使用教程（官网网址登录入口）', link: '/guides/chatgpt/chatgpt-official-website-entry-and-domestic-gpt5-4-tutorial.html' },



            
            { text: 'ChatGPT-5 正式上线，国内如何使用？（2026终极指南）', link: '/guides/chatgpt/2026-chatgpt-how-to-use.html' },
            { text: 'ChatGPT国内使用指南：2026年最新ChatGPT官网注册与中文版使用全教程', link: '/guides/chatgpt/use-chatgpt-china-method-2026.html' },
            { text: 'ChatGPT 中文版：免费使用指南与镜像网站推荐', link: '/guides/chatgpt/chatgpt-china-guide.html' },
            { text: 'ChatGPT 官网登录入口指南：国内直连 ChatGPT 中文版', link: '/guides/chatgpt/chatgpt-official-login-entry-guide-2026.html' },
            { text: 'ChatGPT 中文版免费还是收费？2025年价格表', link: '/guides/chatgpt/chatgpt-free-vs-plus-pricing-guide-2026.html' },
            { text: 'GPT-5 震撼发布？OpenAI 官网最新消息', link: '/guides/chatgpt/gpt-5-official-release-date-features-2026.html' },
            { text: 'ChatGPT 中文版：GPT5 国内使用教程~【12月更新】', link: '/guides/chatgpt/chatgpt-cn-gpt5-usage-guide-dec.html' },
            { text: 'ChatGPT官网中文版入口：国内直连 GPT-5/GPT-4o 详细使用教程', link: '/guides/chatgpt/chatgpt-official-cn-entry-gpt5-4o-guide.html' },
            { text: 'OpenAI官网国内镜像：ChatGPT 中文版免费使用指南', link: '/guides/chatgpt/openai-mirror-chatgpt-cn-free-guide-dec.html' },
            { text: 'Chat GPT 官网地址发布：GPT-5 中文版国内注册全攻略', link: '/guides/chatgpt/chat-gpt-official-address-gpt5-cn-register.html' },
            { text: 'ChatGPT中国国内使用方法：2025年注册与使用详细步骤', link: '/guides/chatgpt/use-chatgpt-china-method.html' },
            { text: 'ChatGPT 5.2 最新模型使用指南！国内可用入口推荐', link: '/guides/chatgpt/chatgpt-5-2-cn-guide-entry.html' },
            { text: '2025 ChatGPT 官网地址及国内使用指南', link: '/guides/chatgpt/chatgpt-china-official-2026.html' },
            { text: 'ChatGPT中国国内使用方法 – 访问、注册及使用详细步骤', link: '/guides/chatgpt/chatgpt-china-access-registration-usage-detailed-steps.html' },
            { text: 'ChatGPT中文版使用指南：2025年最新入口与镜像推荐', link: '/guides/chatgpt/chatgpt-cn-guide.html' },
            { text: 'ChatGPT 官方国内入口及使用教程【完整指南】', link: '/guides/chatgpt/chatgpt-official-access-tutorial-complete-guide.html' },
            { text: 'ChatGPT 官网国内入口及 GPT-5.2 使用教程', link: '/guides/chatgpt/chatgpt-official-entry-gpt5-2-tutorial.html' },
            { text: '2025 ChatGPT 官网地址及国内使用指南：支持 GPT-4o 与 GPT-5', link: '/guides/chatgpt/chatgpt-official-address-cn-guide-2026.html' },
            { text: 'ChatGPT 中文版国内入口与 GPT-4o 深度使用教程', link: '/guides/chatgpt/chatgpt-cn-entry-gpt4o-deep-guide.html' },
            { text: 'OpenAI 官网入口与 ChatGPT 国内镜像站推荐 2025', link: '/guides/chatgpt/openai-official-entry-chatgpt-mirror-2026.html' },
            { text: 'ChatGPT官网入口：2025年国内使用教程（支持GPT-5）', link: '/guides/chatgpt/chatgpt-official-access-guide-2026.html' },
            { text: '2025最新ChatGPT中文版国内使用指南：免费连接的5种方法', link: '/guides/chatgpt/chatgpt-chinese-free-access-top5.html' },
            { text: 'GPT 5.2 已上线！国内可用 ChatGPT 官网中文版使用指南【2025年更新】', link: '/guides/chatgpt/gpt5-2-chatgpt-official-guide-2026.html' },
            { text: 'ChatGPT 官网：GPT-5 国内使用教程【2025年12月更新】', link: '/guides/chatgpt/chatgpt-official-gpt5-usage-2026.html' },
            { text: 'ChatGPT 国内使用指南：免费使用 ChatGPT 中文版~【12月更新】', link: '/guides/chatgpt/chatgpt-cn-free-guide-2026.html' },
            { text: 'ChatGPT官网入口：国内如何使用GPT-4o及全攻略', link: '/guides/chatgpt/chatgpt-official-gpt4o-guide.html' },
            { text: 'ChatGPT中文版国内使用指南', link: '/guides/chatgpt/chatgpt-chinese-guide.html' },
            { text: 'ChatGPT 官网国内使用指南', link: '/guides/chatgpt/chatgpt-guide.html' },
            { text: 'ChatGPT 官网中文版使用指南', link: '/guides/chatgpt/chatgpt-official-website-url.html' },
            { text: 'Chat GPT 中文版免费使用指南', link: '/guides/chatgpt/chatgpt-chinese.html' },
            { text: 'ChatGPT 怎么用？新手教学', link: '/guides/chatgpt/what-is-chatgpt.html' },
            { text: 'GPT 国内使用指南', link: '/guides/chatgpt/gpt-chatgpt-china.html' },
            { text: 'OpenAI ChatGPT 国内使用指南', link: '/guides/chatgpt/openai-chatgpt-guide.html' },
            { text: '提示词技巧', link: '/guides/chatgpt/prompt-tips.html' },
            { text: 'ChatGPT中文版官网', link: '/guides/chatgpt/chatgpt-cn-site.html' },
            { text: 'ChatGPT 官网中文版国内使用指南【2025年10月持续更新】', link: '/guides/chatgpt/chatgpt-official-website.html' },
            { text: 'ChatGPT 官网 中文版国内使用超全指南', link: '/guides/chatgpt/gpt5-chatgpt-guide.html' },
            { text: 'ChatGPT 新手入门指南', link: '/guides/chatgpt/chatgpt-guide-for-beginners.html' },
            { text: 'ChatGPT官方网址入口及国内使用GPT-5教程', link: '/guides/chatgpt/chatgpt-official-2026.html' },
            { text: 'ChatGPT官方网址入口及国内使用GPT-5教程', link: '/guides/chatgpt/chatgpt-china-official.html' },
            { text: 'ChatGPT官网入口及ChatGPT中文版国内使用教程(2025最新)', link: '/guides/chatgpt/chatgpt-official-entry.html' },
            { text: 'GPT 5.2 已上线！国内可用 ChatGPT 官网中文版使用指南', link: '/guides/chatgpt/chatgpt-official-guide-2026.html' },
            { text: 'ChatGPT 官网入口：OpenAI GPT-5.2 国内使用教程', link: '/guides/chatgpt/chatgpt-official-entry-openai-gpt5-2-usage.html' },
            { text: 'ChatGPT上线全新GPT5.2模型！国内使用指南！', link: '/guides/chatgpt/chatgpt-gpt5-2-official-guide-cn.html' },
            { text: 'GPT 5.2 已上线！国内可用使用指南【2026年1月发布】', link: '/guides/chatgpt/chatgpt-official-guide-2026.html' },
            { text: 'ChatGPT 中文版国内入口与 GPT-5.2 深度使用教程(2026年最新)', link: '/guides/chatgpt/chatgpt-cn-entry-gpt-deep-guide.html' },
            { text: 'ChatGPT官方最新指南！中文版GPT-5.2入口！【2026年1月5日】', link: '/guides/chatgpt/chatgpt-official-gpt5-2-usage-2026.html' },
            { text: 'ChatGPT官方最新指南！中文版GPT-5.2，国内可用入口！', link: '/guides/chatgpt/chatgpt-tutorial.html' },
            { text: 'ChatGPT中文版：免费使用指南与镜像网站推荐', link: '/guides/chatgpt/chatgpt-china.html' },
            { text: '最新ChatGPT官方指南：GPT-5.2官方入口及国内使用教程', link: '/guides/chatgpt/chatgpt-official-guide-gpt5-2-entry.html' },
            { text: 'GPT-5.2 国内使用全攻略【2026年1月首发】', link: '/guides/chatgpt/gpt-5-2-china-usage-review-guide.html' },
            { text: 'ChatGPT中文版5.2使用指南', link: '/guides/chatgpt/chatgpt-chinese-5.2-guide.html' },
            { text: 'ChatGPT 5.2 最新模型使用指南！(2026年1月更新)', link: '/guides/chatgpt/chatgpt-china-5.2-guide.html' },
            { text: 'ChatGPT 国内使用解决方案：2026年1月最新指南', link: '/guides/chatgpt/chatgpt-domestic-access-solutions-2026.html' },
            { text: 'GPT-5.2 深度解析：功能、架构与未来展望', link: '/guides/chatgpt/gpt-5-2-features-deep-dive-2026.html' },
            { text: 'ChatGPT 中文版：免费使用指南与镜像网站推荐', link: '/guides/chatgpt/chatgpt-chinese-gpt5-complete-guide-2026.html' },
            { text: 'ChatGPT 中文版指南', link: '/guides/chatgpt/chinese-guide.html' },
            { text: 'ChatGPT中文指南：2026最新ChatGPT官网使用教程', link: '/guides/chatgpt/chatgpt-chinese-guide-ultimate-2026.html' },
            { text: 'ChatGPT 镜像网站完全上手指南【2026年持续更新】', link: '/guides/chatgpt/chatgpt-mirrors-site.html' },
            { text: 'ChatGPT官网进不去？2026最新 ChatGPT中文版 直连使用全攻略 (支持GPT-5.2)', link: '/guides/chatgpt/chatgpt-official-website-chinese-version-guide.html' },
            { text: 'ChatGPT 中文指南', link: '/guides/chatgpt/chatgpt-chinese-guide-2026.html' }
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
            { text: 'OpenAI Platform 开发文档概览', link: '/guides/chatgpt-dev/openai-platform-overview.html' },
            { text: 'OpenAI API 开发指南', link: '/guides/chatgpt-dev/openai-api-guide.html' },
            { text: 'OpenAI API 快速入门', link: '/guides/chatgpt-dev/quickstart.html' },
            { text: '文本生成指南', link: '/guides/chatgpt-dev/text-generation.html' },
            { text: 'Prompt Engineering 指南', link: '/guides/chatgpt-dev/prompt-engineering.html' },
            { text: 'Assistants API 开发指南', link: '/guides/chatgpt-dev/assistants.html' },
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
            { text: 'Gemini 中文版注册与使用教程', link: '/guides/gemini/gemini-usage.html' },
            { text: 'Gemini 3 vs GPT-5 对比评测', link: '/guides/gemini/gemini-vs-gpt5.html' },
            { text: 'Gemini API 申请与开发指南', link: '/guides/gemini/gemini-api-guide.html' },
            { text: 'Gemini - 谷歌AI 模型 Gemini 3 Pro 国内使用指南', link: '/guides/gemini/gemini-3pro.html' },
            { text: 'Gemini 提示词工程 (Prompt) 指南', link: '/guides/gemini/gemini-prompt-guide.html' }
          ]
        }
      ],

      // --- Blog 板块 (巨量数据) ---
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
          text: 'ChatGPT 手册',
          collapsed: false,
          items: [
            { text: 'ChatGPT写作技巧2026：10个立竿见影的Prompt模板，职场人亲测有效', link: '/blog/chatgpt-cn/chatgpt-writing-skills-prompt-templates-2026.html' },
            { text: 'ChatGPT官网入口 2026：新手从零入门，国内免翻墙直连GPT-5.4完整攻略', link: '/blog/chatgpt-cn/chatgpt-guanwang-roukou-xinshourumen-2026.html' },
            { text: 'ChatGPT 5.4 震撼发布！国内怎么用？GPT-5.4 官网注册与国内直连保姆级教程 (2026最新)', link: '/blog/chatgpt-cn/chatgpt-5-4-release-and-china-usage-guide-2026.html' },
            { text: 'ChatGPT 中文版：官网入口与国内使用指南（支持 GPT-5 / GPT-4o）', link: '/blog/chatgpt-cn/chatgpt-chinese-official-entry-and-gpt5-gpt4o-guide.html' },
            { text: 'GPT-5.4 Thinking 是什么？ChatGPT 最新推理模型完整介绍（2026版）', link: '/blog/chatgpt-cn/what-is-gpt-5-4-thinking-model-introduction-2026.html' },
            { text: 'GPT-5.4 Thinking vs Gemini 3.1 Pro：哪个更适合复杂任务？', link: '/blog/chatgpt-cn/gpt-5-4-thinking-vs-gemini-3-1-pro-complex-tasks.html' },
            { text: 'ChatGPT 中文版怎么使用？2026 最新GPT-5.4国内使用指南', link: '/blog/chatgpt-cn/how-to-use-chatgpt-chinese-version-gpt-5-4-guide-2026.html' },
            { text: 'ChatGPT 免费版和 Plus 有什么区别？完整功能对比', link: '/blog/chatgpt-cn/chatgpt-free-vs-plus-difference-feature-comparison.html' },
            { text: 'ChatGPT国内使用教程：2026年最新官网入口与访问方法完整指南', link: '/blog/chatgpt-cn/chatgpt-china-access-guide-2026.html' },





            { text: 'ChatGPT 免费使用指南：GPT-5 新手快速入门教程【2026年3月更新】', link: '/blog/chatgpt-cn/chatgpt-free-usage-and-gpt5-beginner-guide-2026.html' },
            { text: 'ChatGPT上线全新GPT5.2模型！使用指南！', link: '/blog/chatgpt-cn/chatgpt-gpt5-2-official-guide-cn.html' },
            { text: 'ChatGPT官网发布 GPT Image 1.5', link: '/blog/chatgpt-cn/chatgpt-official-gpt-image-1-5-release.html' },
            { text: 'GPT-5 级体验？GPT Image 1.5 全攻略', link: '/blog/chatgpt-cn/chatgpt-chinese-gpt-image-1-5-guide.html' },
            { text: 'ChatGPT官网：GPT-5 正式上线（2026终极指南）', link: '/blog/chatgpt-cn/2026-gpt5-how-to-use.html' },
            { text: 'GPT-5.2 vs Gemini 3：谁是2025年最强AI模型？', link: '/blog/chatgpt-cn/gpt5-2-vs-gemini-3.html' },
            { text: 'ChatGPT 5.2 官网发布？模型参数深度解析', link: '/blog/chatgpt-cn/gpt5-2-official-parameters-2025.html' },
            { text: 'ChatGPT 5.2 国内如何使用？功能评测', link: '/blog/chatgpt-cn/chatgpt-5-2-guide-2025.html' },
            { text: 'OpenAI官网发布GPT-5最新消息？', link: '/blog/chatgpt-cn/gpt5-official-news-2025.html' },
            { text: '程序员如何用 ChatGPT 提效', link: '/blog/chatgpt-coding-assistant.html' },
            { text: 'ChatGPT 提示词工程进阶指南', link: '/blog/chatgpt-prompt-engineering-guide.html' },
            { text: '2025年 AI 展望：未来趋势', link: '/blog/future-of-llm-2025.html' },
            { text: 'ChatGPT官方网址入口（官网网址登录入口）', link: '/blog/chatgpt-official.html' },
            { text: 'ChatGPT官方网址入口指南', link: '/blog/chatgpt-official-guide.html' },
            { text: 'ChatGPT官网入口_注册使用全教程', link: '/blog/chatgpt.html' },
            { text: 'GPT-5 发布：国内使用教程及注册攻略', link: '/blog/chatgpt-cn/openai-gpt5-2025.html' },
            { text: 'ChatGPT官网入口（官方登录&中文版）2025指南', link: '/blog/chatgpt-cn/2025-chatgpt-official.html' },
            { text: 'ChatGPT 中文版使用网站推荐与详细教程', link: '/blog/chatgpt-cn/chatgpt-chinese-usage-websites.html' },
            { text: 'ChatGPT 官网入口网页版直达链接与登录方法', link: '/blog/chatgpt-cn/chatgpt-official-web-entry.html' },
            { text: 'ChatGPT 中国国内使用方法：注册及使用指南', link: '/blog/chatgpt-cn/chatgpt-cn-register.html' },
            { text: 'ChatGPT 官网与中文版使用终极指南', link: '/blog/chatgpt-cn/chatgpt-guide.html' },
            { text: 'GPT-5.3 vs Claude 4.6 vs Gemini 3.1 Pro 国内该选哪个？', link: '/blog/chatgpt-cn/gpt5-3-vs-claude4-6-vs-gemini3-1-pro-china-guide.html' },
            { text: 'ChatGPT 中文版免费：国内使用指南【2026年1月更新】', link: '/blog/chatgpt-cn/chatgpt.html' },
            { text: 'GPT-5.4 vs Claude 4.6 vs Gemini 3.1 Pro vs Grok 4.2：2026年旗舰AI全横评，国内怎么用？', link: '/blog/chatgpt-cn/gpt-5-4-claude-4-6-gemini-3-1-pro-grok-4-2-china-guide-2026.html' }
          ]
        },
        {
          text: 'AI写作专栏',
          collapsed: false,
          items: [
            { text: '写作基础教程', link: '/blog/writing/basics.html' },
            { text: '场景应用', collapsed: true, items: [
              { text: '小红书写作', link: '/blog/writing/xiaohongshu.html' },
              { text: '论文写作', link: '/blog/writing/academic.html' }
            ]}
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