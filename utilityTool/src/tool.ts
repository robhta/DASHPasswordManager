import prompts from 'prompts';
import { Gateway } from './gateway/toolGateway';

const topOptions = [
  { value: 'init', title: 'Create new wallet' },
  { value: 'existing', title: 'Use existing wallet' },
];

const lowOptions = [
  { value: 'connect', title: 'Connect to devnet' },
  { value: 'getAllIdentities', title: 'Get all identites of account'},
  { value: 'createIdentity', title: 'Create identity' },
  { value: 'topup', title: 'Topup identity' },
  { value: 'registerName', title: 'Register name for identity' },
  { value: 'address', title: 'Get unused address' },
  { value: 'mnemonic', title: 'Show mnemonic'},
  { value: 'fund', title: 'Show fund' },
  { value: 'name', title: 'Get identity of name' },
  { value: 'identity', title: 'Get identity' },
  { value: 'passwordmanager', title: 'Configure passwordmanager' }
];

const passwordOptions = [
  { value: 'createContract', title: 'Create contract' }
]

async function getOneIdentity(gateway: Gateway): Promise<string> {
  const identites: string[] = await gateway.getAllIdentities();

  const response = await prompts({
    type: 'select',
    name: 'identity',
    message: 'Choose identity',
    choices: identites.map(identity => ({ title: identity, value: identity }))
  });

  return response.identity;
}

async function enterString(message: string): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message,
  });

  return response.value
}

(async () => {
    const response = await prompts({
      type: 'select',
      name: 'option',
      message: 'What do you want:',
      choices: topOptions
    });

    let gateway: Gateway;

    switch(response.option) {
      // When user has no mnemonic, or want to create a new wallet
      // Gateway will be initilized with new mnemonic
      case 'init': 
        gateway = new Gateway();
        await gateway.createNewWallet();
        break;

      // When user has mnemonic, he has to enter the mnemonic first
      // Gateway will be initilized with mnemonic
      default:
        const mnemonic = await enterString('Enter mnemonic');
        gateway = new Gateway(mnemonic);
        break;
    }
    let continueProgram = true;
  
    while (continueProgram) {
      const lowResponse = await prompts({
        type: 'select',
        name: 'option',
        message: 'What do you want:',
        choices: lowOptions
      });

      switch(lowResponse.option) {
        case 'address':
          await gateway.getUnusedAdress();
          break;
        case 'mnemonic':
          gateway.getMnemonic();
          break;
        case 'fund':
          break;
        case 'registerName':
          const identityName = await getOneIdentity(gateway);
          const name = await enterString('Enter name for identity');
          await gateway.setNameForIdentity(identityName, name);
          break;
        case 'topup':
          const identityTopup = await getOneIdentity(gateway);
          await gateway.topupIdentity(identityTopup);
          break;
        case 'createIdentity':
          await gateway.createIdentity();
          break;
        case 'getAllIdentities':
          await gateway.getAllIdentities();
          break;
        case 'connect': 
          await gateway.connectToPlatform();
          break;
        case 'identity':
          const identity = await getOneIdentity(gateway);
          await gateway.getIdentity(identity);
          break;
        case 'name':
          const identityByName = await enterString('Enter name of identity');
          await gateway.getIdentityByName(identityByName);
          break;
        case 'passwordmanager':
          const pwdResponse = await prompts({
            type: 'select',
            name: 'option',
            message: 'What do you want:',
            choices: passwordOptions,
          });
          switch(pwdResponse.option) {
            case 'createContract':
              const contractIdentity = await getOneIdentity(gateway);
              await gateway.createPwdManagerContract(contractIdentity);
              break;
          }
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
