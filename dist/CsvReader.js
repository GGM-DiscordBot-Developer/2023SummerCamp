"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStudent = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const fileName = "data.csv";
let resultArr = [];
let classData;
InitReader();
/**
 * @returns role id of student's class
 * @param name name of student
 */
function findStudent(name) {
    for (let i = 0; i < resultArr.length; i++) {
        for (let j = 0; j < resultArr[i].length; j++) {
            if (resultArr[i][j].includes(name.trim())) {
                return classData[resultArr[0][j]];
            }
        }
    }
    return;
}
exports.findStudent = findStudent;
function InitReader() {
    return __awaiter(this, void 0, void 0, function* () {
        let context = (yield promises_1.default.readFile(path_1.default.join(__dirname, "..", "data", fileName))).toString();
        context.split("\n").filter(str => str != "").forEach(str => {
            resultArr.push(str.split(",").map(str => str.trim()));
        });
        classData = JSON.parse((yield promises_1.default.readFile(path_1.default.join(__dirname, "..", "data", "classData.json"))).toString());
    });
}
