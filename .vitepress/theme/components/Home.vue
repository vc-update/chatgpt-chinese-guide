<script setup>
// chatgpt-chinese-guide.com 首页 - 定位：ChatGPT 使用指南与评测中心
const guides = [
  {
    title: "🚀 ChatGPT 快速入门",
    desc: "从零开始，5分钟学会使用 ChatGPT。覆盖注册、登录、提问技巧，适合完全没接触过AI的新手。",
    tags: ["新手必读", "图文教程", "2026最新"],
    link: "/chatgpt/chatgpt-guide-for-beginners"
  },
  {
    title: "🏆 5大ChatGPT中文平台实测排名",
    desc: "我们实际测试了市面上主流的ChatGPT中文平台，从响应速度、模型版本、稳定性、价格四个维度进行打分排名。",
    tags: ["深度评测", "横向对比", "数据驱动"],
    link: "/chatgpt/chatgpt-zhongwen-ban-nage-haoyong-5da-pingtai-shice-paiming-2026"
  },
  {
    title: "🔍 ChatGPT 官网打不开怎么办？",
    desc: "针对国内用户无法访问 chat.openai.com 的常见问题，提供6种经过验证的解决方案，附详细操作步骤。",
    tags: ["问题解决", "国内访问", "实操"],
    link: "/chatgpt/chatgpt-not-working-fix-guide"
  },
  {
    title: "⚔️ ChatGPT vs Claude：谁更强？",
    desc: "GPT-5.4 与 Claude 4.6 在写作、编程、推理、多模态四大场景的深度对比，用真实案例说话。",
    tags: ["模型对比", "GPT-5.4", "Claude 4.6"],
    link: "/chatgpt/chatgpt-vs-claude"
  },
  {
    title: "🪞 ChatGPT 镜像站避坑指南",
    desc: "镜像站鱼龙混杂，我们整理了判断镜像站是否靠谱的5个核心标准，帮你避开虚假站点和钓鱼陷阱。",
    tags: ["防骗指南", "安全提醒", "实用"],
    link: "/chatgpt/chatgpt-mirror-sites-recommendation-and-anti-scam-guide-2026"
  },
  {
    title: "📱 手机端使用完全指南",
    desc: "Android 和 iOS 设备上使用 ChatGPT 的全部方法：官方App、网页版、第三方客户端逐一对比。",
    tags: ["移动端", "iOS", "Android"],
    link: "/chatgpt/chatgpt-mobile-guide-android-ios"
  }
];

const stats = [
  { number: "38+", label: "深度指南文章" },
  { number: "5", label: "平台实测评分" },
  { number: "2026", label: "持续更新中" },
  { number: "100%", label: "免费阅读" }
];
</script>

<template>
  <div class="guide-home">
    <!-- 背景 -->
    <div class="bg-layer">
      <div class="bg-gradient"></div>
      <div class="bg-dots"></div>
    </div>

    <div class="container">
      <!-- Hero -->
      <section class="hero">
        <div class="badge">📖 独立评测 · 客观推荐 · 持续更新</div>
        <h1>
          ChatGPT 使用指南
          <span class="hero-sub">中文互联网最全面的 ChatGPT 教程与评测中心</span>
        </h1>
        <p class="hero-desc">
          不推销、不夸大。我们通过<strong>真实测试</strong>和<strong>数据对比</strong>，帮你找到最适合自己的 AI 使用方式。<br>
          覆盖入门教程、平台评测、模型对比、避坑指南、进阶技巧。
        </p>
        <div class="hero-actions">
          <a href="/chatgpt/chatgpt-guide-for-beginners" class="btn btn-primary">📚 开始阅读指南</a>
          <a href="/chatgpt/chatgpt-zhongwen-ban-nage-haoyong-5da-pingtai-shice-paiming-2026" class="btn btn-outline">🏆 查看平台排名</a>
        </div>
      </section>

      <!-- 数据条 -->
      <section class="stats-bar">
        <div v-for="(s, i) in stats" :key="i" class="stat-item">
          <div class="stat-number">{{ s.number }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </section>

      <!-- 精选指南 -->
      <section class="guides-section">
        <h2 class="section-title">📌 精选指南</h2>
        <p class="section-desc">每篇文章都经过实际测试验证，定期更新以确保信息准确</p>

        <div class="guides-grid">
          <a
            v-for="(g, i) in guides"
            :key="i"
            :href="g.link"
            class="guide-card"
          >
            <h3>{{ g.title }}</h3>
            <p>{{ g.desc }}</p>
            <div class="tags">
              <span v-for="(t, j) in g.tags" :key="j" class="tag">{{ t }}</span>
            </div>
          </a>
        </div>
      </section>

      <!-- 为什么选择我们 -->
      <section class="why-section">
        <h2 class="section-title">💡 为什么读我们的指南？</h2>
        <div class="why-grid">
          <div class="why-card">
            <div class="why-icon">🔬</div>
            <h4>真实测试</h4>
            <p>每个推荐的平台我们都亲自注册、使用、测试过，不是道听途说。</p>
          </div>
          <div class="why-card">
            <div class="why-icon">📊</div>
            <h4>数据说话</h4>
            <p>响应速度、稳定性、价格全部量化打分，拒绝模糊的"还不错"。</p>
          </div>
          <div class="why-card">
            <div class="why-icon">🔄</div>
            <h4>持续更新</h4>
            <p>AI领域变化太快，我们每月更新文章，确保你看到的都是最新信息。</p>
          </div>
          <div class="why-card">
            <div class="why-icon">🛡️</div>
            <h4>避坑优先</h4>
            <p>特别关注安全性和防骗，帮你远离虚假镜像站和钓鱼链接。</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.guide-home {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #fefce8 0%, #f0fdf4 30%, #eff6ff 60%, #faf5ff 100%);
}
:root.dark .bg-gradient {
  background: linear-gradient(160deg, #1a1a2e 0%, #0f172a 50%, #1e1b4b 100%);
}

.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.3;
}
:root.dark .bg-dots { opacity: 0.1; }

.container {
  position: relative;
  z-index: 10;
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px 100px;
}

/* Hero */
.hero {
  text-align: center;
  padding: 40px 0 60px;
}

.badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 50px;
  font-size: 14px;
  color: #059669;
  font-weight: 500;
  margin-bottom: 28px;
}
:root.dark .badge {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.3);
}

.hero h1 {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  color: #1e293b;
  margin-bottom: 24px;
  letter-spacing: -1px;
}
:root.dark .hero h1 { color: #f1f5f9; }

.hero-sub {
  display: block;
  font-size: 22px;
  font-weight: 400;
  color: #64748b;
  margin-top: 12px;
  letter-spacing: 0;
}
:root.dark .hero-sub { color: #94a3b8; }

.hero-desc {
  font-size: 17px;
  color: #475569;
  line-height: 1.8;
  max-width: 680px;
  margin: 0 auto 36px;
}
:root.dark .hero-desc { color: #94a3b8; }

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none !important;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.btn-outline {
  background: white;
  color: #1e293b;
  border: 2px solid #e2e8f0;
}
:root.dark .btn-outline {
  background: #1e293b;
  color: #f1f5f9;
  border-color: #334155;
}
.btn-outline:hover {
  border-color: #f59e0b;
  color: #d97706;
}

/* Stats */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  margin-bottom: 70px;
  border: 1px solid #f1f5f9;
}
:root.dark .stats-bar {
  background: #1e293b;
  border-color: #334155;
}

.stat-item { text-align: center; }

.stat-number {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

/* Section titles */
.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: #1e293b;
  border: none;
}
:root.dark .section-title { color: #f1f5f9; }

.section-desc {
  text-align: center;
  color: #64748b;
  font-size: 16px;
  margin-bottom: 40px;
}

/* Guide cards */
.guides-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 80px;
}

.guide-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid #f1f5f9;
  text-decoration: none !important;
  color: inherit;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
}
:root.dark .guide-card {
  background: rgba(30, 41, 59, 0.8);
  border-color: #334155;
}

.guide-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
  border-color: #f59e0b;
}

.guide-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #1e293b;
  border: none;
}
:root.dark .guide-card h3 { color: #f1f5f9; }

.guide-card p {
  font-size: 15px;
  color: #64748b;
  line-height: 1.7;
  flex: 1;
  margin-bottom: 16px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}
:root.dark .tag {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

/* Why section */
.why-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.why-card {
  text-align: center;
  padding: 32px 20px;
  background: white;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
}
:root.dark .why-card {
  background: rgba(30, 41, 59, 0.8);
  border-color: #334155;
}

.why-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

.why-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.why-card h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1e293b;
}
:root.dark .why-card h4 { color: #f1f5f9; }

.why-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

/* Mobile */
@media (max-width: 768px) {
  .hero h1 { font-size: 32px; }
  .hero-sub { font-size: 17px; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .guides-grid { grid-template-columns: 1fr; }
  .why-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .why-grid { grid-template-columns: 1fr; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); padding: 20px; }
}
</style>
