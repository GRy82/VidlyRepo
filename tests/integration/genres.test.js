//resquest is a function
// it can be sent to various endpoints.
const request = require('supertest');
const {User} = require ('../../models/user');
const {Genre} = require('../../models/genre');
let server;

describe('/api/genres', () => {
    //this function is called before each test within the test suite.
    //callback within serves to reload the server.
    beforeEach(() => { server = require('../../index'); })
    //afterward, close the server.
    afterEach(async () => {
        server.close();
        await Genre.remove({});//this empty option removes all.
     });
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { genreTitle: 'genre1'},
                { genreTitle: 'genre2' }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            //.some is an array method. Pass it a predicate.
            expect(res.body.some(g => g.genreTitle === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.genreTitle === 'genre2')).toBeTruthy();
        });
    });
    describe('GET /:id', () => {
        it('should return genre with the given id.', async () => {
            const genre = new Genre({ genreTitle: 'titleOne' });
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('genreTitle', genre.genreTitle);
        });
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
    });
    describe('POST /', () => {
        it('should return 401 if client is not logged in', async () => {
            const res = await request(server)
                .post('/api/genres')
                .send({ name: 'genre1'});
            expect(res.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 characters', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: '1234'});

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 50 characters', async () => {
            const token = new User().generateAuthToken();
            const longName = new Array(52).join('a');

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: longName });
                
            expect(res.status).toBe(400);
        });
    });
});