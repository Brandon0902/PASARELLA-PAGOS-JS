const { expect } = require('chai');
const sinon = require('sinon');
const subscriptionPeriodRepository = require('../../src/repositories/subscriptionPeriodRepository');
const { SubscriptionPeriod } = require('../../src/models/plane');

describe('SubscriptionPeriodRepository', function() {

  afterEach(() => {
    sinon.restore();
  });

  describe('create()', function() {
    it('should create a new subscription period with a transaction', async function() {
      const entity = { userId: 1, planId: 2, startDate: '2024-01-01', endDate: '2024-12-31' };
      const transactionMock = {};

      sinon.stub(SubscriptionPeriod, 'create').resolves(entity);

      const result = await subscriptionPeriodRepository.create(entity, transactionMock);

      expect(result).to.deep.equal(entity);
      sinon.assert.calledWith(SubscriptionPeriod.create, entity, { transaction: transactionMock });
    });
  });

  describe('update()', function() {
    it('should update an existing subscription period with a transaction', async function() {
      const updateData = { endDate: '2024-06-30' };
      const updateResultMock = [1, [{ id: 1, endDate: '2024-06-30' }]];
      const transactionMock = {};

      sinon.stub(SubscriptionPeriod, 'update').resolves(updateResultMock);

      const result = await subscriptionPeriodRepository.update(1, updateData, transactionMock);

      expect(result).to.deep.equal(updateResultMock);
      sinon.assert.calledWith(SubscriptionPeriod.update, updateData, { where: { id: 1 }, transaction: transactionMock, returning: true });
    });

    it('should return 0 if no subscription period was updated', async function() {
      const updateData = { endDate: '2024-06-30' };
      const updateResultMock = [0];
      const transactionMock = {};

      sinon.stub(SubscriptionPeriod, 'update').resolves(updateResultMock);

      const result = await subscriptionPeriodRepository.update(999, updateData, transactionMock);

      expect(result).to.deep.equal(updateResultMock);
      sinon.assert.calledWith(SubscriptionPeriod.update, updateData, { where: { id: 999 }, transaction: transactionMock, returning: true });
    });
  });
});
