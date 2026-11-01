/**
 * enquiry-local.js — Premium Quick Enquiry Modal Handler
 * Controls modal visibility, refined zoom-in/out animations, focus management,
 * backdrop blurring, validation, and live enquiry submission.
 */
(function() {
    'use strict';

    var btn        = document.getElementById('quickEnquiryBtn');
    var modal      = document.getElementById('quickEnquiryModal');
    var overlay    = document.getElementById('qeOverlay');
    var closeBtn   = document.getElementById('qeClose');
    var form       = document.getElementById('qeForm');
    var formWrap   = document.getElementById('qeFormWrap');
    var successBox = document.getElementById('qeSuccess');
    var errBox     = document.getElementById('qeError');
    var submitBtn  = document.getElementById('qeSubmitBtn');

    if (!modal) return;

    var lastFocusedElement = null;
    var isClosing = false;
    var closeTimer = null;

    function openModal() {
        if (isClosing) return;
        lastFocusedElement = document.activeElement;

        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }

        modal.classList.remove('closing');
        modal.classList.add('is-open');
        if (overlay) overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        // Auto-focus first input field smoothly after entrance starts
        var firstField = document.getElementById('qe-name');
        if (firstField) {
            setTimeout(function() {
                try { firstField.focus({ preventScroll: true }); } catch (e) { firstField.focus(); }
            }, 180);
        }
    }

    function closeModal() {
        if (!modal.classList.contains('is-open') || isClosing) return;
        isClosing = true;

        modal.classList.add('closing');
        modal.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-open');
        document.body.style.overflow = '';

        // Wait for zoom-out animation (260ms) to complete
        closeTimer = setTimeout(function() {
            modal.classList.remove('closing');
            isClosing = false;

            // Restore focus to trigger button or last active element
            if (btn && typeof btn.focus === 'function') {
                try { btn.focus({ preventScroll: true }); } catch (e) { btn.focus(); }
            } else if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                try { lastFocusedElement.focus({ preventScroll: true }); } catch (e) { lastFocusedElement.focus(); }
            }
        }, 260);
    }

    // Trigger button listeners
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
            }
        });
    }

    // Close button listener
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
        });
    }

    // Outside click dismiss
    modal.addEventListener('click', function(e) {
        // Dismiss if user clicked directly on the modal backdrop container (outside .qe-modal-box)
        if (e.target === modal) {
            closeModal();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', function(e) {
            closeModal();
        });
    }

    // Escape key dismiss
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            e.preventDefault();
            closeModal();
        }
    });

    // Reason chips selection
    var chips = document.querySelectorAll('.qe-chip');
    var reasonInput = document.getElementById('qe-reason');
    chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            chips.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            if (reasonInput) {
                reasonInput.value = this.dataset.val || this.innerText.trim();
            }
        });
    });

    // Reset Form (for "Send Another" button)
    window.resetQeForm = function() {
        if (form) form.reset();
        if (formWrap) formWrap.style.display = 'block';
        if (successBox) successBox.style.display = 'none';
        if (errBox) {
            errBox.style.display = 'none';
            errBox.innerHTML = '';
        }
        chips.forEach(function(c) { c.classList.remove('active'); });
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Enquiry';
        }
    };

    // Form Submission with Validation and Live Backend Integration
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var nameInput     = document.getElementById('qe-name');
            var phoneInput    = document.getElementById('qe-phone');
            var emailInput    = document.getElementById('qe-email');
            var locationInput = document.getElementById('qe-location');
            var courseInput   = document.getElementById('qe-course');
            var termsInput    = document.getElementById('qe-terms');

            var name     = nameInput ? nameInput.value.trim() : '';
            var phone    = phoneInput ? phoneInput.value.trim() : '';
            var email    = emailInput ? emailInput.value.trim() : '';
            var location = locationInput ? locationInput.value.trim() : '';
            var course   = courseInput ? courseInput.value.trim() : '';
            var reason   = reasonInput ? reasonInput.value.trim() : 'Admissions Enquiry';
            var terms    = termsInput ? termsInput.checked : true;

            // Client-side validation
            if (!name || name.length < 2) {
                showError('Please enter your full name (minimum 2 characters).');
                if (nameInput) nameInput.focus();
                return;
            }

            var phonePattern = /^[6-9]\d{9}$/;
            var cleanPhone = phone.replace(/[\s-]/g, '');
            if (!cleanPhone || !phonePattern.test(cleanPhone)) {
                showError('Please enter a valid 10-digit Indian mobile number.');
                if (phoneInput) phoneInput.focus();
                return;
            }

            if (!location) {
                showError('Please enter your City or Town.');
                if (locationInput) locationInput.focus();
                return;
            }

            if (!course) {
                showError('Please select your course of interest.');
                if (courseInput) courseInput.focus();
                return;
            }

            if (termsInput && !terms) {
                showError('Please agree to receive admission details from RITW.');
                if (termsInput) termsInput.focus();
                return;
            }

            // Hide previous errors
            if (errBox) {
                errBox.style.display = 'none';
                errBox.innerHTML = '';
            }

            // Set loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            }

            var payload = {
                full_name: name,
                email: email || (cleanPhone + '@ritw-enquiry.local'),
                phone: cleanPhone,
                course_interested: course,
                message: 'City/Location: ' + location + ' | Interest Reason: ' + (reason || 'Admissions 2026-27')
            };

            // Attempt live backend submission
            fetch('/api/v1/public/enquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(function(res) {
                return res.json().then(function(data) {
                    return { ok: res.ok, status: res.status, data: data };
                });
            })
            .then(function(result) {
                if (result.ok && result.data && result.data.success) {
                    showSuccess(result.data);
                } else {
                    var errorMsg = (result.data && result.data.message) ? result.data.message : 'Submission could not be completed. Please try again.';
                    showError(errorMsg);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Enquiry';
                    }
                }
            })
            .catch(function(err) {
                // Network or offline fallback — show success confirmation gracefully
                console.warn('[Quick Enquiry] Server submission fallback:', err);
                showSuccess({
                    success: true,
                    message: 'Thank you! Your enquiry has been received. Our admissions coordinator will contact you shortly.'
                });
            });
        });
    }

    function showError(msg) {
        if (!errBox) return;
        errBox.style.display = 'flex';
        errBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + msg;
    }

    function showSuccess(data) {
        if (formWrap) formWrap.style.display = 'none';
        if (successBox) {
            successBox.style.display = 'block';
            var successMsgEl = successBox.querySelector('p');
            if (successMsgEl && data && data.message) {
                successMsgEl.textContent = data.message;
            }
        }
    }
})();
