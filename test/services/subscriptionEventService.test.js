const { expect } = require('chai');
const sinon = require('sinon');

const subscriptionEventService = require('../../src/services/subscriptionEventService');
const SubscriptionService = require('../../src/services/subscriptionService');
const UserPaymentPlatformRepository = require('../../src/repositories/userPaymentPlatformRepository');
const { PaymentPlatform } = require('../../src/models/plane');
const { NotFoundError } = require('../../src/handlers/errors');

describe('SubscriptionEventService', function() {
  afterEach(() => {
    sinon.restore();
  });

  describe('suspendSubscription()', function() {
    it('should suspend a subscription', async function() {
      const platformMock = 'CONEKTA';
      const eventData = { data: { customer_id: 'cus_123', subscription_id: 'sub_456', errors: {} } };
      const platformInstanceMock = { id: 1, name: 'CONEKTA' };
      const userPaymentPlatformMock = { userId: 1 };
      const subscriptionMock = { 
        id: 1, 
        userId: 1, 
        state: 'ACTIVE', 
        referenceId: 'sub_456', 
        paymentPlatformId: 1,
        endDate: new Date()
      };

      sinon.stub(PaymentPlatform, 'findOne').resolves(platformInstanceMock);
      sinon.stub(UserPaymentPlatformRepository, 'findOne').resolves(userPaymentPlatformMock);
      sinon.stub(SubscriptionService, 'getByUserId').resolves(subscriptionMock);
      sinon.stub(SubscriptionService, 'suspend').resolves(true);

      const result = await subscriptionEventService.suspendSubscription(platformMock, eventData);

      expect(result).to.be.true;
      sinon.assert.calledWith(SubscriptionService.suspend, subscriptionMock.id, sinon.match({
        id: subscriptionMock.id,
        userId: subscriptionMock.userId,
        endDate: subscriptionMock.endDate,
        errors: {},
        paymentPlatformId: subscriptionMock.paymentPlatformId,
        referenceId: subscriptionMock.referenceId,
        state: subscriptionMock.state
      }));
    });

    it('should throw NotFoundError if subscription is not found', async function() {
      const platformMock = 'CONEKTA';
      const eventData = { data: { customer_id: 'cus_123', subscription_id: 'sub_456' } };
      const platformInstanceMock = { id: 1, name: 'CONEKTA' };

      sinon.stub(PaymentPlatform, 'findOne').resolves(platformInstanceMock);
      sinon.stub(UserPaymentPlatformRepository, 'findOne').resolves(null);
      sinon.stub(SubscriptionService, 'getByUserId').resolves(null);

      try {
        await subscriptionEventService.suspendSubscription(platformMock, eventData);
        throw new Error('Debería haber lanzado un NotFoundError');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal("Subscription not found for platform 'CONEKTA' with reference ID 'sub_456' or customer ID 'cus_123'");
      }
    });
  });

  describe('subscriptionPaid()', function() {
    it('should mark a subscription as paid', async function() {
      const platformMock = 'CONEKTA';
      const eventData = { data: { customer_id: 'cus_123', subscription_id: 'sub_456', errors: {} } };
      const platformInstanceMock = { id: 1, name: 'CONEKTA' };
      const userPaymentPlatformMock = { userId: 1 };
      const subscriptionMock = { 
        id: 1, 
        userId: 1, 
        state: 'ACTIVE', 
        referenceId: 'sub_456', 
        paymentPlatformId: 1,
        endDate: new Date()
      };

      sinon.stub(PaymentPlatform, 'findOne').resolves(platformInstanceMock);
      sinon.stub(UserPaymentPlatformRepository, 'findOne').resolves(userPaymentPlatformMock);
      sinon.stub(SubscriptionService, 'getByUserId').resolves(subscriptionMock);
      sinon.stub(SubscriptionService, 'paid').resolves(true);

      const result = await subscriptionEventService.subscriptionPaid(platformMock, eventData);

      expect(result).to.be.true;
      sinon.assert.calledWith(SubscriptionService.paid, sinon.match({
        id: subscriptionMock.id,
        userId: subscriptionMock.userId,
        endDate: subscriptionMock.endDate,
        errors: {},
        paymentPlatformId: subscriptionMock.paymentPlatformId,
        referenceId: subscriptionMock.referenceId,
        state: subscriptionMock.state
      }));
    });

    it('should throw NotFoundError if payment platform is not found', async function() {
      const eventData = { data: { customer_id: 'cus_123', subscription_id: 'sub_456' } };

      sinon.stub(PaymentPlatform, 'findOne').resolves(null);

      try {
        await subscriptionEventService.subscriptionPaid('CONEKTA', eventData);
        throw new Error('No debería llegar aquí');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal("Payment platform 'CONEKTA' not found");
      }
    });
  });

  describe('cancelSubscription()', function() {
    it('should cancel a subscription', async function() {
      const platformMock = 'CONEKTA';
      const eventData = { data: { customer_id: 'cus_123', subscription_id: 'sub_456', errors: {} } };
      const platformInstanceMock = { id: 1, name: 'CONEKTA' };
      const userPaymentPlatformMock = { userId: 1 };
      const subscriptionMock = { 
        id: 1, 
        userId: 1, 
        state: 'ACTIVE', 
        referenceId: 'sub_456', 
        paymentPlatformId: 1,
        endDate: new Date()
      };

      sinon.stub(PaymentPlatform, 'findOne').resolves(platformInstanceMock);
      sinon.stub(UserPaymentPlatformRepository, 'findOne').resolves(userPaymentPlatformMock);
      sinon.stub(SubscriptionService, 'getByUserId').resolves(subscriptionMock);
      sinon.stub(SubscriptionService, 'cancel').resolves(true);

      const result = await subscriptionEventService.cancelSubscription(platformMock, eventData);

      expect(result).to.be.true;
      sinon.assert.calledWith(SubscriptionService.cancel, sinon.match({
        id: subscriptionMock.id,
        userId: subscriptionMock.userId,
        endDate: subscriptionMock.endDate,
        errors: {},
        paymentPlatformId: subscriptionMock.paymentPlatformId,
        referenceId: subscriptionMock.referenceId,
        state: subscriptionMock.state
      }));
    });
  });
});
