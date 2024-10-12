const { expect } = require('chai');
const sinon = require('sinon');

const subscriptionService = require('../../src/services/subscriptionService');
const PlaneService = require('../../src/services/planeService');
const SubscriptionTypeService = require('../../src/services/subscriptionTypeService');
const PaymentPlatformService = require('../../src/services/paymentPlatformService');
const SubscriptionRepository = require('../../src/repositories/subscriptionRepository');
const SubscriptionPeriodRepository = require('../../src/repositories/subscriptionPeriodRepository');
const SubscriptionPriceRepository = require('../../src/repositories/subscriptionPriceRepository');
const UserPaymentPlatformRepository = require('../../src/repositories/userPaymentPlatformRepository');
const Mapper = require('../../src/mappers/subscriptionMapper');
const { sequelize } = require('../../src/config/database');
const { NotFoundError, InternalServerError } = require('../../src/handlers/errors');

describe('SubscriptionService', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('create()', function() {
    it('should create a subscription successfully', async function() {
      const data = {
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890'
        },
        subscriptionRequest: {
          plane_id: 1,
          subscription_type_id: 1,
          token_id: 'tok_123'
        }
      };

      const planeMock = { id: 1, name: 'Basic Plan' };
      const subscriptionTypeMock = { id: 1, name: 'Monthly' };
      const priceMock = { id: 1, price: 10.00 };
      const paymentResultMock = { customerId: 'cus_123', subscriptionId: 'sub_123' };
      const subscriptionEntityMock = {};
      const subscriptionCreatedMock = { id: 1, userId: 1, state: 'ACTIVE', referenceId: 'sub_123' };
      subscriptionCreatedMock.subscriptionType = subscriptionTypeMock;

      sinon.stub(PlaneService, 'getById').resolves(planeMock);
      sinon.stub(SubscriptionTypeService, 'getById').resolves(subscriptionTypeMock);
      sinon.stub(SubscriptionPriceRepository, 'findByPlaneAndSubscriptionType').resolves(priceMock);
      sinon.stub(SubscriptionRepository, 'findByUserId').resolves(null);
      sinon.stub(PaymentPlatformService, 'processPaymentPlatforms').resolves(paymentResultMock);

      const transactionStub = {
        commit: sinon.stub().resolves(),
        rollback: sinon.stub().resolves()
      };
      sinon.stub(sequelize, 'transaction').resolves(transactionStub);

      sinon.stub(Mapper, 'toSubscriptionEntity').returns(subscriptionEntityMock);
      sinon.stub(Mapper, 'toSubscriptionPeriodEntity').returns({});
      sinon.stub(Mapper, 'toUserPaymentPlatformEntity').returns({});

      sinon.stub(SubscriptionRepository, 'create').resolves(subscriptionCreatedMock);
      sinon.stub(SubscriptionPeriodRepository, 'create').resolves();
      sinon.stub(UserPaymentPlatformRepository, 'create').resolves();

      const result = await subscriptionService.create(data);

      expect(result).to.deep.equal(subscriptionCreatedMock);

      sinon.assert.calledWith(PlaneService.getById, data.subscriptionRequest.plane_id);
      sinon.assert.calledWith(SubscriptionTypeService.getById, data.subscriptionRequest.subscription_type_id);
      sinon.assert.calledWith(SubscriptionPriceRepository.findByPlaneAndSubscriptionType, planeMock.id, subscriptionTypeMock.id);
      sinon.assert.calledWith(PaymentPlatformService.processPaymentPlatforms, sinon.match.object);
      sinon.assert.calledWith(SubscriptionRepository.create, subscriptionEntityMock, transactionStub);
    });

    it('should throw NotFoundError if plane does not exist', async function() {
      const data = {
        user: { id: 1 },
        subscriptionRequest: { plane_id: 1, subscription_type_id: 1, token_id: 'tok_123' }
      };

      sinon.stub(PlaneService, 'getById').rejects(new NotFoundError('Plane not found'));

      try {
        await subscriptionService.create(data);
        throw new Error('Expected NotFoundError to be thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal('Plane not found');
      }
    });

    it('should throw NotFoundError if subscription type does not exist', async function() {
      const data = {
        user: { id: 1 },
        subscriptionRequest: { plane_id: 1, subscription_type_id: 1, token_id: 'tok_123' }
      };

      const planeMock = { id: 1, name: 'Basic Plan' };

      sinon.stub(PlaneService, 'getById').resolves(planeMock);
      sinon.stub(SubscriptionTypeService, 'getById').rejects(new NotFoundError('Subscription type not found'));

      try {
        await subscriptionService.create(data);
        throw new Error('Expected NotFoundError to be thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal('Subscription type not found');
      }
    });

    it('should throw an error if payment platform processing fails', async function() {
      const data = {
        user: { id: 1 },
        subscriptionRequest: { plane_id: 1, subscription_type_id: 1, token_id: 'tok_123' }
      };

      const planeMock = { id: 1, name: 'Basic Plan' };
      const subscriptionTypeMock = { id: 1, name: 'Monthly' };
      const priceMock = { id: 1, price: 10.00 };

      sinon.stub(PlaneService, 'getById').resolves(planeMock);
      sinon.stub(SubscriptionTypeService, 'getById').resolves(subscriptionTypeMock);
      sinon.stub(SubscriptionPriceRepository, 'findByPlaneAndSubscriptionType').resolves(priceMock);
      sinon.stub(SubscriptionRepository, 'findByUserId').resolves(null);
      sinon.stub(PaymentPlatformService, 'processPaymentPlatforms').rejects(new Error('Payment failed'));

      try {
        await subscriptionService.create(data);
        throw new Error('Expected error to be thrown');
      } catch (err) {
        expect(err.message).to.equal('Payment failed');
      }
    });
  });

  describe('cancel()', function() {
    it('should cancel a subscription successfully', async function() {
      const data = {
        id: 1,
        user: { id: 1 }
      };

      const subscriptionMock = {
        id: 1,
        userId: 1,
        paymentPlatformId: 1,
        referenceId: 'sub_123',
        state: 'ACTIVE'
      };

      const userPaymentPlatformMock = {
        userId: 1,
        payment_platform: {
          id: 1,
          name: 'CONEKTA'
        },
        referenceId: 'cus_123'
      };

      const updatedSubscriptionMock = { ...subscriptionMock, state: 'CANCELLED' };

      sinon.stub(SubscriptionRepository, 'findByIdAndUserId').resolves(subscriptionMock);
      sinon.stub(UserPaymentPlatformRepository, 'findOne').resolves(userPaymentPlatformMock);
      sinon.stub(PaymentPlatformService, 'cancelSubscription').resolves(true);
      sinon.stub(SubscriptionRepository, 'update').resolves([1, [updatedSubscriptionMock]]);
      sinon.stub(SubscriptionPeriodRepository, 'update').resolves([1]);

      const transactionStub = {
        commit: sinon.stub().resolves(),
        rollback: sinon.stub().resolves()
      };
      sinon.stub(sequelize, 'transaction').callsFake(async (callback) => {
        return await callback(transactionStub);
      });

      const result = await subscriptionService.cancel(data);

      expect(result).to.deep.equal(updatedSubscriptionMock);

      sinon.assert.calledWith(SubscriptionRepository.findByIdAndUserId, data.id, data.user.id);
      sinon.assert.calledWith(UserPaymentPlatformRepository.findOne, { userId: data.user.id, paymentPlatformId: subscriptionMock.paymentPlatformId });
      sinon.assert.calledOnce(PaymentPlatformService.cancelSubscription);
      sinon.assert.calledOnce(SubscriptionRepository.update);
      sinon.assert.calledOnce(SubscriptionPeriodRepository.update);
    });

    it('should throw NotFoundError if subscription not found', async function() {
      const data = { id: 1, user: { id: 1 } };

      sinon.stub(SubscriptionRepository, 'findByIdAndUserId').resolves(null);

      try {
        await subscriptionService.cancel(data);
        throw new Error('Expected NotFoundError to be thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal('subscription not found');
      }
    });
  });

  describe('suspend()', function() {
    it('should suspend a subscription successfully', async function() {
      const id = 1;
      const data = { errors: {} };

      const subscriptionMock = { id: 1, state: 'ACTIVE' };
      const updatedSubscriptionMock = { id: 1, state: 'SUSPENDED' };
      const subscriptionPeriodMock = { id: 1, state: 'ACTIVE' };

      sinon.stub(SubscriptionRepository, 'update').resolves([1, [updatedSubscriptionMock]]);
      sinon.stub(SubscriptionPeriodRepository, 'findOne').resolves(subscriptionPeriodMock);
      sinon.stub(SubscriptionPeriodRepository, 'update').resolves([1]);

      sinon.stub(Mapper, 'toSubscriptionEntity1').returns({});
      sinon.stub(Mapper, 'toSubscriptionPeriodEntity1').returns({});

      const transactionStub = {
        commit: sinon.stub().resolves(),
        rollback: sinon.stub().resolves()
      };
      sinon.stub(sequelize, 'transaction').callsFake(async (callback) => {
        return await callback(transactionStub);
      });

      const result = await subscriptionService.suspend(id, data);

      expect(result).to.deep.equal([1, [updatedSubscriptionMock]]);

      sinon.assert.calledOnce(SubscriptionRepository.update);
      sinon.assert.calledOnce(SubscriptionPeriodRepository.update);
    });
  });

  describe('getActiveSubscription()', function() {
    it('should return active subscription details', async function() {
      const userId = 1;

      const subscriptionMock = { id: 1, userId: 1, state: 'ACTIVE' };
      const subscriptionPeriodMock = {
        id: 1,
        subscriptionId: 1,
        state: 'ACTIVE',
        planeId: 1,
        subscriptionTypeId: 1,
        startDate: new Date(),
        endDate: new Date()
      };
      const planeMock = { id: 1, name: 'Basic Plan' };
      const subscriptionTypeMock = { id: 1, name: 'Monthly' };

      sinon.stub(SubscriptionRepository, 'findByUserId').resolves(subscriptionMock);
      sinon.stub(SubscriptionPeriodRepository, 'findOne').resolves(subscriptionPeriodMock);
      sinon.stub(PlaneService, 'getById').resolves(planeMock);
      sinon.stub(SubscriptionTypeService, 'getById').resolves(subscriptionTypeMock);

      const result = await subscriptionService.getActiveSubscription(userId);

      expect(result).to.deep.equal({
        id: subscriptionMock.id,
        userId: subscriptionMock.userId,
        planeName: planeMock.name,
        subscriptionType: subscriptionTypeMock.name,
        startDate: subscriptionPeriodMock.startDate,
        endDate: subscriptionPeriodMock.endDate,
        renewDate: subscriptionPeriodMock.endDate,
        state: subscriptionMock.state
      });
    });

    it('should throw NotFoundError if no active subscription found', async function() {
      const userId = 1;

      sinon.stub(SubscriptionRepository, 'findByUserId').resolves(null);

      try {
        await subscriptionService.getActiveSubscription(userId);
        throw new Error('Expected NotFoundError to be thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal('No active subscription found');
      }
    });
  });

  describe('paid()', function() {
    it('should process a paid subscription when state is PENDING', async function() {
      const subscriptionMock = { id: 1, state: 'PENDING' };
      const currentPeriodMock = {
        id: 1,
        subscriptionId: 1,
        state: 'PENDING',
        subscriptionTypeId: 1
      };
      const subscriptionTypeMock = { id: 1, name: 'Monthly', durationInMonths: 1 };

      sinon.stub(SubscriptionRepository, 'update').resolves();
      sinon.stub(SubscriptionPeriodRepository, 'findOne').resolves(currentPeriodMock);
      sinon.stub(SubscriptionPeriodRepository, 'update').resolves();
      sinon.stub(SubscriptionTypeService, 'getById').resolves(subscriptionTypeMock);

      const result = await subscriptionService.paid(subscriptionMock);

      expect(result).to.deep.equal({ id: 1, state: 'ACTIVE' });

      sinon.assert.calledWith(SubscriptionRepository.update, 1, { state: 'ACTIVE' });
      sinon.assert.calledWith(SubscriptionPeriodRepository.update, 1, { state: 'ACTIVE' });
    });

    it('should process a paid subscription when current period is ACTIVE', async function() {
      const subscriptionMock = { id: 1, state: 'ACTIVE' };
      const currentPeriodMock = {
        id: 1,
        subscriptionId: 1,
        state: 'ACTIVE',
        subscriptionTypeId: 1
      };
      const subscriptionTypeMock = { id: 1, name: 'Monthly', durationInMonths: 1 };

      sinon.stub(SubscriptionPeriodRepository, 'findOne').resolves(currentPeriodMock);
      sinon.stub(SubscriptionTypeService, 'getById').resolves(subscriptionTypeMock);
      sinon.stub(SubscriptionPeriodRepository, 'update').resolves();
      sinon.stub(SubscriptionPeriodRepository, 'create').resolves();
      sinon.stub(Mapper, 'toNextSubscriptionPeriodEntity').returns({});

      const result = await subscriptionService.paid(subscriptionMock);

      expect(result).to.deep.equal(subscriptionMock);

      sinon.assert.calledWith(SubscriptionPeriodRepository.update, 1, { state: 'ENDED' });
      sinon.assert.calledOnce(SubscriptionPeriodRepository.create);
    });

    it('should throw InternalServerError if an error occurs', async function() {
      const subscriptionMock = { id: 1, state: 'ACTIVE' };

      sinon.stub(SubscriptionPeriodRepository, 'findOne').rejects(new Error('Database error'));

      try {
        await subscriptionService.paid(subscriptionMock);
        throw new Error('Expected InternalServerError to be thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(InternalServerError);
        expect(err.message).to.equal('Error processing subscription: Database error');
      }
    });
  });
});
