import prompts from 'prompts';

const pwdOptions = [
    { value: 'entries', title: 'Show entries' },
    { value: 'creation', title: 'Create password' },
    { value: 'update', title: 'Update password' },
    { value: 'deletion', title: 'Delete password' },
]

async function enterString(message: string): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message,
  });

  return response.value
}

(async () => {
    const mnemonic = await enterString('Enter mnemonic to login');

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
