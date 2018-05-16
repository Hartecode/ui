const compact = require('lodash/array/compact');
const assign = require('lodash/object/assign');
const defaults = require('lodash/object/defaults');
const mapValues = require('lodash/object/mapValues');

const getLinkSet = (config, user) => {
    config = global.__env ? global.__env.config : config;
    user = global.__env ? global.__env.user : user;

    let configStub = {
        qaSessions: {
            icon: 'users',
            disableInOnboarding: true,
        },
    }
    if (config) {
        config = mapValues(
            config,
            (link, key) => assign({}, link, configStub[key]));

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

            main.push(config.qaSessions);
            menu.push({
                displayName: 'Available Students',
                host: config.lark.host,
                url: config.lark.url + '/available-students/'
            });
        }
        // Student links
        else {
            // TFL student
            if (/tfl/.test(user.student_type)) {
                assign(home, {
                    host: config.projects.host,
                    url: config.workshops.url
                });
                main.push(home);
            }
            // Core, career path, or full-time student
            else {
                defaults(home, config.dashboard);
                main.push(home);
                main.push(config.qaSessions);
            }
        }

        if (/dashboard-project-hunt-link/.test(user.access)) {
            menu.push(config.projectHunt)
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

    return {
        home,
        main,
        menu,
        insertCourseDropdown,
    }
}

module.exports = {
    getLinkSet
};
