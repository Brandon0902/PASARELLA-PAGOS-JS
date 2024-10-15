const { expect } = require('chai');
const sinon = require('sinon');

const subscriptionTypeService = require('../../src/services/subscriptionTypeService');
const SubscriptionTypeRepository = require('../../src/repositories/subscriptionTypeRepository');
const { NotFoundError } = require('../../src/handlers/errors');

describe('SubscriptionTypeService', function() {
  afterEach(() => {
    sinon.restore();
  });

  describe('getById()', function() {
    it('should return a subscription type when the id exists', async function() {
      const subscriptionTypeMock = { id: 1, name: 'Monthly' };

      sinon.stub(SubscriptionTypeRepository, 'findById').resolves(subscriptionTypeMock);

      const result = await subscriptionTypeService.getById(1);

      expect(result).to.deep.equal(subscriptionTypeMock);
      sinon.assert.calledWith(SubscriptionTypeRepository.findById, 1);
    });

    it('should throw NotFoundError when the subscription type is not found', async function() {
      sinon.stub(SubscriptionTypeRepository, 'findById').resolves(null);

      try {
        await subscriptionTypeService.getById(999);
        throw new Error('No debería llegar aquí');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal("subscription type '999' not found");
      }

      sinon.assert.calledWith(SubscriptionTypeRepository.findById, 999);
    });
  });
});
