# Passsafe -- Store hashed passwords a secure way

Passsafe is a simple javascript utility to keep passwords securely hashed in storage and check them later. It simply encapsulates the use of standard methods (here pbkdf2) behind a nice object-oriented interface.

Passsafe uses [crypto-js](https://code.google.com/p/crypto-js/), a pure javascript dependency. Itcan therefore be used both in a node.js and browser environment, unlike many other candidates that are bound to a C/C++ library.

## Example

To hash a password:

```javascript
var Passsafe = require('passsafe');
var hashed = Passsafe.hash("some password coming from the user");
```

To verify a password later:

```javascript
var Passsafe = require('passsafe');

var toCheck = "some password coming from the user";
var hashed  = "..."; // (retrived from a storage location)

Passsafe.isValid(toCheck, hashed)
```

## The Password Data Abstraction, i.e. the OO API

The OO API is occasionnaly useful. It might look strange at first glance, but if you understand where it comes from, you'll have no difficulty remembering it.

1. Passsafe implements a Password data abstraction, hence

        Password = require('passsafe');

2. A password has two possible representations, one in clear text and another as hashed:

        Password.clear("some clear text password");
        Password.hashed("some hashed password");

3. Whatever the kind of password that you have (that is, you don't care about the actual representation once created), you can check if a password is valid:

        password = ...
        password.isValid("...")

  which is the same as checking whether two passwords are equivalent (i.e. they denote the same value, as usual with a data abstraction):

        p1 = Password.clear('foo');
        p2 = p1.hash();
        p3 = Password.clear('bar');
        p4 = p3.hash();

        p1.equals(p1); // true, a clear text password is equal to itself
        p1.equals(p2); // true, a clear text password is equal to its hashed version
        p2.equals(p1); // true, its hashed version equals the original clear one
        p2.equals(p2); // and the hashed version is equal to itself

        p1.equals(p3); // false, a clear text password is not equal to a different one
        p1.equals(p4); // false, not to its hashed version
        p2.equals(p3); // the hashed version is not equal to another one clear
        p2.equals(p4); // nor to another hash

4. One you got a Password instance, you can get both string representations back:

        password = ...
        password.toClear()
        password.toHashed()

   However, as password hashing is one-way the following will of course fail:

        password = Password.hashed('...')
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
Password.hash("a clear password", options)

// ... and checking time
Password.isValid("a clear password", "the hashed version", options);
```

## How does it work?

Passsafe simply encapulates a PBKDF2 method, which is known to be secure enough provided that you ajust the key size and iterations count to your security requirements and personal paranoia.

Passsafe takes the clear password, hashes it using PBKDF2 and a fresh new random salt, then returns the salt concatenated with the hashing result:

```
salt + PBKDF2(clear, salt)
```

For checking whether a password is correct against an hashed one, Passsafe starts by re-extracting the salt (knowing its size) then rehashes the clear password using the same salt and checks that it ends up with the same result. That's it.
