process.env.NODE_ENV = 'test';

let chai = require('chai') //https://www.chaijs.com/api/bdd/
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp); 

var word_id;

describe('Words', () => {

    describe('POST /create [create]', () => {
        it('it should NOT create new word', (done) => {
            let word = {
                phrase: '' //empty
            }
            chai.request(server)
                .post('/api/words/create')
                .send(word)
                .end((err, res) => {
                    res.should.have.status(400)
                    done();
                });
        })
    })


    describe('POST /create [create]', () => {
        it('it should create new word', (done) => {
            _NAME = 'PHRASE'
            let word = {
                phrase: _NAME,
                hws: 'HWS',
                speechpart: 'SPEECHPART',
                sentence: 'SENTENCE',
                translation: 'TRANSLATION',
                examples: 'EXAMPLE',
                tags : 'A',
                counter : 0,
            }
            chai.request(server)
                .post('/api/words/create')
                .send(word)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('phrase').eql(_NAME)                    
                    word_id = res.body._id
                    console.log('word_id', word_id)
                    done();
                });
        })
    })

    describe('GET / [findAll]', () => {
        it('it should get all the words', (done) => {
            chai.request(server) 
                .get('/api/words/')
                .end((err, res) => {
                    res.should.have.status(200)
                    done();
                });
        })
    })

    describe('GET /find/:id [findOne]', () => {
        it('it should find a word '+word_id, (done) => {
            chai.request(server) 
                .get('/api/words/find/'+word_id)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('_id').eql(word_id)
                    done()
                })
        })
    })

    describe('GET /findtop10toremind [findTop10ToRemind]', () => {
        it('it should get an array of up to 10 top words for reminder', (done) => {
            chai.request(server) 
                .get('/api/words/findtop10toremind')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array').with.lengthOf.at.most(10)
                    done();
                });
        })
    })

    describe('GET /page [getAll]', () => {
        it('it should get all the words for a page', (done) => {
            chai.request(server) 
                .get('/api/words/page/')
                .end((err, res) => {
                    res.should.have.status(200)
                    done();
                });
        })
    })

    describe('PUT /:id [update]', () => {
        it('it should update a word', (done) => {
            chai.request(server) 
            .put('/api/words/'+word_id)
            .send({tags: 'X'})
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('tags').eql('X')
                done();
            });
        })
    })

    describe('DELETE /delete/:id [delete]', () => {
        console.log('test.delete: word_id', word_id)
        it('it should delete a word '+word_id, (done) => {
            chai.request(server) 
            .delete('/api/words/delete/'+word_id)
            .end((err, res) => {
                res.should.have.status(200)
                done();
            });
        })
    })
})
