<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>兑换码测试</title>
</head>
<body>
    <input type="text" id="codeInput" placeholder="请输入兑换码">
    <button id="redeemBtn">兑换</button>
    <div id="message"></div>

    <script src="codes.js"></script>
    <script>
        // 等待兑换码加载完成后再绑定事件
        window.addEventListener('codesLoaded', function() {
            const btn = document.getElementById('redeemBtn');
            const input = document.getElementById('codeInput');
            const msg = document.getElementById('message');
            
            btn.addEventListener('click', function() {
                const code = input.value.trim().toUpperCase(); // 统一转大写
                const result = validateCode(code);
                if (result.valid) {
                    markCodeAsUsed(code);
                    msg.innerHTML = '✅ ' + result.message;
                    // 这里可以添加发放奖励的逻辑
                } else {
                    msg.innerHTML = '❌ ' + result.message;
                }
            });
        });
    </script>
</body>
</html>
