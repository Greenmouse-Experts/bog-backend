const nodeInvoice = require('nice-invoice');

exports.createInvoice = async (data, invoiceName) => {
    const { order_items, orderSlug, totalAmount, deliveryFee } = data
    if (!order_items && order_items.length < 1) {
        return false;
    }
    const myProduct = order_items.map(items => (
        {
            item: items.product.name.substring(0, 17),
            description: items.product.description.substring(0, 20) + "...",
            quantity: items.quantity,
            price: parseInt(items.product.price),
            tax: "10%"
        }
    ));
    console.log(myProduct)
    const invoiceDetail = {
        shipping: {
            name: 'Stephen Olayemi',
            city: order_items[0].shippingAddress.city,
            state: order_items[0].shippingAddress.state,
            country: order_items[0].shippingAddress.country,
            postal_code: order_items[0].shippingAddress.postal_code,
        },
        items: myProduct,
        subtotal: (totalAmount - deliveryFee),
        total: totalAmount,
        order_number: orderSlug,
        header: {
            company_name: "BOG",
            company_logo: "uploads/1zhCsxYT-mail-email.jpg",
            company_address: "Nice Invoice. 123 William Street 1th Floor New York, NY 123456"
        },
        footer: {
            text: "Copyright @ BOG " + new Date().getFullYear(),
        },
        currency_symbol: "₦",
        date: {
            billing_date: "08 August 2020",
            due_date: "10 September 2020",
        }
    };

    nodeInvoice(invoiceDetail, 'uploads/invoice/' + invoiceName + '.pdf')
    return true
}