# -*- coding: utf-8 -*-
"""
SEO 内容审计 / Content Audit —— 只读分析，不删除任何文件

用途：
  扫描 chatgpt/、guides/、blog/ 目录下所有 .md 文章，按主题相似度聚类，
  输出 CSV 报告。你可以把 Bing Webmaster Tools 的"页面级流量"导出后，
  按 URL 把流量列拼到这个 CSV 上，就能直接决策：
    - A 档（有点击）→ 保留
    - B 档（有展示无点击）→ 优化标题描述
    - C 档（被索引零展示）→ 候选 canonical 合并
    - D 档（未被索引）→ 候选 noindex 或删除

使用：
  cd E:/vercel/chatgpt-chinese-guide
  python seo_audit.py
  # 会输出 seo_audit_report.csv
"""

import os
import re
import csv
import sys
from collections import defaultdict
from datetime import datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
SCAN_DIRS = ["chatgpt", "guides", "blog"]
EXCLUDE_DIRS = {"node_modules", ".vitepress", ".git", "dist"}
BASE_URL = "https://www.chatgpt-chinese-guide.com"

# 主题分桶关键词（中英文 + 拼音）
TOPIC_BUCKETS = [
    ("提示词/Prompt", ["prompt", "提示词", "tishici"]),
    ("怎么用/使用教程", ["how-to-use", "zenme-yong", "shiyong", "使用教程", "使用指南", "新手"]),
    ("官网入口", ["guanwang", "official", "官网", "入口", "rukou", "登录", "login"]),
    ("注册教程", ["zhuce", "register", "注册"]),
    ("中文版", ["zhongwen", "chinese", "中文版", "cn-guide", "china-guide"]),
    ("下载安装", ["xiazai", "download", "下载", "安装"]),
    ("镜像站", ["mirror", "jingxiang", "镜像"]),
    ("GPT-5 系列模型", ["gpt-5", "gpt5"]),
    ("Claude", ["claude"]),
    ("Gemini", ["gemini"]),
    ("Grok", ["grok"]),
    ("图片生成/Image", ["image", "tupian", "shengtu", "绘图", "生图"]),
    ("Plus / 价格", ["plus", "pricing", "free", "vs-plus"]),
    ("API / 开发", ["api", "kaifa", "dev", "开发"]),
    ("对比/评测", ["vs", "duibi", "pingce", "对比", "实测", "shice"]),
    ("AI 编程", ["coding", "biancheng", "编程", "code"]),
    ("AI 写作", ["xiezuo", "writing", "写作", "lunwen", "paper", "论文"]),
    ("常见问题/FAQ", ["faq", "wenti", "问题", "not-working", "dabukao"]),
    ("DeepSeek", ["deepseek"]),
]

# 高质量信号：手写文章往往会带这些字段或图片
QUALITY_HINTS = [
    ("有 frontmatter title", re.compile(r"^title\s*:", re.M)),
    ("有 description", re.compile(r"^description\s*:", re.M)),
    ("有 keywords", re.compile(r"\bkeywords\b", re.I)),
    ("有真实图片(.png/.jpg)", re.compile(r"!\[.*?\]\(.*?\.(png|jpg|jpeg|webp|gif)\)", re.I)),
    ("有表格", re.compile(r"^\|.*\|.*\|", re.M)),
    ("有 FAQ 结构", re.compile(r"FAQ|常见问题|Q:|Q：", re.I)),
]

LOW_QUALITY_FLAGS = [
    ("空模板：内容正在复刻中", re.compile(r"内容正在复刻中")),
    ("通用 emoji 套话", re.compile(r"🚧.{0,10}状态")),
]


def scan_files():
    out = []
    for d in SCAN_DIRS:
        full = os.path.join(ROOT, d)
        if not os.path.isdir(full):
            continue
        for r, subs, files in os.walk(full):
            subs[:] = [s for s in subs if s not in EXCLUDE_DIRS]
            for f in files:
                if f.endswith(".md") and f != "index.md":
                    out.append(os.path.join(r, f))
    return out


def classify_topic(slug, title):
    text = (slug + " " + (title or "")).lower()
    matched = []
    for name, kws in TOPIC_BUCKETS:
        for kw in kws:
            if kw.lower() in text:
                matched.append(name)
                break
    return ";".join(matched) if matched else "其他/Uncategorized"


def get_title_and_size(content):
    m = re.search(r"^title\s*:\s*[\"']?(.+?)[\"']?\s*$", content, re.M)
    title = m.group(1).strip() if m else ""
    if not title:
        m2 = re.search(r"^#\s+(.+)$", content, re.M)
        title = m2.group(1).strip() if m2 else ""
    return title


def quality_score(content):
    hits = []
    score = 0
    for label, pat in QUALITY_HINTS:
        if pat.search(content):
            hits.append(label)
            score += 1
    flags = []
    for label, pat in LOW_QUALITY_FLAGS:
        if pat.search(content):
            flags.append(label)
            score -= 5
    return score, hits, flags


def file_to_url(path):
    rel = os.path.relpath(path, ROOT).replace("\\", "/")
    rel = re.sub(r"\.md$", "", rel)
    return f"{BASE_URL}/{rel}"


def main():
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    files = scan_files()
    print(f"扫描到 {len(files)} 个 .md 文件")

    rows = []
    by_topic = defaultdict(list)

    for fp in sorted(files):
        try:
            with open(fp, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            print(f"读取失败 {fp}: {e}")
            continue

        slug = os.path.splitext(os.path.basename(fp))[0]
        title = get_title_and_size(content)
        size_bytes = os.path.getsize(fp)
        mtime = datetime.fromtimestamp(os.path.getmtime(fp)).strftime("%Y-%m-%d")
        topic = classify_topic(slug, title)
        q_score, q_hits, q_flags = quality_score(content)
        url = file_to_url(fp)

        rows.append({
            "url": url,
            "file": os.path.relpath(fp, ROOT).replace("\\", "/"),
            "topic": topic,
            "title": title,
            "size_bytes": size_bytes,
            "size_kb": round(size_bytes / 1024, 1),
            "last_modified": mtime,
            "quality_score": q_score,
            "quality_hits": " | ".join(q_hits),
            "low_quality_flags": " | ".join(q_flags),
            "bing_impressions_30d": "",
            "bing_clicks_30d": "",
            "action_suggest": "",
        })
        by_topic[topic].append(rows[-1])

    for topic, items in by_topic.items():
        if len(items) >= 3:
            items_sorted = sorted(items, key=lambda x: (-x["quality_score"], -x["size_bytes"]))
            for i, row in enumerate(items_sorted):
                if i == 0:
                    row["action_suggest"] = f"主候选页（同主题 {len(items)} 篇中质量最高）"
                else:
                    row["action_suggest"] = f"重复簇成员：等 Bing 流量数据后决定 canonical 到主候选页 / noindex / 保留"

    for row in rows:
        if row["low_quality_flags"]:
            row["action_suggest"] = "⚠️ 低质量页（空模板/占位），优先处理：" + (row["action_suggest"] or "建议 noindex")

    out_csv = os.path.join(ROOT, "seo_audit_report.csv")
    fieldnames = list(rows[0].keys())
    with open(out_csv, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)

    print(f"\n✅ 报告已生成：{out_csv}")
    print(f"   总页数：{len(rows)}")
    print("\n按主题统计（重复簇候选）：")
    for topic, items in sorted(by_topic.items(), key=lambda x: -len(x[1])):
        if len(items) >= 3:
            print(f"  ⚠️  [{len(items)} 篇] {topic}")
        elif len(items) == 2:
            print(f"      [2 篇] {topic}")

    print("\n下一步：")
    print("  1. 打开 seo_audit_report.csv（Excel/WPS）")
    print("  2. 从 Bing Webmaster Tools 导出页面级流量（最近 30/90 天）")
    print("  3. 用 VLOOKUP 把 impressions / clicks 拼到对应 URL 行")
    print("  4. 按规则填 action_suggest，再统一处理")


if __name__ == "__main__":
    main()
