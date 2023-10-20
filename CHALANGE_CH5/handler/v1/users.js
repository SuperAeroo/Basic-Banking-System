const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../../helpers');

module.exports = {
    createUsers: async (req, res, next) =>{
        try {
            let {name, email, password} = req.body
            // validasi email
            
            let existUser = await prisma.users.findFirst({where : {email},})
            if (existUser) {
                return res.status(400).json({
                    status: false,
                    message: 'Email is already used!',
                    data: null
                });
            }
            //create users
            let newUsers = await prisma.users.create({
                data:{ name : name, email : email, password : password }
            })
            res.status(201).json({
                status:true,
                message:"created!",
                data: newUsers
            })
        } catch (err) {
            next(err)       
        }
    },
    getAllUsers: async(req, res, next) =>{
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let users = await prisma.users.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            const { _count } = await prisma.users.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: 'success',
                data: { pagination, users }
            });
        } catch (err) {
            next(err)
        }
    },
    getDetailUsers : async(req,res,next) =>{
        try {
            let profile = []
            let { id } = req.params;
            let user = await prisma.users.findUnique({ where: { id: Number(id) } });
            profile = await prisma.profiles.findUnique({ where: { user_id: Number(id) } });

            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    data: 'no user found with id ' + id
                });
            }

            res.status(200).json({
                status: true,
                message: 'OK',
                data: user,profile
            });
        } catch (err) {
            next(err);
        }
    },
    updateUsers : async(req, res, next)=> {
        try {
            let {id} = req.params
            let {name,email,password} = req.body

            let user = await prisma.users.findUnique({ where: { id: Number(id) } });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Id doesn\'t exist!',
                    data: null
                });
            }

            let existUser = await prisma.users.findFirst({where : {email},})
            if (existUser) {
                return res.status(400).json({
                    status: false,
                    message: 'Email is already used!',
                    data: null
                });
            }

            let updateOperation = await prisma.users.update({
                where: { id: Number(id) },
                data:{ 
                    name : name, 
                    email : email, 
                    password }
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
    deleteUsers : async(req, res, next)=> {
        try {
            let { id } = req.params;

            let user = await prisma.users.findUnique({ where: { id: Number(id) } });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Id doesn\'t exist!',
                    data: null
                });
            }

            let deleteOperation = await prisma.users.delete({
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