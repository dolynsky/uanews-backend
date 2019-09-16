const Apify = require('apify');
const routes = require('./routes').default;
const { getDomainName } = require("../utils");
const { getUnloadedTopics } = require("../models");
const getURLs = require("./urls");
const {
    utils: { log },
} = Apify;

exports.getSources = async () => {
    log.debug('Getting sources.');
    const urls = getURLs();
    const unloadedUrls = await getUnloadedTopics();
    urls = urls.map(url => ({
        url: `${url}`,
        userData: {
            label: 'MAIN',
            state: 'INITIAL'
        },
    }));
    unloadedUrls = unloadedUrls.map(url => ({
        url: `${url}`,
        userData: {
            label: 'DETAIL',
        },
    }));
    return [...urls, ...unloadedUrls];
};

exports.createRouter = globalContext => {
    return async function(routeName, requestContext) {
        const domainName = getDomainName(requestContext.request.loadedUrl);
        if (!domainName) {
            log.warning(`Incorrect URL provided: ${requestContext.request.loadedUrl}`);
            return;
        }
        const route = routes[domainName][routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route for ${domainName}: ${routeName}`);
        return route(requestContext, globalContext);
    };
};