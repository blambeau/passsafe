# Passsafe -- Keep hashed passwords a secure way, e.g. in (local) storage

Passsafe is a simple javascript utility to keep passwords securely hashed in storage and check them later. It simply encapsulates the use of standard methods (here pbkdf2) behind a nice object-oriented interface.

Passsafe uses [crypto-js](https://code.google.com/p/crypto-js/), a pure javascript dependency. Itcan therefore be used both in a node.js and browser environment, unlike many other candidates that are bound to a C/C++ library.

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

## How to remember the API?

The API might look strange at first glance, but if you understand where it comes from, you'll have no difficulty remembering it.

1. Passsafe implements a Password data abstraction, hence

        Password = require('passsafe');

2. A password has two possible representations, one in clear text and another as encrypted:

        Password.clear("some clear text password");
        Password.encrypted("some encrypted/hashed password");

3. Whatever the kind of password that you have (that is, you don't care about the actual representation once created), you can check if a password is valid:

        password = ...
        password.isValid("...")

  which is the same as checking whether two passwords are equal (denote the same value):

        p1 = Password.clear('foo');
        p2 = p1.encrypt();
        p1.equals(p2); // true
        p1.equals(p3); // false

        p3 = Password.clear('bar');
        p4 = p3.encrypt();
        p1.equals(p3); // false
        p1.equals(p4); // false

4. One you got a Password instance, you can get the string representations back:

        password = ...
        password.toClear()
        password.toEncrypted()

   However, as password hashing is one-way the following will of course fail:

        password = Password.encrypted('...')
        password.toClear() // not supported error

For more information about where this data abstraction technique comes from, see what I call [Information Contracts](http://www.finitio.io/reference/latest/information-contracts).

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
