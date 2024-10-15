const { expect } = require('chai');
const sinon = require('sinon');

const subscriptionRepository = require('../../src/repositories/subscriptionRepository');
const { Subscription } = require('../../src/models/plane');

describe('SubscriptionRepository', function() {

  afterEach(() => {
    sinon.restore();
  });

  describe('create()', function() {
    it('should create a new subscription with a transaction', async function() {
      const entity = { userId: 1, planId: 2 };
      const transactionMock = {};

      sinon.stub(Subscription, 'create').resolves(entity);

      const result = await subscriptionRepository.create(entity, transactionMock);

      expect(result).to.deep.equal(entity);
      sinon.assert.calledWith(Subscription.create, entity, { transaction: transactionMock });
    });
  });

  describe('findByUserId()', function() {
    it('should find a subscription by userId', async function() {
      const subscriptionMock = { id: 1, userId: 1, planId: 2 };

      sinon.stub(Subscription, 'findOne').resolves(subscriptionMock);

      const result = await subscriptionRepository.findByUserId(1);

      expect(result).to.deep.equal(subscriptionMock);
      sinon.assert.calledWith(Subscription.findOne, { where: { userId: 1 } });
    });
  });

  describe('findByIdAndUserId()', function() {
    it('should find a subscription by id and userId with state ACTIVE', async function() {
      const subscriptionMock = { id: 1, userId: 1, planId: 2, state: 'ACTIVE' };

      sinon.stub(Subscription, 'findOne').resolves(subscriptionMock);

      const result = await subscriptionRepository.findByIdAndUserId(1, 1);

      expect(result).to.deep.equal(subscriptionMock);
      sinon.assert.calledWith(Subscription.findOne, {
        where: { id: 1, userId: 1, state: 'ACTIVE' }
      });
    });

    it('should return null if subscription is not found', async function() {
      sinon.stub(Subscription, 'findOne').resolves(null);

      const result = await subscriptionRepository.findByIdAndUserId(999, 1);

      expect(result).to.be.null;
    });
  });

  describe('update()', function() {
    it('should update a subscription with given data and transaction', async function() {
      const updateData = { planId: 3 };
      const updateResultMock = [1, [{ id: 1, userId: 1, planId: 3 }]];
      const transactionMock = {};

      sinon.stub(Subscription, 'update').resolves(updateResultMock);

      const result = await subscriptionRepository.update(1, updateData, transactionMock);

      expect(result).to.deep.equal(updateResultMock);
      sinon.assert.calledWith(Subscription.update, updateData, { where: { id: 1 }, transaction: transactionMock, returning: true });
    });
  });
});
