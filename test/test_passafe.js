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

	it('returns different hashed passwords for the same cleartext password', function(){
		var enc1 = Passsafe.hash(realpass);
		var enc2 = Passsafe.hash(realpass);
		expect(enc1).not.to.eql(enc2);
	});
});

describe("Passsafe, the lower-level API", function(){

	describe('hash', function(){

		it('works on a clear password', function(){
			var password = Passsafe.clear(realpass);
			expect(password.hash()).to.be.an(Passsafe.Hashed);
		});

		it('works on an hashed password', function(){
			var hashed = Passsafe.clear(realpass).hash();
			expect(hashed.hash()).to.be(hashed);
		});

	});

	describe('unhash', function(){

		it('works on a clear password', function(){
			var password = Passsafe.clear(realpass);
			expect(password.unhash()).to.be(password);
		});

		it('fails on an hashed password', function(){
			var hashed = Passsafe.clear(realpass).hash();
			expect(function(){
				hashed.unhash();
			}).to.throwError(/not supported: password hashing works one-way/);
		});

	});

	describe('toClear', function(){

		it('works on a clear password', function(){
			var password = Passsafe.clear(realpass);
			expect(password.toClear()).to.eql(realpass);
		});

		it('fails on an hashed password', function(){
			var hashed = Passsafe.clear(realpass).hash();
			expect(function(){
				hashed.toClear();
			}).to.throwError(/not supported: password hashing works one-way/);
		});

	});

	describe('toHashed', function(){

		it('works on a clear password', function(){
			var hashed = Passsafe.hash(realpass);
			expect(hashed).not.to.eql(realpass);
			expect(hashed.length).to.eql(64);
		});

		it('works on an hashed password', function(){
			var password  = Passsafe.clear(realpass).hash();
			var hashed = password.toHashed();
			expect(hashed).not.to.eql(realpass);
			expect(hashed.length).to.eql(64);
		});

	});

	describe('isValid', function(){

		it('works on a clear password', function(){
			var password = Passsafe.clear(realpass);
			expect(password.isValid(realpass)).to.be(true);
			expect(password.isValid(badpass)).to.be(false);
		});

		it('works on an hashed password', function(){
			var password = Passsafe.clear(realpass).hash();
			expect(password.isValid(realpass)).to.be(true);
			expect(password.isValid(badpass)).to.be(false);
		});
	});

	describe('equals', function(){

		it('works on a clear password', function(){
			var p1 = Passsafe.clear(realpass);
			var p2 = p1.hash();
			var p3 = Passsafe.clear(badpass);
			var p4 = p3.hash();
			expect(p1.equals(p1)).to.be(true);
			expect(p1.equals(p2)).to.be(true);
			expect(p1.equals(p3)).to.be(false);
			expect(p1.equals(p4)).to.be(false);
		});

		it('works on an hashed password', function(){
			var p1 = Passsafe.clear(realpass);
			var p2 = p1.hash();
			var p3 = Passsafe.clear(badpass);
			var p4 = p3.hash();
			expect(p2.equals(p1)).to.be(true);
			expect(p2.equals(p2)).to.be(true);
			expect(p2.equals(p3)).to.be(false);
			expect(p2.equals(p4)).to.be(false);
		});
	});

});
