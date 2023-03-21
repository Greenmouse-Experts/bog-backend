const { mailer_template, Mailer, Logo } = require("./Engine");

module.exports = {
  /**
   * Mailer for client project request
   * @param {{email, first_name}} user
   * @param {{}} _project
   */
  ClientProjectRequestMailer: async (user, _project) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = "white";

    const link = `${process.env.SITE_URL}/dashboard/myprojectdetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that you just created a project with the ID of ${_project.projectSlug}</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View project" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                    </p>
                `;
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `${process.env.APP_NAME} - Project Request [${_project.projectSlug}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve("Successful!");
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for new orders for buyers
   * @param {*} user
   * @param {*} orders
   * @param {*} ref_no
   */
  BuyersNewOrderMailer: async (user, orders, ref_no) => {
    const { email, first_name, client } = user;
    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = "white";

    const link = `${client.url}signin?redir_url=/dashboard/order/${ref_no}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">We are glad to inform you that we have received your order <b>${ref_no}</b></p><br/>
              `;
    params.body += `<p style="font-size: 1.4em;">Items in your order (${orders.length})</p>`;
    orders.forEach((order) => {
      params.body += `
            <div class='flex'>
                <img src='${order.item.image1}' style='width: 5em;'/>&nbsp;
                <div>
                    <p style="font-size: 1.4em;">${order.item.name}</p>
                    <p style="font-size: 1.4em;">NGN ${order.item.price.toLocaleString()}</p>
                    <p style="font-size: 1.4em;">Qty: ${order.quantity}</p>
                </div>
            </div><br/>
        `;
    });
    params.body += `<br/><p style="font-size: 1.4em;">For more info, you have to click the button below!</p>`;
    params.body += `
                  <p style="margin-top:30px; font-size: 1em;">
                      <a href="${link}" target="_BLANK" title="click to view your order" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Order</a>
                  </p>
              `;
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `${process.env.APP_NAME} - New Order [${ref_no}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve("Successful!");
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for new orders for admin
   * @param {*} user
   * @param {*} orders
   * @param {*} trx
   */
  AdminNewOrderMailer: async (user, orders, trx) => {
    const { email, url } = user;
    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = "white";

    const link = `${url}signin?redir_url=/dashboard/order/${trx.ref}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that a buyer just placed an order <b>${trx.ref}</b></p><br/>
                  <p style="font-size: 1.4em;">Name: ${trx.buyer.first_name} ${trx.buyer.last_name}</p>
                  <p style="font-size: 1.4em;">Email: ${trx.buyer.email}</p>
                  <p style="font-size: 1.4em;">Phone: ${trx.buyer.phone}</p>
              `;
    params.body += `<p style="font-size: 1.4em;">Order Items (${orders.length})</p>`;
    orders.forEach((order) => {
      params.body += `
            <div class='flex'>
                <img src='${order.item.image1}' style='width: 5em;'/>&nbsp;
                <div>
                    <p style="font-size: 1.4em;">${order.item.name}</p>
                    <p style="font-size: 1.4em;">NGN ${order.item.price.toLocaleString()}</p>
                    <p style="font-size: 1.4em;">Qty: ${order.quantity}</p>
                </div>
            </div><br/>
        `;
    });
    params.body += `<br/><p style="font-size: 1.4em;">For more info, you have to click the button below!</p>`;
    params.body += `
                  <p style="margin-top:30px; font-size: 1em;">
                      <a href="${link}" target="_BLANK" title="click to view your order" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Order</a>
                  </p>
              `;
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `${process.env.APP_NAME} - New Order [${trx.ref}] from ${trx.buyer.first_name} ${trx.buyer.last_name}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve("Successful");
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for updating orders for buyers
   * @param {*} user
   * @param {*} ref_no
   */
  BuyersUpdateOrderMailer: async (url, trx) => {
    const { buyer } = trx;
    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = "white";

    const link = `${url}signin?redir_url=/dashboard/order/${trx.ref}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${buyer.first_name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">We are glad to inform you that your order's status has been updated</p><br/>
              `;
    params.body += `<p style="font-size: 1.4em;">Reference No: (${trx.ref})</p>`;
    params.body += `<p style="font-size: 1.4em;">Status: (${trx.status})</p>`;
    params.body += `<br/><p style="font-size: 1.4em;">For more info, you have to click the button below!</p>`;
    params.body += `
                  <p style="margin-top:30px; font-size: 1em;">
                      <a href="${link}" target="_BLANK" title="click to view your order" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Order</a>
                  </p>
              `;
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email: buyer.email,
      subject: `${process.env.APP_NAME} - Your Order [${trx.ref}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve("Successful!");
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for updating orders for admin
   * @param {*} user
   * @param {*} ref_no
   */
  AdminUpdateOrderMailer: async (user, trx) => {
    const { email, first_name, client } = user;
    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = "white";

    const link = `${client.url}signin?redir_url=/dashboard/order/${trx.ref}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator ${first_name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that you just updated the status of your buyer's order</p><br/>
                  <p style="font-size: 1.4em;">Name: ${trx.buyer.first_name} ${trx.buyer.last_name}</p>
                  <p style="font-size: 1.4em;">Email: ${trx.buyer.email}</p>
                  <p style="font-size: 1.4em;">Phone: ${trx.buyer.phone}</p>
              `;
    params.body += `<p style="font-size: 1.4em;">Order Ref <b>${trx.ref}</b></p>`;
    params.body += `<p style="font-size: 1.4em;">Order Status <b>${trx.status}</b></p>`;

    params.body += `<br/><p style="font-size: 1.4em;">For more info, you have to click the button below!</p>`;
    params.body += `
                  <p style="margin-top:30px; font-size: 1em;">
                      <a href="${link}" target="_BLANK" title="click to view your order" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Order</a>
                  </p>
              `;
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `${process.env.APP_NAME} - Your Order [${trx.ref}] from ${trx.buyer.first_name} ${trx.buyer.last_name}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve("Successful!");
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
