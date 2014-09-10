var Passsafe = require('../index.js');
var expect = require('expect.js');

var realpass = "a password";
var badpass = "not that password";

Passsafe.DEFAULT_OPTIONS.ITERATIONS	= 1;

describe("Passsafe, the higher-level API", function(){

	it('allows hashing a password', function(){
		var hashed = Passsafe.hash(realpass);
		expect(hashed).not.to.eql(realpass);
		expect(hashed.length).to.eql(64);
	});

	it('allows verifying if a password is valid', function(){
		var hashed = Passsafe.hash(realpass);
		expect(Passsafe.isValid(realpass, hashed)).to.be(true);
		expect(Passsafe.isValid(badpass, hashed)).to.be(false);
	});

	it('returns different encrypted passwords for the same cleartext password', function(){
		var enc1 = Passsafe.hash(realpass);
		var enc2 = Passsafe.hash(realpass);
		expect(enc1).not.to.eql(enc2);
	});
});

describe("Passsafe, the lower-level API", function(){

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
			var encrypted = Passsafe.hash(realpass);
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
