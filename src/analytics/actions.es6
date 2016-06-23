const log = require('debug')('ui:analytics');
const Qs = require('qs');
const is = require('is_js');
const superagent = require('superagent');

const get = require('lodash/object/get')
const has = require('lodash/object/has')
const defaults = require('lodash/object/defaults')
const zipObject = require('lodash/array/zipObject');
const map = require('lodash/collection/map');

const urlParams = Qs.parse((window.location.search || '').substring(1));
const cookies = zipObject(map(document.cookie.split('; '), function(cookie) {
    let [name, value] = cookie.split('=');
    return [name, decodeURIComponent(value)];
}));

function app() {
    return get(global, '__env.config.app.name', '').toLowerCase();
}

function appInfo() {
    return {
        app: app(),
        appDisplayName: get(global, '__env.config.app.displayName', '').toLowerCase(),
        uiAnalytics: true,
        uiAnalyticsBackport: false
    }
}

function isLoggedIn() {
    return has(global, '__env.user') && is.object(global.__env.user);
}

function isImpersonating() {
    const inEnv = has(global, '__env.user.real_admin_tf_login');
    const inCookie = has(cookies, 'Tf-Impersonating');

    if (inEnv || inCookie) {
        console.log("No analytics for impersonating users.");
        return true;
    }

    return false;
}

// Lots of ways of trying to find the user's email
function tryEmail() {
    // Check if the user is logged in
    if (has(global, '__env.user.tf_login')) {
        return global.__env.user.tf_login;
    }

    // Check the URL parameters
    if (urlParams.email) {
        return decodeURIComponent(urlParams.email).toLowerCase()
    }

    // Try the cookies
    if (cookies.user_email) {
        return cookies.user_email;
    }

    // Check the form fields
    const emailFields = document.querySelectorAll('[name="email"]');
    if (emailFields.length && emailFields[0].value.length) {
        return emailFields[0].value;
    }
}

function getUserId(id) {
    // If logged in, always identify by user email
    if (isLoggedIn()) {
        return global.__env.user.tf_login;
    }

    // Trust hawk to supply a valid ID, but nobody else
    if (app() == 'hawk' && id) {
        // Keep Hawk-supplied ID
        return id;
    }

    // If logged out, set the id to the mixpanel ID,
    if (is.function(get(window, 'mixpanel.get_distinct_id'))) {
        return window.mixpanel.get_distinct_id();
    }

    // If we can't find mixpanel, fallback to null ID
    return null;
}

// Failsafe for if segment breaks for some reason
function fallback(callback, postData) {
    const oilbirdUrl = get(global, '__env.config.oilbird.url', '//oilbird.thinkful.com');

    superagent.
        post(`${oilbirdUrl}/echo`).
        send(postData).
        withCredentials().
        end((error, response) => {
            is.function(callback) && callback();
        });
}

function mountSegmentIO() {
    let analytics = global.analytics = global.analytics || [];
    if (!analytics.initialize) {
        if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice.");
        else {
            analytics.invoked = !0;
            analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "group", "track", "ready", "alias", "page", "once", "off", "on"];
            analytics.factory = function(t) {
                return function() {
                    let e = Array.prototype.slice.call(arguments);
                    e.unshift(t);
                    analytics.push(e);
                    return analytics
                }
            };
            for (let t = 0; t < analytics.methods.length; t++) {
                let e = analytics.methods[t];
                analytics[e] = analytics.factory(e)
            }
            analytics.load = function(t) {
                let e = global.document.createElement("script");
                e.type = "text/javascript";
                e.async = !0;
                e.src = ("https:" === global.document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
                let n = global.document.getElementsByTagName("script")[0];
                n.parentNode.insertBefore(e, n)
            };
            analytics.SNIPPET_VERSION = "3.0.1";
        }
    }

    return analytics;
}

function load(writeKey) {
    if (isImpersonating()) {
      return;
    }

    if (global.analytics) {
        return global.analytics;
    }

    const head = global.document.head;

    // Select from <meta property="x-tf-segmentio-token" content={writeKey} />
    if (!writeKey) {
        const meta = head.querySelector('meta[property=x-tf-segmentio-token]');
        writeKey = meta && meta.content;
    }

    // Select from <meta content="segmentio" data-token={writeKey} />
    if (!writeKey) {
        const meta = head.querySelector('meta[content=segmentio]');
        writeKey = meta && get(meta, 'dataset.token');
    }

    // Select from __env
    if (!writeKey && get(global, '__env.config.vendor.segment.token')) {
        writeKey = global.__env.config.vendor.segment.token;
    }

    // Raise visibility of error… analytics are important
    if (!writeKey) {
        throw new Error('SegmentIO write key is undefined');
    }

    // Mount segment script and global analytics object
    mountSegmentIO();
    // Configure with write key
    global.analytics.load(writeKey);

    // If in prod, load Mouseflow and set custom mouseflowPath
    // which allows us to track subdomains more easily.
    if (has(__env, 'env.debug') && __env.env.debug == false) {
      var mouseflowPath = document.domain + document.location.pathname;
      var _mfq = _mfq || [];
      (function() {
        var mf = document.createElement("script");
        mf.type = "text/javascript"; mf.async = true;
        mf.src = "//cdn.mouseflow.com/projects/fca2d039-aa07-4f63-8a5c-29f193acc66d.js";
        document.getElementsByTagName("head")[0].appendChild(mf);
      })();
    }

    return global.analytics;
}

// This event mirrors the call signature of global.analytics.identify
function identify(id, traits, options, fn) {
    if (isImpersonating()) {
      return;
    }

    // Argument reshuffling, from original library.
    if (is.function(options)) fn = options, options = null;
    if (is.function(traits)) fn = traits, options = null, traits = null;
    if (is.object(id)) options = traits, traits = id, id = null;

    let email = tryEmail();

    traits = defaults(traits || {}, appInfo());

    // Mixpanel Rules:
    // 1. If the user is logged out, identify by the mixpanel ID
    // 2. If you know their email, you can set that to the email trait
    // 3. On register, alias to the users emails
    // 4. Once logged in, you can safely identify by their email

    // If someone is passing in an email, let's assign it to the traits
    if (id && is.email(id)) {
        traits.email = id;
    }

    id = getUserId(id);

    global.analytics &&
        global.analytics.identify(id, traits, options, fn);
}

// This event mirrors the call signature of global.analytics.alias
function alias(to, from, options, fn) {
    if (isImpersonating()) {
      return;
    }

    // See Mixpanel rules in identify function
    if (app() != 'tailorbird' && app() != 'pelican' && app() != 'stork') {
        log('Alias should only be called on account creation, or email capture.');
        return;
    }

    // Argument reshuffling, from original library.
    if (is.function(options)) fn = options, options = null;
    if (is.function(from)) fn = from, options = null, from = null;
    if (is.object(from)) options = from, from = null;

    global.analytics &&
        global.analytics.alias(to, from, options, fn);

    // By recommendation of Mixpanel, wait 500ms and then identify by email
    setTimeout(function() {
      identify(to);

      // Create a track event so we can see exactly when a user is aliased,
      // to help us better understand everything.
      track('aliased', { 'to': to })
    }, 500);
}


// This event mirrors the call signature of global.analytics.track
function track(event, properties, options, fn) {
    if (isImpersonating()) {
      return;
    }

    // Argument reshuffling, from original library.
    if (is.function(options)) fn = options, options = null;
    if (is.function(properties)) fn = properties, options = null, properties = null;
    const localInfo = {
        email: tryEmail()
    }

    properties = defaults(properties || {}, localInfo, appInfo(), get(global, '__env.user', {}), urlParams);

    if (get(global, 'analytics.initialize')) {
        global.analytics.track(event, properties, options, fn);
    } else {
        // Wait until the document has loaded so we can reliably check if
        // Segment is actually blocked, or just still loading.
        if (document.readyState !== 'complete') {
            document.onreadystatechange = function() {
                track(event, properties, options, fn);
            }
            return;
        }

        fallback(fn, {
            'user_id': getUserId(),
            'call': 'track',
            'email': tryEmail(),
            'event': event,
            'properties': properties
        });
    }
}

// This event mirrors the call signature of global.analytics.page
function page(category, name, properties, options, fn) {
    if (isImpersonating()) {
      return;
    }

    // Argument reshuffling, from original library.
    if (is.function(options)) fn = options, options = null;
    if (is.function(properties)) fn = properties, options = properties = null;
    if (is.function(name)) fn = name, options = properties = name = null;
    if (is.object(category)) options = name, properties = category, name = category = null;
    if (is.object(name)) options = properties, properties = name, name = null;
    if (is.string(category) && !is.string(name)) name = category, category = null;

    properties = defaults(properties || {}, appInfo(), get(global, '__env.user', {}));

    global.analytics &&
        global.analytics.page(category, name, properties, options, fn);
}

module.exports = {
    load,
    identify,
    alias,
    track,
    page
}
