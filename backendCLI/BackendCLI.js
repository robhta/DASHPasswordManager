const pwd = require("../passwordmanager/src/backend/dist/PasswordManager").default;
const readlineSync = require("readline-sync");


async function passwordCLI(){
    let mnemonic = readlineSync.question("Enter your mnemonic to login: ");

    await pwd.setUpDash(mnemonic);

    while(true){
        console.log("What you wanna do?");
        console.log("1. Show Drive-Passwords");
        console.log("2. Add new Drive-Password");

        let answer = readlineSync.question("Enter number: ");

        switch(parseInt(answer)){
            case 1:
                await showDrivePasswords();
                break;
            case 2:
                await addNewDrivePassword();
                break;
        }
    }
}

async function showDrivePasswords(){
    let passwords = await pwd.getAllDashPasswords();
    console.log(passwords);
}

async function addNewDrivePassword(){
    let note = readlineSync.question("Enter note: ");
    let username = readlineSync.question("Enter username: ");
    let password = readlineSync.question("Enter password: ");

    let entry = {
        note: note,
        username: username,
        password: password
    }

    await pwd.createNewPassword(entry, true);
}


function start(){
    passwordCLI().then(r => "CLI terminated");
}

start();