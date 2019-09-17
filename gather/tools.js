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
    let urls = getURLs();
    let unloadedUrls = await getUnloadedTopics();
    urls = urls.map(url => ({
        url: `${url}`,
        userData: {
            label: 'MAIN',
            state: 'INITIAL'
        },
    }));
    unloadedUrls = unloadedUrls.map(topic => ({
        url: topic.url,
        userData: {
            url: topic.url,
            label: 'DETAIL',
        },
    }));
    return [...urls, ...unloadedUrls];
};

exports.createRouter = globalContext => {
    return async function(routeName, requestContext) {
        const domainName = getDomainName(requestContext.request.url);
        if (!domainName) {
            log.warning(`Incorrect URL provided: ${requestContext.request.url}`);
            return;
        }
        const route = routes(domainName)[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        //log.debug(`Invoking route for ${domainName}: ${routeName}`);
        return route(requestContext, globalContext);
    };
};