/**
 * ЗАДАЧА №1 Задача про список рекомендаций maxItemAssociation
 */
function maxItemAssociation(productsGroups) {
    function isIntersects(arr1, arr2) {
        return !!arr1.some(e => arr2.includes(e));
    }

    function filterNull(arrs) {
        return arrs.filter(arr => arr !== null);
    }

    function getUniqValues(arr) {
        const uniqSet = new Set(arr);
        return Array.from(uniqSet.values());
    }

    const copyProductsGroups = [...productsGroups]
    let groups = [];
    let groupIndex = 0;

    while (copyProductsGroups.length > 0) {
        groups[groupIndex] = copyProductsGroups.shift();
        copyProductsGroups.forEach((products, productsIndex) => {
            if (groups[groupIndex] && isIntersects(products, groups[groupIndex])) {
                groups[groupIndex].push(...products);
                copyProductsGroups[productsIndex] = null;
            }
        });
        groupIndex++;
    }

    groups = filterNull(groups);
    groups = groups.map(group => {
        const uniqGroup = getUniqValues(group);
        return uniqGroup.sort();
    })

    return groups;
}
  
const firstIn = [
    ["a", "b"],
    ["a", "c"],
    ["d", "e"]
];

const secondIn =  [
    ["q", "w", 'a'],
    ["a", "b"],
    ["a", "c"],
    ["q", "e"],
    ["q", "r"],
];

console.log(maxItemAssociation(firstIn)); // [['a', 'b', 'c'], ['d', 'e']]
console.log(maxItemAssociation(secondIn)); // [['a', 'b', 'c', 'e', 'q', 'r', 'w']]


/**
 * ЗАДАЧА №2 Написать функцию sum(1)(2)(3)....(n)() === 1 + 2 + 3 + ... + n
 */

// Вариант №1
function sum(v1) {
    let sum = v1
    return function f(v2) {
      if (v2) {
        sum += v2
        return f
      } else {
        return sum
      }
    }
  }

// Вариант №2 (скоращенный вариант №1)
function sum(v1) {
    let sum = v1
    const f = v2 => v2 ? (sum += v2, f) : sum
    return f
}
