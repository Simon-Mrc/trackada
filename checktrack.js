import {readFileSync, existsSync} from "fs";
import {join} from "path";
import {homedir} from "os";

// fjson = Converti le fichier Json en objet format object de javascript avec keys et values
const fjson = JSON.parse(readFileSync("./track.json"));
// home = Chemin d'accés principal pour que ce soit adaptable pour plusieurs config
const home = fjson.root.replace("~", homedir());

//On commence par vérifier que le dossier ada est bien créer au bon endroit avant toute chose
if(existsSync(home)===true){
    console.log("✅ dossier ada")
    let totalBon = 0; // Le totalBon va s'incrémenter à chaque fois qu'un dossier sera "fully validated"

// Création boucle for qui va loop autant de fois qu'il y a de projets listés dans le file
    for (let i = 0 ; i < fjson.projects.length ; i=i+1){
// dossPath représente le chemin hypothétique pour chaque projets
        const dossPath = join(home,fjson.projects[i].name);// il change de valeur à chaque loop
// Si doss existe on fait la même chose pour chaque fichier censé être présent
        if(existsSync(dossPath)===true){
            const gitExist = existsSync(join(dossPath,".git"));// gitExist booléen qui permet de voir si un fichier .git est présent 
// Le const verif est une array vide qui va se remplir des noms des fichiers manquants dans chaque dossier
            const verif = [];//vide à chaque loop et se rempli différemment pour chaque dossier
// On loop autant de fois qu'il y a de fichier dans chaque projets
            for(let j = 0 ; j < fjson.projects[i].required.length ; j = j+1){
                const filePath = join(dossPath,fjson.projects[i].required[j]); //chemin hypothétique pour chaque file
                if(existsSync(filePath)===true){ // file exist on ne fait rien
                }
                else{
                    verif.push(fjson.projects[i].required[j]); // Missing file on note son nom
                }
            }
            if(verif == "" && gitExist === true ){ // tableau vide et .git présent
                console.log(`✅ dossier du projet ${fjson.projects[i].name}`);
                totalBon = totalBon+1; //Yeah !
            }
            else{ //Bouhou
                console.log(`❌ dossier du projet ${fjson.projects[i].name}`);
                if(gitExist === false){
                    console.log(`- le repository git n'est pas initialisé`);
                }
                if(verif.length === 1){
                    console.log(`- Il manque `+verif[0]);
                }
                else{
                    if(verif!=""){ //pour contrer cas de figure ou pas de .git mais pas de missing files
                        const verifdebut = verif.slice(0,-1);
                        console.log(`- Il manque ` + verifdebut.join(`, `) + ` et ` + verif[verif.length-1]);           
                    }
                } 
            }
    
        }
        else{
            console.log(`❌ dossier du projet ${fjson.projects[i].name}`);
            console.log(`- le dossier n'existe pas où n'est pas nommé correctement`);
        }
    }
    const nbTotalProjets = (fjson.projects.length);
    const beforeRound = totalBon*100/nbTotalProjets;
    let pourcentage;
// le if et else sont pour vérifier de quel entier l'arrondi est le plus proche   
    if ((beforeRound-Math.floor(beforeRound)) < 0.5){
        pourcentage = Math.floor(beforeRound);
    }
    else{
        pourcentage = Math.floor(beforeRound)+1;
    }
    console.log(pourcentage+`% des projets sont initialisés correctements. (${totalBon}/${nbTotalProjets})`);
}

else{ // par rapport au premier if si le dossier ada n'est même pas créer.
    console.log("The first thing you have to do is to create ada folder correctly");
}