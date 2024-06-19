const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('POST /api/threads/:board', function(){
        test('should create a new thread and redirect to another board page', function(done){
            chai.request(server)
                .post('/api/threads/waterkloof')
                .send({
                    text: 'The coolness of the springs',
                    delete_password: 'random_password',
                    board: 'waterkloof',
                  })
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        assert.strictEqual(res.status, 200, 'Expected status code to be 200');
                        expect(res).to.redirect
                        done();
                    }
                })
                
        })
    })

    suite('POST api/replies/:board', function() {
        test('should create a new reply', function(done){
            chai.request(server)
                .post('/api/replies/waterkloof')
                .send({
                    board: 'waterkloof',
                    text: 'Really amazing',
                    delete_password: 'random_password',
                    thread_id: '667300f65ed9c864526b3e36'
                })
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        assert.strictEqual(res.status, 200, 'Expected status code to be 200')
                        done()
                    }
                })
        })
    })

});
