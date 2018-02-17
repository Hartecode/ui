function pathWithSlug(path) {
  var mpath = path;
  if (window.__env && window.__env.config) {
    mpath = (window.__env.config.app.slug || '') + path;
  }
  return mpath;
}

function pathWithoutSlug(path) {
  var mpath = path;
  var slug = '';
  if (window.__env && window.__env.config) {
    slug = window.__env.config.app.slug || '';
  }

  if (path.indexOf(slug) == 0) {
    mpath = path.slice(slug.length);
  }

  return mpath;
}

module.exports = {
  pathWithoutSlug,
  pathWithSlug
};
