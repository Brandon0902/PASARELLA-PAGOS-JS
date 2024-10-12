const { expect } = require('chai');
const sinon = require('sinon');

const subscriptionPriceRepository = require('../../src/repositories/subscriptionPriceRepository');
const { SubscriptionPrice } = require('../../src/models/plane');

describe('SubscriptionPriceRepository', function() {

  afterEach(() => {
    sinon.restore();
  });

  describe('findByPlaneAndSubscriptionType()', function() {
    it('should find a subscription price by planeId and subscriptionTypeId', async function() {
      const subscriptionPriceMock = { id: 1, planeId: 1, subscriptionTypeId: 2, price: 10 };

      sinon.stub(SubscriptionPrice, 'findOne').resolves(subscriptionPriceMock);

      const result = await subscriptionPriceRepository.findByPlaneAndSubscriptionType(1, 2);

      expect(result).to.deep.equal(subscriptionPriceMock);
      sinon.assert.calledWith(SubscriptionPrice.findOne, {
        where: { planeId: 1, subscriptionTypeId: 2 }
      });
    });

    it('should return null if subscription price is not found', async function() {
      sinon.stub(SubscriptionPrice, 'findOne').resolves(null);

      const result = await subscriptionPriceRepository.findByPlaneAndSubscriptionType(1, 999);

      expect(result).to.be.null;
    });
  });
});
