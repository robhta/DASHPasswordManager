# DASHPasswordManager
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
	 - fancy GUI, since we work with Vue.
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
		 - symmetric encryption using AES-256-CBC
 - data contract:
	 - 
	 - owner: to reference data (is implicitly given)
	 - index: for identifying the path for the key.
	 - input vector: for AES-256-CBC
	 - encrypted payload
	 
 - problems we need to address:
	 - 
	 - payload padding
	 - concept for the indexing of the data (which branch of the wallet etc.)
	 - good random number generator / SHA-512, AES-256-CBC implementation
 
 - technologie stack
 	- 
	- ionic with vue https://ionicframework.com/docs/vue/overview
	- https://cryptojs.gitbook.io/docs/ for AES-256-CBC and SHA-512
	- https://www.npmjs.com/package/dash to connect with Dash and for key derivation and so on
 
 - architecture
 	-
	- ![alt text](https://github.com/PanzerknackerR/DASHPasswordManager/blob/main/doc/pictures/prototyp_architecture.png)

</details>
