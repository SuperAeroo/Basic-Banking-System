const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../../helpers');

module.exports = {
    createProfiles: async (req, res, next) =>{
        try {
            let {user_id, identity_type,identity_number,address} = req.body
            // validasi id
            
            let existUserId = await prisma.users.findFirst({where : {id:user_id},})
            if (!existUserId) {
                return res.status(400).json({
                    status: false,
                    message: 'User with an id '+user_id+' not fund!',
                    data: null
                });
            }

            let existProfileId = await prisma.profiles.findFirst({where : {user_id:user_id},})
            if (existProfileId) {
                return res.status(400).json({
                    status: false,
                    message: 'Profile with id ' + user_id +' already exists!',
                    data: null
                });
            }

            //create profiles
            let newProfile = await prisma.profiles.create({
                data:{ user_id: +user_id, identity_type : identity_type, identity_number:identity_number, address:address}
            })
            res.status(201).json({
                status:true,
                message:"created!",
                data: newProfile
            })
        } catch (err) {
            next(err)       
        }
    },
    getAllProfiles: async(req, res, next) =>{
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let profile = await prisma.profiles.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            const { _count } = await prisma.profiles.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: 'OK',
                data: { pagination, profile }
            });
        } catch (err) {
            next(err)
        }
    },
    getDetailProfiles : async(req,res,next) =>{
        try {
            let { id } = req.params;
            let profiles = await prisma.profiles.findUnique({ where: { id: Number(id) } });

            if (!profiles) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    data: 'no user found with id ' + id
                });
            }

            res.status(200).json({
                status: true,
                message: 'OK',
                data: profiles
            });
        } catch (err) {
            next(err);
        }
    },
    updateProfiles : async(req, res, next)=> {
        try {
            let {id} = req.params
            let {user_id, identity_type,identity_number,address} = req.body

            let profile = await prisma.profiles.findUnique({ where: { id: Number(id) } });
            if (!profile) {
                return res.status(400).json({
                    status: false,
                    message: 'Id doesn\'t exist!',
                    data: null
                });
            }

            let updateOperation = await prisma.profiles.update({
                where: { id: Number(id) },
                data:{ 
                    user_id : user_id, 
                    identity_type : identity_type, 
                    identity_number : identity_number, 
                    address : address }
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
    deleteProfiles : async(req, res, next)=> {
        try {
            let { id } = req.params;

            let user = await prisma.profiles.findUnique({ where: { id: Number(id) } });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Id doesn\'t exist!',
                    data: null
                });
            }

            let deleteOperation = await prisma.profiles.delete({
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