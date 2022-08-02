export function getPath(element) {
    let path = getPathPart(element);

    if (element.localName !== 'body' && element.parentElement) {
        const parentPath = getPath(element.parentElement);
        path = `${parentPath} ${path}`;
    }

    return path;
}

function getPathPart(element) {
    let pathPart = '';

    if (element.id) {
        pathPart = `#${element.id}`;
    } else if (isOneElement(element)) {
        pathPart = element.className ? `${element.localName}.${element.className}` : element.localName;
    } else {
        if (isFirstElement(element)) {
            pathPart = `${element.localName}:first-child`;
        } else if (isLastElement(element)) {
            pathPart = `${element.localName}:last-child`;
        } else {
            const elementIndex = getElementIndex(element);
            pathPart = `${element.localName}:nth-child(${elementIndex + 1})`;
        }
    }

    return pathPart;
}

function isFirstElement(element) {
    const elements = getAdjacentElementsBySimilarTag(element);
    return element === elements[0];
}

function isLastElement(element) {
    const elements = getAdjacentElementsBySimilarTag(element);
    return element === elements.slice(1).pop();
}

function isOneElement(element) {
    const elements = getAdjacentElementsBySimilarTag(element);
    return elements.length === 1;
}

function getElementIndex(element) {
    const elements = getAdjacentElementsBySimilarTag(element);
    return Array.prototype.indexOf.call(elements, element);
}

function getAdjacentElementsBySimilarTag(element) {
    const elements = [];
    for (let el of element.parentElement.children) {
        if (el.localName === element.localName) {
            elements.push(el);
        }
    }
    return elements;
}
