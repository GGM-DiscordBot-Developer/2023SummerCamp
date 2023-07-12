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
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const CsvReader_1 = require("./CsvReader");
dotenv_1.default.config();
const GGMGuildID = process.env.GGM || "795318898656018444";
const CampGuildID = process.env.CAMP || "1126055188239761410";
const FirstGrade = process.env.FIRSTGRADE || "1126168762316505089";
const SecondGrade = process.env.SECONDGRADE || "1126168801973649438";
const Student = process.env.STUDENT || "1126162629937860608";
const Teacher = process.env.TEACHER || "1126162287598764214";
let ggm, camp;
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildInvites,
    ]
});
client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("bot ready");
    console.log("find ggm server...");
    let guilds = yield client.guilds.fetch();
    ggm = (yield ((_a = guilds.find(guild => guild.id == GGMGuildID)) === null || _a === void 0 ? void 0 : _a.fetch()));
    camp = (yield ((_b = guilds.find(guild => guild.id == CampGuildID)) === null || _b === void 0 ? void 0 : _b.fetch()));
    if (ggm == undefined || camp == undefined) {
        console.error("ggm or camp server cannot found!");
        client.destroy();
        return;
    }
    console.log(`ggm and camp server found!`);
    console.log(`ggm server: ${ggm.name}`);
    console.log(`camp server: ${camp.name}`);
}));
client.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () {
    if (member.guild.id != CampGuildID)
        return;
    if (member.user.bot)
        return;
    console.log(`camp member join! username: ${member.user.username}`);
    let ggmMembers = yield ggm.members.fetch();
    let ggmUser = ggmMembers.find(m => m.id == member.id);
    if (ggmUser == undefined) {
        console.log(`An unregistered user enter on server. username: ${member.nickname}`);
        let dm = yield member.createDM();
        dm.send({ options: { ephemeral: true }, content: "관리자에게 수강 강좌와 학번 이름을 보내주세요. 관리자명: kwak1s1h" });
        return;
    }
    member.setNickname(ggmUser.displayName);
    let name;
    let grade;
    try {
        // 곽석현 (2학년) => ['곽석현 ', '2학년)']
        name = ggmUser.displayName.split('(')[0].trim();
        grade = ggmUser.displayName.split('(')[1].split(')')[0].trim();
    }
    catch (err) {
        console.log(`cannot parse name to format! str: ${ggmUser.nickname}`);
        return;
    }
    console.log(`${grade} ${name} join to camp server!`);
    if (grade == "선생님" || !grade.includes("학년")) {
        member.roles.add(yield camp.roles.fetch(Teacher));
    }
    else {
        member.roles.add(yield camp.roles.fetch(Student));
        member.roles.add(yield camp.roles.fetch(grade == "1학년" ? FirstGrade : SecondGrade));
        let classID = (0, CsvReader_1.findStudent)(name);
        if (classID == undefined || classID.trim() == "") {
            return;
        }
        try {
            member.roles.add(yield camp.roles.fetch(classID));
        }
        catch (err) {
            console.log("class role id not found.");
            console.log(`classID : ${classID}`);
            console.log(`name: ${name}`);
        }
    }
}));
client.login(process.env.TOKEN);
