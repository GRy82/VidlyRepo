const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');


describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    beforeEach(async () => {
        server = require('../../index');

        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();

    });
    afterEach(async () => {
        await Rental.remove({});
        await server.close();
    });

    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    };
    
    it('should return 401 if client is not logged in!', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });
    it('should return 400 if customerId is not present', async () => {
        customerId = '';
        //delete payload.customerId;   <==== an alternative to the above line.
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 400 if movieId is not present', async () => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 404 if a rental w/ customer is not found', async () => {
        customerId = mongoose.Types.ObjectId();
        const res = await exec();

        expect(res.status).toBe(404);
    });
    it('should return 404 if a rental w/ movie is not found', async () => {
        movieId = mongoose.Types.ObjectId();
        const res = await exec();

        expect(res.status).toBe(404);
    });
    it('should return 404 if rental is already returned', () => {

    });
});