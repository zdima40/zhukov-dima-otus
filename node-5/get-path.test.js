import { getPath } from './get-path';
import { describe, test, expect } from 'vitest';
import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom';

describe('test getPath', async () => {
    const html = await readFile('./index.html', { encoding: 'utf-8' });
    const jsDom = new JSDOM(html);
    const document = jsDom.window.document;

    test('test getPath - #id', async () => {
        const testPath = 'body div.someclass #div-id'
        testGetPath(document, testPath);
    });

    test('test getPath - :first-child', async () => {
        const testPath = 'body div.someclass ul li:first-child';
        testGetPath(document, testPath);
    });

    test('test getPath - :nth-child', async () => {
        const testPath = 'body div.someclass ul li:nth-child(2)';
        testGetPath(document, testPath);
    });

    test('test getPath - :last-child', async () => {
        const testPath = 'body div.someclass ul li:last-child';
        testGetPath(document, testPath);
    });

});

function testGetPath(document, testPath) {
    const element = document.querySelector(testPath);
    const resultPath = getPath(element);
    expect(resultPath).toBe(testPath);

    const elements = document.querySelectorAll(resultPath);
    expect(elements.length).toBe(1);
}
