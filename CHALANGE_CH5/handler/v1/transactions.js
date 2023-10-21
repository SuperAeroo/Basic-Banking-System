const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../../helpers');

module.exports = {
    createTransactions : async (req, res, next) =>{
        try {
            let { source_account_id, destination_account_id, amount} = req.body

            // validasi userId source & destination
            let existSourceId = await prisma.bank_Accounts.findFirst({where : {id:source_account_id},})
            let existDestinationId = await prisma.bank_Accounts.findFirst({where : {id:destination_account_id},})
            if (!existSourceId || !existDestinationId) {
                return res.status(400).json({
                    status: false,
                    message: 'Source Id Or Destination Not Found!',
                    data: null
                });
            }
            // validasi balance source akun
            if (existSourceId.balance < amount) {
                return res.status(400).json({
                    status: false,
                    message: "saldo tidak mencukupi",
                    data: null,
                });
            }
            let createTransaction = await prisma.transactions.create({
                data: {
                    source_account_id,
                    destination_account_id,
                    amount,
                },
            });

            await prisma.bank_Accounts.update({
                where: {
                    id: source_account_id,
                },
                data: {
                    balance: {
                        decrement: amount,
                    },
                },
            });

            await prisma.bank_Accounts.update({
                where: {
                    id: destination_account_id,
                },
                data: {
                    balance: {
                        increment: amount,
                    },
                },
            });

            res.status(201).json({
                status:true,
                message:"created!",
                data: createTransaction
            })

        } catch (err) {
            next(err)
        }
    },
    getAllTransactions: async(req, res, next) =>{
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let transactions = await prisma.transactions.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            const { _count } = await prisma.transactions.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: 'OK',
                data: { pagination, transactions }
            });
        } catch (err) {
            next(err)
        }
    },
    getDetailTransactions : async(req,res,next) =>{
        try {
            let { id } = req.params;
            let transactions = await prisma.transactions.findUnique({ where: { id: Number(id) } });

            if (!transactions) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    data: 'no transaction found with id ' + id
                });
            }

            res.status(200).json({
                status: true,
                message: 'OK',
                data: transactions
            });
        } catch (err) {
            next(err);
        }
    },
    updateTransactions : async(req, res, next)=> {
        try {
            let {id} = req.params
            let {user_id, source_account_id, destination_account_id, amount} = req.body

            let existSourceId = await prisma.bank_Accounts.findFirst({where : {id:source_account_id},})
            let existDestinationId = await prisma.bank_Accounts.findFirst({where : {id:destination_account_id},})
            if (!existSourceId && !existDestinationId) {
                return res.status(400).json({
                    status: false,
                    message: 'Source Id Or Destination Not Found!',
                    data: null
                });
            }

            let transaction = await prisma.transactions.findUnique({ where: { id: Number(id) } });
            if (!transaction) {
                return res.status(400).json({
                    status: false,
                    message: 'Id '+id+' doesn\'t exist!',
                    data: null
                });
            }
            if (existSourceId.balance < amount) {
                return res.status(400).json({
                    status: false,
                    message: "saldo tidak mencukupi",
                    data: null,
                });
            }

            let updateOperation = await prisma.transactions.update({
                where: { id: Number(id) },
                data:{ user_id, source_account_id, destination_account_id, amount }
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
    deleteTransactions : async(req, res, next)=> {
        try {
            let { id } = req.params;

            let transaction = await prisma.transactions.findUnique({ where: { id: Number(id) } });
            if (!transaction) {
                return res.status(400).json({
                    status: false,
                    message: 'Id doesn\'t exist!',
                    data: null
                });
            }

            let deleteOperation = await prisma.transactions.delete({
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