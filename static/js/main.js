// Simple BI Agent - 前端逻辑

let chartInstance = null;

// 示例查询
function useExample(text) {
    document.getElementById('queryInput').value = text;
    document.getElementById('queryForm').dispatchEvent(new Event('submit'));
}

// 提交查询
document.getElementById('queryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const query = document.getElementById('queryInput').value.trim();
    if (!query) return;
    
    await executeQuery(query);
});

// 执行查询
async function executeQuery(query) {
    const errorBox = document.getElementById('errorBox');
    const chartSection = document.getElementById('chartSection');
    const tableSection = document.getElementById('tableSection');
    
    // 隐藏之前的结果
    errorBox.classList.add('hidden');
    chartSection.classList.add('hidden');
    tableSection.classList.add('hidden');
    
    try {
        const response = await fetch('/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || '查询失败');
        }
        
        // 显示图表
        renderChart(result);
        chartSection.classList.remove('hidden');
        
        // 显示数据表
        renderTable(result);
        tableSection.classList.remove('hidden');
        
    } catch (error) {
        errorBox.textContent = '❌ ' + error.message;
        errorBox.classList.remove('hidden');
    }
}

// 渲染图表
function renderChart(result) {
    const ctx = document.getElementById('chart').getContext('2d');
    const { chart_type, data } = result;
    
    // 销毁旧图表
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    // 图表颜色
    const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(240, 147, 251, 0.8)',
        'rgba(245, 87, 108, 0.8)',
        'rgba(255, 195, 113, 0.8)',
        'rgba(0, 210, 157, 0.8)',
        'rgba(78, 205, 196, 0.8)',
        'rgba(255, 107, 129, 0.8)'
    ];
    
    const config = {
        type: getChartType(chart_type),
        data: {
            labels: data.labels,
            datasets: [{
                label: result.group_by || result.metric,
                data: data.values,
                backgroundColor: colors.slice(0, data.values.length),
                borderColor: colors.slice(0, data.values.length).map(c => c.replace('0.8', '1')),
                borderWidth: 1,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: chart_type === 'pie'
                },
                title: {
                    display: true,
                    text: result.query,
                    font: {
                        size: 16
                    }
                }
            },
            scales: chart_type !== 'pie' ? {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: result.metric
                    }
                }
            } : {}
        }
    };
    
    chartInstance = new Chart(ctx, config);
}

// 获取 Chart.js 类型
function getChartType(type) {
    const map = {
        'bar': 'bar',
        'line': 'line',
        'pie': 'pie',
        'table': 'bar'
    };
    return map[type] || 'bar';
}

// 渲染数据表
function renderTable(result) {
    const table = document.getElementById('dataTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    // 清空
    thead.innerHTML = '';
    tbody.innerHTML = '';
    
    // 表头
    const headerRow = document.createElement('tr');
    result.data.columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    
    // 数据行 - 需要从原始数据重建
    // 这里简化处理，实际应该从后端返回完整数据
    result.data.labels.forEach((label, idx) => {
        const row = document.createElement('tr');
        const labelCell = document.createElement('td');
        labelCell.textContent = label;
        row.appendChild(labelCell);
        
        const valueCell = document.createElement('td');
        valueCell.textContent = result.data.values[idx];
        row.appendChild(valueCell);
        
        tbody.appendChild(row);
    });
}

// 页面加载时获取示例数据
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/data');
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            // 可以显示欢迎信息或示例数据
            console.log('数据已加载:', result.data.length, '条记录');
        }
    } catch (error) {
        console.error('加载数据失败:', error);
    }
});
