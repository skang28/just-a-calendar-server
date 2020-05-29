const app = require('../src/app');
const supertest = require('supertest');
const knex = require('knex');
const config = require('../config');

const textEvent = {
  title: 'Test Title',
  event_location: 'Test Location',
  start_date_time: '2020-05-29T02:17:19.545Z',
  end_date_time: '2020-05-29T04:17:19.545Z',
  description: 'Test Description',
};

const testPatch = {
  title: 'Test Patch'
};

const testUser = {
  account_name: 'testuser',
  account_password: 'Password2@'
};

//tests for all endpoijnt functionality coded in router for events and user login/creation
describe('App', () => {
  let db;
  let token;
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });

    app.set('db', db);

    async function createUser() {
      let newUser = await fetch(`${config.API_ENDPOINT}/api/users`, {
        method: 'POST',
        body: JSON.stringify({
            account_name: testUser.account_name,
            account_password: testUser.account_password
        }),
        headers: {
            'Content-type':'application/json'
        }
      });
    }

    async function loginUser() {
      let userLoginResponse = await fetch(`${config.API_ENDPOINT}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
            account_name: testUser.account_name,
            account_password: testUser.account_password
        }),
        headers: {
            'Content-type': 'application/json'
        }
      });
      token = await userLoginResponse.json();
      token = token.authToken;
    }
    // put token into authorization header in .set()
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE jac_users, events RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE jac_users, events RESTART IDENTITY CASCADE'))

  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, world!')
  })

  it('POST /api/users responds with 201', () => {
    return supertest(app)
      .post('/api/users')
      .send(testUser)
      .set({
        'Accept':'application/json',
        'Authorization': `bearer ${token}`
      })
      .expect('Content-type', /json/)
      .expect(201)
  })

  it('POST /api/login responds with 201', () => {
    return supertest(app)
      .post('/api/events')
      .send(testUser)
      .set({
        'Accept':'application/json',
        'Authorization': `bearer ${token}`
      })
      .expect('Content-type', /json/)
      .expect(201)
  })

  it('GET /api/events responds with 200', () => {
    return supertest(app)
      .get('/api/events')
      .expect(200)
  })

  it('POST /api/events responds with 201', () => {
    return supertest(app)
      .post('/api/events')
      .send(testEvent)
      .set({
        'Accept':'application/json',
        'Authorization': `bearer ${token}`
      })
      .expect('Content-type', /json/)
      .expect(201)
  })

context('test patching and deleting events', () => {
  beforeEach('insert event', () => {
    return db.into('events').insert(testEvent)
  })

  it('PATCH /api/events/:event_id responds with 204', () => {
    return supertest(app)
      .patch('/api/events/1')
      .set({
        'Accept':'application/json',
        'Authorization': `bearer ${token}`
      })      
      .send(testPatch)
      .expect(204)
  })

  it('DELETE /api/events/:event_id responds with 204', () => {
    return supertest(app)
      .delete('/api/events/1')
      .expect(204)
  })
  
})

})
