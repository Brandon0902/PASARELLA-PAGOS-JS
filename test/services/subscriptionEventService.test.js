const { expect } = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');

const subscriptionEventService = rewire('../../src/services/subscriptionEventService'); // Usamos rewire
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
    });
  });

  describe('subscriptionPaid()', function() {
    it('should mark a subscription as paid', async function() {
      const platformMock = 'CONEKTA';
      const eventData = { 
        data: { 
          customer_id: 'cus_123', 
          subscription_id: 'sub_456', 
          errors: {} 
        } 
      };
      const platformInstanceMock = { id: 1, name: 'CONEKTA' };
      const userPaymentPlatformMock = { 
        userId: 1, 
        data: { email: 'user@example.com' } 
      };

      const lastPeriodMock = {
        state: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(),
        getPlane: sinon.stub().resolves({ name: 'Basic Plan' })
      };

      const subscriptionMock = { 
        id: 1, 
        userId: 1, 
        state: 'ACTIVE', 
        referenceId: 'sub_456', 
        paymentPlatformId: 1,
        endDate: new Date(),
        getPeriods: sinon.stub().returns([lastPeriodMock])
      };

      sinon.stub(PaymentPlatform, 'findOne').resolves(platformInstanceMock);
      sinon.stub(UserPaymentPlatformRepository, 'findOne').resolves(userPaymentPlatformMock);
      sinon.stub(SubscriptionService, 'getByUserId').resolves(subscriptionMock);
      
      const updatedSubscriptionMock = {
        id: subscriptionMock.id,
        user: { id: subscriptionMock.userId, email: 'user@example.com' },
        planeName: 'Basic Plan',
        endDate: new Date(),
        renewDate: '14/10/2024',
        paymentPlatformId: subscriptionMock.paymentPlatformId,
        referenceId: subscriptionMock.referenceId,
        state: 'ACTIVE'
      };
      sinon.stub(SubscriptionService, 'paid').resolves(updatedSubscriptionMock);

      const sendStub = sinon.stub().resolves();
      subscriptionEventService.__set__('send', sendStub);

      await subscriptionEventService.subscriptionPaid(platformMock, eventData);

      sinon.assert.calledWith(SubscriptionService.paid, sinon.match.object);

      sinon.assert.calledOnce(sendStub);
    });
  });

  describe('cancelSubscription()', function() {
    it('should cancel a subscription', async function() {
      const platformMock = 'CONEKTA';
      const eventData = { 
        data: { 
          customer_id: 'cus_123', 
          subscription_id: 'sub_456', 
          errors: {} 
        } 
      };
      const platformInstanceMock = { id: 1, name: 'CONEKTA' };
      const userPaymentPlatformMock = { 
        userId: 1, 
        data: { email: 'user@example.com' } 
      };

      const lastPeriodMock = {
        state: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(),
        getPlane: sinon.stub().resolves({ name: 'Basic Plan' })
      };

      const subscriptionMock = { 
        id: 1, 
        userId: 1, 
        state: 'ACTIVE', 
        referenceId: 'sub_456', 
        paymentPlatformId: 1,
        endDate: new Date(),
        getPeriods: sinon.stub().returns([lastPeriodMock])
      };

      sinon.stub(PaymentPlatform, 'findOne').resolves(platformInstanceMock);
      sinon.stub(UserPaymentPlatformRepository, 'findOne').resolves(userPaymentPlatformMock);
      sinon.stub(SubscriptionService, 'getByUserId').resolves(subscriptionMock);
      sinon.stub(SubscriptionService, 'cancel').resolves(true);

      const sendStub = sinon.stub().resolves();
      subscriptionEventService.__set__('send', sendStub);

      await subscriptionEventService.cancelSubscription(platformMock, eventData);

      sinon.assert.calledWith(SubscriptionService.cancel, sinon.match.object);

      sinon.assert.calledOnce(sendStub);
    });
  });
});
