/**
Результат:
{
    "files": [
        "foo/f1.txt",
        "foo/f2.txt",
        "foo/bar/bar1.txt",
        "foo/bar/bar2.txt"
    ],
    "dirs": [
        "foo",
        "foo/bar",
        "foo/bar/baz"
    ]
}
*/
import { readdir } from 'fs/promises';
import path from 'path';
import esMain from 'es-main';

export async function tree(some_path) {
    if (!some_path) {
        throw new Error('Path argument is empty!');
    }

    let tree = { files: [], dirs: [some_path] };
    
    try {
        tree = await updateTree(tree, some_path);
    } catch (error) {
        console.error(error);
    }

    return tree;
}

async function updateTree(tree, some_path) {
    let treeCopy = { files: [...tree.files], dirs: [...tree.dirs] };

    const absolutePath = path.resolve(some_path);
    const units = await readdir(absolutePath);

    for (let unit of units) {
        const treePath = path.join(some_path, unit);
        if (path.extname(unit)) {
            treeCopy.files.push(treePath);
        } else {
            treeCopy.dirs.push(treePath);
            treeCopy = await updateTree(treeCopy, `${some_path}/${unit}`);
        }
    }

    return treeCopy;
}

if (esMain(import.meta)) {
    const pathArg = process.argv[2];
    const resultTree = await tree(pathArg);
    console.log('tree', resultTree);
}
