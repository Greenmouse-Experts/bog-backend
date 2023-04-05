/* eslint-disable no-unused-vars */
require("dotenv").config();
const axios = require("axios");
const config = require("./config");

const Service = {
  Flutterwave: {
    url: process.env.FLW_BASEURL,
    /**
     * Transfer
     * @param {*} accountNumber 
     * @param {*} bankCode 
     * @param {*} amount 
     * @param {*} narration 
     * @param {*} currency 
     * @param {*} reference 
     * @returns 
     */
    async transfer(
      accountNumber,
      bankCode,
      amount,
      narration,
      currency,
      reference
    ) {
      const data = {
        account_bank: bankCode,
        account_number: accountNumber,
        amount,
        narration,
        currency,
        reference
      };
      try {
        const url = `${this.url}/v3/transfers`;
        const res = await axios.post(url, data, {
          headers: config.flw_header,
        });
        // console.log(res.data);
        return res.data;
      } catch (error) {
        console.log(error.response.data);
        const err = error.response.data;
        const externalError = new Error(err);
        externalError.status = error.response.status;
        return err;
        // throw externalError;
      }
    },
    async viewBanks(){
      try{
        const result = await axios.get(`https://maylancer.org/api/nuban/banklist.php`);
        return result;
      }
      catch(err){
        return err;
      }
    }
    // async createTransferReceipt(accountName, accountNumber, bankCode) {
    //   try {
    //     const createUserUrl = `${this.url}/transferrecipient`;
    //     const result = await axios({
    //       method: "post",
    //       url: createUserUrl,
    //       data: {
    //         type: "nuban",
    //         name: accountName,
    //         account_number: accountNumber,
    //         bank_code: bankCode,
    //         currency: "NGN"
    //       },
    //       headers: auth.header
    //     });
    //     // console.log(result.data);
    //     const resp = result.data;
    //     return resp;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // async finalizeTransfer(transfer_code, token) {
    //   try {
    //     const createUserUrl = `${this.url}/transfer/finalize_transfer`;
    //     const result = await axios({
    //       method: "post",
    //       url: createUserUrl,
    //       data: {
    //         transfer_code,
    //         otp: token
    //       },
    //       headers: auth.header
    //     });
    //     // console.log(result.data);
    //     const resp = result.data;
    //     return resp;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // async verifyPayment(reference) {
    //   try {
    //     const createUserUrl = `${this.url}/transaction/verify/${reference}`;
    //     const result = await axios({
    //       method: "get",
    //       url: createUserUrl,
    //       headers: auth.header
    //     });
    //     // console.log(result.data);
    //     const resp = result.data;
    //     return resp;
    //   } catch (error) {
    //     console.log(error);
    //     const err = error.response.data;
    //     return err;
    //   }
    // }
  },
};

module.exports = { Service };
