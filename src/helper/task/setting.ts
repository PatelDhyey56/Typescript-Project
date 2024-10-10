import { Response } from "express";
import { Request } from "interface";
import constants from "lib/constants";
import postgresInstance from "lib/db/postgres";
import redisHelper from "lib/db/redis";
import settingsMapper from "lib/mappers/settings";
import responseDispatcher from "lib/response-dispatcher";

class SettingsControllerV1 {
  editMaintenanceConfig = async (reqBody: any) => {
    const isUnderMaintenance = !!reqBody.isUnderMaintenance;
    const maintenanceMessage = reqBody.maintenanceMessage;
    const maintenanceUsers: string[] = !!reqBody.maintenanceUsers
      ? reqBody.maintenanceUsers.split(",")
      : [];

    let usersList = [];
    if (!!maintenanceUsers.length) {
      usersList = await postgresInstance.readQuery(
        `select id, contact_no from user_info where contact_no IN (${maintenanceUsers.map(
          (user) => `'${user.trim()}'`
        )})`
      );
    }
    const maintenanceUsersList = usersList.map((user: any) => {
      return { [user.id]: user.contact_no };
    });

    const data = {
      isUnderMaintenance: isUnderMaintenance,
      maintenanceMessage: maintenanceMessage,
      maintenanceUsers: maintenanceUsersList,
    };
    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 
            where setting_type='app_maintenance'
        `,
      [JSON.stringify(data)]
    );
    await redisHelper.updateAppSettings({ isUnderMaintenance });
  };

  editGeneralConfig = async (reqBody: any) => {
    const generalConfig = await postgresInstance.readQuery(`
            select * from app_settings where setting_type='amount_settings' OR setting_type='general_app_config' order by id asc
        `);
    console.log(reqBody);
    if (!generalConfig.length) {
      throw new Error("101");
    }

    if (reqBody.signUpAmount != undefined) {
      generalConfig[0].setting_data.signUpAmount = reqBody.signUpAmount;
    }
    if (reqBody.referralAmount != undefined) {
      generalConfig[0].setting_data.referralAmount = reqBody.referralAmount;
    }
    if (reqBody.referralUpToAmount != undefined) {
      generalConfig[0].setting_data.referralUpToAmount =
        reqBody.referralUpToAmount;
    }
    if (reqBody.minPayoutAmount != undefined) {
      generalConfig[0].setting_data.minPayoutAmount = reqBody.minPayoutAmount;
    }
    if (reqBody.maxPayoutAmount != undefined) {
      generalConfig[0].setting_data.maxPayoutAmount = reqBody.maxPayoutAmount;
    }
    if (reqBody.minDepositAmount != undefined) {
      generalConfig[0].setting_data.minDepositAmount = reqBody.minDepositAmount;
    }
    if (reqBody.maxDepositAmount != undefined) {
      generalConfig[0].setting_data.maxDepositAmount = reqBody.maxDepositAmount;
    }

    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1
            where id=$2
        `,
      [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
    );

    if (reqBody.maximumPayoutPerDay != undefined) {
      generalConfig[1].setting_data.maxPayoutPerDay =
        reqBody.maximumPayoutPerDay;
    }
    if (reqBody.maximumWithdrawTransferPerDay != undefined) {
      generalConfig[1].setting_data.maximumWithdrawTransferPerDay =
        reqBody.maximumWithdrawTransferPerDay;
    }
    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1
            where id=$2
        `,
      [JSON.stringify(generalConfig[1].setting_data), generalConfig[1].id]
    );
  };

  editAppConfig = async (reqBody: any) => {
    const generalConfig = await postgresInstance.readQuery(`
                select * from app_settings where setting_type='app_version'
            `);

    if (reqBody.android_reviewAppVersion != undefined) {
      generalConfig[0].setting_data.android.reviewAppVersion =
        reqBody.android_reviewAppVersion;
    }

    if (reqBody.android_appUpdateUrl != undefined) {
      generalConfig[0].setting_data.android.appUpdateUrl =
        reqBody.android_appUpdateUrl;
    }

    if (reqBody.ios_reviewAppVersion != undefined) {
      generalConfig[0].setting_data.ios.reviewAppVersion =
        reqBody.ios_reviewAppVersion;
    }

    if (reqBody.ios_appUpdateUrl != undefined) {
      generalConfig[0].setting_data.ios.appUpdateUrl = reqBody.ios_appUpdateUrl;
    }

    if (reqBody.appVersionCode != undefined) {
      generalConfig[0].setting_data.appVersion = reqBody.appVersionCode;
    }
    if (reqBody.appUpdateUrl != undefined) {
      generalConfig[0].setting_data.appUpdateUrl = reqBody.appUpdateUrl;
    }

    if (reqBody.appSocketUrl != undefined) {
      generalConfig[0].setting_data.app_socket_url = reqBody.appSocketUrl;
    }

    if (reqBody.manuallyDownloadUrl != undefined) {
      generalConfig[0].setting_data.manually_download_url =
        reqBody.manuallyDownloadUrl;
    }

    await postgresInstance.writeQuery(
      `update app_settings set setting_data=$1 where id=$2`,
      [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
    );
  };

  editURLsConfig = async (reqBody: any) => {
    const generalConfig = await postgresInstance.readQuery(`
            select * from app_settings where setting_type='urls'
        `);

    if (reqBody.privacyPolicy) {
      generalConfig[0].setting_data.privacyPolicy = reqBody.privacyPolicy;
    }
    if (reqBody.termsAndConditions) {
      generalConfig[0].setting_data.termsAndConditions =
        reqBody.termsAndConditions;
    }
    if (reqBody.supportUrl) {
      generalConfig[0].setting_data.supportUrl = reqBody.supportUrl;
    }
    if (reqBody.about) {
      generalConfig[0].setting_data.about = reqBody.about;
    }

    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
    );
  };

  editSMSConfig = async (reqBody: any) => {
    const generalConfig = await postgresInstance.readQuery(`
            select * from app_settings where setting_type='sms_gateway_config'
        `);

    if (reqBody.senderId != undefined) {
      generalConfig[0].setting_data.senderId = reqBody.senderId;
    }
    if (reqBody.user != undefined) {
      generalConfig[0].setting_data.user = reqBody.user;
    }
    if (reqBody.key != undefined) {
      generalConfig[0].setting_data.key = reqBody.key;
    }
    if (reqBody.messageTemplate != undefined) {
      generalConfig[0].setting_data.messageTemplate = reqBody.messageTemplate;
    }

    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
    );
  };

  editPaymentConfig = async (reqBody: any) => {
    const generalConfig = await postgresInstance.readQuery(
      `select * from app_settings where setting_type='payment_gateway_config'`
    );

    if (
      reqBody.settingType ==
      constants.SETTINGS_PARAMS_SETS.CASHFREEPAYMENT_GATEWAY
    ) {
      if (reqBody.data.xClientId != undefined) {
        generalConfig[0].setting_data.cashfree.x_client_id =
          reqBody.data.xClientId;
      }
      if (reqBody.data.xClientSecret != undefined) {
        generalConfig[0].setting_data.cashfree.x_client_secret =
          reqBody.data.xClientSecret;
      }
    } else if (
      reqBody.settingType ==
      constants.SETTINGS_PARAMS_SETS.RAZORPAYPAYMENT_GATEWAY
    ) {
      if (reqBody.data.xClientId != undefined) {
        generalConfig[0].setting_data.razorpay.x_client_id =
          reqBody.data.xClientId;
      }
      if (reqBody.data.xClientSecret != undefined) {
        generalConfig[0].setting_data.razorpay.x_client_secret =
          reqBody.data.xClientSecret;
      }
    } else if (
      reqBody.settingType ==
      constants.SETTINGS_PARAMS_SETS.PHONEPEPAYMENT_GATEWAY
    ) {
      if (reqBody.data.saltKey != undefined) {
        generalConfig[0].setting_data.phonepe.salt_key = reqBody.data.saltKey;
      }
      if (reqBody.data.saltIndex != undefined) {
        generalConfig[0].setting_data.phonepe.salt_index =
          reqBody.data.saltIndex;
      }
      if (reqBody.data.merchantId != undefined) {
        generalConfig[0].setting_data.phonepe.merchant_id =
          reqBody.data.merchantId;
      }
    }

    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
    );
  };

  editPayoutConfig = async (reqBody: any) => {
    const generalConfig = await postgresInstance.readQuery(`
            select * from app_settings where setting_type='payout_gateway_config'
        `);
    console.log("editPayoutConfig ==>>> ", reqBody);
    if (
      reqBody.settingType ==
      constants.SETTINGS_PARAMS_SETS.CASHFREEPAYOUT_GATEWAY
    ) {
      if (reqBody.data.xClientId != undefined) {
        generalConfig[0].setting_data.cashfree.x_client_id =
          reqBody.data.xClientId;
      }
      if (reqBody.data.xClientSecret != undefined) {
        generalConfig[0].setting_data.cashfree.x_client_secret =
          reqBody.data.xClientSecret;
      }
    } else if (
      reqBody.settingType ==
      constants.SETTINGS_PARAMS_SETS.RAZORPAYPAYOUT_GATEWAY
    ) {
      if (reqBody.data.xClientId != undefined) {
        generalConfig[0].setting_data.razorpay.x_client_id =
          reqBody.data.xClientId;
      }
      if (reqBody.data.xClientSecret != undefined) {
        generalConfig[0].setting_data.razorpay.x_client_secret =
          reqBody.data.xClientSecret;
      }
    }

    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
    );
  };

  editDepositSettings = async (reqBody: any) => {
    let generalConfig = await postgresInstance.readQuery(`
            select * from app_settings where setting_type='payment_gateway_config'
        `);

    if (
      reqBody.selectedPaymentGateway &&
      Object.values(constants.PAYMENT_GATEWAYS).includes(
        parseInt(reqBody.selectedPaymentGateway)
      )
    ) {
      generalConfig[0].setting_data.selectedPaymentGateway = parseInt(
        reqBody.selectedPaymentGateway
      );
    }
    if (reqBody.depositNoticeMessage != undefined) {
      generalConfig[0].setting_data.depositNoticeMessage =
        reqBody.depositNoticeMessage;
    }
    await postgresInstance.writeQuery(
      `update app_settings set setting_data=$1 where id=$2`,
      [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
    );

    if (reqBody.depositEnable != undefined) {
      generalConfig = await postgresInstance.readQuery(`
            select * from app_settings where setting_type='general_app_config'
        `);
      generalConfig[0].setting_data.isDepositEnabled = reqBody.depositEnable;
      await postgresInstance.writeQuery(
        `update app_settings set setting_data=$1 where id=$2`,
        [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
      );
    }
  };

  editPayoutSettings = async (reqBody: any) => {
    if (
      Object.values(constants.PAYOUT_GATEWAYS).includes(
        parseInt(reqBody.selectedPayoutGateway)
      )
    )
      await postgresInstance.writeQuery(
        `update payout_methods set payment_gateway=$1`,
        [reqBody.selectedPayoutGateway]
      );
    let generalConfig;
    if (reqBody.payoutNoticeMessage != undefined) {
      generalConfig = await postgresInstance.readQuery(`
                select * from app_settings where setting_type='payout_gateway_config'
            `);
      generalConfig[0].setting_data.payoutNoticeMessage =
        reqBody.payoutNoticeMessage;

      await postgresInstance.writeQuery(
        `
                update app_settings set setting_data=$1 where id=$2
            `,
        [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
      );
    }

    if (reqBody.payoutsEnable != undefined) {
      generalConfig = await postgresInstance.readQuery(`
            select * from app_settings where setting_type='general_app_config'
        `);
      generalConfig[0].setting_data.isPayoutEnabled = reqBody.payoutsEnable;
      await postgresInstance.writeQuery(
        `update app_settings set setting_data=$1 where id=$2`,
        [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
      );
    }
  };

  editNoticeMessage = async (reqBody: any) => {
    const generalConfig = await postgresInstance.readQuery(
      `select * from app_settings where setting_type=$1`,
      ["general_app_config"]
    );

    if (reqBody.noticeMessage != undefined) {
      generalConfig[0].setting_data.noticeMessage = reqBody.noticeMessage;
    }

    // if (reqBody.payoutsEnable !== undefined) {
    //   generalConfig[0].setting_data.isPayoutEnabled = reqBody.payoutsEnable;
    // }

    // if (reqBody.depositEnable !== undefined) {
    //   generalConfig[0].setting_data.isDepositEnabled = reqBody.depositEnable;
    // }

    // if (reqBody.maximumPayoutPerDay >= 0) {
    //   generalConfig[0].setting_data.maxPayoutPerDay =
    //     reqBody.maximumPayoutPerDay;
    // }

    // if (reqBody.maximumWithdrawTransferPerDay >= 0) {
    //   generalConfig[0].setting_data.maximumWithdrawTransferPerDay =
    //     reqBody.maximumWithdrawTransferPerDay;
    // }

    if (reqBody.mindSupportTime) {
      generalConfig[0].setting_data.mindSupportTime = reqBody.mindSupportTime;
    }
    if (reqBody.telegramNotifyTime) {
      generalConfig[0].setting_data.telegramNotifyTime =
        reqBody.telegramNotifyTime;
    }

    await postgresInstance.writeQuery(
      `
      update app_settings set setting_data=$1 where id=$2
      `,
      [JSON.stringify(generalConfig[0].setting_data), generalConfig[0].id]
    );

    await redisHelper.updateAppSettings({
      isPayoutEnabled: generalConfig[0].setting_data.isPayoutEnabled,
      isDepositEnabled: generalConfig[0].setting_data.isDepositEnabled,
    });
  };

  editMessageTemplate = async (reqBody: any) => {
    const messageTemplateConfig = await postgresInstance.readQuery(
      `select * from app_settings where setting_type=$1`,
      ["message_templates"]
    );

    if (reqBody.presentOnLeaderboardWinningListMessage != undefined) {
      messageTemplateConfig[0].setting_data.presentOnLeaderboardWinningListMessage =
        reqBody.presentOnLeaderboardWinningListMessage;
    }
    if (reqBody.closeToLeaderboardWinningListMessage != undefined) {
      messageTemplateConfig[0].setting_data.closeToLeaderboardWinningListMessage =
        reqBody.closeToLeaderboardWinningListMessage;
    }

    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [
        JSON.stringify(messageTemplateConfig[0].setting_data),
        messageTemplateConfig[0].id,
      ]
    );
  };

  editKycConfig = async (reqBody: any) => {
    const messageTemplateConfig = await postgresInstance.readQuery(
      `select * from app_settings where setting_type=$1`,
      ["kyc_config"]
    );

    if (reqBody.isOCRVerification != undefined) {
      messageTemplateConfig[0].setting_data.isOCRVerification =
        reqBody.isOCRVerification;
    }

    if (reqBody.selectedPaymentGateway != undefined) {
      messageTemplateConfig[0].setting_data.selectedPaymentGateway =
        reqBody.selectedPaymentGateway;
    }

    const kycPaymentMethod =
      constants.KYC_PAYMENT_GATEWAYS_MAPPING[reqBody.selectedPaymentGateway];
    const kycPaymentGatewayConfig = !!messageTemplateConfig[0].setting_data
      .paymentGatewayConfig[kycPaymentMethod]
      ? messageTemplateConfig[0].setting_data.paymentGatewayConfig[
          kycPaymentMethod
        ]
      : Object.assign(
          messageTemplateConfig[0].setting_data.paymentGatewayConfig,
          { [kycPaymentMethod]: {} }
        );
    if (reqBody.clientId != undefined) {
      Object.assign(kycPaymentGatewayConfig, { x_client_id: reqBody.clientId });
    }

    if (reqBody.clientSecret != undefined) {
      Object.assign(kycPaymentGatewayConfig, {
        x_client_secret: reqBody.clientSecret,
      });
    }

    if (reqBody.depositAmountWithoutKyc != undefined) {
      messageTemplateConfig[0].setting_data.depositAmountWithoutKyc =
        reqBody.depositAmountWithoutKyc;
    }

    if (reqBody.withdrawAmountWithoutKyc != undefined) {
      messageTemplateConfig[0].setting_data.withdrawAmountWithoutKyc =
        reqBody.withdrawAmountWithoutKyc;
    }

    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [
        JSON.stringify(messageTemplateConfig[0].setting_data),
        messageTemplateConfig[0].id,
      ]
    );
  };

  editBonusCappingConfig = async (reqBody: any) => {
    const generalConfig = await postgresInstance.readQuery(`
            select * from app_settings where setting_type='bonus_capping_settings'
        `);

    if (!generalConfig.length) {
      console.log(
        "insert bonus_capping_settings ==>> ",
        JSON.stringify(reqBody)
      );
      const exitSetting = await postgresInstance.readQuery(
        `select id from app_settings order by id desc limit 1`
      );

      await postgresInstance.writeQuery(
        `insert into app_settings (id, setting_type, setting_data) values($1,$2,$3)`,
        [
          exitSetting[0].id + 1,
          "bonus_capping_settings",
          JSON.stringify(reqBody),
        ]
      );
    } else {
      console.log(
        "update bonus_capping_settings ==>> ",
        JSON.stringify(reqBody)
      );
      await postgresInstance.writeQuery(
        `update app_settings set setting_data=$1 where id=$2`,
        [JSON.stringify(reqBody), generalConfig[0].id]
      );
    }
  };

  editFeatureConfig = async (reqBody: any) => {
    const featureConfig = await postgresInstance.readQuery(`
            select * from app_settings where setting_type in ('amount_settings','general_app_config',
           'feature_configuration', 'message_templates') order by id asc
        `);
    if (reqBody.referralUpToAmount !== undefined) {
      featureConfig[0].setting_data.referralUpToAmount =
        reqBody.referralUpToAmount;
    }
    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [JSON.stringify(featureConfig[0].setting_data), featureConfig[0].id]
    );

    if (reqBody.noticeMessage !== undefined) {
      featureConfig[1].setting_data.noticeMessage = reqBody.noticeMessage;
    }
    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [JSON.stringify(featureConfig[1].setting_data), featureConfig[1].id]
    );

    if (reqBody.depositFeePercentage != undefined) {
      featureConfig[2].setting_data.depositFeePercentage =
        reqBody.depositFeePercentage;
    }
    if (reqBody.withdrawFeeAmount != undefined) {
      featureConfig[2].setting_data.withdrawFeeAmount =
        reqBody.withdrawFeeAmount;
    }
    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [JSON.stringify(featureConfig[2].setting_data), featureConfig[2].id]
    );

    if (reqBody.closeToLeaderboardWinningListMessage !== undefined) {
      featureConfig[3].setting_data.closeToLeaderboardWinningListMessage =
        reqBody.closeToLeaderboardWinningListMessage;
    }
    if (reqBody.presentOnLeaderboardWinningListMessage !== undefined) {
      featureConfig[3].setting_data.presentOnLeaderboardWinningListMessage =
        reqBody.presentOnLeaderboardWinningListMessage;
    }
    await postgresInstance.writeQuery(
      `
            update app_settings set setting_data=$1 where id=$2
        `,
      [JSON.stringify(featureConfig[3].setting_data), featureConfig[3].id]
    );
  };

  getSettings = async (req: Request, res: Response) => {
    let environmentConfig: {
      [key: string]: any[];
    } = {};

    environmentConfig[constants.SETTINGS_SECTIONS.GENERAL] = [];
    environmentConfig[constants.SETTINGS_SECTIONS.APP_Settings] = [];
    environmentConfig[constants.SETTINGS_SECTIONS.PG_Deposit] = [];
    environmentConfig[constants.SETTINGS_SECTIONS.PG_Payout_] = [];
    environmentConfig[constants.SETTINGS_SECTIONS.KYC] = [];
    environmentConfig[constants.SETTINGS_SECTIONS.SMS_Gateways] = [];

    try {
      const appSettings = await postgresInstance.readQuery(
        `select * from app_settings order by id asc`
      );
      for (let i = 0; i < appSettings.length; i++) {
        let inputField: {
          type: string;
          label: string;
          name: string;
          value: string;
        }[];
        let flag = false;
        switch (appSettings[i].setting_type) {
          case "app_version":
            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "App Socket URL",
                "appSocketUrl",
                appSettings[i].setting_data.app_socket_url || ""
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "App Manually Download URL",
                "manuallyDownloadUrl",
                appSettings[i].setting_data.manually_download_url || ""
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.APP_Settings].push({
              apiEndPoint: "/App-Settings-General",
              label: "General",
              developerSettingId: constants.SETTINGS_PARAMS_SETS.APP_CONFIG,
              inputField,
            });

            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "IOS App Update URL",
                "ios_appUpdateUrl",
                appSettings[i].setting_data.ios.appUpdateUrl
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "IOS Review App Version",
                "ios_reviewAppVersion",
                appSettings[i].setting_data.ios?.reviewAppVersion || ""
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Android App Update URL",
                "android_appUpdateUrl",
                appSettings[i].setting_data.android.appUpdateUrl
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Android Review App Version",
                "android_reviewAppVersion",
                appSettings[i].setting_data.android?.reviewAppVersion || ""
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.APP_Settings].push({
              apiEndPoint: "/app-update",
              label: "App Update",
              developerSettingId: constants.SETTINGS_PARAMS_SETS.APP_CONFIG,
              inputField,
            });
            break;
          case "app_maintenance":
            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Under Maintenance ",
                "isUnderMaintenance",
                appSettings[i].setting_data.isUnderMaintenance
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Message",
                "maintenanceMessage",
                appSettings[i].setting_data.maintenanceMessage
              )
            );

            const maintenanceUsers = !!appSettings[i].setting_data
              .maintenanceUsers
              ? appSettings[i].setting_data.maintenanceUsers
              : [];
            const maintenanceUsersArr = maintenanceUsers.map((user: any) => {
              return Object.values(user)[0];
            });
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Maintenance Allowed Users",
                "maintenanceUsers",
                maintenanceUsersArr.join(",")
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.APP_Settings].push({
              apiEndPoint: "/app-maintenance",
              label: "Maintenance",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.APP_MAINTENANCE,
              inputField,
            });
            break;
          case "amount_settings":
            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Signup Amount (₹)",
                "signUpAmount",
                appSettings[i].setting_data.signUpAmount
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Referral Amount (₹)",
                "referralAmount",
                appSettings[i].setting_data.referralAmount
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Payout - Min Amount (₹)",
                "minPayoutAmount",
                appSettings[i].setting_data.minPayoutAmount
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Payout - Max Amount (₹)",
                "maxPayoutAmount",
                appSettings[i].setting_data.maxPayoutAmount
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Deposit - Min Amount (₹)",
                "minDepositAmount",
                appSettings[i].setting_data.minDepositAmount
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Deposit - Max Amount (₹)",
                "maxDepositAmount",
                appSettings[i].setting_data.maxDepositAmount
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.GENERAL].push({
              apiEndPoint: "/general",
              label: "Amount Configs",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.AMOUNT_SETTINGS,
              inputField,
            });

            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Referral Upto Amount",
                "referralUpToAmount",
                appSettings[i].setting_data.referralUpToAmount
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.APP_Settings].push({
              apiEndPoint: "/Display-Configs",
              label: "Display Configs",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.FEATURE_CONFIGURATION,
              inputField,
            });
            break;
          case "sms_gateway_config":
            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Key",
                "key",
                appSettings[i].setting_data.key
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Message Template",
                "messageTemplate",
                appSettings[i].setting_data.messageTemplate
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Sender Id",
                "senderId",
                appSettings[i].setting_data.senderId
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "User",
                "user",
                appSettings[i].setting_data.user
              )
            );
            environmentConfig["SMS Gateways"].push({
              apiEndPoint: "/sms",
              label: "SMSIdea",
              developerSettingId: constants.SETTINGS_PARAMS_SETS.SMSGATEWAY,
              inputField,
            });
            break;
          case "payout_gateway_config":
            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "xClient Id",
                "xClientId",
                appSettings[i].setting_data.cashfree.x_client_id
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "xClient Secret",
                "xClientSecret",
                appSettings[i].setting_data.cashfree.x_client_secret
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.PG_Payout_].push({
              apiEndPoint: "/payout",
              label: "Cashfree",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.CASHFREEPAYOUT_GATEWAY,
              inputField,
            });

            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "xClient Id",
                "xClientId",
                appSettings[i].setting_data.razorpay.x_client_id
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "xClient Secret",
                "xClientSecret",
                appSettings[i].setting_data.razorpay.x_client_secret
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.PG_Payout_].push({
              apiEndPoint: "/payout",
              label: "Razorpay",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.RAZORPAYPAYOUT_GATEWAY,
              inputField: inputField,
            });

            inputField = [];
            const payoutSettings = await postgresInstance.readQuery(
              `select * from payout_methods`
            );
            const paymentGateway = !!payoutSettings.length
              ? payoutSettings[0].payment_gateway
              : 0;
            inputField.push(
              settingsMapper.inputFieldSetter(
                "dropdown",
                "Active PG",
                "selectedPayoutGateway",
                paymentGateway,
                "PAYOUT_GATEWAYS",
                { 1: "CASHFREE", 2: "RAZORPAY", 3: "PHONEPE", 4: "MANUAL" }
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Notice Meesage",
                "payoutNoticeMessage",
                appSettings[i].setting_data?.payoutNoticeMessage ?? ""
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.PG_Payout_].push({
              apiEndPoint: "/PG-Payout-General",
              label: "General",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.PAYOUT_SETTINGS,
              inputField,
            });
            break;
          case "payment_gateway_config":
            inputField = [];

            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "xClient Id",
                "xClientId",
                appSettings[i].setting_data.cashfree.x_client_id
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "xClient Secret",
                "xClientSecret",
                appSettings[i].setting_data.cashfree.x_client_secret
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.PG_Deposit].push({
              apiEndPoint: "/payment",
              label: "Cashfree",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.CASHFREEPAYMENT_GATEWAY,
              inputField,
            });

            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "xClient Id",
                "xClientId",
                appSettings[i].setting_data.razorpay.x_client_id
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "xClient Secret",
                "xClientSecret",
                appSettings[i].setting_data.razorpay.x_client_secret
              )
            );

            environmentConfig[constants.SETTINGS_SECTIONS.PG_Deposit].push({
              apiEndPoint: "/payment",
              label: "Razorpay",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.RAZORPAYPAYMENT_GATEWAY,
              inputField,
            });
            inputField = [];

            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Salt Key",
                "saltKey",
                appSettings[i].setting_data.phonepe.salt_key
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Salt Index",
                "saltIndex",
                appSettings[i].setting_data.phonepe.salt_index
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Merchant Id",
                "merchantId",
                appSettings[i].setting_data.phonepe.merchant_id
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.PG_Deposit].push({
              apiEndPoint: "/payment",
              label: "PhonePe",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.PHONEPEPAYMENT_GATEWAY,
              inputField,
            });

            inputField = [];

            inputField.push(
              settingsMapper.inputFieldSetter(
                "dropdown",
                "Active PG",
                "selectedPaymentGateway",
                appSettings[i].setting_data.selectedPaymentGateway,
                "PAYMENT_GATEWAYS",
                { 1: "CASHFREE", 2: "RAZORPAY", 3: "PHONEPE" }
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Notice Message",
                "depositNoticeMessage",
                appSettings[i].setting_data?.depositNoticeMessage ?? ""
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.PG_Deposit].push({
              apiEndPoint: "/PG-Deposit-General",
              label: "General",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.DEPOSIT_SETTINGS,
              inputField,
            });
            break;
          case "urls":
            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Support",
                "supportUrl",
                appSettings[i].setting_data.supportUrl
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Privacy Policy",
                "privacyPolicy",
                appSettings[i].setting_data.privacyPolicy
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Terms And Conditions",
                "termsAndConditions",
                appSettings[i].setting_data.termsAndConditions
              )
            );

            environmentConfig[constants.SETTINGS_SECTIONS.GENERAL].push({
              apiEndPoint: "/urls",
              label: "URLS",
              developerSettingId: constants.SETTINGS_PARAMS_SETS.URLS,
              inputField,
            });
            break;
          case "general_app_config":
            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Mind Support Time (in seconds)",
                "mindSupportTime",
                appSettings[i].setting_data.mindSupportTime
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Telegram Notify Time (in seconds)",
                "telegramNotifyTime",
                appSettings[i].setting_data.telegramNotifyTime
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.GENERAL].push({
              apiEndPoint: "/Matchmaking",
              label: "Matchmaking",
              developerSettingId: constants.SETTINGS_PARAMS_SETS.GENERAL,
              inputField,
            });

            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Notice Message",
                "noticeMessage",
                appSettings[i].setting_data.noticeMessage
              )
            );
            for (let item of environmentConfig[
              constants.SETTINGS_SECTIONS.APP_Settings
            ]) {
              if (
                item.developerSettingId ==
                constants.SETTINGS_PARAMS_SETS.FEATURE_CONFIGURATION
              ) {
                item.inputField.push(...inputField);
                flag = true;
                break;
              }
            }
            if (!flag) {
              environmentConfig[constants.SETTINGS_SECTIONS.APP_Settings].push({
                apiEndPoint: "/Display-Configs",
                label: "Display Configs",
                developerSettingId:
                  constants.SETTINGS_PARAMS_SETS.FEATURE_CONFIGURATION,
                inputField,
              });
              flag = false;
            }

            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Deposit Enabled?",
                "depositEnable",
                appSettings[i].setting_data.isDepositEnabled
              )
            );
            for (let item of environmentConfig[
              constants.SETTINGS_SECTIONS.PG_Deposit
            ]) {
              if (
                item.developerSettingId ==
                constants.SETTINGS_PARAMS_SETS.DEPOSIT_SETTINGS
              ) {
                item.inputField.push(...inputField);
                flag = true;
                break;
              }
            }
            if (!flag) {
              environmentConfig[constants.SETTINGS_SECTIONS.PG_Deposit].push({
                apiEndPoint: "/PG-Deposit-General",
                label: "General",
                developerSettingId:
                  constants.SETTINGS_PARAMS_SETS.DEPOSIT_SETTINGS,
                inputField,
              });
              flag = false;
            }

            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Payout Enabled?",
                "payoutsEnable",
                appSettings[i].setting_data.isPayoutEnabled
              )
            );
            for (let item of environmentConfig[
              constants.SETTINGS_SECTIONS.PG_Payout_
            ]) {
              if (
                item.developerSettingId ==
                constants.SETTINGS_PARAMS_SETS.PAYOUT_SETTINGS
              ) {
                item.inputField.push(...inputField);
                flag = true;
                break;
              }
            }
            if (!flag) {
              environmentConfig[constants.SETTINGS_SECTIONS.PG_Payout_].push({
                apiEndPoint: "/PG-Deposit-General",
                label: "General",
                developerSettingId:
                  constants.SETTINGS_PARAMS_SETS.PAYOUT_SETTINGS,
                inputField,
              });
              flag = false;
            }

            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Max No. of Payouts per Day",
                "maximumPayoutPerDay",
                appSettings[i].setting_data.maxPayoutPerDay
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Max Withdraw Transfer per Day",
                "maximumWithdrawTransferPerDay",
                appSettings[i].setting_data.maximumWithdrawTransferPerDay
              )
            );
            for (let item of environmentConfig[
              constants.SETTINGS_SECTIONS.GENERAL
            ]) {
              if (
                item.developerSettingId ==
                constants.SETTINGS_PARAMS_SETS.AMOUNT_SETTINGS
              ) {
                item.inputField.push(...inputField);
                flag = true;
                break;
              }
            }
            if (!flag) {
              environmentConfig[constants.SETTINGS_SECTIONS.GENERAL].push({
                apiEndPoint: "/general",
                label: "Amount Configs",
                developerSettingId:
                  constants.SETTINGS_PARAMS_SETS.AMOUNT_SETTINGS,
                inputField,
              });
              flag = false;
            }
            break;
          case "bonus_capping_settings":
            inputField = [];

            const betAmountList = await postgresInstance.readQuery(
              `SELECT DISTINCT ON (amount) 
                                amount, game_bet_amount_config.id, game_id
                            FROM 
                                game_bet_amount_config INNER JOIN games ON games.id = game_bet_amount_config.game_id
                            WHERE games.is_active = $1`,
              [true]
            );

            for (const betAmount of betAmountList) {
              const fieldName: string = `Bet ₹ ${betAmount.amount} (%)`;
              const fieldValue: any = !!appSettings[i].setting_data[
                betAmount.amount
              ]
                ? appSettings[i].setting_data[betAmount.amount]
                : 0;
              inputField.push(
                settingsMapper.inputFieldSetter(
                  "number",
                  fieldName,
                  betAmount.amount,
                  fieldValue
                )
              );
            }
            environmentConfig[constants.SETTINGS_SECTIONS.GENERAL].push({
              apiEndPoint: "/bonus-capping",
              label: "Bonus Capping",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.BONUSCAPPING_SETTING,
              inputField,
            });
            break;
          case "feature_configuration":
            inputField = [];

            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Should show Top Leaderboard Users?",
                "showTopLeaderboardUsers",
                appSettings[i].setting_data.showTopLeaderboardUsers
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Should show Profile Analytics?",
                "showProfileAnalytics",
                appSettings[i].setting_data.showProfileAnalytics
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Should show Online Players?",
                "showOnlinePlayers",
                appSettings[i].setting_data.showOnlinePlayers
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Should show Available Players for Battle?",
                "showGameWaitingPlayer",
                appSettings[i].setting_data.showGameWaitingPlayer
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "State Selection Enabled?",
                "showStateSelection",
                appSettings[i].setting_data.showStateSelection
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Language Selection Enabled?",
                "showLanguageSelection",
                appSettings[i].setting_data.showLanguageSelection
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Should show Frequently Played Bet?",
                "showFrequentlyPlayedBet",
                appSettings[i].setting_data.showFrequentlyPlayedBet
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "AppsFlyer Enabled",
                "enableAppsFlyer",
                appSettings[i].setting_data.enableAppsFlyer
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Withdraw Transfer Enabled?",
                "enableWithdrawTransfers",
                appSettings[i].setting_data.enableWithdrawTransfers
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "BytePro Hack Detect Enabled?",
                "enableByteProHackDetect",
                appSettings[i].setting_data.enableByteProHackDetect
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "Should show Leaderboard Winner Popup?",
                "enableLeaderboardWinnerPopup",
                appSettings[i].setting_data.enableLeaderboardWinnerPopup
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.APP_Settings].push({
              apiEndPoint: "/Feature-Controls",
              label: "Feature Controls",
              developerSettingId:
                constants.SETTINGS_PARAMS_SETS.FEATURE_CONFIGURATION,
              inputField,
            });

            inputField = [];
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Deposit Fee (%)",
                "depositFeePercentage",
                appSettings[i].setting_data.depositFeePercentage
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Withdraw Fee (₹)",
                "withdrawFeeAmount",
                appSettings[i].setting_data.withdrawFeeAmount
              )
            );
            for (let item of environmentConfig[
              constants.SETTINGS_SECTIONS.APP_Settings
            ]) {
              if (
                item.developerSettingId ==
                constants.SETTINGS_PARAMS_SETS.FEATURE_CONFIGURATION
              ) {
                item.inputField.push(...inputField);
                flag = true;
                break;
              }
            }
            if (!flag) {
              environmentConfig[constants.SETTINGS_SECTIONS.APP_Settings].push({
                apiEndPoint: "/Display-Configs",
                label: "Display Configs",
                developerSettingId:
                  constants.SETTINGS_PARAMS_SETS.FEATURE_CONFIGURATION,
                inputField,
              });
              flag = false;
            }
            break;
          case "message_templates":
            inputField = [];

            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Present On Leaderboard Winning List Message",
                "presentOnLeaderboardWinningListMessage",
                appSettings[i].setting_data
                  .presentOnLeaderboardWinningListMessage
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Close To Leaderboard Winning List Message",
                "closeToLeaderboardWinningListMessage",
                appSettings[i].setting_data.closeToLeaderboardWinningListMessage
              )
            );
            for (let item of environmentConfig[
              constants.SETTINGS_SECTIONS.APP_Settings
            ]) {
              if (
                item.developerSettingId ==
                constants.SETTINGS_PARAMS_SETS.FEATURE_CONFIGURATION
              ) {
                item.inputField.push(...inputField);
                flag = true;
                break;
              }
            }
            if (!flag) {
              environmentConfig[constants.SETTINGS_SECTIONS.APP_Settings].push({
                apiEndPoint: "/Display-Configs",
                label: "Display Configs",
                developerSettingId:
                  constants.SETTINGS_PARAMS_SETS.FEATURE_CONFIGURATION,
                inputField,
              });
              flag = false;
            }
            break;
          case "kyc_config":
            inputField = [];

            inputField.push(
              settingsMapper.inputFieldSetter(
                "switch",
                "OCR Verification Enabled?",
                "isOCRVerification",
                appSettings[i].setting_data.isOCRVerification
              )
            );
            const selectedPaymentGateway = !!appSettings[i].setting_data
              .selectedPaymentGateway
              ? appSettings[i].setting_data.selectedPaymentGateway
              : 0;
            inputField.push(
              settingsMapper.inputFieldSetter(
                "dropdown",
                "Active PG",
                "selectedPaymentGateway",
                selectedPaymentGateway,
                "KYC_PAYMENT_GATEWAYS",
                constants.KYC_PAYMENT_GATEWAYS_MAPPING
              )
            );

            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Deposit Limit without KYC (₹)",
                "depositAmountWithoutKyc",
                appSettings[i].setting_data.depositAmountWithoutKyc
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "number",
                "Withdraw Limit without KYC (₹)",
                "withdrawAmountWithoutKyc",
                appSettings[i].setting_data.withdrawAmountWithoutKyc
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.KYC].push({
              apiEndPoint: "/kyc-General",
              label: "General",
              developerSettingId: constants.SETTINGS_PARAMS_SETS.KYC_CONFIG,
              inputField,
            });

            inputField = [];
            const kycPaymentMethod =
              constants.KYC_PAYMENT_GATEWAYS_MAPPING[
                appSettings[i].setting_data?.selectedPaymentGateway
              ];
            const kycPaymentGatewayConfig = !!appSettings[i].setting_data
              ?.paymentGatewayConfig
              ? appSettings[i].setting_data?.paymentGatewayConfig[
                  kycPaymentMethod
                ]
              : {};
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Client Id",
                "clientId",
                kycPaymentGatewayConfig?.x_client_id
              )
            );
            inputField.push(
              settingsMapper.inputFieldSetter(
                "text",
                "Client Secret",
                "clientSecret",
                kycPaymentGatewayConfig?.x_client_secret
              )
            );
            environmentConfig[constants.SETTINGS_SECTIONS.KYC].push({
              apiEndPoint: "/kyc-Cashfree",
              label: "Cashfree",
              developerSettingId: constants.SETTINGS_PARAMS_SETS.KYC_CONFIG,
              inputField,
            });
            break;
        }
      }
      return responseDispatcher.dispatch(req, res, environmentConfig);
    } catch (error) {
      return responseDispatcher.dispatchError(req, res, error);
    }
  };
  editSettings = async (req: Request, res: Response) => {
    try {
      const reqBody = req.body;
      let message;
      switch (reqBody.settingType) {
        case constants.SETTINGS_PARAMS_SETS.GENERAL:
          await this.editNoticeMessage(reqBody.data);
          message = "General config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.AMOUNT_SETTINGS:
          await this.editGeneralConfig(reqBody.data);
          message = "General config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.URLS:
          await this.editURLsConfig(reqBody.data);
          message = "Urls config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.BONUSCAPPING_SETTING:
          await this.editBonusCappingConfig(reqBody.data);
          message = "Bonus capping config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.APP_CONFIG:
          await this.editAppConfig(reqBody.data);
          message = "App settings updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.APP_MAINTENANCE:
          await this.editMaintenanceConfig(reqBody.data);
          message = "Maintenance mode updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.FEATURE_CONFIGURATION:
          await this.editFeatureConfig(reqBody.data);
          message = "Feature configuration updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.CASHFREEPAYMENT_GATEWAY:
          await this.editPaymentConfig(reqBody);
          message = "Payment config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.CASHFREEPAYOUT_GATEWAY:
          await this.editPayoutConfig(reqBody);
          message = "Payout config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.RAZORPAYPAYMENT_GATEWAY:
          await this.editPaymentConfig(reqBody);
          message = "Payment config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.RAZORPAYPAYOUT_GATEWAY:
          await this.editPayoutConfig(reqBody);
          message = "Payout config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.PHONEPEPAYMENT_GATEWAY:
          await this.editPaymentConfig(reqBody);
          message = "Payment config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.DEPOSIT_SETTINGS:
          await this.editDepositSettings(reqBody.data);
          message = "Deposit Settings updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.PAYOUT_SETTINGS:
          await this.editPayoutSettings(reqBody.data);
          message = "Payout Settings updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.KYC_CONFIG:
          await this.editKycConfig(reqBody.data);
          message = "KYC config updated";
          break;

        case constants.SETTINGS_PARAMS_SETS.SMSGATEWAY:
          await this.editSMSConfig(reqBody.data);
          message = "SMS config updated";
          break;

        default:
          message = "Add proper setting type";
          break;
      }

      await settingsMapper.notifySettingsDataUpdate();

      return responseDispatcher.dispatch(req, res, {
        message,
      });
    } catch (error) {
      return responseDispatcher.dispatchError(req, res, error);
    }
  };
}
const settingsControllerV1 = new SettingsControllerV1();
export default settingsControllerV1;
