const { mailer_template, Mailer, Logo } = require("./Engine");

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
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project Request [${_project.projectSlug}]`,
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
   * Mailer for client project commencement
   * @param {{email: string, first_name: string}} user
   * @param {{fee: number, ref: string}} trx
   * @param {{}} _project
   */
  ClientProjectCommencementMailer: async (user, trx, _project) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project Commencement [${_project.projectSlug}]`,
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
   * Mailer for client on project update
   * @param {{email: string, first_name: string}} user
   * @param {string} status
   * @param {{}} _project
   */
  ClientMailerForProjectUpdate: async (user, status, _project) => {
    const { email, first_name } = user;

    let params = {};
    params.logo = Logo;
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project [${_project.projectSlug}] has been ${status}`,
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
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project [${_project.projectSlug}] progress update`,
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
      params.header_color = "white";

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
      params.footer = "";
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
    params.header_color = "white";

    const link = `${process.env.SITE_URL}/dashboard/projectfile?projectId=${_project.id}`;

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `You have bidden for the Project [${_project.projectSlug}]`,
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
    params.header_color = "white";

    const link = `${process.env.SITE_URL}/dashboard/projectfile?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Service partner ${first_name}</b></p>`;
    params.body += `
                    <p style="font-size: 1.4em;">This is to inform you that the project with the ID of ${_project.projectSlug} has been assigned to you</p>
                `;

    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project Assignment [${_project.projectSlug}]`,
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
   * Mailer for service partner on project updates
   * @param {{email: string, first_name: string}} service_partner
   * @param {number} percent
   * @param {{}} _project
   */
  ServicePartnerMailerForProjectUpdate: async (service_partner, percent, _project) => {
    const { email, first_name } = service_partner;

    let params = {};
    params.logo = Logo;
    params.header_color = "white";

    const link = `${process.env.SITE_URL}/dashboard/projectfile?projectId=${_project.id}`;

    params.body = `<p style="font-size:1.7em;"><b>Hi, Service partner ${first_name}</b></p><br/>`;
    params.body += `
                    <p style="font-size: 1.2em;">You updated the project with the ID of ${_project.projectSlug} to ${percent}%</p>
                `;

    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email,
      subject: `Project Update [${_project.projectSlug}]`,
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
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project Request [${_project.projectSlug}] from userID #${id}`,
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
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project Commencement [${_project.projectSlug}] from userID #${id}`,
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
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] has been ${status}`,
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
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] has been ${status}`,
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
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] bid from ${service_partner.first_name} #${service_partner.id}`,
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
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project Assignment [${_project.projectSlug}] to ${service_partner.first_name} #${service_partner.id}`,
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
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project Update [${_project.projectSlug}] from ${service_partner.first_name} #${service_partner.id}`,
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
   * Admins mailer for updating project progress
   * @param {{name: string, userType: string, id: string}} user
   * @param {[]} admins
   * @param {string} status
   * @param {number} percent
   * @param {{}} _project
   */
  AdminProjectProgressMailer: async (user, admins, status, percent, _project) => {
    const { name, userType, id } = user;

    // Get project and super admin email addresses
    let admin_emails = [];
    admins.forEach((admin) => {
      admin_emails.push(admin.email);
    });

    let params = {};
    params.logo = Logo;
    params.header_color = "white";

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
    params.footer = "";
    params.date = new Date().getFullYear();

    let params2 = {
      email: admin_emails,
      subject: `Project [${_project.projectSlug}] progress update`,
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
      subject: `New Order [${ref_no}]`,
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
