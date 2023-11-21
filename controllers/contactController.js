
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

const createContact = asyncHandler(async (req, res) => {
    console.log("The body is: ",req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    })

    res.status(201).json({
        message: "Created the Contact",
        data: contact
    });
});

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    res.status(200).json({
        message: `Get the contact for ${req.params.id}`,
        data:contact
    });
});

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update contacts of other users !");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id, 
        req.body,
        { new:true }
    );
    res.status(200).json({
        message: `Update the contact for ${req.params.id}`,
        data: updateContact
    });
});

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to delete contacts of other users !");
    }

    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    console.log("contact found: ",contact);
    // await contact.remove();
    const deletedContact = await Contact.deleteOne({ _id: req.params.id });
    console.log("***** deleted contact is: ",deletedContact);
    res.status(200).json({message: `Delete the contact for ${req.params.id}`});
});



module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };

