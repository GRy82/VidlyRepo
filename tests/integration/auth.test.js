// provides test module with 'request' function.
const request = require('supertest');
const {User} = require('../../models/user'); //object destructuring

describe('auth middleware', () => {
    
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { server.close(); });

    let token;

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ genreTitle: 'genre1' });
    };

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    
});