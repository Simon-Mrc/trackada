import {readFileSync, existsSync} from "fs";
import {join} from "path";
import {homedir} from "os";

const fjson = JSON.parse(readFileSync("./track.json"));
const home = fjson.root.replace("~", homedir());
let tab=[];
console.log(home)
const test1 = join(home,"projets/gis-le-adapage-Simon-Mrc/.git" )
console.log(test1);
const test = existsSync(test1);
console.log(test);
/*console.log(home);
console.log(fjson.projects.length);
const a = existsSync(home+"/adalgo");
console.log(fjson.projects[1].required[1]);
console.log(a);
console.log(home+"/"+fjson.projects[0].name);
const j=join(home,fjson.projects[0].name);
console.log(j);
*/