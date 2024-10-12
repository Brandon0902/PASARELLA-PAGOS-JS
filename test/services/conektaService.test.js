const { expect } = require('chai');
const sinon = require('sinon');

const conektaService = require('../../src/services/conektaService');
const { conektaClient } = require('../../src/services/httpService');

describe('ConektaService', function() {
  afterEach(() => {
    sinon.restore();
  });

  describe('createSubscription()', function() {
    it('should create a subscription and return customerId and subscriptionId', async function() {
      const customerData = {
        email: 'test@example.com',
        name: 'John Doe',
        phone: '123456789',
        token_id: 'tok_test_123'
      };
      const planId = 'plan_test_123';
      const paymentType = 'card';
      const conektaResponseMock = {
        data: {
          id: 'cus_test_123',
          subscription: { id: 'sub_test_123' }
        }
      };

      sinon.stub(conektaClient, 'post').resolves(conektaResponseMock);

      const result = await conektaService.createSubscription(customerData, planId, paymentType);

      expect(result).to.deep.equal({
        customerId: 'cus_test_123',
        subscriptionId: 'sub_test_123'
      });

      sinon.assert.calledWith(conektaClient.post, '/customers', {
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        plan_id: planId,
        payment_sources: [
          {
            type: 'card',
            token_id: customerData.token_id
          }
        ]
      });
    });

    it('should throw an error if the API request fails', async function() {
      const customerData = {
        email: 'test@example.com',
        name: 'John Doe',
        phone: '123456789',
        token_id: 'tok_test_123'
      };
      const planId = 'plan_test_123';
      const paymentType = 'card';

      sinon.stub(conektaClient, 'post').rejects(new Error('API Error'));

      try {
        await conektaService.createSubscription(customerData, planId, paymentType);
        throw new Error('No debería llegar aquí');
      } catch (err) {
        expect(err.message).to.equal('API Error');
      }

      sinon.assert.calledWith(conektaClient.post, '/customers', {
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        plan_id: planId,
        payment_sources: [
          {
            type: 'card',
            token_id: customerData.token_id
          }
        ]
      });
    });
  });

  describe('cancelSubscription()', function() {
    it('should cancel a subscription for a given customerId', async function() {
      const subscriptionMock = { customerId: 'cus_test_123' };
      const cancelResponseMock = { data: { success: true } };

      sinon.stub(conektaClient, 'post').resolves(cancelResponseMock);

      const result = await conektaService.cancelSusbcription(subscriptionMock);

      expect(result).to.deep.equal(cancelResponseMock);

      sinon.assert.calledWith(conektaClient.post, `/customers/cus_test_123/subscription/cancel`);
    });

    it('should throw an error if the API request to cancel fails', async function() {
      const subscriptionMock = { customerId: 'cus_test_123' };

      sinon.stub(conektaClient, 'post').rejects(new Error('API Error'));

      try {
        await conektaService.cancelSusbcription(subscriptionMock);
        throw new Error('No debería llegar aquí');
      } catch (err) {
        expect(err.message).to.equal('API Error');
      }

      sinon.assert.calledWith(conektaClient.post, `/customers/cus_test_123/subscription/cancel`);
    });
  });
});
