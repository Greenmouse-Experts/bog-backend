const { capitalize } = require('lodash');
const { mailer_template, Mailer, Logo } = require('./Engine');

module.exports = {
  /**
   * Mailer for client project request
   * @param {{email: string, first_name: string}} user
   * @param {{}} _project
   */
  ClientProjectRequestMailer: async (user, _project) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/myprojectdetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that you just created a project with the ID of ${_project.projectSlug}</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                    </p>
                `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project Request [${_project.projectSlug}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for client project commencement
   * @param {{email: string, first_name: string}} user
   * @param {{fee: number, ref: string}} trx
   * @param {{}} _project
   */
  ClientProjectCommencementMailer: async (user, trx, _project) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/myprojectdetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that you just commenced your project with the ID of ${
                      _project.projectSlug
                    } by paying the commitment fee of NGN ${trx.fee.toLocaleString()}</p><br/>
                    <p style="font-size: 1.4em;">Reference: ${trx.ref}</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                    </p>
                `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project Commencement [${_project.projectSlug}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for client on project update
   * @param {{email: string, first_name: string}} user
   * @param {string} status
   * @param {{}} _project
   */
  ClientMailerForProjectUpdate: async (user, status, _project) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/myprojectdetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that your project with the ID of ${_project.projectSlug} has been ${status}</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                    </p>
                `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project [${_project.projectSlug}] has been ${status}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Client mailer on project's progress
   * @param {{email:string, first_name:string}} user
   * @param {string} status
   * @param {number} percent
   * @param {{}} _project
   */
  ClientMailerForProjectProgress: async (user, status, percent, _project) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/myprojectdetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">Your project with the ID of ${_project.projectSlug} is ${status}</p>
                    <p style="font-size: 1.4em;">Progress: ${percent}%</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                    </p>
                `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project [${_project.projectSlug}] progress update`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Client mailer on project's installment payment
   * @param {{email:string, first_name:string}} user
   * @param {{}} project_installment
   * @param {{}} _project
   */
  ClientMailerForProjectInstallmentPayment: async (
    user,
    project_installment,
    _project
  ) => {
    const { email, first_name } = user;
    const { amount, title } = project_installment;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/myprojectdetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">You have paid the ${title} of NGN ${amount.toLocaleString()} for the project with the ID of ${
      _project.projectSlug
    }</p>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                    </p>
                `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project [${_project.projectSlug}] installment payment`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Client mailer on project's progress note update
   * @param {{email:string, first_name:string}} user
   * @param {string} note
   * @param {string} image
   * @param {{}} _project
   */
  ClientMailerForProjectProgressNoteUpdate: async (
    user,
    note,
    image,
    _project
  ) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/myprojectdetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">Here's the update for the project with the ID of ${
                      _project.projectSlug
                    }</p><br/>
                    ${image &&
                      `<p style="font-size: 1.2em;"><img src="${image}" style="width: 10em; object-fit: contain;" /></p>`}
                    <p style="font-size: 1.2em;"> - ${note}</p><br/>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                    </p>
                `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project [${_project.projectSlug}] Notification`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for service partners on project dispatch
   * @param {[]} service_partners
   * @param {string} status
   * @param {{}} _project
   */
  ServicePartnersMailerForProjectDispatch: async (
    service_partners,
    status,
    _project
  ) => {
    // const { email, first_name } = user;

    // Get service partners email addresses
    // let partner_emails = [];
    service_partners.forEach(async (partner) => {
      // partner_emails.push(partner.email);
      let params = {};
      params.logo = Logo;
      params.header_color = 'white';

      const link = `${process.env.SITE_URL}/login?redir_url=/dashboard/projectfile?projectId=${_project.id}`;

      params.body = `<p style="font-size:1.7em;"><b>Hi, Service partner ${partner.fname}</b></p>`;
      params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that the project with the ID of ${_project.projectSlug} has been ${status} to you</p><br/>
                    <p style="font-size: 1.4em;">To view project submission and bid for it, click the button below!</p>
                `;
      params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View submission" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Submission</a>
                    </p>
                `;
      params.footer = '';
      params.date = new Date().getFullYear();

      let params2 = {
        email: partner.email,
        subject: `Project [${_project.projectSlug}] has been ${status} to you`,
      };

      const template = mailer_template(params);

      // Send Mail
      await Mailer(template, params2);
    });
  },

  /**
   * Mailer for service partners on project dispatch
   * @param {[]} service_partners
   * @param {string} status
   * @param {{}} _project
   */
  ProductPartnersMailerForProductDispatch: async (
    service_partners,
    status,
    _product
  ) => {
    // const { email, first_name } = user;

    // Get service partners email addresses
    // let partner_emails = [];
    service_partners.forEach(async (partner) => {
      // partner_emails.push(partner.email);
      let params = {};
      params.logo = Logo;
      params.header_color = 'white';

      const link = `${process.env.SITE_URL}/dashboard/projectfile?projectId=${_project.id}`;

      params.body = `<p style="font-size:1.7em;"><b>Hi, Service partner ${partner.fname}</b></p>`;
      params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that the project with the ID of ${_project.projectSlug} has been ${status} to you</p><br/>
                    <p style="font-size: 1.4em;">To view project submission and bid for it, click the button below!</p>
                `;
      params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View submission" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Submission</a>
                    </p>
                `;
      params.footer = '';
      params.date = new Date().getFullYear();

      let params2 = {
        email: partner.email,
        subject: `Project [${_project.projectSlug}] has been ${status} to you`,
      };

      const template = mailer_template(params);

      // Send Mail
      await Mailer(template, params2);
    });
  },

  /**
   * Mailer for service partner on project bid
   * @param {{email: string, first_name: string}} service_partner
   * @param {{}} _project
   */
  ServicePartnerMailerForProjectBid: async (service_partner, _project) => {
    const { email, first_name } = service_partner;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/login?redir_url=/dashboard/projects`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Service partner ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that you have bidden for the project with the ID of ${_project.projectSlug}</p><br/>
                    <p style="font-size: 1.4em;">To view project submission, click the button below!</p>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View submission" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Submission</a>
                    </p>
                `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `You have bidden for the Project [${_project.projectSlug}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for service partner on project update
   * @param {{email: string, first_name: string}} service_partner
   * @param {number} percent
   * @param {{}} project
   */
  ServicePartnerMailerForProjectUpdate: async (
    service_partner,
    percent,
    project
  ) => {
    const { email, first_name } = service_partner;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectfile?projectId=${project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Service partner ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that you have update the project's progress [${project.projectSlug}] to ${percent}% </p><br/>
                    <p style="font-size: 1.4em;">To view project details, click the button below!</p>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="View details" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Details</a>
                    </p>
                `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project [${project.projectSlug}] progress update`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for service partner that a project has been assigned to
   * @param {{email: string, first_name: string}} service_partner
   * @param {{}} _project
   */
  ServicePartnerMailerForProjectAssignment: async (
    service_partner,
    _project
  ) => {
    const { email, first_name } = service_partner;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/login?redir_url=/dashboard/projects`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Service partner ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that the project with the ID of ${_project.projectSlug} has been assigned to you</p>
                `;

    params.body += `
    <p style="margin-top:30px; font-size: 1em;">
        <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View project Details</a>
    </p>
`;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project Assignment [${_project.projectSlug}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for service partner on project payout
   * @param {{email: string, first_name: string}} service_partner
   * @param {number} amount
   * @param {{}} _project
   */
  ServicePartnerMailerForProjectPayout: async (
    service_partner,
    amount,
    _project
  ) => {
    const { email, first_name } = service_partner;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectfile?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Service partner ${first_name}</b></p><br/>`;
    params.body += `
                    <p style="font-size: 1.2em;">You been paid an amount of NGN ${amount} for the project [${_project.projectSlug} that has been assigned to you.</p>
                `;

    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                </p>
            `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project Payout [${_project.projectSlug}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for super admin and project admins on project request
   * @param {{name: string, userType: string, id: string}} user
   * @param {[]} admins
   * @param {{}} _project
   */
  AdminProjectRequestMailer: async (user, admins, _project) => {
    const { name, userType, id } = user;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that ${name} (${userType}) with the userID of #${id} just created a project with the ID of ${_project.projectSlug}</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                </p>
            `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project Request [${_project.projectSlug}] from userID #${id}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for super admins and project admins on project commencement
   * @param {{name: string, userType: string, id: string}} user
   * @param {[]} admins
   * @param {{fee: number, ref: string}} trx
   * @param {{}} _project
   */
  AdminProjectCommencementMailer: async (user, admins, trx, _project) => {
    const { name, userType, id } = user;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that ${name} (${userType}) with the userID of #${id} just commenced the project with the ID of ${
      _project.projectSlug
    } by paying the commitment fee of NGN ${trx.fee.toLocaleString()}.</p><br/>
                    <p style="font-size: 1.4em;">Reference: ${trx.ref}</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                </p>
            `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project Commencement [${_project.projectSlug}] from userID #${id}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Admins mailer for updating project status
   * @param {{name: string, userType: string, id: string}} user
   * @param {[]} admins
   * @param {string} status
   * @param {{}} _project
   */
  AdminProjectUpdateMailer: async (user, admins, status, _project) => {
    const { name, userType, id } = user;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that the project with the ID of ${_project.projectSlug} belonging to ${name} (${userType}) with the userID of #${id} has been ${status}.</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                </p>
            `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] has been ${status}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Admins mailer for project dispatched to service partners
   * @param {{name: string, userType: string, id: string}} user
   * @param {[]} service_partners
   * @param {[]} admins
   * @param {string} status
   * @param {{}} _project
   */
  AdminProjectDispatchMailer: async (
    user,
    service_partners,
    admins,
    status,
    _project
  ) => {
    const { name, userType, id } = user;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that the project with the ID of ${_project.projectSlug} belonging to ${name} (${userType}) with the userID of #${id} has been ${status} to the following service partners:</p><br/>
                    
                      &nbsp;&nbsp;<ul>`;
    service_partners.forEach((_partner) => {
      params.body += `
                        <li><p style="font-size: 1.4em;">${_partner.name} (${_partner.email})</p></li>
                        `;
    });
    params.body += `
                      </ul>
                    <br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                </p>
            `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] has been ${status}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Admins mailer for service partner's bids
   * @param {{name: string, userType: string, id: string}} user
   * @param {{first_name:string, name:string, email:string, id:string}} service_partner
   * @param {[]} admins
   * @param {string} status
   * @param {{}} _project
   */
  AdminProjectBidUpdateMailer: async (
    user,
    service_partner,
    admins,
    status,
    _project
  ) => {
    const { name, userType, id } = user;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that the project with the ID of ${_project.projectSlug} belonging to ${name} (${userType}) with the userID of #${id} has been ${status} by ${service_partner.name} (${service_partner.email})</p><br/>
                    <p style="font-size: 1.4em;">To view project bids, you have to click the button below!</p>
                `;
    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View bids" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Bids</a>
                </p>
            `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] bid from ${service_partner.first_name} #${service_partner.id}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Admins mailer on project assignment to a service partner
   * @param {{name: string, userType: string, id: string}} user
   * @param {{first_name:string, name:string, email:string, id:string}} service_partner
   * @param {[]} admins
   * @param {string} status
   * @param {{}} _project
   */
  AdminProjectAssigmentUpdateMailer: async (
    user,
    service_partner,
    admins,
    status,
    _project
  ) => {
    const { name, userType, id } = user;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that the project with the ID of ${_project.projectSlug} belonging to ${name} (${userType}) with the userID of #${id} has been assigned to ${service_partner.name} (${service_partner.email})</p><br/>
                    <p style="font-size: 1.4em;">To view project details, click the button below!</p>
                `;
    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View project details" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View project details</a>
                </p>
            `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project Assignment [${_project.projectSlug}] to ${service_partner.first_name} #${service_partner.id}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Update project and super admins on project updates
   * @param {{}} service_partner
   * @param {[]} admins
   * @param {number} percent
   * @param {{}} _project
   */
  AdminProjectUpdateMailerFromServicePartner: async (
    service_partner,
    admins,
    percent,
    _project
  ) => {
    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that the project with the ID of ${_project.projectSlug} has been updated to ${percent}% by ${service_partner.name} (${service_partner.email})</p><br/>
                    <p style="font-size: 1.4em;">To view project details, click the button below!</p>
                `;
    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View project details" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View project details</a>
                </p>
            `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project Update [${_project.projectSlug}] from ${service_partner.first_name} #${service_partner.id}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Admins mailer for updating project progress
   * @param {{name: string, userType: string, id: string}} user
   * @param {[]} admins
   * @param {string} status
   * @param {number} percent
   * @param {{}} _project
   */
  AdminProjectProgressMailer: async (
    user,
    admins,
    status,
    percent,
    _project
  ) => {
    const { name, userType, id } = user;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">Project with the ID of ${_project.projectSlug} belonging to ${name} (${userType}) with the userID of #${id} is ${status}.</p>
                    <p style="font-size: 1.4em;">Progress: ${percent}%</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                </p>
            `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] progress update`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Admins mailer for project note update mailer
   * @param {{name: string, userType: string, id: string}} user
   * @param {[]} admins
   * @param {string} note
   * @param {string} image
   * @param {{}} _project
   */
  AdminProjectProgressNoteUpdateMailer: async (
    admins,
    note,
    image,
    _project
  ) => {
    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">A notification on the project ${
                      _project.slug
                    } with the ID #${_project.id} was sent.</p><br/>
                    ${image &&
                      `<p style="font-size: 1.2em;"><img src="${image}" style="width: 10em; object-fit: contain;" /></p>`}
                    <p style="font-size: 1.2em;"> - ${note}</p><br/>
                    <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
                `;
    params.body += `
                <p style="margin-top:30px; font-size: 1em;">
                    <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
                </p>
            `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] Notification`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Admins mailer for project progress note update
   * @param {{name: string, userType: string, id: string}} user
   * @param {[]} admins
   * @param {string} note
   * @param {string} image
   * @param {{}} _project
   */
  AdminProjectInstallmentPaymentMailer: async (
    user,
    admins,
    pr_installment,
    _project
  ) => {
    const { name, userType, id } = user;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">Project ${name} (${userType}) with the ID #${id} paid the ${
      _project.title
    } of NGN ${pr_installment.amount.toLocaleString()} for the project with the ID of ${
      _project.projectSlug
    }.</p>
                  <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
              `;
    params.body += `
              <p style="margin-top:30px; font-size: 1em;">
                  <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
              </p>
          `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] installment payment`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Admins mailer for project progress note update
   * @param {{company_name:string}} service_partner
   * @param {[]} admins
   * @param {string} amount
   * @param {{}} _project
   */
  AdminProjectPayoutMailer: async (
    service_partner,
    admins,
    amount,
    _project
  ) => {
    const { company_name } = service_partner;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/projectadmindetails?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">Service partner ${company_name} has been paid an amount of NGN ${amount.toLocaleString()} for the project [${
      _project.projectSlug
    }].</p>
                  <p style="font-size: 1.4em;">To view project details, you have to click the button below!</p>
              `;
    params.body += `
              <p style="margin-top:30px; font-size: 1em;">
                  <a href="${link}" target="_BLANK" title="View project" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Project Details</a>
              </p>
          `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] payout to service partner`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for forgot password
   * @param {{email: string, first_name: string}} user
   * @param {string} token
   */
  ClientForgotPasswordMailer: async (user, token) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/resetpassword?email=${email}&token=${token}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that you just initiated a password change action.</p><br/>
                    <p style="font-size: 1.4em;">To reset your password, you have to click the button below!</p>
                    <p style="font-size: 1.4em;">If this was not initiated by you, do not proceed.</p>
                `;
    params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="Reset Password" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">Reset Password</a>
                    </p>
                `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Password reset`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        throw Promise.reject(err);
      });
  },

  /**
   * Mailer for forgot password for mobile
   * @param {{email: string, first_name: string}} user
   * @param {string} token
   */
  ClientForgotPasswordMobileMailer: async (user, token) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that you requested to change your password.</p><br/>
                    <h3 style="font-size: 1.4em;">${token}</h3>
                    <p style="font-size: 1.4em;">Use the token to reset your password!</p>
                    <p style="font-size: 1.4em;">If this was not initiated by you, do not proceed.</p>
                `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Password reset`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
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
  // BuyersNewOrderMailer: async (user, orders, ref_no) => {
  //   const { email, first_name, client } = user;
  //   // setup mail credentials
  //   let params = {};
  //   params.logo = Logo;
  //   params.header_color = "white";

  //   const link = `${client.url}signin?redir_url=/dashboard/order/${ref_no}`;

  //   params.body = `<p style="font-size:1.7em;"><b>Hi, ${first_name}</b></p>`;
  //   params.body += `
  //                 <p style="font-size: 1.4em;">We are glad to inform you that we have received your order <b>${ref_no}</b></p><br/>
  //             `;
  //   params.body += `<p style="font-size: 1.4em;">Items in your order (${orders.length})</p>`;
  //   orders.forEach((order) => {
  //     params.body += `
  //           <div class='flex'>
  //               <img src='${order.item.image1}' style='width: 5em;'/>&nbsp;
  //               <div>
  //                   <p style="font-size: 1.4em;">${order.item.name}</p>
  //                   <p style="font-size: 1.4em;">NGN ${order.item.price.toLocaleString()}</p>
  //                   <p style="font-size: 1.4em;">Qty: ${order.quantity}</p>
  //               </div>
  //           </div><br/>
  //       `;
  //   });
  //   params.body += `<br/><p style="font-size: 1.4em;">For more info, you have to click the button below!</p>`;
  //   params.body += `
  //                 <p style="margin-top:30px; font-size: 1em;">
  //                     <a href="${link}" target="_BLANK" title="click to view your order" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Order</a>
  //                 </p>
  //             `;
  //   params.footer = "";
  //   params.date = new Date().getFullYear();

  //   let params2 = {
  //     email,
  //     subject: `New Order [${ref_no}]`,
  //   };

  //   const template = mailer_template(params);

  //   // Send Mail
  //   Mailer(template, params2)
  //     .then((response) => {
  //       return Promise.resolve("Successful!");
  //     })
  //     .catch((err) => {
  //       return Promise.reject(err);
  //     });
  // },

  /**
   * Mailer for new orders for admin
   * @param {{}} client
   * @param {[]} admins
   * @param {[]} orders
   * @param {string} invoice
   * @param {{}} trx
   */
  AdminNewOrderMailer: async (client, admins, orders, invoice, trx) => {
    // Get product and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/orderadmindetail?productId=${orders[0].product.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that a client just placed an order <b>[${trx.ref}]</b></p><br/>
                  <p style="font-size: 1.4em;">Name: ${client.name}</p>
                  <p style="font-size: 1.4em;">Email: ${client.email}</p>
              `;
    params.body += `<p style="font-size: 1.4em;">Order Items (${orders.length})</p>`;

    orders.forEach((order) => {
      params.body += `
            <div class='flex'>
                <img src='${
                  order.product.image
                }' style='width: 10em; object-fit:contain;'/>&nbsp;
                <div>
                    <p style="font-size: 1.4em;">${order.product.name}</p>
                    <p style="font-size: 1.4em;">NGN ${order.product.price.toLocaleString()}</p>
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
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `New Order [${trx.ref}] from ${client.fname}`,
      files: invoice,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for updating orders for clients
   * @param {{}} user
   * @param {string} status
   * @param {{}} trx
   */
  ClientUpdateOrderMailer: async (user, status, trx) => {
    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    let link = '';
    if (status === 'completed') {
      link = `${process.env.SITE_URL}/login?redir_url=/dashboard/order-detail/${trx.id}?f=1`;
    } else {
      link = `${process.env.SITE_URL}/login?redir_url=/dashboard/order-detail/${trx.id}`;
    }

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${user.name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that your order has been ${
                    status === 'pending' ? 'updated to pending' : status
                  }</p><br/>
              `;
    params.body += `<p style="font-size: 1.4em;">Reference No: (${trx.ref})</p>`;
    if (status === 'completed') {
      params.body += `<br/><p style="font-size: 1.4em;">Please click the button below to tell us your experience on the delivery and the product in Order Review box leaving star rating. Thanks!</p>`;
      params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="click to review order" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">Review</a>
                    </p>
                `;
    } else {
      if (status === 'cancelled') {
        params.body += `<br/>
      <p style="font-size: 1.4em;"><b>PS:</b> Your money will be refunded in 7 working days' time.</p>`;
      }
      params.body += `<p style="font-size: 1.4em;">For more info, you have to click the button below!</p>
      `;
      params.body += `
                    <p style="margin-top:30px; font-size: 1em;">
                        <a href="${link}" target="_BLANK" title="click to view your order" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Order</a>
                    </p>
                `;
    }
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: user.email,
      subject: `Your Order [${trx.ref}] ${
        status === 'completed'
          ? status
          : status === 'cancelled'
          ? 'has been cancelled'
          : ''
      }`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for order refund request for clients
   * @param {{}} user
   * @param {{}} trx
   */
  ClientOrderRefundRequestMailer: async (user, trx) => {
    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/order-detail/${trx.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${user.name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">We are glad to inform you that your refund request on your order has been sent!</p><br/>
              `;
    params.body += `<p style="font-size: 1.4em;">Reference No: (${trx.ref})</p>`;
    params.body += `<br/><p style="font-size: 1.4em;">For more info, you have to click the button below!</p>`;
    params.body += `
                  <p style="margin-top:30px; font-size: 1em;">
                      <a href="${link}" target="_BLANK" title="click to view your order" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Order</a>
                  </p>
              `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: user.email,
      subject: `Refund request on Order [${trx.ref}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for refunding order for clients
   * @param {{}} user
   * @param {{}} trx
   */
  ClientOrderRefundMailer: async (user, trx) => {
    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/order-detail/${trx.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${user.name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that your order has been refunded!</p><br/>
              `;
    params.body += `<p style="font-size: 1.4em;">Reference No: (${trx.ref})</p>`;
    params.body += `<br/><p style="font-size: 1.4em;">For more info, you have to click the button below!</p>`;
    params.body += `
                  <p style="margin-top:30px; font-size: 1em;">
                      <a href="${link}" target="_BLANK" title="click to view your order" style="padding:20px;color:white;font-size:1.2em;background-color:#000;text-decoration:none;border-radius:5px;border:0">View Order</a>
                  </p>
              `;
    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: user.email,
      subject: `Order has been refunded [${trx.ref}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for updating orders for admins
   * @param {{}} client
   * @param {[]} admins
   * @param {string} status
   * @param {{}} trx
   */
  AdminUpdateOrderMailer: async (client, admins, status, trx) => {
    // Get product and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that the order [${
                    trx.ref
                  }] has been ${
      status === 'pending' ? 'updated to pending' : status
    }</p><br/>
                  <p style="font-size: 1.4em;">Name: ${client.name}</p>
                  <p style="font-size: 1.4em;">Email: ${client.email}</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Order update [${trx.ref}] - client ${client.fname}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for order refund request for admins
   * @param {{}} client
   * @param {[]} admins
   * @param {{}} trx
   */
  AdminOrderRefundRequestMailer: async (client, admins, trx) => {
    // Get product and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that a refund request for the order [${trx.ref}] has been sent!</p><br/>
                  <p style="font-size: 1.4em;">Name: ${client.name}</p>
                  <p style="font-size: 1.4em;">Email: ${client.email}</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Refund request on order [${trx.ref}] from ${client.fname}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer on refunding order for admins
   * @param {{}} client
   * @param {[]} admins
   * @param {{}} trx
   */
  AdminOrderRefundMailer: async (client, admins, trx) => {
    // Get product and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that your order [${trx.ref}] has been refunded!</p><br/>
                  <p style="font-size: 1.4em;">Name: ${client.name}</p>
                  <p style="font-size: 1.4em;">Email: ${client.email}</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Order [${trx.ref}] has been refunded - Client ${client.fname}`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for suspending a user by admin to user
   * @param {{first_name:string, email:string}} client
   * @param {string} reason
   */
  AdminSuspendUserMailerForUser: async (client, reason) => {
    const { first_name, email } = client;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    params.body = `<p style="font-size:1.7em;"><b>Hi, ${
      !first_name ? 'user' : first_name
    }</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that your account has been suspended.</p><br/>
                  <p style="font-size: 1.4em;"><b>Reason for suspension:</b></p>
                  <p style="font-size: 1.2em;">${reason}</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Account suspension`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for suspending a user by admin to admin
   * @param {{}} client
   * @param {[]} admins
   * @param {{}} reason
   */
  AdminSuspendUserMailerForAdmin: async (client, admins, reason) => {
    // Get super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    const { first_name, last_name, email } = client;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    params.body = `<p style="font-size:1.7em;"><b>Hi, Administrator</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you a user's account [${
                    !first_name ? 'user' : `${first_name} ${last_name}`
                  }] has been suspended.</p><br/>
                  <p style="font-size: 1.4em;">Email: ${email}</p>
                  <p style="font-size: 1.4em;">Reason: ${reason}</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Account suspension [${!first_name ? 'user' : first_name}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for new signup for clients
   * @param {{first_name:string, email:string}} client
   */
  clientWelcomeMessage: async (client) => {
    const { fname: first_name, name, email } = client;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/shop`;
    const link2 = `${process.env.SITE_URL}/services`;

    params.body = `<p style="font-size:1.7em;"><b>Welcome to ${
      process.env.APP_NAME
    }, ${!first_name ? name : first_name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">We are glad to have you onboard and can't wait for you to start enjoying the amazing features we offer.</p><br/>
                  <p style="font-size: 1.4em;">You can proceed to <a href="${link}">placing your orders</a>, <a href="${link2}">requesting for a service</a> etc.</p>
                  <p style="font-size: 1.4em;">Thanks for registering with us.</p><br/>
                  <p style="font-size: 1.4em;">Regards, <br/></p>
                  <p style="font-size: 1.4em;">${process.env.APP_NAME} team.</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Welcome`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for new signup for service partners
   * @param {{first_name:string, email:string}} partner
   */
  servicePartnerWelcomeMessage: async (partner) => {
    const { fname: first_name, name, email } = partner;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/kyc`;
    const link2 = `${process.env.SITE_URL}/dashboard/subscription`;
    const link3 = `${process.env.SITE_URL}/dashboard/projects`;

    params.body = `<p style="font-size:1.7em;"><b>Welcome to ${
      process.env.APP_NAME
    }, ${!first_name ? name : first_name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">We are glad to have you onboard and can't wait for you to start enjoying the amazing features we offer.</p><br/>
                  <p style="font-size: 1.4em;">You can proceed to <a href="${link}">completing your KYC</a>, <a href="${link2}">subscribing,</a> <a href="${link3}">bid for projects</a> etc.</p>
                  <p style="font-size: 1.4em;">Thanks for registering with us.</p><br/>
                  <p style="font-size: 1.4em;">Regards, <br/></p>
                  <p style="font-size: 1.4em;">${process.env.APP_NAME} team.</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Welcome`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer for new signup for product partners
   * @param {{first_name:string, email:string}} partner
   */
  productPartnerWelcomeMessage: async (partner) => {
    const { fname: first_name, name, email } = partner;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/kyc`;
    const link2 = `${process.env.SITE_URL}/dashboard/subscription`;
    const link3 = `${process.env.SITE_URL}/dashboard/products`;
    const link4 = `${process.env.SITE_URL}/dashboard/order-request`;

    params.body = `<p style="font-size:1.7em;"><b>Welcome to ${
      process.env.APP_NAME
    }, ${!first_name ? name : first_name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">We are glad to have you onboard and can't wait for you to start enjoying the amazing features we offer.</p><br/>
                  <p style="font-size: 1.4em;">You can proceed to <a href="${link}">completing your KYC</a>, <a href="${link2}">subscribing,</a> <a href="${link3}">listing products</a>, <a href="${link4}">tracking orders</a> etc.</p>
                  <p style="font-size: 1.4em;">Thanks for registering with us.</p><br/>
                  <p style="font-size: 1.4em;">Regards, <br/></p>
                  <p style="font-size: 1.4em;">${process.env.APP_NAME} team.</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Welcome`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Mailer to product partners on their product approval or disapproval
   * @param {*} partner
   * @param {*} product
   */
  PartnerProductApprovalMessage: async (
    partner,
    product,
    status,
    reason_details
  ) => {
    const { first_name, email } = partner;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/login`;

    params.body = `<p style="font-size:1.7em;"><b>Hello ${
      !first_name ? 'user' : first_name
    }</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that your product <b>${
                    product.name
                  }</b> ${
      status === 'in_review'
        ? 'is under review'
        : ` has been reviewed and ${status}`
    }${reason_details}.</p><br/>
                  <p style="font-size: 1.4em;">You can view this by logging to your <a href="${link}">dashboard</a>.</p>
                  <p style="font-size: 1.4em;">Regards, <br/></p>
                  <p style="font-size: 1.4em;">${process.env.APP_NAME} team.</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Your product ${
        status === 'in_review'
          ? 'is under review'
          : ` has been reviewed and ${status}`
      }`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject(err);
      });
  },

  /**
   * Mailer of complaint to iuser
   * @param {{first_name:string, email:string}} user
   * @param {{issue_type, issue_no, title, description, status}} issue
   */
  complaintMessageToUser: async (user, issue) => {
    const { first_name, email } = user;
    const { issue_type, issue_no, title, description, status } = issue;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/dashboard/complaints`;

    params.body = `<p style="font-size:1.7em;"><b>Welcome to ${
      process.env.APP_NAME
    }, ${!first_name ? 'user' : first_name}</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that you just made a complaint for the ticket issue ${issue_type} has been sent.</p><br/>
                  <p style="font-size: 1.4em;">Status: ${status}</p>
                  <p style="font-size: 1.4em;">Issue No: ${issue_no}</p><br/>
                  <p style="font-size: 1.4em;">Title: ${title}</p>
                  <p style="font-size: 1.4em;">Description:</p>
                  <p style="font-size: 1.2em;">${description}</p>
                  <p style="font-size: 1.4em;">For more info, click <a href="${link}">here</a>.</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Complaints on ${issue_type} [${issue_no}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Disapproval message for kyc document
   * @param {*} user
   * @param {*} issue
   */
  ProviderMailerForKycDocument: async (
    user,
    kyc_document,
    approved,
    reason
  ) => {
    const { first_name, email } = user;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}?redir_url=/dashboard/kyc`;

    params.body = `<p style="font-size:1.7em;"><b>Dear ${
      !first_name ? 'user' : first_name
    },</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that your ${kyc_document} kyc has been ${approved}.</p><br/>
                  `;
    if (approved === 'disapproved') {
      params.body += `<p style="font-size: 1.4em;">Reason: ${reason}</p>
                    `;
    }
    params.body += `
                  <p style="font-size: 1.4em;">For more info, click <a href="${link}">here</a>.</p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Disapproval for your ${kyc_document} kyc document`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Email to admin for kyc update request
   * @param {*} user
   * @param {*} issue
   */
  KycUpdateRequestMailer: async (admin_emails, user) => {
    const { name, fname, lname } = user;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/admin`;

    params.body = `<p style="font-size:1.7em;"><b>Dear administrator,</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that a user has requested an access to update their KYC information.</p><br/>
                  `;

    params.body += `<p style="font-size: 1.4em;">Name: ${
      name ? name : `${fname} ${lname}`
    }</p>
                    `;

    params.body += `
                  <p style="margin-top:30px; font-size: 1em;">
                  <a href="${link}" target="_BLANK" title="Visit dashboard" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">Visit Dashboard</a>
              </p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Kyc information update request`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Email to create an account profile
   * @param {*} user
   * @param {*} issue
   */
  AccountProfileCreationMailer: async (user) => {
    const { name, fname, userType, email } = user;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/login`;

    params.body = `<p style="font-size:1.7em;"><b>Dear ${fname ||
      name},</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">This is to inform you that you have created a ${userType} profile and it has been added to your account collection.</p><br/>
                  `;

    params.body += `
                  <p style="margin-top:30px; font-size: 1em;">
                  <a href="${link}" target="_BLANK" title="Visit dashboard" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">Visit Dashboard</a>
              </p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Account profile creation [${userType}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  /**
   * Email for sending a message to clients
   * @param {*} user
   * @param {*} message
   */
  postMessageEmail: async (user, userType, message) => {
    const { name, fname, email } = user;

    // setup mail credentials
    let params = {};
    params.logo = Logo;
    params.header_color = 'white';

    const link = `${process.env.SITE_URL}/login`;

    params.body = `<p style="font-size:1.7em;"><b>Hi ${fname || name},</b></p>`;
    params.body += `
                  <p style="font-size: 1.4em;">A message has been sent:</p><br/>
                  <p>To: ${userType}</p><br/>`;

    if (message.supportingDocument) {
      params.body += `
        <img src="${message.supportingDocument}" style="width: 50%;" />
      `;
    }
    params.body += `
    <p>${message.content}</p>
    `;

    params.body += `
                  <p style="margin-top:30px; font-size: 1em;">
                  <a href="${link}" target="_BLANK" title="Visit dashboard" style="padding: 15px;color:white;font-size:1em;background-color:#000;text-decoration:none;border-radius:5px;border:0">Visit Dashboard</a>
              </p>
              `;

    params.footer = '';
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Message Notification [${userType.replace('_', ' ')}]`,
    };

    const template = mailer_template(params);

    // Send Mail
    Mailer(template, params2)
      .then((response) => {
        return Promise.resolve('Successful!');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
