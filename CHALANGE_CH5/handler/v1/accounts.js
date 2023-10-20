const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../../helpers');

module.exports = {
    createAccounts: async (req, res, next) =>{
        try {
            let {user_id, bank_name, bank_account_number, balance} = req.body
            // validasi // validasi userId
            
            let existUserId = await prisma.users.findFirst({where : {id: user_id},})
            if (!existUserId) {
                return res.status(400).json({
                    status: false,
                    message: 'User with ID '+ user_id +' not found!',
                    data: null
                });
            }
            //create bank_Accounts
            let newAccounts = await prisma.Bank_Accounts.create({
                data:{ 
                    user_id : user_id, 
                    bank_name : bank_name, 
                    bank_account_number : bank_account_number, 
                    balance : balance }
            })

            res.status(201).json({
                status:true,
                message:"created!",
                data: newAccounts
            })
        } catch (err) {
            next(err)
            // console.log(err.message);
        }
    },
    getAllAccounts: async(req, res, next) =>{
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let accounts = await prisma.Bank_Accounts.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            const { _count } = await prisma.Bank_Accounts.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: 'OK',
                data: { pagination, accounts }
            });
        } catch (err) {
            next(err)
        }
    },
    getDetailAccounts : async(req,res,next) =>{
        try {
            let { id } = req.params;
            let account = await prisma.Bank_Accounts.findUnique({ where: { id: Number(id) } });

            if (!account) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    data: 'no account found with id ' + id
                });
            }

            res.status(200).json({
                status: true,
                message: 'OK',
                data: account
            });
        } catch (err) {
            next(err);
        }
    },
    updateAccounts : async(req, res, next)=> {
        try {
            let {id} = req.params
            let {user_id, bank_name,bank_account_number,balance} = req.body

            let account = await prisma.bank_Accounts.findUnique({ where: { id: Number(id) } });
            if (!account) {
                return res.status(400).json({
                    status: false,
                    message: 'Id doesn\'t exist!',
                    data: null
                });
            }
            let existUserId = await prisma.users.findFirst({where : {id: user_id},})
            if (!existUserId) {
                return res.status(400).json({
                    status: false,
                    message: 'User with ID '+ user_id +' not found!',
                    data: null
                });
            }

            let updateOperation = await prisma.bank_Accounts.update({
                where: { id: Number(id) },
                data:{ 
                    user_id : user_id, 
                    bank_name : bank_name, 
                    bank_account_number : bank_account_number, 
                    balance : balance }
            });

            res.status(200).json({
                status: true,
                message: 'OK',
                data: updateOperation
            });
        } catch (err) {
            next(err.message)
        }
    },
    deleteAccounts : async(req, res, next)=> {
        try {
            let { id } = req.params;

            let user = await prisma.bank_Accounts.findUnique({ where: { id: Number(id) } });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Id '+id+' doesn\'t exist!',
                    data: null
                });
            }

            let deleteOperation = await prisma.bank_Accounts.delete({
                where: { id: Number(id) }
            });

            res.status(200).json({
                status: true,
                message: 'OK',
                data: deleteOperation
            });
        } catch (err) {
            next(err);
        }
    }
    
}