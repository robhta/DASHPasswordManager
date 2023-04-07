# DASHPasswordManager

## Specification
[DASH Password Manager Concept](https://docs.google.com/document/d/e/2PACX-1vQ89VBwYm5t59Dg6eZlfoI33Ul5I3hu6EYboM4maz4oLZ8C3Hd2ubsH26JKT9eWhJn4I-OT_rzBAYbf/pub)

## Prerequirements
To use the password manager you need the following objects:
- Nodejs > 12 (Tested with Node16)


## Setup local devnet
At the moment testnet is not up and running. So you need to set up a local devnet environment. To do so, use the following commands:

```
sudo npm install -g dashmate

dashmate setup local

dashmate group start
```

Now your local devnet env is deployed and running.

## Create wallet and fund it
Next step is to create a wallet and fund dash to the wallet. To do so, you can use the utilityTool:
```
git clone <url of the repo>

cd DASHPasswordManager

cd ./utilityTool

npm install

npm run start
```
Now the utilityTool will start. Choose 'Create new wallet' to get a new mnemonic and a address you should fund to. (Please write down the mnemonic)

Next you need to fund to the address:
```
dashmate group stop

dashmate wallet mint 10 --address=<your address> --config=local_seed

dashmate group start
```

The mnemonic is now loaded with 10 Dash.

## Create identity and create app contract
To create the identity you can use the utilityTool again.
```
cd ./utilityTool

npm run start
```
Now choose 'Use existing wallet' and enter your mnemonic. Choose 'Create identity' to create a identity and after that choose 'Topup identity' to load some Duff to it.
The identity is now ready to interact with the Dash-Platform. Next we should go on and create the passwordmanager contract. Choose 'Configure passwordmanager' and then choose 'Create contract'. (Please write down the id of the contract, we need it later).

## Update data contract id within passwordmanager
Please open the file pwdmanager/src/backend/dash/dash.ts. In line 17 update the contractId to the id you get from the step before. Save and you are ready to rock.

## Use passwordmanager cli
```
cd pwdmanager

npm install

npm run cli
```
Enter your mnemonic. After that you can choose from one of your identities and you are ready to go. You can create, update, delete and read your passwords. Have fun!

