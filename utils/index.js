exports.getHttpDomainName = (url="") => {
    const matches = url.match(/(https?:\/\/)(.*?)\/.+/);
    return matches && (matches[1] + matches[2]);
}

exports.getDomainName = (url="") => {
    const matches = url.match(/(https?:\/\/)(.*?)\/.+/);
    return matches && matches[2];
}

exports.trimText = (text) => {
    return text.replace(/[ \n\t]+/g, " ");
}
