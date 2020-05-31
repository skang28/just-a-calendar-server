const app = require('../src/app');
const supertest = require('supertest');
const knex = require('knex');
const {expect} = require('chai');

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

const testUser2 = {
  account_name: 'testuser2',
  account_password: 'Password2@'
}

//tests for all endpoint functionality coded in router for events and user login/creation
describe('App', () => {
  let db;
  let token;
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });

    app.set('db', db);
  })

  function newUser() {
    supertest(app)
      .post('/api/users')
      .send(testUser)
      .set('Accept', 'application/json')
      .expect(201)
  }

  function loginUser() {
    supertest(app)
      .post('/api/users')
      .send(testUser)
      .set('Accept', 'application/json')
      .then(res => {
        return res.json()
      })
      .then(authRes => {
        token = authRes.authToken
        console.log(token)
      })
  }


  before('clean the table', () => db.raw('TRUNCATE jac_users, events RESTART IDENTITY CASCADE'))

  
  before('create test user and login to test user accoutn',() => {
  
  })

  afterEach('cleanup', () => db.raw('TRUNCATE events RESTART IDENTITY CASCADE'))

  after('disconnect from db', () => db.destroy())


  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, world!')
  })

  it('POST /api/users responds with 201', () => {
    return supertest(app)
      .post('/api/users')
      .send(testUser2)
      .set('Accept','application/json')
      .expect('Content-type', /json/)
      .expect(201)
  })

  it('POST /api/auth/login responds with 200', () => {
    return supertest(app)
      .post('/api/auth/login')
      .send(testUser2)
      .set('Accept','application/json')
      .expect('Content-type', /json/)
      .expect(200)
  })

  it('GET /api/events responds with 200', () => {
    return supertest(app)
      .get('/api/events')
      .expect(200)
  })
/*
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
  })*/
  
})
