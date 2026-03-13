#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple BI Agent - 自然语言数据查询与可视化
"""

from flask import Flask, render_template, request, jsonify
import pandas as pd
import json
import re
from datetime import datetime

app = Flask(__name__)

# 示例数据 - 实际可以替换为 CSV/数据库
SAMPLE_DATA = {
    "sales": [
        {"date": "2026-01-01", "product": "产品 A", "sales": 15000, "region": "华东"},
        {"date": "2026-01-02", "product": "产品 B", "sales": 12000, "region": "华北"},
        {"date": "2026-01-03", "product": "产品 A", "sales": 18000, "region": "华南"},
        {"date": "2026-01-04", "product": "产品 C", "sales": 9000, "region": "华东"},
        {"date": "2026-01-05", "product": "产品 B", "sales": 14000, "region": "华北"},
        {"date": "2026-01-06", "product": "产品 A", "sales": 20000, "region": "华南"},
        {"date": "2026-01-07", "product": "产品 C", "sales": 11000, "region": "华东"},
        {"date": "2026-01-08", "product": "产品 B", "sales": 16000, "region": "华北"},
    ]
}

def parse_query(query: str) -> dict:
    """
    解析自然语言查询，返回查询参数
    简化版本 - 实际可以用 LLM 来解析
    """
    result = {
        "type": "table",  # table, bar, line, pie
        "group_by": None,
        "metric": "sales",
        "filter": None,
        "limit": 10
    }
    
    query_lower = query.lower()
    
    # 检测图表类型
    if "趋势" in query or "变化" in query:
        result["type"] = "line"
    elif "占比" in query or "比例" in query:
        result["type"] = "pie"
    elif "柱状" in query or "对比" in query:
        result["type"] = "bar"
    
    # 检测分组字段
    if "产品" in query:
        result["group_by"] = "product"
    elif "地区" in query or "区域" in query:
        result["group_by"] = "region"
    elif "日期" in query or "时间" in query:
        result["group_by"] = "date"
    
    # 检测排序
    if "前" in query or "最高" in query or "最多" in query:
        result["order"] = "desc"
    elif "后" in query or "最低" in query or "最少" in query:
        result["order"] = "asc"
    
    return result

def execute_query(params: dict) -> dict:
    """执行查询并返回结果"""
    df = pd.DataFrame(SAMPLE_DATA["sales"])
    
    # 分组聚合
    if params["group_by"]:
        result = df.groupby(params["group_by"])[params["metric"]].sum().reset_index()
        result = result.sort_values(params["metric"], ascending=params.get("order", "asc") == "asc")
        result = result.head(params["limit"])
    else:
        result = df.head(params["limit"])
    
    # 转换为前端格式
    labels = result[params["group_by"] or "date"].tolist() if params["group_by"] or "date" in result.columns else list(range(len(result)))
    values = result[params["metric"]].tolist()
    
    return {
        "labels": labels,
        "values": values,
        "columns": result.columns.tolist()
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/query', methods=['POST'])
def query():
    """处理查询请求"""
    data = request.json
    query_text = data.get('query', '')
    
    if not query_text:
        return jsonify({"error": "请输入查询内容"}), 400
    
    # 解析查询
    params = parse_query(query_text)
    
    # 执行查询
    result = execute_query(params)
    
    return jsonify({
        "success": True,
        "query": query_text,
        "chart_type": params["type"],
        "data": result,
        "group_by": params["group_by"],
        "metric": params["metric"]
    })

@app.route('/api/data', methods=['GET'])
def get_data():
    """获取原始数据"""
    df = pd.DataFrame(SAMPLE_DATA["sales"])
    return jsonify({
        "success": True,
        "data": df.to_dict('records'),
        "columns": df.columns.tolist()
    })

if __name__ == '__main__':
    print("🚀 Simple BI Agent 启动中...")
    print("📊 访问地址：http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
