var Passsafe = require('../index.js');
var expect = require('expect.js');

describe("Passsafe", function(){

	it('allows encrypting and checking a password', function(){
		var realpass = "a password";
		var badpass  = "not the valid password";

		// create a clear passsafe instance
		var clear = Passsafe.clear(realpass);

		// encrypt it and reload an encrypted version
		var encrypted = clear.toEncrypted();
		var test = Passsafe.encrypted(encrypted);

		// check that it recognizes passwords correctly
		expect(test.isValid(realpass)).to.be(true);
		expect(test.isValid(badpass)).to.be(false);
	});

	it('returns different encrypted passwords for the same cleartext password', function(){
		var realpass = "a password";
		var enc1 = Passsafe.clear(realpass).toEncrypted();
		var enc2 = Passsafe.clear(realpass).toEncrypted();
		expect(enc1).not.to.eql(enc2);
	});

});
