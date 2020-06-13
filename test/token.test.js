process.env.NODE_ENV = 'test';

let chai = require('chai') //https://www.chaijs.com/api/bdd/
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()
let logger = require('../app/winston')

chai.use(chaiHttp); 

var device

describe('Tokens', () => {

    describe('POST /create [create]', () => {
        it('it should NOT create new token', (done) => {
            let token = {
                device: '', //empty
                token: '' //empty
            }
            chai.request(server)
                .post('/api/tokens/create')
                .send(token)
                .end((err, res) => {
                    res.should.have.status(400)
                    done();
                });
        })
    })


    describe('POST /create ', () => {
        it('it should create new token', (done) => {
            let token = {
                device: 'DEVICE',
                token: 'TOKEN',
                name: 'NAME'
            }
            chai.request(server)
                .post('/api/tokens/create')
                .send(token)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('name').eql('NAME')                    
                    device = res.body.device
                    console.log('device', device)
                    done();
                });
        })
    })
    
    describe('GET /:device [findOne]', () => {
        logger.info('HELLO WINSTON')
        it('it should find a token (by device)', (done) => {
            chai.request(server) 
                .get('/api/tokens/'+device)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('device').eql(device)
                    done()
                })
        })
    })

})