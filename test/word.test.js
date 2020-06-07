process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp); //https://www.chaijs.com/api/bdd/

describe('Words', () => {

    describe('POST /create [create]', () => {
        it('it should create new word', (done) => {
            done()
        })
    })

    describe('GET / [findAll]', () => {
        it('it should get all the words', (done) => {
            done()
        })
    })

    describe('GET /find/:id [findOne]', () => {
        it('it should find a word', (done) => {
            done()
        })
    })

    describe('GET /findTop10ToRemind [findTop10ToRemind]', () => {
        it('it should get an array of up to 10 top words for reminder', (done) => {
            done()
        })
    })

    describe('GET /page [getAll]', () => {
        it('it should get all the words for a page', (done) => {
            done()
        })
    })

    describe('PUT /:id [update]', () => {
        it('it should update a word', (done) => {
            done()
        })
    })

    describe('DELETE /delete/:id [delete]', () => {
        it('it should delete a word', (done) => {
            done()
        })
    })
})
