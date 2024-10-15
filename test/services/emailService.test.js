const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const path = require('path');
const appConfig = require('../../src/config/config');

describe('EmailService', function() {
  let sendEmailStub, emailService, fsStub, ejsStub;

  const subscriptionMock = {
    user: { email: 'testuser@example.com' },
    planeName: 'Basic Plan',
    renewDate: '2024-12-31'
  };

  beforeEach(function() {
    appConfig.properties = {
      ...appConfig.properties,
      SEND_GRID_EMAIL_FROM: 'no-reply@example.com',
      SUPPORT_EMAIL_CONTACT: 'support@example.com'
    };

    sendEmailStub = sinon.stub().resolves();

    fsStub = {
      readFileSync: sinon.stub().returns('<html>Email template</html>')
    };

    ejsStub = {
      render: sinon.stub().returns('<html>Rendered Email</html>')
    };

    emailService = proxyquire('../../src/services/emailService', {
      '../utils/email': { sendEmail: sendEmailStub },
      'fs': fsStub,
      'ejs': ejsStub
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should send an email with the correct data', async function() {
    await emailService.send(subscriptionMock);

    const expectedEmailData = {
      to: 'testuser@example.com',
      from: 'no-reply@example.com',
      subject: '¡Ya eres parte de Lexfania! Comienza usar la plataforma hoy mismo',
      text: undefined,
      html: '<html>Rendered Email</html>'
    };

    sinon.assert.calledOnce(fsStub.readFileSync);
    sinon.assert.calledWith(fsStub.readFileSync, sinon.match((filePath) => {
      return filePath.includes(path.join('resources', 'templates', 'subscription_template.ejs'));
    }), 'utf-8');

    sinon.assert.calledOnce(ejsStub.render);
    sinon.assert.calledWith(ejsStub.render, '<html>Email template</html>', {
      planeName: 'Basic Plan',
      renewDate: '2024-12-31',
      contactEmail: 'support@example.com'
    });

    sinon.assert.calledOnce(sendEmailStub);
    sinon.assert.calledWithMatch(sendEmailStub, expectedEmailData);
  });

  it('should throw an error if email sending fails', async function() {
    sendEmailStub.rejects(new Error('Email sending failed'));

    try {
      await emailService.send(subscriptionMock);
      throw new Error('Expected method to reject.');
    } catch (err) {
      expect(err.message).to.equal('Email sending failed');
    }

    sinon.assert.calledOnce(sendEmailStub);
  });
});
