const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../../helpers');

module.exports = {
    createTransactions : async (req, res, next) =>{
        try {
            let { source, destination, amount} = req.body

            // validasi userId source & destination
            let existSourceId = await prisma.bank_Accounts.findFirst({where : {id:source},})
            let existDestinationId = await prisma.bank_Accounts.findFirst({where : {id:destination},})
            if (!existSourceId && !existDestinationId) {
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
                    source_account_id : source,
                    destination_account_id : destination,
                    amount : amount,
                },
            });

            await prisma.bank_Accounts.update({
                where: {
                    id: source,
                },
                data: {
                    balance: {
                        decrement: amount,
                    },
                },
            });

            await prisma.bank_Accounts.update({
                where: {
                    id: destination,
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
    }
}