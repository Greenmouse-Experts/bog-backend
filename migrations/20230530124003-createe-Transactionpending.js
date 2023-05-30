'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
     
//      await queryInterface.createTable('transactions_pending',{
//     id: {
//       type: Sequelize.UUID,
//       defaultValue: Sequelize.UUIDV4,
//       unique: true,
//       primaryKey: true,
//     },
//     TransactionId: {
//       type: Sequelize.STRING,
//       allowNull: true,
//     },
//     userId: {
//       type: Sequelize.STRING,
//       allowNull: true,
//     },
//     superadmin: {
//       type: Sequelize.BOOLEAN,
//       default: false,
//     },
//     financialadmin: {
//       type: Sequelize.BOOLEAN,
//       default: false,
//     },
//     transaction: {
//       allowNull: true,
//       type: Sequelize.TEXT,
//       get() {
//         const data = this.getDataValue("transaction");
//         return JSON.parse(data);
//       },
//       set(value) {
//         this.setDataValue("transaction", JSON.stringify(value));
//       },
//     },
//   },
//   { paranoid: true }
// );
queryInterface.addColumn(
   "transactions_pending", // table name
   "transfer", // new field name
   {
     type: Sequelize.TEXT,
     allowNull: true,
   }
 );


     
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
