const Reflux = require('reflux');
const superagent = require('superagent');

const SearchActions = Reflux.createActions({
  getSuggestions: { asyncResult: true }
});

SearchActions.getSuggestions.listen(function(input, config) {
  const fetchURLBase = config.useSSL
    ? `https:${config.www.url}/projects`
    : config.projects.url;
  superagent
    .get(`${fetchURLBase}/api/search/suggest`)
    .query({ input: input })
    .withCredentials()
    .end((error, response) => {
      !error && response.ok
        ? this.completed(response.body)
        : this.failed(error || response);
    });
});

module.exports = SearchActions;
