import prompts from 'prompts';
import { PasswordEntry, PasswordManager } from '../backend/passwordmanager';

const pwdOptions = [
    { value: 'entries', title: 'Show entries' },
    { value: 'creation', title: 'Create password' },
    { value: 'update', title: 'Update password' },
    { value: 'deletion', title: 'Delete password' },
    { value: 'testEncryption', title: 'Test encryption' }
]

const updateOptions = [
    { value: 'name', title: 'Update name' },
    { value: 'password', title: 'Update password' },
    { value: 'booth', title: 'Update booth' }
]

async function enterString(message: string): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message,
  });

  return response.value
}

async function createEntry(): Promise<PasswordEntry> {
    const name = await enterString('Enter name for password');
    const password = await enterString('Enter password');
    return {
        key: -1,
        name,
        password
    };
}

async function getOneIdentity(manager: PasswordManager): Promise<string> {
    const identites: string[] = await manager.getAllDashIdentities();
  
    const response = await prompts({
      type: 'select',
      name: 'identity',
      message: 'Choose identity',
      choices: identites.map(identity => ({ title: identity, value: identity }))
    });
  
    return response.identity;
}

async function getOnePasswordEntry(manager: PasswordManager): Promise<PasswordEntry> {
    const passwords = manager.getPasswordEntries();

    const response = await prompts({
        type: 'select',
        name: 'password',
        message: 'Choose password to see cleartext',
        choices: passwords.map(password => ({ title: password.name, value: password})),
        suggest: (input, choices) => {
            return Promise.resolve(
                choices.filter(choice => choice.value.name.toLowerCase().startsWith(input.toLowerCase()))
            );
        }
    });
    return response.password;
}

(async () => {
    const mnemonic = await enterString('Enter mnemonic to login');

    const manager = new PasswordManager(mnemonic);
    const identity = await getOneIdentity(manager);
    manager.setDashIdentity(identity);
    await manager.init();

    let continueProgram = true;

    while(continueProgram) {
        const pwdResponse = await prompts({
            type: 'select',
            name: 'pwdOption',
            choices: pwdOptions,
            message: 'What do you want to do',
        });

        switch(pwdResponse.pwdOption) {
            case 'entries': 
                const passwordEntry = await getOnePasswordEntry(manager);
                console.log('Name: ', passwordEntry.name);
                console.log('Password: ', passwordEntry.password);
                break;
            case 'creation':
                await manager.createNewPassword(await createEntry());
                break;
            case 'update':
                const passwordEntry2Update = await getOnePasswordEntry(manager);
                const updateResponse = await prompts({
                    type: 'select',
                    name: 'updateOption',
                    choices: updateOptions,
                    message: 'Which property do you want to update?'
                });
                if(updateResponse.updateOption === 'name' || updateResponse.updateOption === 'booth') {
                    passwordEntry2Update.name = await enterString('Enter name');
                }
                if(updateResponse.updateOption === 'password' || updateResponse.updateOption === 'booth') {
                    passwordEntry2Update.password = await enterString('Enter password');
                }
                await manager.updatePasswordEntry(passwordEntry2Update);
                break;
            case 'deletion':
                const passwordEntry2Delete = await getOnePasswordEntry(manager);
                await manager.deletePasswordEntry(passwordEntry2Delete);
                break;
            case 'testEncryption':
                manager.test(await createEntry());
                break;
        }

        const continueResponse = await prompts({
            type: 'confirm',
            name: 'continue',
            message: 'Do want to go ahead?'
        });
    
          continueProgram = continueResponse.continue;
    }
  }
)();
