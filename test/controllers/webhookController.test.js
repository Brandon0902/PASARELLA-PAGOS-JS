const { expect } = require('chai');
const sinon = require('sinon');

const webhookController = require('../../src/controllers/webhookController');
const processEventService = require('../../src/services/processEventService');

describe('WebhookController', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('handleWebhook()', function() {
    it('debe procesar el evento exitosamente y responder con estado 200', async function() {
      const event = {
        type: 'subscription.paid',
        data: {}
      };

      sinon.stub(processEventService, 'executeStrategy').resolves();

      const req = {
        body: event
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };

      await webhookController.handleWebhook(req, res);

      sinon.assert.calledOnce(processEventService.executeStrategy);
      sinon.assert.calledWith(processEventService.executeStrategy, event.type, event);

      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);

      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, 'Evento recibido y procesado');
    });

    it('debe manejar errores y responder con estado 400', async function() {
      const event = {
        type: 'subscription.paid',
        data: {}
      };

      const error = new Error('Error procesando el evento');

      sinon.stub(processEventService, 'executeStrategy').rejects(error);

      const req = {
        body: event
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };

      await webhookController.handleWebhook(req, res);

      sinon.assert.calledOnce(processEventService.executeStrategy);
      sinon.assert.calledWith(processEventService.executeStrategy, event.type, event);

      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 400);

      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, `Error procesando el evento: ${error.message}`);
    });

    it('debe manejar eventos sin tipo y responder con estado 400', async function() {
      const event = {
        data: {}
      };

      sinon.stub(processEventService, 'executeStrategy');

      const req = {
        body: event
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };

      await webhookController.handleWebhook(req, res);

      sinon.assert.notCalled(processEventService.executeStrategy);

      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 400);

      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, 'Error: El tipo de evento es obligatorio');
    });
  });
});
