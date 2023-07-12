import { Client, DMChannel, GatewayIntentBits, Guild, GuildMember, OAuth2Guild, Role } from "discord.js";
import dotenv from "dotenv";
import { findStudent } from "./CsvReader";
dotenv.config();

const GGMGuildID = process.env.GGM || "795318898656018444";
const CampGuildID = process.env.CAMP || "1126055188239761410";

const FirstGrade = process.env.FIRSTGRADE || "1126168762316505089";
const SecondGrade = process.env.SECONDGRADE || "1126168801973649438";

const Student = process.env.STUDENT || "1126162629937860608";
const Teacher = process.env.TEACHER || "1126162287598764214";

let ggm: Guild, camp: Guild;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
    ]
});

client.on("ready", async () => {
    console.log("bot ready");

    console.log("find ggm server...");
    let guilds = await client.guilds.fetch();
    ggm = await guilds.find(guild => guild.id == GGMGuildID)?.fetch() as Guild;
    camp = await guilds.find(guild => guild.id == CampGuildID)?.fetch() as Guild;
    if(ggm == undefined || camp == undefined) {
        console.error("ggm or camp server cannot found!");
        client.destroy();
        return;
    }
    console.log(`ggm and camp server found!`);
    console.log(`ggm server: ${ggm.name}`);
    console.log(`camp server: ${camp.name}`);
});

client.on("guildMemberAdd", async (member) => {
    if(member.guild.id != CampGuildID) return;
    if(member.user.bot) return;

    console.log(`camp member join! username: ${member.user.username}`);
    let ggmMembers = await ggm.members.fetch();
    let ggmUser: GuildMember = ggmMembers.find(m => m.id == member.id) as GuildMember;
    if(ggmUser == undefined) {
        console.log(`An unregistered user enter on server. username: ${member.nickname}`);
        let dm: DMChannel = await member.createDM();
        dm.send({options: {ephemeral: true}, content: "관리자에게 수강 강좌와 학번 이름을 보내주세요. 관리자명: kwak1s1h"});
        return;
    }
    member.setNickname(ggmUser.displayName);
    
    let name: string;
    let grade: string;
    try {
        // 곽석현 (2학년) => ['곽석현 ', '2학년)']
        name = ggmUser.displayName.split('(')[0].trim();
        grade = ggmUser.displayName.split('(')[1].split(')')[0].trim();
    }
    catch(err) {
        console.log(`cannot parse name to format! str: ${ggmUser.nickname}`);
        return;
    }
    console.log(`${grade} ${name} join to camp server!`);

    if(grade == "선생님" || !grade.includes("학년")) {
        member.roles.add(await camp.roles.fetch(Teacher) as Role);
    }
    else {
        member.roles.add(await camp.roles.fetch(Student) as Role);
        member.roles.add(await camp.roles.fetch(grade == "1학년" ? FirstGrade : SecondGrade) as Role);
        let classID = findStudent(name);
        if(classID == undefined || classID.trim() == "") {
            return;
        } 
        try {
            member.roles.add(await camp.roles.fetch(classID) as Role);
        }
        catch(err) {
            console.log("class role id not found.");
            console.log(`classID : ${classID}`);
            console.log(`name: ${name}`);
        }
    }
});

client.login(process.env.TOKEN);