const { expect } = require('chai');
const sinon = require('sinon');

// Importar el controlador y las dependencias
const planeController = require('../../src/controllers/planeController');
const planeService = require('../../src/services/planeService');
const Schemas = require('../../src/validations/schemas');
const { BadRequestError } = require('../../src/handlers/errors');

describe('PlaneController', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('getAll()', function() {
    it('debe devolver todos los planes', async function() {
      // Datos simulados
      const planesMock = [
        { id: 1, name: 'Plan Básico' },
        { id: 2, name: 'Plan Premium' }
      ];

      sinon.stub(planeService, 'getAll').resolves(planesMock);

      const req = {};
      const res = {
        json: sinon.stub()
      };
      const next = sinon.stub();

      await planeController.getAll(req, res, next);

      
      sinon.assert.calledOnce(planeService.getAll);
      sinon.assert.calledWith(res.json, planesMock);
      sinon.assert.notCalled(next);
    });

    it('debe llamar a next con error si el servicio falla', async function() {
      const error = new Error('Error del servicio');

      sinon.stub(planeService, 'getAll').rejects(error);

      const req = {};
      const res = {
        json: sinon.stub()
      };
      const next = sinon.stub();

      await planeController.getAll(req, res, next);

      sinon.assert.calledOnce(planeService.getAll);
      sinon.assert.notCalled(res.json);
      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next, error);
    });
  });

  describe('createPaymentPlatform()', function() {
    it('debe crear una plataforma de pago exitosamente', async function() {
      const requestBody = {
        plane_id: 1,
        subscription_type_id: 1,
        payment_platform_id: 1,
        reference_id: 'ref_123'
      };

      const planePaymentPlatformMock = { id: 1, ...requestBody };

      sinon.stub(Schemas.plane, 'validate').returns({ value: requestBody });

      sinon.stub(planeService, 'createPaymentPlatform').resolves(planePaymentPlatformMock);

      const req = { body: requestBody };
      const res = {
        json: sinon.stub()
      };
      const next = sinon.stub();

      await planeController.createPaymentPlatform(req, res, next);

      sinon.assert.calledOnce(Schemas.plane.validate);
      sinon.assert.calledWith(Schemas.plane.validate, requestBody);

      sinon.assert.calledOnce(planeService.createPaymentPlatform);
      sinon.assert.calledWith(planeService.createPaymentPlatform, {
        planeId: requestBody.plane_id,
        subscriptionTypeId: requestBody.subscription_type_id,
        paymentPlatformId: requestBody.payment_platform_id,
        referenceId: requestBody.reference_id
      });

      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, planePaymentPlatformMock);

      sinon.assert.notCalled(next);
    });

    it('debe llamar a next con BadRequestError si la validación falla', async function() {
      const requestBody = {
      };

      const validationError = { error: { message: 'Error de validación' } };
      sinon.stub(Schemas.plane, 'validate').returns(validationError);

      
      sinon.stub(planeService, 'createPaymentPlatform');

      const req = { body: requestBody };
      const res = {
        json: sinon.stub()
      };
      const next = sinon.stub();

      await planeController.createPaymentPlatform(req, res, next);

      sinon.assert.calledOnce(Schemas.plane.validate);
      sinon.assert.calledWith(Schemas.plane.validate, requestBody);

      sinon.assert.notCalled(planeService.createPaymentPlatform);
      sinon.assert.notCalled(res.json);

      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next, sinon.match.instanceOf(BadRequestError));
      expect(next.firstCall.args[0].message).to.equal('Error de validación');
    });

    it('debe llamar a next con error si el servicio falla', async function() {
      const requestBody = {
        plane_id: 1,
        subscription_type_id: 1,
        payment_platform_id: 1,
        reference_id: 'ref_123'
      };

      sinon.stub(Schemas.plane, 'validate').returns({ value: requestBody });

      const serviceError = new Error('Error del servicio');
      sinon.stub(planeService, 'createPaymentPlatform').rejects(serviceError);

      const req = { body: requestBody };
      const res = {
        json: sinon.stub()
      };
      const next = sinon.stub();

     
      await planeController.createPaymentPlatform(req, res, next);

      sinon.assert.calledOnce(Schemas.plane.validate);
      sinon.assert.calledOnce(planeService.createPaymentPlatform);

      sinon.assert.notCalled(res.json);

      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next, serviceError);
    });
  });
});
