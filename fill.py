import os
import re

# 配置文件路径
config_path = os.path.join('.vitepress', 'config.mts')

# 内容模板
def get_content(title):
    return f"""---
outline: deep
---

# {title}

<div class="info-box">
  <span class="icon">🚧</span> 
  <strong>状态：</strong> 内容正在复刻中...
</div>

这里是 **{title}** 的详细页面。

我们正在根据原版网站结构完善此内容。您可以先参考左侧导航栏浏览其他板块。

## 核心内容预览
- 详细功能介绍
- 使用教程与技巧
- 常见问题解答

> 提示：本站内容正在持续构建中。

<style>
.info-box {{
  background-color: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 12px 16px;
  color: #c2410c;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}}
.icon {{ font-size: 20px; }}
</style>
"""

def main():
    if not os.path.exists(config_path):
        print("❌ 错误：找不到配置文件 .vitepress/config.mts")
        return

    print("📖 正在读取配置...")
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ 读取配置失败: {e}")
        return

    # 提取标题和链接
    pattern = re.compile(r"text:\s*['\"](.*?)['\"],\s*link:\s*['\"](.*?)['\"]")
    matches = pattern.findall(content)

    print(f"🔍 准备更新 {len(matches)} 个文件...")

    success_count = 0
    for title, link in matches:
        # 清理路径
        clean_path = link.lstrip('/')
        if clean_path.endswith('.html'):
            file_path = clean_path.replace('.html', '.md')
        else:
            file_path = clean_path + '.md'
            
        # 【关键修复】只有当路径包含文件夹时，才去创建文件夹
        dir_name = os.path.dirname(file_path)
        if dir_name:
            try:
                os.makedirs(dir_name, exist_ok=True)
            except Exception as e:
                print(f"⚠️ 创建目录失败 {dir_name}: {e}")
                continue

        # 强制覆盖写入
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(get_content(title))
            print(f"⚡ 已更新: {title}")
            success_count += 1
        except Exception as e:
            print(f"❌ 写入失败 {file_path}: {e}")

    print(f"\n🎉 全部完成！共强制更新了 {success_count} 个文件。")
    print("👉 现在重启 'npm run docs:dev'，所有标题肯定都是中文了！")

if __name__ == "__main__":
    main()