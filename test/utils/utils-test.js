const { describe, Try } = require("riteway");
const utils = require("../../utils");

describe("getDomainName()", async assert => {
    const should = "return the correct domain name";
    const shouldNull = "return null";

    assert({
        given: "no arguments",
        should: shouldNull,
        actual: utils.getDomainName(),
        expected: null
    });

    assert({
        given: "empty url",
        should: shouldNull,
        actual: utils.getDomainName(""),
        expected: null
    });

    assert({
        given: "relative url",
        should: shouldNull,
        actual: utils.getDomainName("/some_relative_url.html"),
        expected: null
    });

    assert({
        given: "normal url",
        should: should,
        actual: utils.getDomainName("https://github.com/ericelliott/riteway"),
        expected: "github.com"
    });
});

describe("getHttpDomainName()", async assert => {
    const should = "return the correct domain name";
    const shouldNull = "return null";

    assert({
        given: "no arguments",
        should: shouldNull,
        actual: utils.getHttpDomainName(),
        expected: null
    });

    assert({
        given: "empty url",
        should: shouldNull,
        actual: utils.getHttpDomainName(""),
        expected: null
    });

    assert({
        given: "relative url",
        should: shouldNull,
        actual: utils.getHttpDomainName("/some_relative_url.html"),
        expected: null
    });

    assert({
        given: "normal url",
        should: should,
        actual: utils.getHttpDomainName("https://github.com/ericelliott/riteway"),
        expected: "https://github.com"
    });
});
