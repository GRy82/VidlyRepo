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

            expect(res.body).toHaveProperty('genreTitle', genre.genreTitle);
            expect(res.status).toBe(200);
        });
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
    });


    describe('POST /', () => {

        //Define happy path. Then in each test, we change one parameter
        //that clearly aligns with the name of the test.

        let token;
        let genreTitle;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ genreTitle: genreTitle });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            genreTitle = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = "";
            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 characters', async () => {
            genreTitle = '1234';
            const res = await exec();
           
            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 50 characters', async () => {
            genreTitle = new Array(52).join('a');
            const res = await exec();
                
            expect(res.status).toBe(400);
        });
        it('should save genre if valid genre name', async () => {
            await exec();
                
            const genre = Genre.find({ genreTitle: 'genre1' });
            
            expect(genre).not.toBeNull();
        });
        it('should return genre if valid', async () => {
            const res = await exec();
            
            expect(res.body).toHaveProperty('genreTitle', 'genre1');
            expect(res.body).toHaveProperty('_id');
        });
    });
});