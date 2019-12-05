var chai = require('../node_modules/chai');
var chaiHttp = require('../node_modules/chai-http');
var server = require('../express-server.js');
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
    var id = "5de02590f0d8b627fc6c2ff9";
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
        res.body[1].name.should.equal("Sekiro Shadows Die Twice [PlayStation4]");
        done();
      });
  });

  //it('should add a SINGLE item on /item POST'); Do in the future
  //it('should update a SINGLE item on /item/<id> PUT');
  //it('should delete a SINGLE item on /item/<id> DELETE');
});