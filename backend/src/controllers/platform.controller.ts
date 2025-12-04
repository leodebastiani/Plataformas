import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { convertToCSV } from '../utils/export.utils';

const prisma = new PrismaClient();

// Controller for Platform operations

export const getPlatforms = async (req: AuthRequest, res: Response) => {
    try {
        const { sector, status, expiring } = req.query;

        const where: any = {};
        // Filter by sector name if provided (needs to check related sectors)
        if (sector) {
            where.sectors = {
                some: {
                    name: sector as string
                }
            };
        }
        if (status) where.status = status;

        let platforms = await prisma.platform.findMany({
            where,
            include: {
                userPlatforms: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                sectors: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        // Transform to match expected format
        const transformedPlatforms = platforms.map(platform => ({
            ...platform,
            users: platform.userPlatforms.map(up => up.user),
            userPlatforms: undefined
        }));

        // Filter expiring platforms (within 30 days)
        if (expiring === 'true') {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            const filtered = transformedPlatforms.filter(p =>
                p.expirationDate && p.expirationDate <= thirtyDaysFromNow
            );
            res.json(filtered);
        } else {
            res.json(transformedPlatforms);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching platforms' });
    }
};

export const createPlatform = async (req: AuthRequest, res: Response) => {
    const { name, description, sectors, licenseType, expirationDate, status } = req.body;
    try {
        const platform = await prisma.platform.create({
            data: {
                name,
                description,
                licenseType,
                expirationDate: expirationDate ? new Date(expirationDate) : null,
                status,
                sectors: {
                    connect: sectors ? sectors.map((id: string) => ({ id })) : []
                }
            },
            include: {
                sectors: true,
                userPlatforms: {
                    include: {
                        user: true
                    }
                }
            }
        });

        // Transform response
        const transformedPlatform = {
            ...platform,
            users: platform.userPlatforms.map(up => up.user),
            userPlatforms: undefined
        };
        res.status(201).json(transformedPlatform);
    } catch (error) {
        res.status(500).json({ message: 'Error creating platform' });
    }
};

export const updatePlatform = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, description, sectors, licenseType, expirationDate, status } = req.body;
    try {
        const platform = await prisma.platform.update({
            where: { id },
            data: {
                name,
                description,
                licenseType,
                expirationDate: expirationDate ? new Date(expirationDate) : null,
                status,
                sectors: {
                    set: sectors ? sectors.map((id: string) => ({ id })) : []
                }
            },
            include: {
                sectors: true,
                userPlatforms: {
                    include: {
                        user: true
                    }
                }
            }
        });

        // Transform response
        const transformedPlatform = {
            ...platform,
            users: platform.userPlatforms.map(up => up.user),
            userPlatforms: undefined
        };
        res.json(transformedPlatform);
    } catch (error) {
        res.status(500).json({ message: 'Error updating platform' });
    }
};

export const deletePlatform = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        // Check if platform exists
        const platform = await prisma.platform.findUnique({ where: { id } });
        if (!platform) {
            return res.status(404).json({ message: 'Platform not found' });
        }

        // Delete platform (cascade will handle UserPlatform relations)
        await prisma.platform.delete({ where: { id } });
        res.json({ message: 'Platform deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting platform:', error);
        res.status(500).json({
            message: 'Error deleting platform',
            error: error.message
        });
    }
};

export const exportPlatforms = async (req: AuthRequest, res: Response) => {
    try {
        const XLSX = require('xlsx');

        const platforms = await prisma.platform.findMany({
            include: {
                userPlatforms: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                sectors: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Transform data for export
        const exportData = platforms.map(platform => ({
            ID: platform.id,
            Nome: platform.name,
            Descrição: platform.description || '',
            'Tipo de Licença': platform.licenseType,
            'Quantidade de Licenças': platform.licenseQuantity || 'N/A',
            'Data de Expiração': platform.expirationDate ? new Date(platform.expirationDate).toLocaleDateString('pt-BR') : '',
            Status: platform.status,
            Setores: platform.sectors.map(s => s.name).join(', '),
            Usuários: platform.userPlatforms.map(up => up.user.name).join(', '),
            'Data de Criação': new Date(platform.createdAt).toLocaleDateString('pt-BR'),
            'Última Atualização': new Date(platform.updatedAt).toLocaleDateString('pt-BR')
        }));

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Plataformas');

        // Set column widths
        worksheet['!cols'] = [
            { wch: 36 }, // ID
            { wch: 25 }, // Nome
            { wch: 40 }, // Descrição
            { wch: 15 }, // Tipo de Licença
            { wch: 20 }, // Quantidade de Licenças
            { wch: 18 }, // Data de Expiração
            { wch: 10 }, // Status
            { wch: 30 }, // Setores
            { wch: 40 }, // Usuários
            { wch: 15 }, // Data de Criação
            { wch: 18 }  // Última Atualização
        ];

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        const filename = `plataformas_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', excelBuffer.length.toString());
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.send(excelBuffer);
    } catch (error) {
        console.error('Error exporting platforms:', error);
        res.status(500).json({ message: 'Error exporting platforms' });
    }
};
