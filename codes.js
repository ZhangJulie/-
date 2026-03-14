// codes.js
// 所有有效兑换码（初始）
window.VALID_CODES = [
    'A7B9-2K4M-PQ8R',
    'A3Z9-L1P5-T6WQ',
    'A4HJ-6K8L-2N3P',
    'A5ST-9U7V-1W2X',
    'A8N2-B4V5-C6X7',
    'A1L9-P3O4-I5U6',
    'A2W3-E4R5-T6Y7',
    'A9I0-O8P7-Z6X5',
    'A5G6-H7J8-K9L0',
    'A4B5-N6M7-Q8W9',
    'A2K3-L4Z5-X6C7',
    'A7U8-I9O0-P1Q2',
    'A3E4-R5F6-G7H8',
    'A2A3-Q4W5-E6R7',
    'A8V9-B0N1-M2K3',
    'A4P5-O6I7-U8Y9',
    'A1X2-C3V4-B5N6',
    'A9G8-F7D6-S5A4',
    'A6Y5-R4E3-W2Q1',
    'A3M4-K5J6-H7G8'
];

// 已使用兑换码（从 localStorage 读取）
window.USED_CODES = (function() {
    try {
        return JSON.parse(localStorage.getItem('USED_CODES') || '[]');
    } catch (e) {
        return [];
    }
})();

// 验证兑换码（格式、是否存在、是否已使用）
function validateCode(code) {
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
        return { valid: false, message: '无效的兑换码格式' };
    }
    if (!window.VALID_CODES.includes(code)) {
        return { valid: false, message: '兑换码不存在' };
    }
    if (window.USED_CODES.includes(code)) {
        return { valid: false, message: '该兑换码已使用过' };
    }
    return { valid: true, message: '验证通过' };
}

// 标记兑换码为已使用
function markCodeAsUsed(code) {
    if (!window.USED_CODES.includes(code)) {
        window.USED_CODES.push(code);
        localStorage.setItem('USED_CODES', JSON.stringify(window.USED_CODES));
        return true;
    }
    return false;
}

// 导出到全局
window.validateCode = validateCode;
window.markCodeAsUsed = markCodeAsUsed;
