const { publishEvent } = require('../utils/rabbitmq');

const publishPaymentSuccess = async (userId, plan, amount) => {
  const event = {
    type: 'PAYMENT_SUCCESS',
    userId,
    plan,
    amount
  };
  await publishEvent('payment.success', event);
};

const publishPaymentFailed = async (userId, reason) => {
  const event = {
    type: 'PAYMENT_FAILED',
    userId,
    reason
  };
  await publishEvent('payment.failed', event);
};

const publishPayoutSuccess = async (claimId, userId, amount) => {
  const event = {
    type: 'PAYOUT_SUCCESS',
    claimId,
    userId,
    amount
  };
  await publishEvent('payout.success', event);
};

const publishPayoutFailed = async (claimId, userId, reason) => {
  const event = {
    type: 'PAYOUT_FAILED',
    claimId,
    userId,
    reason
  };
  await publishEvent('payout.failed', event);
};

module.exports = {
  publishPaymentSuccess,
  publishPaymentFailed,
  publishPayoutSuccess,
  publishPayoutFailed
};
