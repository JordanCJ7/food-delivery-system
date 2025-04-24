const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const PayPalClient = () => {
  const environment = process.env.NODE_ENV === 'production'
    ? new checkoutNodeJssdk.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET)
    : new checkoutNodeJssdk.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);

  return new checkoutNodeJssdk.core.PayPalHttpClient(environment);
};

module.exports = {
  PayPalClient,
  PayPalOrders: checkoutNodeJssdk.orders
};
