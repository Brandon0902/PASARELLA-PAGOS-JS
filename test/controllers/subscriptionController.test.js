const { expect } = require('chai');
const sinon = require('sinon');

const subscriptionController = require('../../src/controllers/subscriptionController');
const SubscriptionService = require('../../src/services/subscriptionService');
const subscriptionSchema = require('../../src/validations/schemas');
const { BadRequestError } = require('../../src/handlers/errors');

describe('SubscriptionController', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('create()', function() {
    it('debe crear una suscripción exitosamente', async function() {
      const subscriptionRequest = {
        plane_id: 1,
        subscription_type_id: 1,
        token_id: 'tok_123'
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      };

      const subscriptionMock = {
        id: 1,
        userId: user.id,
        state: 'ACTIVE',
      };

      sinon.stub(subscriptionSchema.subscription, 'validate').returns({ value: subscriptionRequest });
      sinon.stub(SubscriptionService, 'create').resolves(subscriptionMock);

      const req = {
        body: subscriptionRequest,
        user: user
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
      const next = sinon.stub();

      await subscriptionController.create(req, res, next);

      sinon.assert.calledOnce(subscriptionSchema.subscription.validate);
      sinon.assert.calledWith(subscriptionSchema.subscription.validate, subscriptionRequest);

      sinon.assert.calledOnce(SubscriptionService.create);
      sinon.assert.calledWith(SubscriptionService.create, { user, subscriptionRequest });

      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);

      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, subscriptionMock);

      sinon.assert.notCalled(next);
    });

    it('debe llamar a next con BadRequestError si la validación falla', async function() {
      const subscriptionRequest = {};

      const validationError = { error: { message: 'Error de validación' } };
      sinon.stub(subscriptionSchema.subscription, 'validate').returns(validationError);

      sinon.stub(SubscriptionService, 'create');

      const req = {
        body: subscriptionRequest
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
      const next = sinon.stub();

      await subscriptionController.create(req, res, next);

      sinon.assert.calledOnce(subscriptionSchema.subscription.validate);
      sinon.assert.calledWith(subscriptionSchema.subscription.validate, subscriptionRequest);

      sinon.assert.notCalled(SubscriptionService.create);

      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next, sinon.match.instanceOf(BadRequestError));
      expect(next.firstCall.args[0].message).to.equal('Error de validación');

      sinon.assert.notCalled(res.send);
    });

    it('debe llamar a next con error si el servicio falla', async function() {
      const subscriptionRequest = {
        plane_id: 1,
        subscription_type_id: 1,
        token_id: 'tok_123'
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      };

      const error = new Error('Error del servicio');

      sinon.stub(subscriptionSchema.subscription, 'validate').returns({ value: subscriptionRequest });
      sinon.stub(SubscriptionService, 'create').rejects(error);

      const req = {
        body: subscriptionRequest,
        user: user
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
      const next = sinon.stub();

      await subscriptionController.create(req, res, next);

      sinon.assert.calledOnce(subscriptionSchema.subscription.validate);
      sinon.assert.calledWith(subscriptionSchema.subscription.validate, subscriptionRequest);

      sinon.assert.calledOnce(SubscriptionService.create);
      sinon.assert.calledWith(SubscriptionService.create, { user, subscriptionRequest });

      sinon.assert.notCalled(res.send);

      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next, error);
    });
  });

  describe('cancel()', function() {
    it('debe cancelar una suscripción exitosamente', async function() {
      const user = {
        id: 1
      };
      const id = '1';
      const result = {
        id: 1,
        state: 'CANCELLED'
      };

      sinon.stub(SubscriptionService, 'cancel').resolves(result);

      const req = {
        params: { id },
        user
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
      const next = sinon.stub();

      await subscriptionController.cancel(req, res, next);

      sinon.assert.calledOnce(SubscriptionService.cancel);
      sinon.assert.calledWith(SubscriptionService.cancel, { id: parseInt(id), user });

      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);

      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, result);

      sinon.assert.notCalled(next);
    });

    it('debe llamar a next con error si el servicio falla', async function() {
      const user = {
        id: 1
      };
      const id = '1';
      const error = new Error('Error del servicio');

      sinon.stub(SubscriptionService, 'cancel').rejects(error);

      const req = {
        params: { id },
        user
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
      const next = sinon.stub();

      await subscriptionController.cancel(req, res, next);

      sinon.assert.calledOnce(SubscriptionService.cancel);
      sinon.assert.calledWith(SubscriptionService.cancel, { id: parseInt(id), user });

      sinon.assert.notCalled(res.send);

      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next, error);
    });
  });

  describe('getActiveSubscription()', function() {
    it('debe devolver la suscripción activa exitosamente', async function() {
      const user = {
        id: 1
      };
      const subscriptionMock = {
        id: 1,
        userId: 1,
        state: 'ACTIVE',
      };

      sinon.stub(SubscriptionService, 'getActiveSubscription').resolves(subscriptionMock);

      const req = {
        user
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
      const next = sinon.stub();

      await subscriptionController.getActiveSubscription(req, res, next);

      sinon.assert.calledOnce(SubscriptionService.getActiveSubscription);
      sinon.assert.calledWith(SubscriptionService.getActiveSubscription, user.id);

      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);

      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, subscriptionMock);

      sinon.assert.notCalled(next);
    });

    it('debe llamar a next con error si el servicio falla', async function() {
      const user = {
        id: 1
      };
      const error = new Error('Error del servicio');

      sinon.stub(SubscriptionService, 'getActiveSubscription').rejects(error);

      const req = {
        user
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };
      const next = sinon.stub();

      await subscriptionController.getActiveSubscription(req, res, next);

      sinon.assert.calledOnce(SubscriptionService.getActiveSubscription);
      sinon.assert.calledWith(SubscriptionService.getActiveSubscription, user.id);

      sinon.assert.notCalled(res.send);

      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next, error);
    });
  });
});
