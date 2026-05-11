# -*- coding: utf-8 -*-
"""
合并 Bing 数据 + 站内审计，输出最终决策表
"""

import csv
import re
import os
import sys
from collections import defaultdict

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT = os.path.dirname(os.path.abspath(__file__))
BING = os.path.join(ROOT, "bing_data.csv")
AUDIT = os.path.join(ROOT, "seo_audit_report.csv")
OUT = os.path.join(ROOT, "seo_decision_table.csv")


def normalize_url(u):
    """统一 URL 形态：去掉 .html、末尾斜杠，转小写比较用的 key"""
    u = u.strip().lower()
    u = re.sub(r"\.html$", "", u)
    u = re.sub(r"/$", "", u)
    return u


def load_bing():
    """读 Bing CSV，返回 {normalized_url: row_dict}"""
    out = {}
    with open(BING, "r", encoding="utf-8-sig") as f:
        r = csv.DictReader(f)
        for row in r:
            url = row["页面"].strip()
            if not url:
                continue
            key = normalize_url(url)
            out[key] = {
                "url_raw": url,
                "impressions": int(row["印象数"] or 0),
                "clicks": int(row["点击次数"] or 0),
                "ctr": row["点击率"].strip(),
                "avg_position": float(row["平均排名"] or 0),
            }
    return out


def load_audit():
    """读 audit CSV，返回 list of dict"""
    with open(AUDIT, "r", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def grade(impressions, clicks):
    """A/B/C/D 分档"""
    if clicks >= 1:
        return "A"  # 有点击：金牌资产
    if impressions >= 10:
        return "B"  # 有展示无点击：标题描述待优化
    if impressions >= 1:
        return "C"  # 极少展示：边缘页面
    return "D"      # 零展示：僵尸页（候选 noindex）


def main():
    bing = load_bing()
    audit = load_audit()

    print(f"Bing 数据：{len(bing)} 个 URL 有展示")
    print(f"站内审计：{len(audit)} 个页面文件")
    print()

    # 给每篇文章拼 Bing 数据
    results = []
    matched_keys = set()
    for row in audit:
        url = row["url"]
        key = normalize_url(url)
        b = bing.get(key)
        if b is None:
            # 试试加 .html 后缀的匹配
            key2 = normalize_url(url + ".html")
            b = bing.get(key2)
        if b:
            matched_keys.add(key)
            imps = b["impressions"]
            clicks = b["clicks"]
            ctr = b["ctr"]
            pos = b["avg_position"]
        else:
            imps, clicks, ctr, pos = 0, 0, "", 0

        g = grade(imps, clicks)
        action = {
            "A": "🟢 绝对禁动：完全保留，连 frontmatter 都不要改",
            "B": "🟡 优化标题/描述：有展示无点击，改 title 和 description 能多拿点击",
            "C": "🟠 边缘页：极少展示，候选 canonical 合并到同主题主页",
            "D": "🔴 僵尸页：零展示，候选 noindex 或物理删除",
        }[g]

        results.append({
            **row,
            "bing_impressions": imps,
            "bing_clicks": clicks,
            "bing_ctr": ctr,
            "bing_avg_position": pos if pos else "",
            "grade": g,
            "decision": action,
        })

    # 检查 Bing 里有但 audit 里没有的（说明有 URL 不是从这 252 个 .md 来的）
    unmatched_bing = []
    for key, b in bing.items():
        if key not in matched_keys:
            unmatched_bing.append((b["url_raw"], b["impressions"], b["clicks"]))

    # 排序：A > B > C > D，按点击/印象降序
    results.sort(key=lambda x: (
        {"A": 0, "B": 1, "C": 2, "D": 3}[x["grade"]],
        -int(x["bing_clicks"] or 0),
        -int(x["bing_impressions"] or 0),
    ))

    # 写决策表
    fieldnames = list(results[0].keys())
    with open(OUT, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(results)

    # 控制台汇总
    by_grade = defaultdict(list)
    for r in results:
        by_grade[r["grade"]].append(r)

    print("=" * 68)
    print("分档结果")
    print("=" * 68)
    total = len(results)
    for g in ["A", "B", "C", "D"]:
        items = by_grade.get(g, [])
        pct = len(items) * 100 / total if total else 0
        total_imp = sum(int(x["bing_impressions"] or 0) for x in items)
        total_clk = sum(int(x["bing_clicks"] or 0) for x in items)
        print(f"\n【{g} 档】{len(items)} 篇 ({pct:.1f}%)  Bing 印象 {total_imp:,} / 点击 {total_clk:,}")
        if g == "A":
            print("   动作：完全保留，禁止修改")
        elif g == "B":
            print("   动作：等 A 档稳定后，优化 title/description 提升 CTR")
        elif g == "C":
            print("   动作：考虑 canonical 合并到同主题 A 档")
        elif g == "D":
            print("   动作：候选 noindex（保守）或物理删除（激进）")

    print()
    print("=" * 68)
    print("A 档（绝对禁动白名单）TOP 15")
    print("=" * 68)
    for r in by_grade["A"][:15]:
        url_short = r["url"].replace("https://www.chatgpt-chinese-guide.com", "")
        print(f"  印 {r['bing_impressions']:>8,} | 点 {r['bing_clicks']:>6,} | 排名 {r['bing_avg_position']:>5} | {url_short}")

    print()
    if unmatched_bing:
        print("=" * 68)
        print(f"⚠️  Bing 报告了但 audit 没扫到的 URL（{len(unmatched_bing)} 个）")
        print("=" * 68)
        print("这些 URL 可能是：")
        print("  - 已删除的旧文章（Bing 还在展示但点击会 404）→ 需要 301 重定向")
        print("  - 不在 chatgpt/guides/blog 目录的页面")
        for url, imp, clk in unmatched_bing[:20]:
            print(f"  印 {imp:>8,} | 点 {clk:>5,} | {url}")

    print()
    print(f"✅ 决策表已生成：{OUT}")
    print("   下一步：打开 seo_decision_table.csv 按 grade 列筛选，按档执行")


if __name__ == "__main__":
    main()
