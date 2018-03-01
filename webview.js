"use strict";

const path = require('path');

module.exports = Franz => {
    const getMessages = function getMessages() {
        var el = document.querySelector('a[href$="archived%3Afalse+is%3Aopen"]');
        if (!el) {
            return;
        }
        Franz.setBadge(parseInt(el.text.replace('Open', '').trim(), 10));
    };
    Franz.loop(getMessages);

    // open links in browser, not franz
    if (document.location.href == 'https://github.com/pulls/review-requested') {
        window.setInterval(function() {
            document.querySelectorAll('a').forEach(function(el) {
                if (!el.getAttribute('loc')) {
                    el.setAttribute('loc', el.href);
                    el.addEventListener('click', function(e) {
                        window.open(this.getAttribute('loc'));
                        e.stopPropagation();
                        e.preventDefault();
                    });
                }
            });
        }, 250);
    }

    Franz.injectCSS(path.join(__dirname, 'user-style.css'));
};
