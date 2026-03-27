const Stripe = require('stripe');

let stripeInstance;

try {
  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.warn('Failed to initialize Stripe. Mocking the service for testing.', error.message);
  // Optional: Mock instance for testing
}

/**
 * Create a new Stripe PaymentIntent (equivalent to Order)
 */
const createOrder = async (amount, receipt) => {
  try {
    if (!stripeInstance || !process.env.STRIPE_SECRET_KEY) {
      console.log('Using mock Stripe createOrder');
      return { id: `mock_pi_${Date.now()}`, amount: amount * 100, currency: 'inr', receipt };
    }

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amount * 100, // amount in the smallest currency unit
      currency: "inr",
      description: receipt
    });
    return paymentIntent;
  } catch (error) {
    console.error('Stripe Error: createOrder failed', error);
    throw error;
  }
};

/**
 * Execute a Payout (simulated for sandbox)
 */
const createPayout = async (amount, referenceId) => {
  try {
    // Simulating payout due to missing connected account info in event
    console.log(`Simulating Stripe payout of ₹${amount} for ref: ${referenceId}`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate Random Success/Failure (90% success)
    if (Math.random() > 0.9) {
      throw new Error('Simulated Stripe Payout API failure');
    }
    
    return {
      id: `po_mock_${Date.now()}`,
      amount: amount * 100,
      status: 'processed'
    };
  } catch (error) {
    console.error('Stripe Error: createPayout failed', error);
    throw error;
  }
};

module.exports = { createOrder, createPayout };
