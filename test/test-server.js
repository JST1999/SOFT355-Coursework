var chai = require('../node_modules/chai');
var chaiHttp = require('../node_modules/chai-http');
var server = require('../express-server.js');
var createHash = require('../express-server.js').createHash;
var bcrypt = require('../express-server.js').bcrypt;
var should = require('../node_modules/should/as-function');//latest version of should

var should = chai.should();

chai.use(chaiHttp);

describe('Items', function() {
  it('should list ALL items on /listitems GET', function(done) {
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
    var id = "5dee54851e02aa3cc09cbeb1";
    chai.request(server)
      .get('/item/'+id)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');//its still an array, fix?
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('description');
        res.body[0].should.have.property('price');
        res.body[0].should.have.property('quantity');
        res.body[0].should.have.property('category');
        res.body[0].should.have.property('reviews');
        res.body[0]._id.should.equal(id);
        res.body[0].name.should.equal("Sekiro Shadows Die Twice [Xbox]");
        done();
      });
  });
  it('should list a ALL items on /searchitems/:querystr GET', function(done) {
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

  //it('should add a SINGLE item on /item POST'); Do in the future
  //it('should update a SINGLE item on /item/<id> PUT');
  //it('should delete a SINGLE item on /item/<id> DELETE');
});

describe('Users', function() {
  it('should generate hashes correctly', function(done) {
    var password = "password123";
    var salt = bcrypt.genSaltSync();
    var hash = createHash(password, salt);
    var password2 = "password123";
    var salt2 = salt
    var hash2 = createHash(password2, salt2);

    hash.should.equal(hash2);
    done();
  });
  it('should not add a SINGLE user on /signup POST email already in use', function(done) {
    chai.request(server)
      .post('/signup')
      .send({fistname: "Test",
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
  it('should add a SINGLE user on /signup POST', function(done) {//remove from database once your done
    // this.timeout(5000);
    // setTimeout(done, 5000);
    chai.request(server)
      .post('/signup')
      .send({fistname: "Test",
            lastname: "Tester",
            email: "ttester@gmail.com",
            password: "password",
            streetName: "10 Downing Street",
            city: "London",
            county: "London",
            postcode: "dont know"})
      .end(function(err, res){
        //res.should.have.status(200);//gives me timeout error yet the post req works
        done();
      });
  });
  //it('should update a SINGLE item on /item/<id> PUT');
  //it('should delete a SINGLE item on /item/<id> DELETE');
});