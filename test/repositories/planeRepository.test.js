const { expect } = require('chai');
const sinon = require('sinon');

const planeRepository = require('../../src/repositories/planeRepository');
const { Plane, Benefit, SubscriptionType, SubscriptionPrice } = require('../../src/models/plane');

describe('PlaneRepository', function() {

  afterEach(() => {
    sinon.restore();
  });

  describe('findAll()', function() {
    it('should return all planes with associated benefits and subscription prices', async function() {
      const planesMock = [
        {
          id: 1,
          name: 'Basic Plan',
          Benefits: [{ id: 1, name: 'Free Shipping' }],
          SubscriptionPrices: [
            { id: 1, price: 10, SubscriptionType: { id: 1, name: 'Monthly' } }
          ]
        }
      ];

      sinon.stub(Plane, 'findAll').resolves(planesMock);

      const result = await planeRepository.findAll();

      expect(result).to.deep.equal(planesMock);
      expect(result[0]).to.have.property('Benefits');
      expect(result[0]).to.have.property('SubscriptionPrices');
    });
  });

  describe('findById(id)', function() {
    it('should return a plane when the id exists', async function() {
      const planeMock = { id: 1, name: 'Basic Plan' };

      sinon.stub(Plane, 'findByPk').resolves(planeMock);

      const result = await planeRepository.findById(1);

      expect(result).to.deep.equal(planeMock);
    });

    it('should return null when the plane does not exist', async function() {
      sinon.stub(Plane, 'findByPk').resolves(null);

      const result = await planeRepository.findById(999);

      expect(result).to.be.null;
    });
  });
});
