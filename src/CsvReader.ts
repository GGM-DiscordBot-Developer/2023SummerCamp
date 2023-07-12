import fs from "fs/promises";
import path from "path";
import csv from "csv-parser";

const fileName = "data.csv";

let resultArr: string[][] = [];
let classData: { [key: string] : string };
InitReader();

/**
 * @returns role id of student's class
 * @param name name of student
 */
export function findStudent(name: string): string | undefined {
    for(let i = 0; i < resultArr.length; i++) {
        for(let j = 0; j < resultArr[i].length; j++) {
            if(resultArr[i][j].includes(name.trim())) {
                return classData[resultArr[0][j]];
            }
        }
    }
    return;
}

async function InitReader() {
    let context: string = (await fs.readFile(path.join(__dirname, "..", "data", fileName))).toString();
    context.split("\n").filter(str => str != "").forEach(str => {
        resultArr.push(str.split(",").map(str => str.trim()));
    });
    classData = JSON.parse((await fs.readFile(path.join(__dirname, "..", "data", "classData.json"))).toString());
}