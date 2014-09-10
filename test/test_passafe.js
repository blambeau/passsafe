var Passsafe = require('../index.js');
var expect = require('expect.js');

Passsafe.DEFAULT_OPTIONS.ITERATIONS	= 1;

describe("Passsafe", function(){

	var realpass = "a password";
	var badpass = "not that password";

	it('allows encrypting and checking a password', function(){
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
		var enc1 = Passsafe.clear(realpass).toEncrypted();
		var enc2 = Passsafe.clear(realpass).toEncrypted();
		expect(enc1).not.to.eql(enc2);
	});

	describe('encrypt', function(){

		it('works on a clear password', function(){
			var password = Passsafe.clear(realpass);
			expect(password.encrypt()).to.be.an(Passsafe.Encrypted);
		});

		it('works on an encrypted password', function(){
			var encrypted = Passsafe.clear(realpass).encrypt();
			expect(encrypted.encrypt()).to.be(encrypted);
		});

	});

	describe('decrypt', function(){

		it('works on a clear password', function(){
			var password = Passsafe.clear(realpass);
			expect(password.decrypt()).to.be(password);
		});

		it('fails on an encrypted password', function(){
			var encrypted = Passsafe.clear(realpass).encrypt();
			expect(function(){
				encrypted.decrypt();
			}).to.throwError(/not supported: password hashing works one-way/);
		});

	});

	describe('toClear', function(){

		it('works on a clear password', function(){
			var password = Passsafe.clear(realpass);
			expect(password.toClear()).to.eql(realpass);
		});

		it('fails on an encrypted password', function(){
			var encrypted = Passsafe.clear(realpass).encrypt();
			expect(function(){
				encrypted.toClear();
			}).to.throwError(/not supported: password hashing works one-way/);
		});

	});

	describe('toEncrypted', function(){

		it('works on a clear password', function(){
			var encrypted = Passsafe.clear(realpass).toEncrypted();
			expect(encrypted).not.to.eql(realpass);
			expect(encrypted.length).to.eql(64);
		});

		it('works on an encrypted password', function(){
			var password  = Passsafe.clear(realpass).encrypt();
			var encrypted = password.toEncrypted();
			expect(encrypted).not.to.eql(realpass);
			expect(encrypted.length).to.eql(64);
		});

	});

	describe('isValid', function(){

		it('works on a clear password', function(){
			var password = Passsafe.clear(realpass);
			expect(password.isValid(realpass)).to.be(true);
			expect(password.isValid(badpass)).to.be(false);
		});

		it('works on an encrypted password', function(){
			var password = Passsafe.clear(realpass).encrypt();
			expect(password.isValid(realpass)).to.be(true);
			expect(password.isValid(badpass)).to.be(false);
		});
	});

	describe('equals', function(){

		it('works on a clear password', function(){
			var p1 = Passsafe.clear(realpass);
			var p2 = p1.encrypt();
			var p3 = Passsafe.clear(badpass);
			var p4 = p3.encrypt();
			expect(p1.equals(p1)).to.be(true);
			expect(p1.equals(p2)).to.be(true);
			expect(p1.equals(p3)).to.be(false);
			expect(p1.equals(p4)).to.be(false);
		});

		it('works on an encrypted password', function(){
			var p1 = Passsafe.clear(realpass);
			var p2 = p1.encrypt();
			var p3 = Passsafe.clear(badpass);
			var p4 = p3.encrypt();
			expect(p2.equals(p1)).to.be(true);
			expect(p2.equals(p2)).to.be(true);
			expect(p2.equals(p3)).to.be(false);
			expect(p2.equals(p4)).to.be(false);
		});
	});

});
