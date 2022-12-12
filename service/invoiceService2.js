/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const easyinvoice = require("easyinvoice");
const fs = require("fs");

exports.createInvoice = async (orderData, user) => {
  const { order_items, orderSlug, contact } = orderData;
  if (!order_items && order_items.length < 1) {
    return false;
  }
  const myProduct = order_items.map(items => ({
    description: items.product.name.substring(0, 27),
    quantity: items.quantity,
    price: parseInt(items.product.price),
    "tax-rate": items.taxrate || 0
  }));
  const data = {
    customize: {
      // "template": fs.readFileSync('template.html', 'base64')
    },
    images: {
      // The logo on top of your invoice
      // logo: "../uploads/bog_moijdl.png"
      logo:
        "https://res.cloudinary.com/yhomi1996/image/upload/v1665783638/bog_moijdl.png"
      // The invoice background
      // https://public.easyinvoice.cloud/img/watermark-draft.jpg
      // background: ""
    },
    // Your own data
    sender: {
      company: "BOG LTD",
      address: "Sample Street 123",
      zip: "1234 AB",
      city: "Lagos",
      country: "Nigeria"
      // "custom1": "custom value 1",
      // "custom2": "custom value 2",
      // "custom3": "custom value 3"
    },
    // Your recipient
    client: {
      company: user.name,
      zip: contact.postal_code,
      state: contact.state,
      city: contact.city,
      country: contact.country
      // "custom1": "custom value 1",
      // "custom2": "custom value 2",
      // "custom3": "custom value 3"
    },
    information: {
      // Invoice number
      number: orderSlug,
      // Invoice data
      date: new Date().getDate()
    },
    // The products you would like to see on your invoice
    // Total values are being calculated automatically
    products: myProduct,
    // The message you would like to display on the bottom of your invoice
    "bottom-notice": "Kindly pay your invoice within 15 days.",
    // Settings to customize your invoice
    settings: {
      currency: "NGN" // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
      // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
      // "tax-notation": "gst", // Defaults to 'vat'
      // "margin-top": 25, // Defaults to '25'
      // "margin-right": 25, // Defaults to '25'
      // "margin-left": 25, // Defaults to '25'
      // "margin-bottom": 25, // Defaults to '25'
      // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
      // "height": "1000px", // allowed units: mm, cm, in, px
      // "width": "500px", // allowed units: mm, cm, in, px
      // "orientation": "landscape", // portrait or landscape, defaults to portrait
    },
    // Translate your invoice to your preferred language
    translate: {
      // "invoice": "FACTUUR",  // Default to 'INVOICE'
      // "number": "Nummer", // Defaults to 'Number'
      // "date": "Datum", // Default to 'Date'
      // "due-date": "Verloopdatum", // Defaults to 'Due Date'
      // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
      // "products": "Producten", // Defaults to 'Products'
      // "quantity": "Aantal", // Default to 'Quantity'
      // "price": "Prijs", // Defaults to 'Price'
      // "product-total": "Totaal", // Defaults to 'Total'
      // "total": "Totaal" // Defaults to 'Total'
    }
  };
  console.log(data);
  // Create your invoice! Easy!
  const result = await easyinvoice.createInvoice(data);
  // The response will contain a base64 encoded PDF file
  // console.log('PDF base64 string: ', result.pdf);
  fs.writeFileSync(`uploads/invoice/${orderSlug}.pdf`, result.pdf, "base64");
  // easyinvoice.download('myInvoice.pdf', result.pdf);

  return true;
};
