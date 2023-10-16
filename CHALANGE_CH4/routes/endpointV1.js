const express = require("express");
const router = express.Router();

const { createUsers, getAllUsers, getDetailUsers, updateUsers, deleteUsers } = require("../handler/v1/users");
const { createAccounts, getAllAccounts, getDetailAccounts} = require("../handler/v1/accounts");
const { createTransactions, getAllTransactions, getDetailTransactions } = require("../handler/v1/transactions");
const { createProfiles, getAllProfiles, getDetailProfiles, updateProfiles, deleteProfiles } = require("../handler/v1/profiles");

router.get("/", (req, res) => {
    res.status(200).json({
        status: true,
        message: "Chalange Ch4 Aldii",
        data: null,
    });
});

//users
router.post("/users", createUsers);
router.get("/users", getAllUsers);
router.get("/users/:id", getDetailUsers);
router.put("/users/:id", updateUsers);
router.delete("/users/:id", deleteUsers);

//profiles
router.post("/profiles", createProfiles);
router.get("/profiles", getAllProfiles);
router.get("/profiles/:id", getDetailProfiles);
router.put("/profiles/:id", updateProfiles);
router.delete("/profiles/:id", deleteProfiles);

//accounts
router.post("/accounts", createAccounts);
router.get("/accounts", getAllAccounts);
router.get("/accounts/:id", getDetailAccounts);

//transactions
router.post("/transactions", createTransactions);
router.get("/transactions", getAllTransactions);
router.get("/transactions/:id", getDetailTransactions);

module.exports = router;