import prompts from 'prompts';
import { PasswordEntry, PasswordManager } from '../backend/passwordmanager';

const pwdOptions = [
    { value: 'entries', title: 'Show entries' },
    { value: 'creation', title: 'Create password' },
    { value: 'update', title: 'Update password' },
    { value: 'deletion', title: 'Delete password' },
    { value: 'testEncryption', title: 'Test encryption' }
]

async function enterString(message: string): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message,
  });

  return response.value
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

(async () => {
    const mnemonic = await enterString('Enter mnemonic to login');

    const manager = new PasswordManager(mnemonic);
    const identity = await getOneIdentity(manager);
    manager.setDashIdentity(identity);
    // await manager.init();

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
                break;
            case 'creation':
                break;
            case 'update':
                break;
            case 'deletion':
                break;
            case 'testEncryption':
                const name = await enterString('Enter name for password');
                const password = await enterString('Enter password');
                const passwordEntry: PasswordEntry = {
                    key: 100,
                    name,
                    password
                };
                manager.test(passwordEntry);
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
