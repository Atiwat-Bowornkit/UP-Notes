// Ensure the script runs after the HTML is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm') || document.querySelector('form');
    const emailInput = document.getElementById('email');
    const verifyIndicator = document.getElementById('emailVerifyStatus');
    const upSsoBtn = document.getElementById('upSsoBtn');

    // Helper: Check if email belongs to University of Phayao (@up.ac.th or @g.up.ac.th)
    function isUpStudentEmail(email) {
        const lower = email.toLowerCase().trim();
        return lower.endsWith('@up.ac.th') || lower.endsWith('@g.up.ac.th');
    }

    // Real-time UP Email Verification Indicator
    if (emailInput && verifyIndicator) {
        emailInput.addEventListener('input', function() {
            const val = emailInput.value.trim();
            if (!val) {
                verifyIndicator.className = 'verify-indicator';
                verifyIndicator.innerHTML = '';
                return;
            }

            if (isUpStudentEmail(val)) {
                verifyIndicator.className = 'verify-indicator valid';
                verifyIndicator.innerHTML = '<i class="fa-solid fa-circle-check" title="ยืนยันสิทธิ์นิสิต ม.พะเยา สำเร็จ"></i>';
            } else if (val.includes('@')) {
                verifyIndicator.className = 'verify-indicator invalid';
                verifyIndicator.innerHTML = '<i class="fa-solid fa-circle-xmark" title="ต้องใช้อีเมล @up.ac.th เท่านั้น"></i>';
            } else {
                verifyIndicator.className = 'verify-indicator';
                verifyIndicator.innerHTML = '';
            }
        });
    }

    // Form Submit Event Listener with UP Email Enforcement
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                alert('กรุณากรอกข้อมูลอีเมลและรหัสผ่านให้ครบถ้วน');
                return;
            }

            // Check UP Student Email Domain
            if (!isUpStudentEmail(email)) {
                alert('❌ การเข้าสู่ระบบสงวนสิทธิ์เฉพาะนิสิตมหาวิทยาลัยพะเยาเท่านั้น!\n\nกรุณาใช้อีเมลสถาบันที่ลงท้ายด้วย @up.ac.th หรือ @g.up.ac.th');
                return;
            }

            alert(`✅ ยืนยันตัวตนสำเร็จ!\nยินดีต้อนรับนิสิต มหาวิทยาลัยพะเยา\nEmail: ${email}`);
            // Navigate to User Dashboard prototype
            window.location.href = 'nonthakorn_dashboard_user_prototype.html';
        });
    }

    // UP SSO One-Click Login Simulation
    if (upSsoBtn) {
        upSsoBtn.addEventListener('click', function() {
            const studentId = prompt('จำลองเข้าใช้งานด้วย UP WebMail SSO\nกรุณากรอกรหัสนิสิต ม.พะเยา (เช่น 66012345):', '66012345');
            if (studentId && studentId.trim()) {
                const ssoEmail = `${studentId.trim()}@up.ac.th`;
                alert(`✅ เข้าสู่ระบบผ่าน UP SSO สำเร็จ!\nบัญชีนิสิต: ${ssoEmail}`);
                window.location.href = 'nonthakorn_dashboard_user_prototype.html';
            }
        });
    }

    // Forgot Password Link Listener
    const forgotPasswordLink = document.querySelector('.forgot-link') || document.querySelector('.forgot-password a');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value.trim();

            if (!email) {
                alert('กรุณากรอกอีเมลนิสิตของคุณ (@up.ac.th) เพื่อรับลิงก์รีเซ็ตรหัสผ่าน');
                return;
            }

            if (!isUpStudentEmail(email)) {
                alert('กรุณากรอกอีเมลนิสิต ม.พะเยา (@up.ac.th หรือ @g.up.ac.th) ให้ถูกต้อง');
                return;
            }

            alert(`ส่งลิงก์กู้คืนรหัสผ่านไปยังอีเมลนิสิต: ${email} เรียบร้อยแล้ว`);
        });
    }
});

// Quick Domain Append Function for Helper Pills
function appendDomain(domain) {
    const emailInput = document.getElementById('email');
    if (!emailInput) return;

    let currentVal = emailInput.value.trim();
    if (currentVal.includes('@')) {
        currentVal = currentVal.split('@')[0];
    }

    if (currentVal) {
        emailInput.value = currentVal + domain;
    } else {
        emailInput.value = '66012345' + domain;
    }

    // Trigger input event to update verification indicator
    emailInput.dispatchEvent(new Event('input'));
    emailInput.focus();
}
