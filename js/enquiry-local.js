/**
 * enquiry-local.js — Local Enquiry Modal Handler
 * Controls modal visibility, interactive chips, and transparent submission notice.
 */
(function() {
    'use strict';

    var btn      = document.getElementById('quickEnquiryBtn');
    var modal    = document.getElementById('quickEnquiryModal');
    var closeBtn = document.getElementById('qeClose');
    var form     = document.getElementById('qeForm');
    var errBox   = document.getElementById('qeError');

    if (!modal) return;

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (btn) btn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Reason chips
    var chips = document.querySelectorAll('.qe-chip');
    var reasonInput = document.getElementById('qe-reason');
    chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            chips.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            if (reasonInput) reasonInput.value = this.dataset.val || this.innerText;
        });
    });

    // Form submission handling - TRANSPARENT NOTICE (No fake success)
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = document.getElementById('qe-name').value.trim();
            var phone = document.getElementById('qe-phone').value.trim();

            if (!name || !phone) {
                if (errBox) {
                    errBox.style.display = 'flex';
                    errBox.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please fill in your name and valid mobile number.';
                }
                return;
            }

            // Transparent disclosure: Backend is disconnected in local static reconstruction
            if (errBox) {
                errBox.style.display = 'flex';
                errBox.style.background = '#fff8e1';
                errBox.style.color = '#856404';
                errBox.style.borderLeft = '4px solid #ffc107';
                errBox.innerHTML = '<div style="line-height:1.4;"><i class="fas fa-info-circle"></i> <strong>Local Offline Mode:</strong> Backend endpoint (<code>includes/enquiry-handler.php</code>) and database storage are not available in this local static reconstruction. In live production, this connects to the institutional MySQL database. For immediate assistance, please use the WhatsApp button or call <strong>+91 9121214081</strong>.</div>';
            }
        });
    }
})();
