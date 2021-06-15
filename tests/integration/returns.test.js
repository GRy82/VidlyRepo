const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const moment = require('moment');


describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    beforeEach(async () => {
        server = require('../../index');

        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            genre: { genreTitle: '12345' },
            numberInStock: 3,
            dailyRentalRate: 2,
        });
        await movie.save();
        
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
        await Movie.remove({});
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
    it('should return 400 if rental is already returned', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 200 if rental is valid and not yet returned', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it('should set valid return date when input is valid', async () => {
        const res = await exec();
        
        const rentalInDb = await Rental.findById(rental._id);
        const differenceInTime = new Date() - rentalInDb.dateReturned;
        expect(differenceInTime).toBeLessThan(10 * 1000);
    });
    it('should calculate rental fee if valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
    
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });
    it('should increment the movie\'s stock', async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
});