/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const sequelize = require('../config/database/connection');
const SupplyCategory = require('../models/KycCategoryOfSuppies');
const KycDocuments = require('../models/KycDocuments');
const KycFinancialData = require('../models/KycFinancialData');
const KycGeneralInfo = require('../models/KycGeneralInfo');
const KycOrganisationInfo = require('../models/KycOrganisationInfo');
const KycTaxPermits = require('../models/KycTaxPermits');
const KycWorkExperience = require('../models/KycWorkExperience');
const {
  getUserTypeProfile,
  updateUserTypeProfile,
} = require('../service/UserService');
const Notification = require('../helpers/notification');
const helpers = require('../helpers/message');
const EmailService = require('../service/emailService');
const UserService = require('../service/UserService');
const {
  USERTYPE,
  kyc_criteria_for_rating_service_partners,
  avg_rating,
} = require('../helpers/utility');
const ServicePartner = require('../models/ServicePartner');
const User = require('../models/User');
const { ProviderMailerForKycDocument } = require('../helpers/mailer/samples');

/**
 *
 * @param {userType: string, userId: string} user - contains user details like userType, id
 * @param {string} role
 * @param {{}} data
 */
const rateServicePartner = async (user, role, data) => {
  sequelize.transaction(async (t) => {
    try {
      const { userId } = user;
      const {
        years_of_experience,
        certification_of_personnel,
        no_of_staff,
        cost_of_projects_completed,
        complexity_of_projects_completed,
      } = data;

      // Get criteria metadata based on role
      const __criteria = kyc_criteria_for_rating_service_partners.find(
        (criteria) => criteria.service_type === role
      );

      if (!__criteria) {
        throw new Error();
      }

      let years_of_experience_rating;
      let certification_of_personnel_rating;
      let no_of_staff_rating;
      let cost_of_projects_completed_rating;
      let complexity_of_projects_completed_rating;

      if (years_of_experience) {
        // Get rating based on the entered 'year of experience'
        const details = __criteria.meta_data.years_of_experience.find(
          (detail) => detail.experience === years_of_experience
        );
        if (details) {
          years_of_experience_rating = details.rating;
        }
      }
      if (certification_of_personnel) {
        // Get rating based on the entered 'certification of personnel'
        const details = __criteria.meta_data.certification_of_personnel.find(
          (detail) => detail.experience === certification_of_personnel
        );
        if (details) {
          certification_of_personnel_rating = details.rating;
        }
      }
      if (no_of_staff) {
        // Get rating based on the entered 'number of staff'
        const details = __criteria.meta_data.no_of_staff_members.find(
          (detail) => detail.experience === no_of_staff
        );
        if (details) {
          no_of_staff_rating = details.rating;
        }
      }
      if (cost_of_projects_completed) {
        // Get rating based on the entered 'cost of project completed'
        const details = __criteria.meta_data.cost_of_projects_completed.find(
          (detail) => detail.experience === cost_of_projects_completed
        );
        if (details) {
          cost_of_projects_completed_rating = details.rating;
        }
      }
      if (complexity_of_projects_completed) {
        // Get rating based on the entered 'cost of project completed'
        const details = __criteria.meta_data.complexity_of_projects_completed.find(
          (detail) => detail.experience === complexity_of_projects_completed
        );
        if (details) {
          complexity_of_projects_completed_rating = details.rating;
        }
      }

      // Update available ratings in users model
      const updateData = {
        years_of_experience_rating,
        certification_of_personnel_rating,
        no_of_staff_rating,
        cost_of_projects_completed_rating,
        complexity_of_projects_completed_rating,
      };

      await User.update(updateData, { where: { id: userId } });

      // Get user details
      const user_details = await UserService.findUserById(userId);

      const rating_details = {
        years_of_experience_rating: user_details.years_of_experience_rating,
        certification_of_personnel_rating:
          user_details.certification_of_personnel_rating,
        no_of_staff_rating: user_details.no_of_staff_rating,
        complexity_of_projects_completed_rating:
          user_details.complexity_of_projects_completed_rating,
        cost_of_projects_completed_rating:
          user_details.cost_of_projects_completed_rating,
        quality_delivery_performance_rating:
          user_details.quality_delivery_performance_rating,
        timely_delivery_peformance_rating:
          user_details.timely_delivery_peformance_rating,
      };

      // Update service partner
      await updateServicePartnerRating(rating_details, userId);
    } catch (error) {
      console.log(error);
      t.rollback();
    }
  });
};

const updateServicePartnerRating = async (rating_details, userId) => {
  try {
    const rating = avg_rating(rating_details);

    await ServicePartner.update({ rating }, { where: { userId } });
  } catch (error) {
    console.log(error);
  }
};

// supply Categories controllers
exports.createSupplyCategories = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      if (profile.isVerified) {
        return res.status(403).send({
          success: false,
          message: 'User is verified and cannot update categories'
        });
      }  
      const data = {
        ...req.body,
        userId: profile.id
      };
      const getCategories = await SupplyCategory.findOne({
        where: { userId: profile.id }
      });
      if (getCategories) {
        const myCategories = await SupplyCategory.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
        return res.status(200).send({
          success: true,
          data: myCategories
        });
      }
      const myCategories = await SupplyCategory.create(data, {
        transaction: t
      });
      myCategories.categories = myCategories.categories.split(',');
      return res.status(200).send({
        success: true,
        data: myCategories
      });
    } catch (error) {
      return next(error);
    }
  });
};
exports.ReadSupplyCategories = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.query;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      let result = await SupplyCategory.findOne({
        where: { userId: profile.id },
      });
      console.log(result);
      if (result !== null) {
        result.categories =
          result.categories !== null ? result.categories.split(',') : {};
      } else {
        result = {};
      }
      return res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Financial Data controllers
exports.createKycFinancialData = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      if (profile.isVerified) {
        return res.status(403).send({
          success: false,
          message: 'User is verified and cannot update categories'
        });
      } 
      const data = {
        ...req.body,
        userId: profile.id
      };
      let myFinancial = await KycFinancialData.findOne({
        where: { userId: profile.id }
      });
      if (myFinancial) {
        await KycFinancialData.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
      } else {
        myFinancial = await KycFinancialData.create(data, {
          transaction: t
        });
      }

      return res.status(200).send({
        success: true,
        data: myFinancial
      });
    } catch (error) {
      return next(error);
    }
  });
};
exports.ReadKycFinancialData = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.query;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const result = await KycFinancialData.findOne({
        where: { userId: profile.id },
      });

      return res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  });
};

// General Info controllers
exports.createKycGeneralInfo = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const {
        organisation_name,
        userType,
        role,
        years_of_experience,
        certification_of_personnel
      } = req.body;

      const userId = req.user.id;

      if (userType === USERTYPE.SERVICE_PARTNER) {
        // Determine rating for service partner based
        await rateServicePartner({ userId }, role, {
          years_of_experience,
          certification_of_personnel
        });
      }

      const profile = await getUserTypeProfile(userType, userId);

      if (profile.isVerified) {
        return res.status(403).send({
          success: false,
          message: 'User is verified and cannot update categories'
        });
      }

      const data = {
        ...req.body,
        userId: profile.id
      };

      // Check name
      const orgName = await KycGeneralInfo.findOne({
        where: { organisation_name },
        transaction: t
      });
      if (orgName) {
        return res.status(400).send({
          success: false,
          message: 'Organization name exists.'
        });
      }

      const getMyInfo = await KycGeneralInfo.findOne({
        where: { userId: profile.id }
      });
      if (getMyInfo) {
        const updatedInfo = await KycGeneralInfo.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
        return res.status(200).send({
          success: true,
          data: updatedInfo
        });
      }
      const myInfo = await KycGeneralInfo.create(data, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: myInfo
      });
    } catch (error) {
      t.rollback();
      console.error('Transaction error:', error); // Enhanced error logging
      return next(error);
    }
  });
};
exports.ReadKycGeneralInfo = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.query;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const result = await KycGeneralInfo.findOne({
        where: { userId: profile.id },
      });

      return res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Organisation Info controllers
exports.createKycOrganisationInfo = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const {
        userType,
        role,
        no_of_staff,
        cost_of_projects_completed,
        complexity_of_projects_completed,
        Incorporation_date
      } = req.body;
      const userId = req.user.id;

      // Verify incorporation date
      if (new Date(Incorporation_date).getTime() >= new Date().getTime()) {
        return res.status(400).send({
          success: false,
          message: 'Incorporation date is invalid.'
        });
      }

      if (userType === USERTYPE.SERVICE_PARTNER) {
        // Determine rating for service partner based
        rateServicePartner({ userId }, role, {
          no_of_staff,
          cost_of_projects_completed,
          complexity_of_projects_completed
        });
      }

      const profile = await getUserTypeProfile(userType, userId);

      if (profile.isVerified) {
        return res.status(403).send({
          success: false,
          message: 'User is verified and cannot update categories'
        });
      }  
      const data = {
        ...req.body,
        userId: profile.id,
      };
      const getOrgInfo = await KycOrganisationInfo.findOne({
        where: { userId: profile.id }
      });

      if (getOrgInfo) {
        const updatedOrgInfo = await KycOrganisationInfo.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
        return res.status(200).send({
          success: true,
          data: updatedOrgInfo
        });
      }
      const OrganisationInfo = await KycOrganisationInfo.create(data, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: OrganisationInfo
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};
exports.ReadKycOrganisationInfo = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.query;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const result = await KycOrganisationInfo.findOne({
        where: { userId: profile.id },
      });

      return res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Tax Permits controllers
exports.createKycTaxPermits = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      if (profile.isVerified) {
        return res.status(403).send({
          success: false,
          message: 'User is verified and cannot update categories'
        });
      }  
      const data = {
        ...req.body,
        userId: profile.id
      };
      const getPermits = await KycTaxPermits.findOne({
        where: { userId: profile.id }
      });
      if (getPermits) {
        const updatedPermits = await KycTaxPermits.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
        return res.status(200).send({
          success: true,
          data: updatedPermits
        });
      }
      const taxPermits = await KycTaxPermits.create(data, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: taxPermits
      });
    } catch (error) {
      return next(error);
    }
  });
};
exports.ReadKycTaxPermits = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.query;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const result = await KycTaxPermits.findOne({
        where: { userId: profile.id },
      });

      return res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Work Experience controllers
exports.createKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      if (profile.isVerified) {
        return res.status(403).send({
          success: false,
          message: 'User is verified and cannot update categories'
        });
      }  
      const url = `${process.env.APP_URL}/${req.file.path}`;

      const data = {
        ...req.body,
        userId: profile.id,
        fileUrl: url
      };
      const experiences = await KycWorkExperience.create(data, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: experiences
      });
    } catch (error) {
      return next(error);
    }
  });
};
exports.ReadKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.query;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const result = await KycWorkExperience.findAll({
        where: { userId: profile.id }
      });

      return res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  });
};
exports.UpdateKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const { jobId } = req.params;
      const url = `${process.env.APP_URL}/${req.file.path}`;

      const data = {
        ...req.body,
        userId: profile.id,
        fileUrl: url,
      };
      const updatedExperience = await KycWorkExperience.update(data, {
        where: { id: jobId },
        transaction: t,
      });

      return res.status(200).send({
        success: true,
        data: updatedExperience,
      });
    } catch (error) {
      return next(error);
    }
  });
};
exports.deleteKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req.params;
      await KycWorkExperience.destroy({
        where: { id },
        transaction: t,
      });

      return res.status(200).send({
        success: true,
        data: 'Work deleted successfully',
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Kyc Documents controllers
exports.createKycDocuments = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      if (profile.isVerified) {
        return res.status(403).send({
          success: false,
          message: 'User is verified and cannot update categories'
        });
      } 
      const loadFiles = req.files.map((file, i) => ({
        name: file.fieldname,
        file: `${process.env.APP_URL}/${file.path}`,
        userType,
        userId: profile.id
      }));

      const documents = await KycDocuments.bulkCreate(loadFiles, {
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data: documents
      });
    } catch (error) {
      return next(error);
    }
  });
};
exports.ReadKycDocuments = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.query;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const result = await KycDocuments.findAll({
        where: { userId: profile.id },
      });

      const new_result = formatKycDoc(result);

      return res.status(200).send({
        success: true,
        data: result,
        formatted: new_result,
      });
    } catch (error) {
      return next(error);
    }
  });
};
const formatKycDoc = (result) => {
  const new_result = [];
  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    const details_cred = {
      id: element.id,
      file: element.file,
      approved: element.approved,
      reason: element.reason,
      createdAt: element.createdAt,
      updatedAt: element.updatedAt,
      deletedAt: element.deletedAt,
    };

    if (new_result.length === 0) {
      new_result.push({
        name: element.name,
        userType: element.userType,
        userId: element.userId,
        details: [details_cred],
      });
    } else {
      const resultFoundIndex = new_result.findIndex(
        (_r) => _r.name === element.name
      );

      if (resultFoundIndex !== -1) {
        new_result[resultFoundIndex].details.push(details_cred);
      } else {
        new_result.push({
          name: element.name,
          userType: element.userType,
          userId: element.userId,
          details: [details_cred],
        });
      }
    }
  }
  return new_result;
};
exports.deleteKycDocuments = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req.params;
      await KycDocuments.destroy({
        where: { id },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        data: 'Document deleted successfully',
      });
    } catch (error) {
      return next(error);
    }
  });
};


exports.approveDisapproveKycDocument = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id, userId } = req.params;
      const { approved, reason } = req.body;

      const kycDoc = await KycDocuments.findOne({ where: { id } });
      if (!kycDoc) {
        return res
          .status(404)
          .send({ success: false, message: 'Kyc document not found.' });
      }

      if (kycDoc.approved || kycDoc.approved === false) {
        return res.status(404).send({
          success: false,
          message:
            'KYC document has already been vetted. You cannot approve or disapprove it again.',
        });
      }

      const userDetails = await User.findOne({ where: { id: userId } });
      if (!userDetails) {
        return res
          .status(404)
          .send({ success: false, message: 'Account not found.' });
      }

      let { kycScore } = userDetails;
      kycScore = JSON.parse(kycScore);

      if (!approved) {
        kycScore.uploadDocument = kycScore.uploadDocument - 1;
        kycScore = JSON.stringify(kycScore);

        // Update User Model
        await User.update({ kycScore }, { where: { id: userId } });
      }

      await KycDocuments.update({ approved, reason }, { where: { id } });

      let approval_status = approved ? 'approved' : 'disapproved';

      // Mailer for providers
      const kyc_document = kycDoc.name.split('_').join(' ');
      if (!approved) {
        await ProviderMailerForKycDocument(
          userDetails,
          kyc_document,
          approval_status,
          reason
        );
      }

      // send notification to provider
      const profile = await getUserTypeProfile(userDetails.userType, userId);
      const message = `Your ${kyc_document} KYC document has been ${approval_status}.${
        approved ? '' : ` Reason: ${reason}.`
      }`;

      const { io } = req.app;
      await Notification.createNotification({
        type: 'user',
        message: message,
        userId: profile.id,
      });
      io.emit(
        'getNotifications',
        await Notification.fetchUserNotificationApi({ userId: profile.id })
      );

      return res.send({
        success: true,
        message: `KYC document has been ${approval_status} successfully.`,
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Admin verifies user and give score based on kyc
exports.approveKycVerification = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const {
        userType,
        userId,
        verificationStatus,
        kycPoint,
        approved,
        reason
      } = req.body;
      const profile = await getUserTypeProfile(userType, userId);

      // Must be > 0 and <= 100
      if (isNaN(kycPoint) || kycPoint <= 0 || kycPoint > 100) {
        return res.status(400).send({
          success: false,
          message: `Kyc point must be in the range of 0 and 100`
        });
      }

      if (profile == null) {
        return res.status(404).send({
          success: false,
          message: `User is not a professional`
        });
      }

      const id = userId;
      const user = await UserService.findUser({ id });

      if (!user) {
        return res.status(404).send({
          success: false,
          message: `User account not found.`
        });
      }

      if (approved === false && !reason) {
        return res.status(404).send({
          success: false,
          message: `Reason for disapproval is required.`
        });
      }

      if (verificationStatus) {
        const data = {
          isVerified: verificationStatus,
          kycPoint: verificationStatus === true ? kycPoint : 0
        };

        await updateUserTypeProfile({
          userType,
          id: profile.id,
          data,
          transaction: t
        });
      }

      //send email to user
      const encodeEmail = encodeURIComponent(user.email);
      let message =
        approved === undefined || approved
          ? helpers.kycApprovalMessage(user.fname, encodeEmail)
          : helpers.kycDisapprovalMessage(user.fname, encodeEmail, reason);
      await EmailService.sendMail(
        user.email,
        message,
        approved === undefined || approved
          ? 'Kyc has been approved'
          : 'Kyc has been disapproved'
      );

      const messages = `Your KYC has been disapproved. Reason: ${reason}`;

      const { io } = req.app;
      await Notification.createNotification({
        type: 'user',
        message: messages,
        userId: profile.id,
      });
      io.emit(
        'getNotifications',
        await Notification.fetchUserNotificationApi({ userId: profile.id })
      );

      const kyc_msg =
        approved === undefined || approved
          ? 'Kyc has been approved'
          : 'Kyc has been disapproved';

      return res.status(200).send({
        success: true,
        message: kyc_msg,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.getUserKycDetails = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.query;
      const { userId } = req.params;
      if (!userType) {
        return res.status(400).send({
          success: false,
          message: 'userType is required',
        });
      }
      const profile = await getUserTypeProfile(userType, userId);
      const suppyCategory = await SupplyCategory.findOne({
        where: { userId: profile.id }
      });
      const kycFinancialData = await KycFinancialData.findOne({
        where: { userId: profile.id }
      });

      const kycGeneralInfo = await KycGeneralInfo.findOne({
        where: { userId: profile.id }
      });

      const kycOrganisationInfo = await KycOrganisationInfo.findOne({
        where: { userId: profile.id }
      });

      const kycTaxPermits = await KycTaxPermits.findOne({
        where: { userId: profile.id }
      });

      const kycWorkExperience = await KycWorkExperience.findAll({
        where: { userId: profile.id }
      });

      const kycDocuments = await KycDocuments.findAll({
        where: { userId: profile.id }
      });
      let isKycCompleted = true;
      if (userType === 'vendor') {
        if (
          !kycFinancialData &&
          kycDocuments.length === 0 &&
          kycWorkExperience.length === 0 &&
          !kycGeneralInfo &&
          !kycTaxPermits &&
          !kycOrganisationInfo &&
          !suppyCategory
        ) {
          isKycCompleted = false;
        }
      } else if (
        !kycFinancialData &&
        kycDocuments.length === 0 &&
        kycWorkExperience.length === 0 &&
        !kycGeneralInfo &&
        !kycTaxPermits &&
        !kycOrganisationInfo
      ) {
        isKycCompleted = false;
      }

      const data = {
        isKycCompleted,
        suppyCategory,
        kycFinancialData,
        kycGeneralInfo,
        kycOrganisationInfo,
        kycTaxPermits,
        kycWorkExperience,
        kycDocuments
      };
      return res.status(200).send({
        success: true,
        data
      });
    } catch (error) {
      return next(error);
    }
  });
};
