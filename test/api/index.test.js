process.env.NODE_ENV = 'test';

const request = require('supertest');
const { server } = require('../../index.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

it("ответ 200", (done) => {
	request(server) // 3
		.get("/book")
		.set("Accept", "application/json")
		// .send({ text })
		.expect(200)
		.end((err, res) => {
			if (err) {
				return done(err);
			}
		});

	done();
});


describe('Books', () => {

  describe('/GET book', () => {
      it('it should GET all the books', (done) => {
        chai.request(server)
            .get('/book')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});