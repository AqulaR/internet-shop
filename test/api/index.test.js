const server = require("../../index");
const chaiHttp =  require("chai-http");
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const expect = require('expect').default
const request = require('supertest')

let jsonfile = require('jsonfile');
let file = jsonfile.readFileSync('data.json');

describe('GET requests\n', () => {
    
    describe('/GET book', () => {
        it('should GET all the books', done => {
            request(server)
                .get("/book")
                .expect(200)
                .expect((res) => {
                    expect(res.body.book).toStrictEqual(file)
                })
                .end(function(err, res) {
                  if (err) throw err;
                  done();
                });
        })
    })
    
    describe("/GET book:id", () => {
        it('should GET book by id', done => {
            request(server)
                .get('/book/0')
                .expect(200)
                .expect((res) => {
                    expect(res.body.book).toStrictEqual(file[0])
                })
                .end((err, res) => {
                    if (err) return done(err)
                    done()
                })
        })
    })

    describe("/GET book:id/users ", () => {
        it('should GET book and users', done => {
            request(server)
                .get('/book/0/users')
                .expect(200)
                .expect((res) => {
                    expect(res.body.users).toStrictEqual(file[0].users)
                })
                .end((err, res) => {
                    if (err) return done(err)
                    done()
                })
        })
    })

    describe("/GET book:id/users:id ", () => {
        it('should GET book and user with id', done => {
            request(server)
                .get('/book/0/0')
                .expect(200)
                .expect((res) => {
                    expect(res.body.user).toStrictEqual(file[0].users[0])
                })
                .end((err, res) => {
                    if (err) return done(err)
                    done()
                })
        })
    })
})
describe('POST requests\n', () => {
    describe('/POST book', () => {
        it('should POST one book', done => {
            const book = {
              id: file.length,
              amount: 1,
              name: "post-Name-of-book",
              author: "post-Author",
              relise: "post-relise-date",
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

    describe('/POST book:id/users', () => {
        it('should POST one book', done => {
            const users = {
                id: file[file.length].users.length,
                name: "Post-user-name",
                datein: "Post-user-datein",
                dateout: "Post-user-dateout"
            }
    
            request(server)
                .post(`/book/${file.length}.users`)
                .send(users)
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
})

describe("PUT requests\n", () => {
    describe("/PUT book:id", () => {
        const book = {
            amount: 1,
            name: "Put-Name-of-book",
            author: "Put-Author",
            relise: "put-relise-date"
        }
        it('should update book by PUT', done => {
            request(server)
                .put(`/book/${file.length}`)
                .send(book)
                .end((err, res) => {
                    if (err) return done(err)
                    done()
                })
        })
    })
})

describe("/DELETE book:id", () => {
    it('should delete a book', (done) => {
        request(server)
            .delete(`/book/${file.length}`)
            .expect(200)    
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })
})