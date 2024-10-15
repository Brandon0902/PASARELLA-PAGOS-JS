const { expect } = require('chai');
const nock = require('nock');
const { conektaClient } = require('../../src/services/httpService');
const { properties } = require('../../src/config/config');

describe('httpService - conektaClient', function () {
    
  afterEach(() => {
    
    nock.cleanAll();
  });

  it('should create the conektaClient with the correct headers', function () {
    const headers = conektaClient.defaults.headers;

    expect(conektaClient.defaults.baseURL).to.equal(properties.CONEKTA_API_URL);
    expect(headers['accept']).to.equal('application/vnd.conekta-v2.1.0+json');
    expect(headers['Accept-Language']).to.equal('es');
    expect(headers['Authorization']).to.equal(`Bearer ${properties.CONEKTA_API_KEY}`);
  });

  it('should successfully make a GET request to the Conekta API', async function () {
    const responseMock = { data: 'mocked response' };

    nock(properties.CONEKTA_API_URL)
      .get('/mocked-endpoint')  
      .reply(200, responseMock);

    const response = await conektaClient.get('/mocked-endpoint');

    expect(response.status).to.equal(200);
    expect(response.data).to.deep.equal(responseMock);
  });

  it('should handle a 404 error when making a GET request to a non-existent Conekta endpoint', async function () {
    const errorMessage = { error: 'Not Found' };

    nock(properties.CONEKTA_API_URL)
      .get('/non-existent-endpoint')
      .reply(404, errorMessage);

    try {
      await conektaClient.get('/non-existent-endpoint');
      throw new Error('Request should have failed');
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data).to.deep.equal(errorMessage);
    }
  });
});
