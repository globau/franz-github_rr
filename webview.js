"use strict";

const path = require('path');

module.exports = Franz => {
    function open_in_browser(e) {
        window.open(this.href);
        e.stopPropagation();
        e.preventDefault();
    };

    function set_badge() {
        var el = document.querySelector('a[href$="archived%3Afalse+is%3Aopen"]');
        Franz.setBadge(el ? parseInt(el.text.replace('Open', '').trim(), 10) : 0);
    };

    function initialise() {
        // wait for document to load
        if (document.readyState !== 'complete') {
            window.setTimeout(initialise, 50);
            return;
        }
        // review-requested page only
		if (document.location.href !== 'https://github.com/pulls/review-requested') {
            window.setTimeout(initialise, 250);
            return;
        }

        // set badge
        set_badge();

        // watch for xhr page loading by observing the percentage bar
        var observer = new MutationObserver(function(mutation) {
            var loader = document.querySelector('#js-pjax-loader-bar');
            if (!loader.classList.contains('is-loading')) {
                set_badge();
            }
        });
        observer.observe(document.querySelector('#js-pjax-loader-bar'), { attributes: true });

        // open links in browser, not franz
        document.querySelectorAll('a').forEach(function(el) {
            if (!el.href) return;

            // allow clicking on the "review requests" link to refresh the page
            if (el.getAttribute('aria-label') === 'Pull Requests requesting your review') return;

            el.addEventListener('click', open_in_browser);
        });
    };
    initialise();

    // auto-refresh
    window.setInterval(function() {
        document.location = document.location;
    }, 5 * 60 * 1000);

    Franz.injectCSS(path.join(__dirname, 'user-style.css'));
};
