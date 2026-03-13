# Simple BI Agent 📊

一个简单的 BI 风格数据查询与可视化 Agent - 支持自然语言查询数据并生成图表。

## 功能特性

- 🗣️ **自然语言查询** - 用中文提问，自动解析查询意图
- 📈 **图表展示** - 自动生成柱状图、折线图、饼图等
- 💾 **多数据源支持** - CSV、SQLite、API
- 🚀 **快速部署** - 开箱即用

## 快速开始

### 安装依赖

```bash
pip install -r requirements.txt
```

### 运行应用

```bash
python app.py
```

访问 http://localhost:5000

## 项目结构

```
simple-bi-agent/
├── app.py              # Flask 主应用
├── requirements.txt    # Python 依赖
├── data/               # 数据目录
│   └── sample.csv      # 示例数据
├── templates/
│   └── index.html      # 前端页面
└── static/
    └── js/
        └── main.js     # 前端逻辑
```

## 示例查询

- "显示销售额前 10 的产品"
- "过去 30 天的用户增长趋势"
- "各地区的收入占比"

---

**License**: MIT | **Author**: 汤圆爸爸
