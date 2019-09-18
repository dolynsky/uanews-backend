const cheerio = require('cheerio');
const { concat, isArray, sortBy } = require('lodash');
const { normalize } = require('./utils');

const LETTER_DEDUCTION = 0.01;

const findUniqueSelector = ($, item, parentSelector = '') => {
    let uniqueSelector = '';
    const pSelector = parentSelector ? `${parentSelector} > ` : '';
    if (item.attr('id')) {
        uniqueSelector = `${pSelector}${item.get(0).tagName}[id='${item.attr('id')}']`;
        return uniqueSelector;
    }
    let localSelector = '';
    let classes = item.attr('class') || null;
    if (classes) {
        classes = classes.split(' ');
        classes.forEach((stepClass) => {
            if (uniqueSelector) return;
            localSelector = `${pSelector}${item.tagName}.${stepClass}`;
            if ($(localSelector).length === 1) {
                uniqueSelector = localSelector;
            }
        });
        if (uniqueSelector) return uniqueSelector;
        localSelector = `${pSelector}${item.tagName}.${classes.join('.')}`;
        if ($(localSelector).length === 1) return localSelector;
    }
    return false;
};

function createFullSelector($, item) {
    const completePath = item.parentsUntil('body');
    const pathTillUnique = [];
    let foundUnique = false;
    completePath.each(function () {
        if (foundUnique) return;
        const step = $(this);
        pathTillUnique.push(step);
        foundUnique = findUniqueSelector($, step);
    }, []);
    pathTillUnique.unshift(item);
    const path = pathTillUnique.reverse().reduce((partialPath, step, index) => {
        if (index === 0 && foundUnique) {
            return foundUnique;
        }
        if (index === 0) {
            return step.get(0).tagName;
        }
        const uniquePath = findUniqueSelector($, step, partialPath);
        if (uniquePath) return uniquePath;
        return `${partialPath} > ${step.get(0).tagName}`;
    }, '');
    return path;
}

function findSimilarSelectors($, selectors) {
    return selectors
        .map((foundSelector) => {
            const { selector } = foundSelector;
            const steps = selector.split(' > ');
            let options = steps
                .reduce((lists, step, index) => {
                    const arrayPart = steps.slice(0, index + 1);
                    arrayPart[arrayPart.length - 1] = arrayPart[arrayPart.length - 1].replace(/:nth-child\(\d+\)/, '');
                    const arraySelector = arrayPart.join(' > ');
                    const childSelector = steps.slice(index + 1).join(' > ');
                    if (!arraySelector || !childSelector) return lists;
                    const parentElements = $(arraySelector);
                    const children = parentElements.find(childSelector);
                    if (children.length > 1) lists.push({ arraySelector, childSelector });
                    return lists;
                }, [])
                .reverse()
                .map(({ arraySelector, childSelector }) => {
                    const parentElements = $(arraySelector);
                    const possibleIndexes = {};
                    parentElements.each(function (index) {
                        const child = $(this).find(childSelector);
                        if (child.length > 0) possibleIndexes[index] = child.text();
                    });
                    if (Object.keys(possibleIndexes).length > 1) return { arraySelector, childSelector, possibleIndexes };
                    return null;
                })
                .filter(item => !!item);

            // if selector contains id, use only the tag and check if it returns list
            if (options.length === 0 && steps[0].indexOf('[id=') !== -1) {
                const localSteps = [...steps];
                localSteps[0] = localSteps[0].replace(/(.+)\[.+/, '$1');
                const localSelector = localSteps.join(' > ');
                const parents = $(steps[0]).parent();
                const items = parents.find(localSelector);
                if (items.length > 1) {
                    const parentSelector = createFullSelector($, parents);
                    const fullSelector = `${parentSelector} > ${localSteps.join(' > ')}`;
                    const fullSteps = fullSelector.split(' > ');
                    options = fullSteps
                        .reduce((lists, step, index) => {
                            const arrayPart = fullSteps.slice(0, index + 1);
                            if (arrayPart[arrayPart.length - 1].indexOf('nth-child') !== -1) return lists;

                            const arraySelector = arrayPart.join(' > ');
                            const childSelector = fullSteps.slice(index + 1).join(' > ');
                            if (!arraySelector || !childSelector) return lists;
                            const parentElements = $(arraySelector);
                            const children = parentElements.find(childSelector);
                            if (children.length > 1) lists.push({ arraySelector, childSelector });
                            return lists;
                        }, [])
                        .reverse()
                        .map(({ arraySelector, childSelector }) => {
                            const parentElements = $(arraySelector);
                            const possibleIndexes = {};
                            parentElements.each(function (index) {
                                const child = $(this).find(childSelector);
                                if (child.length > 0) possibleIndexes[index] = child.text();
                            });
                            if (Object.keys(possibleIndexes).length > 1) return { arraySelector, childSelector, possibleIndexes };
                            return null;
                        })
                        .filter(item => !!item);
                }
            }

            if (options.length) {
                return {
                    ...foundSelector,
                    foundInLists: options,
                };
            }
            return foundSelector;
        });
}

class DOMSearcher {
    constructor({ $, html }) {
        if (!$ && !html) throw new Error('DOMSearcher requires cheerio instance or HTML code.');
        this.$ = $ || cheerio.load(html);
        this.searchElement = this.searchElement.bind(this);
        this.findPath = this.findPath.bind(this);
        this.createSelector = this.createSelector.bind(this);
    }

    setHTML(html) {
        this.$ = cheerio.load(html);
    }

    createSelector(path, item) {
        const { $ } = this;

        const completePath = concat(path, item);

        const elementsWithId = completePath.map(step => !!step.id);
        const lastUsableID = elementsWithId.lastIndexOf(true);

        const importantPartOfPath = lastUsableID !== -1
            ? completePath.slice(lastUsableID)
            : completePath;

        const parts = importantPartOfPath.map((step, i) => {
            let classes = step.class && step.class.trim() ? `.${step.class.trim().split(' ').join('.')}` : '';
            // remove bootstrap column classes
            classes = classes.replace(/\.col-[^.]+-\d+/gi, '');
            // remove even/odd classes
            classes = classes.replace(/\.even/gi, '').replace(/\.odd/gi, '');
            if (classes === '.' || classes === '') classes = undefined;
            return {
                id: step.id,
                tag: step.tag,
                classes: classes ? classes.substr(1).split('.') : undefined,
                position: step.nthChild || i === importantPartOfPath.length - 1 ? `:nth-child(${(step.nthChild || 0) + 1})` : '',
            };
        });

        const getSelector = (step) => {
            let selector;
            if (step.id) {
                selector = `${step.tag}[id='${step.id}']`;
                if ($(selector).length === 1) return selector;
            }
            if (step.classes) {
                selector = step.classes.reduce((uniqueSelector, stepClass) => {
                    if (uniqueSelector) return uniqueSelector;

                    let classSelector = `.${stepClass}`;
                    if ($(classSelector).length === 1) return classSelector;

                    classSelector = `${step.tag}.${stepClass}`;
                    if ($(classSelector).length === 1) return classSelector;

                    return false;
                }, false);
                if (selector) return selector;
                selector = `${step.tag}.${step.classes.join('.')}`;
                if ($(selector).length === 1) return selector;
            }
            selector = `${step.tag}`;
            if ($(selector).length === 1) return selector;
            if (step.classes) return `${step.tag}.${step.classes.join('.')}`;
            return `${step.tag}${step.position}`;
        };

        let lastPart = parts.pop();
        let partialSelector = getSelector(lastPart, true);
        let selector = partialSelector;
        let options = $(selector);
        while (
            (
                options.length > 1
                || !!partialSelector.match(/(.*):nth-child\((.*)\)/)
                || !!partialSelector.match(/^(\w+)$/)
            ) && parts.length > 0
        ) {
            lastPart = parts.pop();
            partialSelector = getSelector(lastPart);
            selector = `${partialSelector} > ${selector}`;
            options = $(selector);
        }

        return selector;
    }

    searchElement(tagName, $element) {
        const { searchElement, $ } = this;

        const elementText = $element.text();
        const elementData = {
            tag: tagName,
            class: $element.attr('class'),
            id: $element.attr('id'),
        };
        const normalizedText = normalize(elementText); // to lower case to match most results
        const score = this.normalizedSearch.reduce((lastScore, searchString) => {
            console.log(`normalizedText: ${normalizedText}   searchString: ${searchString}`)
            if (normalizedText.indexOf(searchString) === -1) return lastScore;
            const remainingTextLength = normalizedText.replace(searchString, '').length;
            const searchScore = (1 + (remainingTextLength * LETTER_DEDUCTION));
            return Math.max(lastScore, searchScore);
        }, 0);

        if (score === 0) return elementData;

        elementData.textScore = score;

        const childElements = $element.children();
        if (childElements.length === 0) {
            elementData.text = elementText;
            return elementData;
        }

        const children = [];
        let hasViableChild = false;
        $element.children().each(function () {
            const index = $(this).prevAll(this.tagName).length || 0;
            const result = searchElement(this.tagName, $(this));
            children.push({ ...result, index });
            if (result.text || result.children) hasViableChild = true;
        });
        if (hasViableChild) {
            elementData.children = children;
            return elementData;
        }
        elementData.text = elementText;
        return elementData;
    }

    findPath(currentPath, item, siblings = 0, siblingClasses = {}) {
        const { findPath, createSelector } = this;
        if (item.text) {
            const selector = createSelector(currentPath, item, siblings);
            this.foundPaths.push({
                selector,
                text: item.text,
                score: (1 + (selector.split('>').length * 0.2)) * item.textScore,
            });
            return;
        }

        const uniqueClasses = item.class && item.class.split(' ').filter((itemClass) => siblingClasses[itemClass] <= 1).join(' ');

        const newPath = concat(currentPath, {
            tag: item.tag,
            id: item.id,
            class: uniqueClasses || undefined,
            nthChild: !uniqueClasses ? item.index : undefined,
        });

        const childrenClasses = item.children.reduce((classes, child) => {
            if (!child.class) return classes;
            const childClasses = child.class.split(' ');
            childClasses.forEach((childClass) => {
                if (!classes[childClass]) classes[childClass] = 1;
                else classes[childClass]++;
            });
            return classes;
        }, {});

        item.children.forEach((child) => {
            if (!child.text && !child.children) return;
            findPath(newPath, child, item.children.length - 1, childrenClasses);
        });
    }

    find(searchFor) {
        const { $, searchElement, findPath } = this;
        if (!searchFor || !isArray(searchFor)) {
            throw new Error('DOMSearcher requires array of search queries.');
        }

        this.searchFor = searchFor;
        this.normalizedSearch = searchFor.map(searchString => normalize(searchString));
        this.foundPaths = [];

        let $body = $('body');
        if (!$body.length) $body = $.root();
        $body = $body.children();
        $body
            .map(function () {
                return searchElement(this.tagName, $(this));
            }).get()
            .filter(child => child.text || child.children)
            .forEach((child) => findPath([], child));

        const sortedSelectors = sortBy(this.foundPaths, ['score']).map(({ selector, text }) => ({ selector, text }));
        const selectorsWithDetails = findSimilarSelectors($, sortedSelectors);
        return selectorsWithDetails;
    }
}

module.exports = DOMSearcher;
