import { forEach, range } from "lodash";
import { extract, token_set_ratio } from "fuzzball";

function generateOutputColumn(
  vlookupColumn: string[],
  inputColumn: string[],
  threshold: number
) {
  // console.log({vlookupColumn, inputColumn, threshold})
  const outputColumn: string[] = [];
  const closeMatches: string[][] = [];
  const choices = vlookupColumn;

  const options = { scorer: token_set_ratio };

  forEach(inputColumn, (query) => {
    const results = extract(query, choices, options);
    // console.log({results})
    const best = results[0];
    // console.log({ best });
    if (best[1] >= threshold) {
      outputColumn.push(best[0] as string);
    } else {
      outputColumn.push("");
      const score = best[1];
      closeMatches[score] = closeMatches[score] || [];
      if (
        // @ts-ignore
        !closeMatches[score].includes([query, best[0]])
        // !closeMatches[score].includes([best[0], query])
      ) {
        // @ts-ignore
        closeMatches[score].push([query, best[0]]);
      }
    }
  });

  return [outputColumn, closeMatches];
}

// function getSimilarNames(listOfLists, companyNames, minScore = 95.0) {
//   //   const companyCount = listOfLists.length;
//   const companyIds = range(listOfLists.length);
//   const combinations = getCombinations(companyIds, 2);
//   const nameToNickName = {};
//   // { emA: n1, emB: n1 }
//   const formMap = {};
//   // { n1 : { coA: emA, coB: emB } }
//   const employeeMap = {};
//   // { coA_emA: n1, coB_emB: n1 }
//   const employeeMap2 = {};
//   // { coA: { emA: { coB : emB } } }
//   forEach(companyNames, (companyName) => {
//     employeeMap2[companyName] = {};
//   });
//   const resultMap = {};
//   // { combo1: { emIdA: emIdB } }
//   const closeMatches = {};
//   // { emA: "emC (85)" }
//   // console.log({ combinations });
//   let count = 0;
//   forEach(combinations, (combination, combIdx) => {
//     // console.log({ combination, listOfLists });
//     const coA = listOfLists[combination[0]];
//     const coAName = companyNames[combination[0]];
//     const coB = listOfLists[combination[1]];
//     const coBName = companyNames[combination[1]];
//     resultMap[combIdx] = {};
//     forEach(coA, (employeeA, idxA) => {
//       // does either name already have a nickname

//       // search thru coB for matches and get single highest match
//       const options = { scorer: token_set_ratio };

//       const results = extract(employeeA, coB, options);
//       const best = results[0];
//       // console.log({ best });
//       if (best[1] >= minScore) {
//         // employeeMap2[employeeA] = best;
//         // employeeMap2[best[0] as string] = employeeA;
//         resultMap[combIdx][idxA] = best[2];
//         let nickname = "";
//         if (nameToNickName[employeeA]) {
//           nickname = nameToNickName[employeeA];
//         } else if (nameToNickName[best[0] as string]) {
//           nickname = nameToNickName[best[0] as string];
//         } else {
//           nickname = "" + (count + 1);
//           count += 1;
//           formMap[nickname] = {};
//         }
//         nameToNickName[employeeA] = nickname;
//         nameToNickName[best[0] as string] = nickname;

//         formMap[nickname][coAName] = employeeA;
//         formMap[nickname][coBName] = best[0] as string;

//         employeeMap[`${coAName}_${employeeA}`] = nickname;
//         employeeMap[`${coBName}_${best[0] as string}`] = nickname;

//         employeeMap2[coAName][employeeA] =
//           employeeMap2[coAName][employeeA] || {};
//         employeeMap2[coAName][employeeA][coBName] = best[0];
//         employeeMap2[coBName][best[0]] = employeeMap2[coBName][best[0]] || {};
//         employeeMap2[coBName][best[0]][coAName] = employeeA;
//       } else {
//         const score = best[1];
//         closeMatches[score] = closeMatches[score] || [];
//         if (
//           !closeMatches[score].includes([employeeA, best[0]]) &&
//           !closeMatches[score].includes([best[0], employeeA])
//         ) {
//           closeMatches[score].push([employeeA, best[0]]);
//         }
//         // closeMatches[employeeA] = best[0] + ` (${best[1]})`;
//       }
//     });
//   });
//   const closeMatchesArray = [];
//   Object.keys(closeMatches).forEach((k) => {
//     if (parseInt(k) > 59) {
//       forEach(closeMatches[k], (pair) => {
//         closeMatchesArray.push({ score: k, name1: pair[0], name2: pair[1] });
//       });
//     }
//   });

//   return {
//     employeeMap,
//     employeeMap2,
//     formMap,
//     nameToNickName,
//     combinations,
//     resultMap,
//     closeMatches: closeMatchesArray.reverse(),
//     count,
//   };
// }

// // https://stackoverflow.com/a/45813619/999943
// function getCombinations(array, size) {
//   const result = [];

//   function p(t, i) {
//     if (t.length === size) {
//       result.push(t);
//       return;
//     }
//     if (i + 1 > array.length) {
//       return;
//     }
//     p(t.concat(array[i]), i + 1);
//     p(t, i + 1);
//   }

//   p([], 0);
//   return result;
// }

// var array = ['a', 'b', 'c', 'd'];

// console.log(getPermutations(array, 2));

export { generateOutputColumn };
