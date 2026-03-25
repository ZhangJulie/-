// codes.js
window.VALID_CODES = [];
window.USED_CODES = [];

// 加载兑换码（支持重试和明确错误提示）
async function loadCodes() {
    const fileName = 'codes.txt';   // 请将您的文件重命名为 codes.txt
    try {
        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: 文件 ${fileName} 未找到，请确认文件名和路径`);
        }
        const text = await response.text();
        const lines = text.split(/\r?\n/);
        window.VALID_CODES = lines
            .map(line => line.trim().toUpperCase())
            .filter(line => line.length > 0);
        
        console.log(`✅ 成功加载 ${window.VALID_CODES.length} 个兑换码`);
        if (window.VALID_CODES.length === 0) {
            console.warn('⚠️ 兑换码文件为空，请检查文件内容');
        }
        return true;
    } catch (error) {
        console.error('❌ 加载兑换码失败:', error.message);
        // 在页面上显示错误，方便排查
        const msg = document.createElement('div');
        msg.style.cssText = 'position:fixed; top:10px; left:10px; background:red; color:white; padding:8px; z-index:9999;';
        msg.innerText = `兑换码加载失败：${error.message}`;
        document.body.appendChild(msg);
        return false;
    }
}

function initUsedCodes() {
    try {
        const stored = localStorage.getItem('USED_CODES');
        window.USED_CODES = stored ? JSON.parse(stored) : [];
    } catch (e) {
        window.USED_CODES = [];
    }
}

function validateCode(code) {
    const upperCode = code.toUpperCase();
    const format1 = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const format2 = /^[A-Z0-9]{12}$/;
    
    if (!format1.test(upperCode) && !format2.test(upperCode)) {
        return { valid: false, message: "无效的兑换码格式（需为 XXXX-XXXX-XXXX 或连续12位大写字母数字）" };
    }
    if (!window.VALID_CODES.includes(upperCode)) {
        return { valid: false, message: "兑换码不存在" };
    }
    if (window.USED_CODES.includes(upperCode)) {
        return { valid: false, message: "该兑换码已使用过" };
    }
    return { valid: true, message: "验证通过", code: upperCode };
}

function markCodeAsUsed(code) {
    const upperCode = code.toUpperCase();
    if (!window.USED_CODES.includes(upperCode)) {
        window.USED_CODES.push(upperCode);
        localStorage.setItem('USED_CODES', JSON.stringify(window.USED_CODES));
        return true;
    }
    return false;
}

window.validateCode = validateCode;
window.markCodeAsUsed = markCodeAsUsed;

(async function() {
    initUsedCodes();
    await loadCodes();
    window.dispatchEvent(new Event('codesLoaded'));
})();
