const server = require("../../index");
const chaiHttp =  require("chai-http");
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const expect = require('expect').default
const request = require('supertest')

let jsonfile = require('jsonfile');
let file = jsonfile.readFileSync('data.json');

describe('/GET book', () => {
    it('should GET all the books', done => {
        request(server)
            .get("/book")
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;
              done();
            });
    })
})

describe('/POST book', () => {
    it('should POST one book', done => {
        const book = {
          id: file.length,
          amount: 1,
          name: "Name-of-book",
          author: "Author",
          relise: "relise-date",
          users: []
        }

        request(server)
            .post('/book')
            .send(book)
            .expect(200)
            .expect((res) => {
                expect((res.body).length).toStrictEqual(file.length + 1)
            })
            .end((err, res) => {
                if (err) return done(err)
                done()
            });
    })
});

describe("/GET book :id", () => {
    it('should GET book by id', done => {
        request(server)
            .get('/book/0')
            .send(JSON.stringify(file[0], null, '\t'))
            .expect(200)
            .expect((res) => {
                console.log(res.body)
                expect((res.body).id).toStrictEqual(3)
            })
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })
})

describe("/PUT book :id", () => {
    const book = {
        name: "Take a Bow",
        giveDate: "01.06.2022",
        backDate: "30.06.2023",
        author: "Прокл Лыткин",
    }
    it('should update book by PUT', done => {
        request(server)
            .put('/api/book/3')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql("book has been edited")
                done()
            })
    })
})
