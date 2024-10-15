const { expect } = require('chai');
const sinon = require('sinon');

const subscriptionTypeRepository = require('../../src/repositories/subscriptionTypeRepository');
const { SubscriptionType } = require('../../src/models/plane');

describe('SubscriptionTypeRepository', function() {

  afterEach(() => {
    sinon.restore();
  });

  describe('findById()', function() {
    it('should find a subscription type by id', async function() {
      const subscriptionTypeMock = { id: 1, name: 'Monthly' };

      sinon.stub(SubscriptionType, 'findByPk').resolves(subscriptionTypeMock);

      const result = await subscriptionTypeRepository.findById(1);

      expect(result).to.deep.equal(subscriptionTypeMock);
      sinon.assert.calledWith(SubscriptionType.findByPk, 1);
    });

    it('should return null if subscription type is not found', async function() {
      sinon.stub(SubscriptionType, 'findByPk').resolves(null);

      const result = await subscriptionTypeRepository.findById(999);

      expect(result).to.be.null;
    });
  });
});
