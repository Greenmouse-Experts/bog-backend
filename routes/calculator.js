const express = require("express");

const formidable = require("formidable");

const fs = require("fs");
const { parse } = require("csv-parse");
const reader = require("xlsx");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const CalculatorController = require("../controllers/CalculatorController");

const { validate, CalculatorCalculator } = require("../helpers/validators");

router
  .route("/calculator-settings/create")
  .post(
    CalculatorCalculator(),
    validate,
    [Auth, Access.verifyAccess],
    CalculatorController.createRate
  );

router
  .route("/calculator-settings/update/:id")
  .post([Auth, Access.verifyAccess], CalculatorController.UpdateRate);
router
  .route("/calculator-settings/delete/:id")
  .delete(CalculatorController.DeleteRate);

router.route("/calculator-settings/all").get(CalculatorController.ReadRate);

// const workbook = reader.readFile('./Book1.xlsx')

// const importDeptInputs = (req, res) => {
//   var form = new formidable.IncomingForm({
//     multiples: true,
//     // maxFileSize: 25 * 1024 * 1024,
//     // uploadDir: path.resolve(__dirname, '../../images')
//   });

//   form.parse(req, function(err, fields, file) {
//     // res.json(file);
//     try {
//       if (err) throw err;
//       if (!file.doc) {
//         res.status(400).json({ error: 1, msg: "No file provided!" });
//       } else if (
//         file.doc.originalFilename.split(".")[1] !== "xls" &&
//         file.doc.originalFilename.split(".")[1] !== "xlsx"
//       ) {
//         res
//           .status(400)
//           .json({ error: 1, msg: "File has to be of a .xls,.xlsx format!" });
//       } else {
//         // console.log(file.doc.filepath)
//         const workbook = reader.readFile(file.doc.filepath);

//         var sheet_name_list = workbook.SheetNames;

//         let rates = { rates: [] };
//         for (let index = 0; index < sheet_name_list.length; index++) {
//           const sheet = sheet_name_list[index];
//           var xlData = reader.utils.sheet_to_json(workbook.Sheets[sheet]);

//           console.log(xlData);
//           const __xlData = xlData.filter(
//             (_data) => typeof _data.__EMPTY_4 === "number"
//           );

//           console.log(__xlData);
//           let _index = 0;
//           rates.rates = __xlData.map((_xdata) => {
//             const formula =
//               _xdata[
//                 `ALWAYS ROUND UP ALL RESULTS FORWARD TO THE NEXT WHOLE NUMBER`
//               ];
//             _index += 1;
//             return {
//               index: _index,
//               description: _xdata.__EMPTY_1,
//               rates: _xdata.__EMPTY_4,
//               formula,
//             };
//           });
//         }

//         return res.send({
//           status: true,
//           message: `Rates and formula for ${sheet_name_list[0]}`,
//           data: rates,
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(400).json({ error: 1, msg: error });
//     }
//   });
// };

// router.route("/smartcal").post(importDeptInputs);
// router
//   .route("/calculator-settings/upload")
//   .post([Auth], CalculatorController.extractAndStoreParams);

module.exports = router;
