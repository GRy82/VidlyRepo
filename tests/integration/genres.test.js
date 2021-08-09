//resquest is a function
// it can be sent to various endpoints.
const request = require('supertest');
const {User} = require ('../../models/user');
const {Genre} = require('../../models/genre');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
    //this function is called before each test within the test suite.
    //callback within serves to reload the server.
    beforeEach(() => { server = require('../../index'); })
    //afterward, close the server.
    afterEach(async () => {
        await Genre.remove({});//this empty option removes all.
        await server.close();
     });
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { title: 'genre1'},
                { title: 'genre2' }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            //.some is an array method. Pass it a predicate.
            expect(res.body.some(g => g.title === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.title === 'genre2')).toBeTruthy();
        });
    });
    describe('GET /:id', () => {
        it('should return genre with the given id.', async () => {
            const genre = new Genre({ title: 'titleOne' });
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.body).toHaveProperty('title', genre.title);
            expect(res.status).toBe(200);
        });
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
        it('should return 404 if id is valid but not present db', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);

            expect(res.status).toBe(404);
        });
    });


    describe('POST /', () => {

        //Define happy path. Then in each test, we change one parameter
        //that clearly aligns with the name of the test.

        let token;
        let title;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ title: title });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            title = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = "";
            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 characters', async () => {
            title = '1234';
            const res = await exec();
           
            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 50 characters', async () => {
            title = new Array(52).join('a');
            const res = await exec();
                
            expect(res.status).toBe(400);
        });
        it('should save genre if valid genre name', async () => {
            await exec();
                
            const genre = Genre.find({ title: 'genre1' });
            
            expect(genre).not.toBeNull();
        });
        it('should return genre if valid', async () => {
            const res = await exec();
            
            expect(res.body).toHaveProperty('title', 'genre1');
            expect(res.body).toHaveProperty('_id');
        });
    });

    describe('PUT /:id', () => {
        let genre, id, token, updatedName;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ title: updatedName });
        };

        beforeEach( async () => {
            genre = new Genre({ title: 'genre1' });
            await genre.save();
            id = genre._id;
            token = new User().generateAuthToken();
            updatedName = 'genre2';
        });
        it('should update the document in the database', async () => {
            await exec();
            const updatedGenre = await Genre.findById(genre._id);
            
            expect(updatedGenre.title).toBe(updatedName);
        });
        it('should return updated object', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('title', updatedName);
            expect(res.body).toHaveProperty('_id');
        });
        it('should return 400 error if title length < 5 chars', async () => {
            updatedName = 'shrt';
            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 error if title length > 50 chars', async () => {
            updatedName = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 404 error if genre is not found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });
        it('should return 404 error if id provided is not valid id', async () => {
            id = 123;
            const res = await exec();

            expect(res.status).toBe(404);
        });
        it('should return 401 error if user not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });
    });
    describe('DELETE /:id', () => {
        
        let id, genre, token;

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send();
        }

        beforeEach(() => {
            genre = new Genre({ title: 'deletable genre' });
            genre.save();
            id = genre._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        });
        it('should remove genre from database', async () => {
            await exec();
            
            const searchedGenre = await Genre.findById(id);
            expect(searchedGenre).toBeNull();
        });
        it('should return removed genre in response', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('title', genre.title);
        });
        it('should return 404 status if genre with id provided doe not exist', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });
        it('should return status 404 if invalid id provided.', async () => {
            id = 123;
            const res = await exec();

            expect(res.status).toBe(404);
        });
        it('should return status code 401 if unauthenticated.', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return status 403 if authenticated but unauthorized.', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();
            const res = await exec();

            expect(res.status).toBe(403);
        });
    });
});