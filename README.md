# DASHPasswordManager

<details>
<summary markdown="span">run the app</summary>
	
- run inside your browser:
	-
	- you need a terminal or an IDE like webstom, where you have opened to projekt directory
	- cd passwordmanager/
	- npm install
	- ionic serve
	
- run on your phone (only android is considered now):
	-
	- you need to have a working android studio environment on your pc
	- you need a terminal or an IDE like webstom, where you have opened to projekt directory
	- cd passwordmanager/
	- npm install (if you dont have done it before)
	- ionic build
	- add in capacitor.config.json path of android studio like: "linuxAndroidStudioPath": "/snap/android-studio/current/android-studio/bin/studio.sh",
	- ionic cap add android
	- then android studio will be open and you can start the app on your device or emulator of choice

</details>

<details>
<summary markdown="span">prototype implementation</summary>
	
 - out of scope:
	 - 
	 - sharing passwords. (asymmetric cryptography)
	 - local storage of passwords
	 - fancy user-functionalities (for example, 20-character password without special characters.)
 - what we implement:
	 - 
	 - store Passwords in Dash Drive
	 - multi-device access (we implement with Ionic, so we can easily create Android-, IOS-App and Browser Extension)
	 - GUI with react
 - functionalities to be expected:
	 - 
	 - store passwords
	 - read all stored passwords 
	 - sign in with only one mnemonic
		 - choose between any desired existing identity or create a new one
			 - (We don't want to create a mnemonic, for the same reasons as Whatsdapp, so everything related to money is outsourced.)
	 - cryptographic part
		 - create and get specific hardend key (specify path)
		 - derive symmetric key using sha-512
		 - fill the payload so that it can be AES encrypted
		 - use a random number generator to generate an input vector
		 - symmetric encryption using AES-256-CBC for deriving a symmetric key 
		 - symmetric encryption using AES-256-GCM for contract encryption
 - data contract:
	 - 
	 - owner: to reference data (is implicitly given)
	 - index: for identifying the path for the key.
	 - input vector: for AES-256-GCM
	 - authentication Tag: for AES-256-GCM
	 - encrypted payload
	 
 - problems we need to address:
	 - 
	 - payload padding
	 - concept for the indexing of the data (which branch of the wallet etc.)
	 - good random number generator / SHA-512, AES-256-CBC implementation
 
 - technologie stack
 	- 
	- ionic with react https://ionicframework.com/docs/react/quickstart
	- https://nodejs.org/api/crypto.html for crypto and rng (also trezor linked this lib in their slip-16)
	- https://www.npmjs.com/package/dash to connect with Dash and for key derivation and so on
 
 - architecture
 	-
	- ![alt text](https://github.com/PanzerknackerR/DASHPasswordManager/blob/main/doc/pictures/prototyp_architecture.png)
	- ToDo: Component Login

</details>
