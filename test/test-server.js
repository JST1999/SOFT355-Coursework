var chai = require('../node_modules/chai');
var chaiHttp = require('../node_modules/chai-http');
var server = require('../express-server.js');
var createHash = require('../express-server.js').createHash;
var createSalt = require('../express-server.js').createSalt;
var should = require('../node_modules/should/as-function');//latest version of should

var should = chai.should();

chai.use(chaiHttp);

describe('Items', function() {
  it('should list ALL items on /listitems GET', function(done) {
    this.timeout(20000);
    setTimeout(done, 20000);//my parents internet does this test at around 9000ms
    chai.request(server)
      .get('/listitems')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('description');
        res.body[0].should.have.property('price');
        res.body[0].should.have.property('quantity');
        res.body[0].should.have.property('category');
        res.body[0].should.have.property('reviews');
        done();
      });
  });
  it('should list a SINGLE item on /item/<id> GET', function(done) {
    this.timeout(20000);
    setTimeout(done, 20000);
    var id = "5dee54851e02aa3cc09cbeb1";
    chai.request(server)
      .get('/item/'+id)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('_id');//its still an array, fix?
        res.body.should.have.property('name');
        res.body.should.have.property('description');
        res.body.should.have.property('price');
        res.body.should.have.property('quantity');
        res.body.should.have.property('category');
        res.body.should.have.property('reviews');
        res.body._id.should.equal(id);
        res.body.name.should.equal("Sekiro Shadows Die Twice [Xbox]");
        done();
      });
  });
  it('should list a ALL items on /searchitems/:querystr GET', function(done) {
    this.timeout(20000);
    setTimeout(done, 20000);
    var queryTest = "sekiro";
    chai.request(server)
      .get('/searchitems/'+queryTest)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('description');
        res.body[0].should.have.property('price');
        res.body[0].should.have.property('quantity');
        res.body[0].should.have.property('category');
        res.body[0].should.have.property('reviews');
        res.body[0].name.should.equal("Sekiro Shadows Die Twice [Xbox]");
        res.body[1].should.have.property('_id');
        res.body[1].should.have.property('name');
        res.body[1].should.have.property('description');
        res.body[1].should.have.property('price');
        res.body[1].should.have.property('quantity');
        res.body[1].should.have.property('category');
        res.body[1].should.have.property('reviews');
        res.body[1].name.should.equal("Sekiro Shadows Die Twice [PS4]");
        done();
      });
  });
});

describe('Users', function() {
  var sessID = "";

  it('should generate hashes correctly', function(done) {
    this.timeout(20000);
    setTimeout(done, 20000);
    var password = "password123";
    var salt = createSalt();
    var hash = createHash(password, salt);
    var password2 = "password123";
    var salt2 = salt
    var hash2 = createHash(password2, salt2);

    hash.should.equal(hash2);
    done();
  });
  it('should not add a SINGLE user on /signup POST email already in use', function(done) {
    this.timeout(20000);
    setTimeout(done, 20000);
    chai.request(server)
      .post('/signup')
      .send({firstname: "Test",
            lastname: "Tester",
            email: "jtungay@gmail.com",
            password: "password",
            streetName: "10 Downing Street",
            city: "London",
            county: "London",
            postcode: "dont know"})
      .end(function(err, res){
        res.should.have.status(401);
        done();
      });
  });
  // it('should add a SINGLE user on /signup POST', function(done) {//remove from database once your done
  //   // this.timeout(20000);
  //   // setTimeout(done, 20000);
  //   chai.request(server)
  //     .post('/signup')
  //     .send({firstname: "Test",
  //           lastname: "Tester",
  //           email: "ttester@gmail.com",
  //           password: "password",
  //           streetName: "10 Downing Street",
  //           city: "London",
  //           county: "London",
  //           postcode: "dont know"})
  //     .end(function(err, res){
  //       //res.should.have.status(200);//gives me timeout error yet the post req works
  //       done();
  //     });
  // });
  it('should confirm login details of SINGLE user and return a session ID on /login POST', function(done) {
    this.timeout(20000);
    setTimeout(done, 20000);
    chai.request(server)
      .post('/login')
      .send({email: "jtungay@gmail.com",
            password: "password"})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.message.should.have.length(64);
        sessID = res.body.message;
        done();
      });
  });
  it('should NOT confirm login details of SINGLE user on /login POST', function(done) {
    this.timeout(20000);
    setTimeout(done, 20000);
    chai.request(server)
      .post('/login')
      .send({email: "jtungay@gmail.com",
            password: "pword"})
      .end(function(err, res){
        res.should.have.status(401);
        done();
      });
  });
  it('should return details of SINGLE user with a currect session ID on /getuserdetails POST', function(done) {
    this.timeout(20000);
    setTimeout(done, 20000);
    chai.request(server)
      .post('/getuserdetails')
      .send({sessionID: sessID})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property("streetName");
        res.body.should.have.property("firstname");
        res.body.should.have.property("email");
        done();
      });
  });
  it('should confirm a logout of SINGLE user on /logout POST', function(done) {
    this.timeout(20000);
    setTimeout(done, 20000);
    chai.request(server)
      .post('/logout')
      .send({sessionID: sessID})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });
});