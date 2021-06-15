const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');


describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;

    beforeEach(async () => {
        server = require('../../index');

        rental = new Rental({
            customer: {
                name: '12345',
                phone: '12345'
            },
            movie: {
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
        customerId = rental.customer._id;
        movieId = rental.movie._id;

    });
    afterEach(async () => {
        await Rental.remove({});
        await server.close();
    });
    
    it('should return 401 if client is not logged in!', async () => {
        const res = await request(server)
            .post('/api/returns')
            .send({ customerId, movieId });

        expect(res.status).toBe(401);
    });
    // it('should return 400 if customerId is not valid', () => {

    // });
});