"use strict";

const path = require('path');

module.exports = Franz => {
    function open_in_browser(e) {
        window.open(this.href);
        e.stopPropagation();
        e.preventDefault();
    };

    function initialise() {
        // wait for document to load
        if (document.readyState !== 'complete') {
            window.setTimeout(initialise, 50);
        }
        // wait for xhr
        var loading_el = document.querySelector('.dashboard-pane .phui-property-list-text-content');
        if (!loading_el || loading_el.innerHTML.trim() === 'Loading...') {
            window.setTimeout(initialise, 50);
        }
        // review-requested page only
		if (document.location.href !== 'https://github.com/pulls/review-requested') {
            window.setTimeout(initialise, 250);
        }

        // set badge
        var el = document.querySelector('a[href$="archived%3Afalse+is%3Aopen"]');
        if (el) {
            Franz.setBadge(parseInt(el.text.replace('Open', '').trim(), 10));
        } else {
            Franz.setBadge(0);
        }

        // open links in browser, not franz
        document.querySelectorAll('a').forEach(function(el) {
            if (!el.href) return;

            // allow clicking on the "review requests" link to refresh the page
            if (el.getAttribute('aria-label') === 'Pull Requests requesting your review') return;

            // allow auth
            if (el.href.startsWith('/auth')) return;

            el.addEventListener('click', open_in_browser);
        });
    };

    // auto-refresh
    window.setInterval(function() {
        document.location = document.location;
    }, 5 * 60 * 1000);

    Franz.injectCSS(path.join(__dirname, 'user-style.css'));
};
