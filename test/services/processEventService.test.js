const { expect } = require('chai');
const sinon = require('sinon');

const eventService = require('../../src/services/processEventService');
const SubscriptionEventService = require('../../src/services/subscriptionEventService');

describe('EventService', function() {
  afterEach(() => {
    sinon.restore();
  });

  describe('executeStrategy()', function() {
    it('should execute handleSubscriptionPaid strategy when eventType is subscription.paid', async function() {
      const eventData = {
        object: { id: 'sub_123' }
      };

      sinon.stub(SubscriptionEventService, 'subscriptionPaid').resolves({ success: true });

      const result = await eventService.executeStrategy('subscription.paid', eventData);

      expect(result).to.deep.equal({ success: true });
      sinon.assert.calledWith(SubscriptionEventService.subscriptionPaid, 'CONEKTA', { data: { subscription_id: 'sub_123' } });
    });

    it('should execute handleChargeDeclined strategy when eventType is charge.declined', async function() {
      const eventData = {
        data: {
          object: {
            customer_id: 'cus_123',
            failure_code: 'card_declined',
            failure_message: 'Card was declined'
          }
        }
      };

      sinon.stub(SubscriptionEventService, 'suspendSubscription').resolves({ success: true });

      const result = await eventService.executeStrategy('charge.declined', eventData);

      expect(result).to.deep.equal({ success: true });
      sinon.assert.calledWith(SubscriptionEventService.suspendSubscription, 'CONEKTA', {
        data: {
          customer_id: 'cus_123',
          errors: { failure_code: 'card_declined', failure_message: 'Card was declined' }
        }
      });
    });

    it('should execute handleSubscriptionCanceled strategy when eventType is subscription.canceled', async function() {
      const eventData = {
        object: { id: 'sub_456' }
      };

      sinon.stub(SubscriptionEventService, 'cancelSubscription').resolves({ success: true });

      const result = await eventService.executeStrategy('subscription.canceled', eventData);

      expect(result).to.deep.equal({ success: true });
      sinon.assert.calledWith(SubscriptionEventService.cancelSubscription, 'CONEKTA', { data: { subscription_id: 'sub_456' } });
    });

    it('should throw an error if the event type is unknown', async function() {
      const eventData = { object: { id: 'sub_789' } };

      try {
        await eventService.executeStrategy('unknown.event', eventData);
        throw new Error('No debería llegar aquí');
      } catch (err) {
        expect(err.message).to.equal('Estrategia no encontrada para el evento: unknown.event');
      }
    });
  });
});
