const express = require('express');
const router = express.Router();
const { getContacts, createContact, getContact, updateContact, deleteContact } = require("../controllers/contactController");
const validateToken = require('../middleware/validateToken');


// router.route("/").get((req,res)=>{
//     res.status(200).json({message: "Get all the contacts"});
// });

router.use(validateToken);
router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

// router.route("/:id").put(updateContact);
// router.route("/:id").delete(deleteContact);







module.exports = router;

