# Passsafe -- Keep hashed passwords a secure way, e.g. in (local) storage

Passsafe is a simple javascript utility to keep passwords securely hashed in storage and check them later. It simply encapsulates the use of standard methods (here pbkdf2) behind a nice object-oriented interface.

Passsafe uses crypto-js, a pure javascript dependency. Itcan therefore be used both in a node.js and browser environment, unlike many other candidates.

## Example

To hash a password:

```javascript
var Password = require('passsafe');

var cleartext = "some password coming from the user";

// `encrypted` is a simple hashed string that you can keep in a resonably
// safe way
var encrypted = Passsafe.clear(cleartext).toEncrypted();
```

To verify a password later:

```javascript
var Password = require('passsafe');

var toCheck = "some password coming from the user";
var encrypted = "..."; // (retrived from a storage location)

// check if it's the correct password
if (Password.encrypted(encrypted).isValid(toCheck)) {
  console.log("Yes, access granted!");
} else {
  console.log("No, invalid password");
}
```

## Options

Passsafe provides some options to control the hashing process. The example below illustrates how to specify your own set of options. Default options are as illustrated, so you don't have to pass them if no change is required:

```javascript
options = {
	// salt size in bytes (see CryptoJS.lib.WordArray.random)
	SALT_SIZE: 16,

	// key size in words (128 bits by default, see CryptoJS.algo.PBKDF2)
	KEY_SIZE: 128/32,

	// The number of PBKDF2 iterations
	ITERATIONS = 1000
};

// use those options in particular, at hashing time
Password.clear("a clear password", options).toEncrypted();

// ... and checking time
Password.encrypted("...", options).isValid("a clear password");
```

## How does it work?

Passsafe simply encapulates a PBKDF2 method, which is known to be secure enough provided that you ajust the key size and iterations count to your security requirements and personal paranoia.

Passsafe takes the clear password, hashes it using PBKDF2 and a fresh new random salt, then returns the salt concatenated with the hashing result:

```
salt + PBKDF2(clear, salt)
```

For checking whether a password is correct against an encrypted one, Passsafe starts by re-extracting the salt (knowing its size) then rehashes the clear password using the same salt and checks that it ends up with the same result. That's it.
