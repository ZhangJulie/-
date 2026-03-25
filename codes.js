// codes.js
// 兑换码管理模块：从 codes.txt.txt 加载兑换码，支持三段式和连续12位格式

window.VALID_CODES = [];    // 存储有效兑换码
window.USED_CODES = [];     // 已使用的兑换码（存储在 localStorage）

// 加载兑换码文件（每行一个码）
async function loadCodes() {
    try {
        // 注意：您的文件名是 codes.txt.txt，所以这里请求该文件
        const response = await fetch('codes.txt.txt');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const text = await response.text();
        // 按行分割，过滤空行和前后空白
        const lines = text.split(/\r?\n/);
        window.VALID_CODES = lines
            .map(line => line.trim().toUpperCase())   // 统一转大写
            .filter(line => line.length > 0);
        
        console.log(`成功加载 ${window.VALID_CODES.length} 个兑换码`);
        return true;
    } catch (error) {
        console.error('加载兑换码文件失败:', error);
        // 可在此显示错误提示
        return false;
    }
}

// 初始化已使用码列表（从 localStorage 读取）
function initUsedCodes() {
    try {
        const stored = localStorage.getItem('USED_CODES');
        window.USED_CODES = stored ? JSON.parse(stored) : [];
    } catch (e) {
        window.USED_CODES = [];
    }
}

// 验证兑换码（支持两种格式：三段式 或 连续12位）
function validateCode(code) {
    // 统一转大写
    const upperCode = code.toUpperCase();
    // 格式校验
    const format1 = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/; // 三段式
    const format2 = /^[A-Z0-9]{12}$/;                           // 连续12位
    
    if (!format1.test(upperCode) && !format2.test(upperCode)) {
        return { valid: false, message: "无效的兑换码格式" };
    }
    if (!window.VALID_CODES.includes(upperCode)) {
        return { valid: false, message: "兑换码不存在" };
    }
    if (window.USED_CODES.includes(upperCode)) {
        return { valid: false, message: "该兑换码已使用过" };
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

// 导出全局方法
window.validateCode = validateCode;
window.markCodeAsUsed = markCodeAsUsed;

// 启动：初始化已使用列表，加载兑换码，完成后触发自定义事件
(async function() {
    initUsedCodes();
    await loadCodes();
    window.dispatchEvent(new Event('codesLoaded'));
})();
