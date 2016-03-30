const compact = require('lodash/array/compact');
const assign = require('lodash/object/assign');
const defaults = require('lodash/object/defaults');
const mapValues = require('lodash/object/mapValues');

let user;
if (global.__env) {
    user  = global.__env.user;
}

let config = {
    qaSessions: {
        icon: 'users',
        disableInOnboarding: true,
    }
}
if (global.__env) {
    config = mapValues(
        global.__env.config,
        (link, key) => assign({}, link, config[key]));

}

let home = {displayName: 'Home', icon: 'home'};
let main = [];
let menu = [];
let insertCourseDropdown = false;

if(! user) {
  // non-logged in user
    defaults(home, config.www);
    insertCourseDropdown = true;
    menu.push(config.mentors);
    menu.push(config.pricing);
    menu.push(config.business);
    menu.push(config.signIn);
}

else {
    // admin, mentor
    if (/admin|mentor/.test(user.role)) {
        defaults(home, config.dashboard);
        main.push(home);

        menu.push(config.activity);
        main.push(config.qaSessions);
        menu.push(config.takeStudent);

        if (/admin/.test(user.role)) {
            menu.push(config.courses);
        }
    }
    // Student links
    else {
        // core student
        if (user.access.indexOf('core-student') >= 0) {
            defaults(home, config.dashboard);
            main.push(home);
            main.push(config.qaSessions);
        }
        // TFL student
        else if (/tfl/.test(user.student_type)) {
            assign(home, {
                host: config.projects.host,
                url: config.workshops.url
            });
            main.push(home);
        }
        // Career path or full-time student
        else {
            defaults(home, config.dashboard);
            main.push(home);
            main.push(config.qaSessions);
        }
    }

    menu.push(config.refer);
    menu.push(config.slack);
    menu.push(config.settings);
    menu.push(config.support);
    menu.push(config.signOut);
}

main = compact(main);
menu = compact(menu);

try {
    let url = location.toString();
    let domain = location.hostname.split('.').slice(-2).join('.');
    [].concat(main, menu).forEach(function (item) {
        item.active = new RegExp(item.url, 'gi').test(url);
        item.external = ! new RegExp(domain, 'gi').test(item.url);
    });
} catch (e) {}

module.exports = {
  home,
  main,
  insertCourseDropdown,
  menu
};
