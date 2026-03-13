# 安装指南

## 环境要求

- Python 3.12+
- pyenv (推荐)

## 快速开始

### 1. 激活虚拟环境

```bash
cd /home/admin/.openclaw/workspace/apps/simple-bi-agent

# 加载 pyenv
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - bash)"
eval "$(pyenv virtualenv-init -)"

# 激活虚拟环境（自动，因为 .python-version 已配置）
# 或者直接运行：
pyenv local simple-bi-agent-venv
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 运行应用

```bash
python app.py
```

访问 http://localhost:5000

---

## 配置说明

### pyenv 配置（已添加到 ~/.bashrc）

```bash
# pyenv 配置
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - bash)"
eval "$(pyenv virtualenv-init -)"
```

### 使配置生效

```bash
# 重新加载 bashrc
source ~/.bashrc

# 或者开启新的终端会话
```

### 验证

```bash
python --version  # 应显示 Python 3.12.13
pip --version     # 应显示虚拟环境中的 pip
```

---

## 项目结构

```
simple-bi-agent/
├── app.py              # Flask 主应用
├── requirements.txt    # Python 依赖
├── .python-version     # pyenv 虚拟环境配置
├── data/               # 数据目录
│   └── sample.csv      # 示例数据
├── templates/
│   └── index.html      # 前端页面
└── static/
    └── js/
        └── main.js     # 前端逻辑
```
