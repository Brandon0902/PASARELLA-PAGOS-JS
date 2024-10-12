const { expect } = require('chai');
const sinon = require('sinon');

const paymentService = require('../../src/services/paymentPlatformService');
const { PlanePaymentPlatform } = require('../../src/models/plane');
const conektaService = require('../../src/services/conektaService');

describe('PaymentService', function() {
  afterEach(() => {
    sinon.restore();
  });

  describe('processPaymentPlatforms()', function() {
    it('should process payment platforms and return customer and subscription ids', async function() {
      const customerData = { planeId: 1, subscriptionTypeId: 2 };
      const paymentType = 'credit_card';
      const paymentPlatformMock = [{
        paymentPlatformId: 1,
        referenceId: 'ref123',
        payment_platform: { name: 'CONEKTA' }
      }];
      const conektaResponseMock = { customerId: 'cus_123', subscriptionId: 'sub_123' };

      sinon.stub(PlanePaymentPlatform, 'findAll').resolves(paymentPlatformMock);
      sinon.stub(conektaService, 'createSubscription').resolves(conektaResponseMock);

      const result = await paymentService.processPaymentPlatforms(customerData, paymentType);

      expect(result).to.deep.equal({
        customerId: 'cus_123',
        subscriptionId: 'sub_123',
        id: 1
      });
      sinon.assert.calledOnce(PlanePaymentPlatform.findAll);
      sinon.assert.calledOnce(conektaService.createSubscription);
      sinon.assert.calledWith(conektaService.createSubscription, customerData, 'ref123', paymentType);
    });

    it('should throw an error if no payment platforms are found', async function() {
      const customerData = { planeId: 1, subscriptionTypeId: 2 };
      const paymentType = 'credit_card';
    
      sinon.stub(PlanePaymentPlatform, 'findAll').resolves([]);
    
      try {
        await paymentService.processPaymentPlatforms(customerData, paymentType);
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.include('Error al procesar las plataformas de pago');
      }
    });
  });

  describe('cancelSubscription()', function() {
    it('should cancel a subscription using the correct payment platform strategy', async function() {
      const subscriptionMock = {
        referenceData: { referenceId: 'ref123' },
        paymentPlatformName: 'CONEKTA'
      };
      const cancelResponseMock = true;

      sinon.stub(conektaService, 'cancelSusbcription').resolves(cancelResponseMock);

      const result = await paymentService.cancelSubscription(subscriptionMock);

      expect(result).to.be.true;
      sinon.assert.calledOnce(conektaService.cancelSusbcription);
      sinon.assert.calledWith(conektaService.cancelSusbcription, subscriptionMock.referenceData);
    });

    it('should return false if cancellation fails', async function() {
      const subscriptionMock = {
        referenceData: { referenceId: 'ref123' },
        paymentPlatformName: 'CONEKTA'
      };

      sinon.stub(conektaService, 'cancelSusbcription').rejects(new Error('Cancellation failed'));

      const result = await paymentService.cancelSubscription(subscriptionMock);

      expect(result).to.be.false;
    });
  });
});
