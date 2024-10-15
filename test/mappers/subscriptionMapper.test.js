const { expect } = require('chai');
const sinon = require('sinon');
const moment = require('moment');
const subscriptionMapper = require('../../src/mappers/subscriptionMapper');
const { NotFoundError } = require('../../src/handlers/errors');

describe('subscriptionMapper', function() {
  describe('toSubscriptionEntity()', function() {
    it('should create a subscription entity with trial days', function() {
      const userId = 1;
      const paymentData = { id: 2, subscriptionId: 'sub_123' };
      const hasTrialDays = true;

      const result = subscriptionMapper.toSubscriptionEntity(userId, paymentData, hasTrialDays);

      expect(result).to.deep.equal({
        userId: userId,
        paymentMethodId: 1,
        paymentPlatformId: paymentData.id,
        referenceId: paymentData.subscriptionId,
        hasTrialDays: hasTrialDays,
        state: 'ACTIVE'
      });
    });

    it('should create a subscription entity without trial days', function() {
      const userId = 1;
      const paymentData = { id: 2, subscriptionId: 'sub_123' };
      const hasTrialDays = false;

      const result = subscriptionMapper.toSubscriptionEntity(userId, paymentData, hasTrialDays);

      expect(result).to.deep.equal({
        userId: userId,
        paymentMethodId: 1,
        paymentPlatformId: paymentData.id,
        referenceId: paymentData.subscriptionId,
        hasTrialDays: hasTrialDays,
        state: 'PENDING'
      });
    });
  });

  describe('calculateEndDate()', function() {
    it('should calculate end date with trial days', function() {
      const subscriptionType = 'MONTHLY';
      const hasTrialDays = true;
      const plane = { trialDays: 7 };
      const startDate = moment('2023-01-01');

      const endDate = subscriptionMapper.calculateEndDate(subscriptionType, hasTrialDays, plane, startDate);

      expect(endDate.format('YYYY-MM-DD')).to.equal('2023-01-08');
    });

    it('should calculate end date for monthly subscription without trial days', function() {
      const subscriptionType = 'MONTHLY';
      const hasTrialDays = false;
      const plane = {};
      const startDate = moment('2023-01-01');

      const endDate = subscriptionMapper.calculateEndDate(subscriptionType, hasTrialDays, plane, startDate);

      expect(endDate.format('YYYY-MM-DD')).to.equal('2023-02-01');
    });

    it('should calculate end date for yearly subscription without trial days', function() {
      const subscriptionType = 'YEARLY';
      const hasTrialDays = false;
      const plane = {};
      const startDate = moment('2023-01-01');

      const endDate = subscriptionMapper.calculateEndDate(subscriptionType, hasTrialDays, plane, startDate);

      expect(endDate.format('YYYY-MM-DD')).to.equal('2024-01-01');
    });

    it('should return null for unknown subscription type', function() {
      const subscriptionType = 'WEEKLY';
      const hasTrialDays = false;
      const plane = {};
      const startDate = moment('2023-01-01');

      const endDate = subscriptionMapper.calculateEndDate(subscriptionType, hasTrialDays, plane, startDate);

      expect(endDate).to.be.null;
    });
  });

  describe('toSubscriptionPeriodEntity()', function() {
    it('should create a subscription period entity', function() {
      const subscription = { id: 1 };
      const subscriptionType = { code: 'MONTHLY' };
      const prices = { planeId: 2, subscriptionTypeId: 3, price: 9.99 };
      const hasTrialDays = true;
      const plane = { trialDays: 7 };

      const clock = sinon.useFakeTimers(new Date('2023-01-01').getTime());

      const result = subscriptionMapper.toSubscriptionPeriodEntity(subscription, subscriptionType, prices, hasTrialDays, plane);

      expect(result).to.deep.equal({
        subscriptionId: subscription.id,
        planeId: prices.planeId,
        subscriptionTypeId: prices.subscriptionTypeId,
        price: prices.price,
        state: 'ACTIVE',
        startDate: moment().utc(),
        endDate: moment().utc().add(plane.trialDays, 'day')
      });

      clock.restore();
    });
  });

  describe('toNextSubscriptionPeriodEntity()', function() {
    it('should create the next subscription period entity', function() {
      const subscription = { id: 1 };
      const currentPeriod = {
        endDate: moment('2023-01-08'),
        planeId: 2,
        subscriptionTypeId: 3,
        price: 9.99
      };
      const subscriptionType = { code: 'MONTHLY' };
      const plane = {};

      const result = subscriptionMapper.toNextSubscriptionPeriodEntity(subscription, currentPeriod, subscriptionType, plane);

      expect(result).to.deep.equal({
        subscriptionId: subscription.id,
        planeId: currentPeriod.planeId,
        subscriptionTypeId: currentPeriod.subscriptionTypeId,
        price: currentPeriod.price,
        state: 'ACTIVE',
        startDate: currentPeriod.endDate,
        endDate: moment(currentPeriod.endDate).utc().add(1, 'month')
      });
    });
  });

  describe('toSubscriptionPeriodEntity1()', function() {
    it('should update a subscription period entity', function() {
      const subscriptionPeriod = {
        state: 'ACTIVE',
        errorDetails: null,
        endDate: moment('2023-02-01'),
        updatedAt: moment('2023-01-01')
      };
      const data = {
        state: 'ERROR',
        errorDetails: { message: 'Payment failed' },
        endDate: moment('2023-01-15')
      };

      const clock = sinon.useFakeTimers(new Date('2023-01-10').getTime());

      const result = subscriptionMapper.toSubscriptionPeriodEntity1(subscriptionPeriod, data);

      expect(result).to.deep.equal({
        state: data.state,
        errorDetails: data.errorDetails,
        endDate: data.endDate,
        updatedAt: moment().utc()
      });

      clock.restore();
    });
  });

  describe('toUserPaymentPlatformEntity()', function() {
    it('should create a user payment platform entity', function() {
      const paymentPlatformId = 1;
      const user = { id: 2, email: 'user@example.com' };
      const paymentData = { customerId: 'cus_123' };

      const result = subscriptionMapper.toUserPaymentPlatformEntity(paymentPlatformId, user, paymentData);

      expect(result).to.deep.equal({
        userId: user.id,
        paymentPlatformId: paymentPlatformId,
        referenceId: paymentData.customerId,
        data: {
          email: user.email
        },
        state: 'ACTIVE'
      });
    });
  });

  describe('toSubscriptionEntity1()', function() {
    it('should update a subscription entity', function() {
      const subscription = {
        endDate: moment('2023-02-01')
      };
      const state = 'CANCELED';
      const endDate = moment('2023-01-15');

      const clock = sinon.useFakeTimers(new Date('2023-01-10').getTime());

      const result = subscriptionMapper.toSubscriptionEntity1(subscription, state, endDate);

      expect(result).to.deep.equal({
        state: state,
        endDate: endDate,
        updatedAt: moment().utc()
      });

      clock.restore();
    });
  });

  describe('toCancelSubscriptionEntity()', function() {
    it('should create a cancel subscription entity', function() {
      const clock = sinon.useFakeTimers(new Date('2023-01-10').getTime());

      const result = subscriptionMapper.toCancelSubscriptionEntity();

      expect(result).to.deep.equal({
        state: 'CANCELED',
        endDate: moment().utc(),
        updatedAt: moment().utc()
      });

      clock.restore();
    });
  });

  describe('toEndedSubscriptionPeriodEntity()', function() {
    it('should create an ended subscription period entity', function() {
      const clock = sinon.useFakeTimers(new Date('2023-01-10').getTime());

      const result = subscriptionMapper.toEndedSubscriptionPeriodEntity();

      expect(result).to.deep.equal({
        state: 'ENDED',
        endDate: moment().utc()
      });

      clock.restore();
    });
  });

  describe('getPeriod()', function() {
    it('should return the last active or pending period', async function() {
      const subscription = {
        id: 1,
        getPeriods: sinon.stub().resolves([
          { state: 'ENDED' },
          { state: 'ACTIVE', id: 2 }
        ])
      };

      const result = await subscriptionMapper.getPeriod(subscription);

      expect(result).to.deep.equal({ state: 'ACTIVE', id: 2 });
    });

    it('should throw NotFoundError if no active or pending period found', async function() {
      const subscription = {
        id: 1,
        getPeriods: sinon.stub().resolves([
          { state: 'ENDED' },
          { state: 'CANCELED' }
        ])
      };

      try {
        await subscriptionMapper.getPeriod(subscription);
        throw new Error('Expected NotFoundError to be thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal('error to trying current period for suscription 1');
      }
    });

    it('should return lastPeriod if defined', async function() {
      const subscription = {
        id: 1,
        lastPeriod: { state: 'ACTIVE', id: 2 }
      };

      const result = await subscriptionMapper.getPeriod(subscription);

      expect(result).to.deep.equal(subscription.lastPeriod);
    });
  });

  describe('toSubscription()', function() {
    it('should create a subscription DTO', async function() {
      const subscription = {
        id: 1,
        endDate: moment('2023-02-01'),
        paymentPlatformId: 2,
        referenceId: 'sub_123',
        state: 'ACTIVE',
        getPeriods: sinon.stub()
      };

      const user = { id: 1, email: 'user@example.com' };

      const lastPeriod = {
        endDate: moment('2023-02-01'),
        getPlane: sinon.stub().resolves({ name: 'Basic Plan' })
      };

      const result = await subscriptionMapper.toSubscription(subscription, user, lastPeriod);

      expect(result).to.deep.equal({
        id: subscription.id,
        user: user,
        planeName: 'Basic Plan',
        endDate: subscription.endDate,
        renewDate: moment(lastPeriod.endDate).format('DD/MM/YYYY'),
        paymentPlatformId: subscription.paymentPlatformId,
        referenceId: subscription.referenceId,
        state: subscription.state
      });
    });

    it('should get lastPeriod if not provided', async function() {
      const subscription = {
        id: 1,
        endDate: moment('2023-02-01'),
        paymentPlatformId: 2,
        referenceId: 'sub_123',
        state: 'ACTIVE',
        getPeriods: sinon.stub().resolves([
          { state: 'ENDED' },
          { state: 'ACTIVE', id: 2, endDate: moment('2023-02-01'), getPlane: sinon.stub().resolves({ name: 'Basic Plan' }) }
        ])
      };

      const user = { id: 1, email: 'user@example.com' };

      const result = await subscriptionMapper.toSubscription(subscription, user);

      expect(result).to.deep.equal({
        id: subscription.id,
        user: user,
        planeName: 'Basic Plan',
        endDate: subscription.endDate,
        renewDate: moment('2023-02-01').format('DD/MM/YYYY'),
        paymentPlatformId: subscription.paymentPlatformId,
        referenceId: subscription.referenceId,
        state: subscription.state
      });
    });
  });
});
