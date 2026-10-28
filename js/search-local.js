/**
 * search-local.js — Client-Side Instant Search for Local RITW Website
 * Powered by local sitemap index (347 pages & documents)
 */
(function () {
    'use strict';

    var modal   = document.getElementById('ritwSearchModal');
    var input   = document.getElementById('ritwSearchInput');
    var closeBtn= document.getElementById('ritwSearchClose');
    var results = document.getElementById('ritwSearchResults');
    var inner   = document.getElementById('ritwSearchResultsInner');
    var footer  = document.getElementById('ritwSearchFooter');
    var allLink = document.getElementById('ritwSearchAllLink');

    if (!modal || !input) return;

    var debounceTimer = null;
    var currentQuery  = '';

    // Determine path prefix based on current page location
    var isSubPage = window.location.pathname.includes('/about/') ||
                    window.location.pathname.includes('/departments/') ||
                    window.location.pathname.includes('/admissions/') ||
                    window.location.pathname.includes('/placements/') ||
                    window.location.pathname.includes('/contact/');
    var pathPrefix = isSubPage ? '../' : '';

    var CAT_COLORS = {
        'Admissions':  '#c62828', 'Departments': '#1565c0', 'Academics':   '#2e7d32',
        'Facilities':  '#00838f', 'About':       '#4527a0', 'Approvals':   '#558b2f',
        'IQAC':        '#6d4c41', 'NIRF':        '#00695c', 'Placements':  '#0277bd',
        'Committees':  '#6a1a9a', 'Research':    '#283593', 'Documents':   '#37474f',
        'Gallery':     '#6a1a9a', 'NSS':         '#ad1457', 'Media':       '#0277bd',
        'General':     '#842db8'
    };
    function catColor(cat) { return CAT_COLORS[cat] || '#842db8'; }

    function openModal() {
        modal.removeAttribute('hidden');
        modal.offsetHeight;
        modal.classList.add('rsm-open');
        document.body.style.overflow = 'hidden';
        setTimeout(function () { input.focus(); }, 60);
    }

    function closeModal() {
        modal.classList.remove('rsm-open');
        document.body.style.overflow = '';
        setTimeout(function () {
            modal.setAttribute('hidden', '');
            input.value = '';
            clearResults();
        }, 180);
    }

    window.ritwOpenSearch = function (q) {
        openModal();
        if (q) {
            input.value = q;
            doSearch(q);
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (modal.hasAttribute('hidden')) openModal();
            else closeModal();
        }
    });

    input.addEventListener('input', function () {
        var q = input.value.trim();
        clearTimeout(debounceTimer);
        if (q.length < 2) { clearResults(); return; }
        debounceTimer = setTimeout(function () { doSearch(q); }, 120);
    });

    function doSearch(q) {
        currentQuery = q;
        var queryLower = q.toLowerCase();
        var index = window.RITW_SEARCH_INDEX || [];

        var matched = index.filter(function (item) {
            return item.title.toLowerCase().includes(queryLower) ||
                   item.category.toLowerCase().includes(queryLower);
        });

        renderResults({
            total: matched.length,
            results: matched.slice(0, 8)
        }, q);
    }

    function renderResults(data, q) {
        inner.innerHTML = '';
        results.removeAttribute('hidden');

        if (!data.results || data.results.length === 0) {
            inner.innerHTML = '<div class="rsm-state"><i class="fas fa-search-minus"></i> No results found for "' + esc(q) + '"</div>';
            if (footer) footer.setAttribute('hidden', '');
            return;
        }

        data.results.forEach(function (r) {
            var color = catColor(r.category);
            var icon  = r.type === 'pdf' ? 'fa-file-pdf' : 'fa-file-alt';
            var a     = document.createElement('a');
            
            var targetUrl = r.url;
            if (!targetUrl.startsWith('http')) {
                targetUrl = pathPrefix + targetUrl.replace(/^\.\.\//, '');
            }
            a.href = targetUrl;
            a.className = 'rsm-item';
            if (r.type === 'pdf' || targetUrl.startsWith('http')) a.target = '_blank';
            
            a.innerHTML =
                '<span class="rsm-item-icon" style="background:' + color + ';">' +
                    '<i class="fas ' + icon + '"></i>' +
                '</span>' +
                '<span class="rsm-item-body">' +
                    '<div class="rsm-item-title">' + highlight(esc(r.title), q) + '</div>' +
                    (r.snippet ? '<div class="rsm-item-snippet">' + esc(r.snippet) + '</div>' : '') +
                '</span>' +
                '<span class="rsm-item-cat">' + esc(r.category) + '</span>';
            inner.appendChild(a);
        });

        if (footer && allLink) {
            allLink.innerHTML = 'Showing top ' + data.results.length + ' of ' + data.total + ' results';
            footer.removeAttribute('hidden');
        }
    }

    function clearResults() {
        results.setAttribute('hidden', '');
        inner.innerHTML = '';
        if (footer) footer.setAttribute('hidden', '');
    }

    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function highlight(safeStr, q) {
        if (!q) return safeStr;
        var words = q.trim().split(/\s+/).filter(function(w){ return w.length >= 2; });
        var re = new RegExp('(' + escRe(esc(q)) + ')', 'gi');
        safeStr = safeStr.replace(re, '<mark>$1</mark>');
        words.forEach(function(w) {
            var wr = new RegExp('(' + escRe(esc(w)) + ')', 'gi');
            safeStr = safeStr.replace(wr, '<mark>$1</mark>');
        });
        return safeStr;
    }

    function escRe(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var triggers = document.querySelectorAll('.ritw-search-trigger');
        triggers.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                openModal();
            });
        });
    });
}());
