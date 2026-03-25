<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>兑换码系统 - 安全的一次性使用</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 {
            margin-top: 0;
            color: #333;
        }
        input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-sizing: border-box;
            margin-bottom: 12px;
        }
        button {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
        }
        button:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }
        button:hover:not(:disabled) {
            background: #0056b3;
        }
        .message {
            margin-top: 16px;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
        }
        .success {
            background: #d4edda;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
        }
        .info {
            background: #e2e3e5;
            color: #383d41;
        }
        hr {
            margin: 20px 0;
        }
        .debug {
            font-size: 12px;
            color: #666;
            margin-top: 20px;
            word-break: break-all;
        }
    </style>
</head>
<body>
<div class="card">
    <h2>🎁 兑换码系统</h2>
    <p>请输入您的兑换码（支持 <code>XXXX-XXXX-XXXX</code> 或连续12位大写字母数字）</p>
    <input type="text" id="codeInput" placeholder="例如: A1B2-C3D4-E5F6 或 B7A2C3D4E5F6" autocomplete="off">
    <button id="redeemBtn">兑换</button>
    <div id="message" class="message info" style="display: none;"></div>
    <hr>
    <div class="debug">
        <strong>系统状态</strong><br>
        <span id="status">初始化中...</span>
    </div>
</div>

<script>
    // ==================== 兑换码核心模块 ====================
    window.VALID_CODES = [];    // 有效兑换码列表
    window.USED_CODES = [];     // 已使用兑换码（存储在 localStorage）

    // 加载兑换码文件 (codes.txt)
    async function loadCodes() {
        try {
            const response = await fetch('codes.txt');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: 文件 codes.txt 不存在或无法访问`);
            }
            const text = await response.text();
            const lines = text.split(/\r?\n/);
            window.VALID_CODES = lines
                .map(line => line.trim().toUpperCase())
                .filter(line => line.length > 0);
            console.log(`✅ 成功加载 ${window.VALID_CODES.length} 个兑换码`);
            return true;
        } catch (error) {
            console.error('❌ 加载兑换码失败:', error);
            document.getElementById('status').innerHTML = `❌ 加载失败: ${error.message}`;
            return false;
        }
    }

    // 初始化已使用码列表
    function initUsedCodes() {
        try {
            const stored = localStorage.getItem('USED_CODES');
            window.USED_CODES = stored ? JSON.parse(stored) : [];
        } catch (e) {
            window.USED_CODES = [];
        }
    }

    // 验证兑换码（格式、存在性、是否已使用）
    function validateCode(code) {
        const upperCode = code.toUpperCase();
        const format1 = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/; // 三段式
        const format2 = /^[A-Z0-9]{12}$/;                           // 连续12位

        if (!format1.test(upperCode) && !format2.test(upperCode)) {
            return { valid: false, message: "无效的兑换码格式（需为 XXXX-XXXX-XXXX 或连续12位大写字母数字）" };
        }
        if (!window.VALID_CODES.includes(upperCode)) {
            return { valid: false, message: "兑换码不存在" };
        }
        if (window.USED_CODES.includes(upperCode)) {
            return { valid: false, message: "该兑换码已使用过，无法重复兑换" };
        }
        return { valid: true, message: "验证通过", code: upperCode };
    }

    // 标记兑换码为已使用
    function markCodeAsUsed(code) {
        const upperCode = code.toUpperCase();
        if (!window.USED_CODES.includes(upperCode)) {
            window.USED_CODES.push(upperCode);
            localStorage.setItem('USED_CODES', JSON.stringify(window.USED_CODES));
            return true;
        }
        return false;
    }

    // 模拟奖励发放（实际开发中可替换为调用后端API）
    // 返回 Promise，成功 resolve，失败 reject
    async function grantReward(code) {
        // 模拟异步操作（例如发送请求到服务器）
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟成功概率 90%，失败概率 10%（用于测试重试）
                const success = Math.random() > 0.1;
                if (success) {
                    console.log(`奖励发放成功: ${code}`);
                    resolve();
                } else {
                    reject(new Error("奖励发放失败，请稍后重试"));
                }
            }, 1500);
        });
    }

    // 显示消息
    function showMessage(text, type) {
        const msgDiv = document.getElementById('message');
        msgDiv.textContent = text;
        msgDiv.className = `message ${type}`;
        msgDiv.style.display = 'block';
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 3000);
    }

    // 更新状态显示
    function updateStatus() {
        const statusSpan = document.getElementById('status');
        statusSpan.innerHTML = `✅ 已加载 ${window.VALID_CODES.length} 个有效兑换码<br>
                                📋 已使用 ${window.USED_CODES.length} 个兑换码 (存储在浏览器中)`;
    }

    // ==================== 页面初始化与交互 ====================
    (async function() {
        initUsedCodes();
        await loadCodes();
        updateStatus();

        const btn = document.getElementById('redeemBtn');
        const input = document.getElementById('codeInput');
        let isProcessing = false;  // 防止重复点击

        btn.addEventListener('click', async () => {
            if (isProcessing) return;
            const rawCode = input.value.trim();
            if (!rawCode) {
                showMessage('请输入兑换码', 'error');
                return;
            }

            // 第一步：验证码的有效性（未使用）
            const result = validateCode(rawCode);
            if (!result.valid) {
                showMessage(`❌ ${result.message}`, 'error');
                input.value = '';
                return;
            }

            // 第二步：开始兑换流程（锁定按钮，避免重复）
            isProcessing = true;
            btn.disabled = true;
            showMessage('⏳ 正在处理兑换，请稍候...', 'info');

            try {
                // 第三步：发放奖励（关键步骤）
                await grantReward(result.code);
                // 第四步：奖励发放成功，标记为已使用
                markCodeAsUsed(result.code);
                showMessage(`🎉 兑换成功！ ${result.message}`, 'success');
                updateStatus();  // 更新已使用数量
                input.value = '';
            } catch (error) {
                // 奖励发放失败，不标记，码仍可重试
                console.error('奖励发放失败:', error);
                showMessage(`⚠️ 兑换失败：${error.message}，请稍后重试`, 'error');
                // 不清空输入框，方便用户重试
            } finally {
                isProcessing = false;
                btn.disabled = false;
                // 如果失败，不清空输入框；成功已清空，这里再确保一次
                if (input.value.trim() === rawCode && result.valid && !window.USED_CODES.includes(result.code)) {
                    // 失败时保留输入内容
                } else if (window.USED_CODES.includes(result.code)) {
                    input.value = '';
                }
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !isProcessing) {
                btn.click();
            }
        });

        // 调试接口
        window.debug = {
            validateCode,
            markCodeAsUsed,
            getValidCodes: () => window.VALID_CODES,
            getUsedCodes: () => window.USED_CODES
        };
        console.log('兑换码系统已就绪，可使用 debug 对象进行调试');
    })();
</script>
</body>
</html>
