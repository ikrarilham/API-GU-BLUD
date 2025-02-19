/** import the products.model module */
const usersModel = require("../../model/admin/user.model");

const usersController = {
  /** get controller */
  get: (req, res) => {
    return usersModel
      .get(req.query)
      .then((result) => {
        const costumeJson = {
          headers: {
            "content-type": "aplication/json",
            "x-custom-headers": "costumValue",
          },
          body: {
            response_code: "00",
            response_descripstion: "Success",
            items: result.map((row) => row.pegawai_id),
          },
        };
        return res.status(200).send({ data: costumeJson });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  /** end of getDetail controller */

  /** getDetail controller */
  getDetail: (req, res) => {
    return usersModel
      .getDetail(req.params.id)
      .then((result) => {
        const costumeJson = {
          headers: {
            "content-type": "aplication/json",
            "x-custom-headers": "costumValue",
          },
          body: {
            response_code: "00",
            response_descripstion: "Success",
            items: result.map((row) => row.username),
          },
        };
        return res.status(200).send({ data: costumeJson });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  /** End of GetDetail Controller */

  /** Update Controller */
  // update: (req, res) => {
  //   const quest = {
  //     ...req.body,
  //     id: req.params.id,
  //     file: req.files,
  //   };
  //   return usersModel
  //     .update(quest)
  //     .then((result) => {
  //       return res.status(201).send({ message: "Success", data: result });
  //     })
  //     .catch((error) => {
  //       return res.status(500).send({ message: error });
  //     });
  // },
  /** End of Update Controller */

  /** end of getDetail controller */
  /** Remove Controller */
  // remove: (req, res) => {
  //   if (req.params.id != ":id") {
  //     return usersModel
  //       .remove(req.params.id)
  //       .then((result) => {
  //         return res.status(200).send({ message: "success", data: result });
  //       })
  //       .catch((error) => {
  //         return res.status(500).send({ message: error });
  //       });
  //   } else {
  //     return res.status(400).send({ message: "id not found" });
  //   }
  // },
  /** End of Remove Controller */
};

/** export the users Controller */
module.exports = usersController;
