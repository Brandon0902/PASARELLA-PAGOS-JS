const { expect } = require('chai');
const sinon = require('sinon');

const planeService = require('../../src/services/planeService');

const repository = require('../../src/repositories/planeRepository');
const { PlanePaymentPlatform, PaymentPlatform } = require('../../src/models/plane');
const SubscriptionTypeService = require('../../src/services/subscriptionTypeService');
const { NotFoundError } = require('../../src/handlers/errors');
const moment = require('moment');


describe('PlaneService', function() {

  afterEach(() => {
    sinon.restore();
  });

  describe('getAll()', function() {
    it('should return all planes', async function() {
      const planesMock = [{ id: 1, name: 'Plane 1' }, { id: 2, name: 'Plane 2' }];
      
      sinon.stub(repository, 'findAll').resolves(planesMock);
      
      const result = await planeService.getAll();
      
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.equal(planesMock);
    });
  });

  describe('getById(id)', function() {
    it('should return a plane when the id exists', async function() {
      const planeMock = { id: 1, name: 'Plane 1' };
      
      sinon.stub(repository, 'findById').resolves(planeMock);
      
      const result = await planeService.getById(1);
      
      expect(result).to.deep.equal(planeMock);
    });

    it('should throw NotFoundError when the plane is not found', async function() {
      sinon.stub(repository, 'findById').resolves(null);

      try {
        await planeService.getById(999);
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal("plane not '999' found");
      }
    });
  });

  describe('createPaymentPlatform(data)', function() {
    it('should create a new payment platform', async function() {
      const data = {
        planeId: 1,
        subscriptionTypeId: 1,
        paymentPlatformId: 1
      };
      const newPlatformMock = { id: 1, ...data, state: 'ACTIVE', createdAt: moment() };

      sinon.stub(planeService, 'getById').resolves({ id: 1 });
      sinon.stub(SubscriptionTypeService, 'getById').resolves({ id: 1 });
      sinon.stub(PaymentPlatform, 'findByPk').resolves({ id: 1 });
      sinon.stub(PlanePaymentPlatform, 'create').resolves(newPlatformMock);

      const result = await planeService.createPaymentPlatform(data);

      expect(result).to.have.property('id');
      expect(result.state).to.equal('ACTIVE');
      expect(result.planeId).to.equal(1);
    });

    it('should throw NotFoundError if payment platform is not found', async function() {
      const data = {
        planeId: 1,
        subscriptionTypeId: 1,
        paymentPlatformId: 999
      };

      sinon.stub(planeService, 'getById').resolves({ id: 1 });
      sinon.stub(SubscriptionTypeService, 'getById').resolves({ id: 1 });
      sinon.stub(PaymentPlatform, 'findByPk').resolves(null);

      try {
        await planeService.createPaymentPlatform(data);
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal("payment platform '999' not found");
      }
    });
  });
});
