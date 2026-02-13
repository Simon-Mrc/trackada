import {readFileSync, existsSync} from "fs";
import {join} from "path";
import {homedir} from "os";
import fs from 'fs';

const fjson = JSON.parse(readFileSync("./track.json"));
const home = join(fjson.root.replace("~", homedir()));
let allToCreate = [];

if(existsSync(home)!=true){ 
    console.log("The first thing you have to do is to create ada folder correctly");
}

if(existsSync(home)===true){
    console.log("✅ dossier ada")
    let totalBon = 0;
    for (let i = 0 ; i < fjson.projects.length ; i=i+1){
        const dossPath = join(home,fjson.projects[i].name);
        if(existsSync(dossPath)===true){
            const gitExist = existsSync(join(dossPath,".git"));
            const verif = [];
            for(let j = 0 ; j < fjson.projects[i].required.length ; j = j+1){
                const filePath = join(dossPath,fjson.projects[i].required[j]); 
                if(existsSync(filePath)===true){
                }
                else{
                    verif.push(fjson.projects[i].required[j]);
                    allToCreate.push({
                        name : fjson.projects[i].required[j],
                        type : "file",
                        adress : dossPath
                    });
                }
            }
            if(verif == "" && gitExist === true ){ 
                console.log(`✅ dossier du projet ${fjson.projects[i].name}`);
                totalBon = totalBon+1;
            }
            else{ 
                console.log(`❌ dossier du projet ${fjson.projects[i].name}`);
                if(gitExist === false){
                    console.log(`- le repository git n'est pas initialisé`);
                    allToCreate.push({
                        name : ".git",
                        type : "file",
                        adress : dossPath
                    })
                }
                if(verif.length === 1){
                    console.log(`- Il manque `+verif[0]);
                }
                else{
                    if(verif!=""){ 
                        const verifdebut = verif.slice(0,-1);
                        console.log(`- Il manque ` + verifdebut.join(`, `) + ` et ` + verif[verif.length-1]);           
                    }
                } 
            }
    
        }
        else{
            console.log(`❌ dossier du projet ${fjson.projects[i].name}`);
            console.log(`- le dossier n'existe pas où n'est pas nommé correctement`);
            allToCreate.push({
                name : fjson.projects[i].name,
                type : "folder",
                adress : home
            })
        }
    }
    const nbTotalProjets = (fjson.projects.length);
    const beforeRound = totalBon*100/nbTotalProjets;
    let pourcentage;

    if ((beforeRound-Math.floor(beforeRound)) < 0.5){
        pourcentage = Math.floor(beforeRound);
    }
    else{
        pourcentage = Math.floor(beforeRound)+1;
    }
    console.log(pourcentage+`% des projets sont initialisés correctements. (${totalBon}/${nbTotalProjets})`);
}
console.log(allToCreate);

function createMissing(){
    for (let i = 0 ; i<allToCreate.length ; i= i +1){
        if(allToCreate[i].type == "folder"){
            fs.mkdirSync(join(allToCreate[i].adress,allToCreate[i].name));
        }
        if(allToCreate[i].type == "file"){
            fs.writeFileSync(join(allToCreate[i].adress,allToCreate[i].name),``);
        }
    }

}
createMissing();