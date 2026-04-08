# -*- coding: utf-8 -*-
import os
import re
import sys
from datetime import datetime

SCAN_DIRS = ["chatgpt", "chatgpt-cn", "blog", "guides"]
EXCLUDE_DIRS = set(["node_modules", ".vitepress", ".git", "dist", ".vscode"])
FRONTMATTER_DATE_FIELDS = ["date", "updateTime", "lastUpdated", "updated"]

TARGET_DATE = datetime.now()
TARGET_DATE_STR = TARGET_DATE.strftime("%Y-%m-%d")
TARGET_YEAR = TARGET_DATE.year
TARGET_MONTH = TARGET_DATE.month
TARGET_CN = str(TARGET_YEAR) + "\u5e74" + str(TARGET_MONTH) + "\u6708"

OLD_YEAR = 2026
OLD_MONTHS = [1, 2]


def find_md(dirs, base):
    result = []
    for d in dirs:
        full = os.path.join(base, d)
        if not os.path.isdir(full):
            print("WARN: not found: " + full)
            continue
        for root, subdirs, files in os.walk(full):
            subdirs[:] = [s for s in subdirs if s not in EXCLUDE_DIRS]
            for f in files:
                if f.endswith(".md"):
                    result.append(os.path.join(root, f))
    return result


def update_fm(content):
    changes = []
    m = re.match(r"^(---\s*\n)(.*?)(---\s*\n)", content, re.DOTALL)
    if not m:
        return content, changes
    before = m.group(1)
    body = m.group(2)
    after = m.group(3)
    rest = content[m.end():]
    new_body = body
    for field in FRONTMATTER_DATE_FIELDS:
        pat = r"^(" + field + r"\s*:\s*[\"']?)(\d{4}-\d{2}-\d{2})([\"']?\s*)$"
        fm = re.search(pat, new_body, re.MULTILINE)
        if fm:
            old = fm.group(2)
            try:
                dt = datetime.strptime(old, "%Y-%m-%d")
                if dt.year == OLD_YEAR and dt.month in OLD_MONTHS:
                    new_body = new_body[:fm.start(2)] + TARGET_DATE_STR + new_body[fm.end(2):]
                    changes.append("  fm." + field + ": " + old + " -> " + TARGET_DATE_STR)
            except ValueError:
                pass
    return before + new_body + after + rest, changes


def update_body(content):
    changes = []
    m = re.match(r"^---\s*\n.*?---\s*\n", content, re.DOTALL)
    pos = m.end() if m else 0
    body = content[pos:]

    for om in OLD_MONTHS:
        old_cn = str(OLD_YEAR) + "\u5e74" + str(om) + "\u6708"
        if old_cn in body:
            body = body.replace(old_cn, TARGET_CN)
            changes.append("  text: " + old_cn + " -> " + TARGET_CN)

        pat = str(OLD_YEAR) + "-" + str(om).zfill(2) + r"-\d{2}"
        found = re.findall(pat, body)
        if found:
            body = re.sub(pat, TARGET_DATE_STR, body)
            for f in set(found):
                changes.append("  text: " + f + " -> " + TARGET_DATE_STR)

        for kw in ["\u66f4\u65b0", "\u6700\u65b0"]:
            old_tag = "\u3010" + old_cn + kw + "\u3011"
            new_tag = "\u3010" + TARGET_CN + kw + "\u3011"
            if old_tag in body:
                body = body.replace(old_tag, new_tag)
                changes.append("  tag: " + old_tag + " -> " + new_tag)

    return content[:pos] + body, changes


def process(fp, dry):
    try:
        with open(fp, "r", encoding="utf-8") as f:
            orig = f.read()
    except Exception as e:
        print("ERROR reading " + fp + ": " + str(e))
        return False

    content = orig
    all_ch = []

    content, ch = update_fm(content)
    all_ch.extend(ch)
    content, ch = update_body(content)
    all_ch.extend(ch)

    if all_ch:
        print("")
        print("[FILE] " + fp)
        for c in all_ch:
            print(c)
        if not dry:
            with open(fp, "w", encoding="utf-8") as f:
                f.write(content)
            print("  >> DONE")
        else:
            print("  >> dry-run, not saved")
    return len(all_ch) > 0


def main():
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    dry = True
    if "--run" in sys.argv:
        dry = False

    base = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base)

    print("=" * 50)
    if dry:
        print("DRY-RUN mode. Use --run to apply.")
    else:
        print("LIVE mode. Files will be changed!")
    print("=" * 50)
    print("Root: " + base)
    print("Target: " + TARGET_DATE_STR + " (" + TARGET_CN + ")")
    print("Old: " + str(OLD_YEAR) + " months=" + str(OLD_MONTHS))
    print("")

    for d in SCAN_DIRS:
        p = os.path.join(base, d)
        st = "OK" if os.path.isdir(p) else "MISSING"
        print("  " + d + " -> " + st)
    print("")

    files = find_md(SCAN_DIRS, base)
    print("Found " + str(len(files)) + " md files")

    if not files:
        print("No files found. Check directory.")
        return

    count = 0
    for fp in sorted(files):
        if process(fp, dry):
            count = count + 1

    print("")
    print("=" * 50)
    print("Scanned: " + str(len(files)))
    print("Changed: " + str(count))
    print("No date: " + str(len(files) - count))
    if dry and count > 0:
        print("Run: python update_dates.py --run")
    print("=" * 50)


if __name__ == "__main__":
    main()
