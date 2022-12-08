/* eslint-disable camelcase */
/* eslint-disable radix */
const dayjs = require("dayjs");
const nodeInvoice = require("nice-invoice");

exports.createInvoice = async (data, invoiceName, user) => {
  const { order_items, orderSlug, totalAmount, deliveryFee } = data;
  if (!order_items && order_items.length < 1) {
    return false;
  }
  const myProduct = order_items.map(items => ({
    item: items.product.name.substring(0, 17),
    description: `${items.product.description.substring(0, 20)}...`,
    quantity: items.quantity,
    price: parseInt(items.product.price),
    tax: "10%"
  }));

  const invoiceDetail = {
    shipping: {
      name: user.name,
      city: order_items[0].shippingAddress.city,
      state: order_items[0].shippingAddress.state,
      country: order_items[0].shippingAddress.country,
      postal_code: order_items[0].shippingAddress.postal_code
    },
    items: myProduct,
    subtotal: totalAmount - deliveryFee,
    total: totalAmount,
    order_number: orderSlug,
    header: {
      company_name: "BOG",
      company_logo: "bog_logo.png",
      company_address:
        "BOG. 2 metal box road, off acme road, Ogba Industrial Estate Rd, Ogba, Lagos"
    },
    footer: {
      text: `Copyright @ BOG ${new Date().getFullYear()}`
    },
    currency_symbol: `N`,
    date: {
      billing_date: dayjs().format("DD-MM-YYYY"),
      due_date: dayjs().format("DD-MM-YYYY")
    }
  };

  nodeInvoice(invoiceDetail, `uploads/invoice/${invoiceName}.pdf`);
  return true;
};
