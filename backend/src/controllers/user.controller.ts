import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middlewares/auth.middleware';
import { convertToCSV } from '../utils/export.utils';

const prisma = new PrismaClient();

// Controller for User operations

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                sector: true,
                position: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                userPlatforms: {
                    select: {
                        platform: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
        });

        // Transform the response to match the expected format
        const transformedUsers = users.map(user => ({
            ...user,
            platforms: user.userPlatforms.map(up => up.platform),
            userPlatforms: undefined
        }));
        res.json(transformedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const createUser = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, role, sector, position, status, password, platforms } = req.body;

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'ADMIN',
                sector,
                position,
                status: status || 'ACTIVE',
                userPlatforms: {
                    create: platforms ? platforms.map((platformId: string) => ({
                        platformId
                    })) : []
                }
            },
            include: {
                userPlatforms: {
                    include: {
                        platform: true
                    }
                }
            }
        });

        // Transform the response
        const transformedUser = {
            ...user,
            platforms: user.userPlatforms.map(up => up.platform),
            userPlatforms: undefined
        };

        res.status(201).json({ ...transformedUser, password: undefined });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, sector, position, status, platforms } = req.body;

        const data: any = {
            name,
            email,
            role,
            sector,
            position,
            status
        };

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        // First, delete existing platform associations
        if (platforms !== undefined) {
            await prisma.userPlatform.deleteMany({
                where: { userId: id }
            });
        }

        const user = await prisma.user.update({
            where: { id },
            data,
            include: {
                userPlatforms: {
                    include: {
                        platform: true
                    }
                }
            }
        });

        // Create new platform associations if provided
        if (platforms && platforms.length > 0) {
            await prisma.userPlatform.createMany({
                data: platforms.map((platformId: string) => ({
                    userId: id,
                    platformId
                }))
            });
        }

        // Fetch updated user with platforms
        const updatedUser = await prisma.user.findUnique({
            where: { id },
            include: {
                userPlatforms: {
                    include: {
                        platform: true
                    }
                }
            }
        });

        // Transform the response
        const transformedUser = updatedUser ? {
            ...updatedUser,
            platforms: updatedUser.userPlatforms.map(up => up.platform),
            userPlatforms: undefined
        } : null;

        res.json({ ...transformedUser, password: undefined });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user (cascade will handle UserPlatform relations)
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
};

export const exportUsers = async (req: AuthRequest, res: Response) => {
    try {
        const XLSX = require('xlsx');

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                sector: true,
                position: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                userPlatforms: {
                    select: {
                        platform: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
        });

        // Transform data for export
        const exportData = users.map(user => ({
            ID: user.id,
            Nome: user.name,
            Email: user.email,
            Função: user.role,
            Setor: user.sector || '',
            Cargo: user.position || '',
            Status: user.status,
            Plataformas: user.userPlatforms.map(up => up.platform.name).join(', '),
            'Data de Criação': new Date(user.createdAt).toLocaleDateString('pt-BR'),
            'Última Atualização': new Date(user.updatedAt).toLocaleDateString('pt-BR')
        }));

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuários');

        // Set column widths
        worksheet['!cols'] = [
            { wch: 36 }, // ID
            { wch: 25 }, // Nome
            { wch: 30 }, // Email
            { wch: 10 }, // Função
            { wch: 20 }, // Setor
            { wch: 20 }, // Cargo
            { wch: 10 }, // Status
            { wch: 40 }, // Plataformas
            { wch: 15 }, // Data de Criação
            { wch: 18 }  // Última Atualização
        ];

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        const filename = `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', excelBuffer.length.toString());
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.send(excelBuffer);
    } catch (error) {
        console.error('Error exporting users:', error);
        res.status(500).json({ message: 'Error exporting users' });
    }
};
