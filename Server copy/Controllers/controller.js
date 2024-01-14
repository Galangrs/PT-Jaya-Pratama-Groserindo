const bcrypt = require("bcrypt");
const { User, History } = require("../models/");
const JWT = require("../Helpers/Jsonwebtoken");
const XLSX = require("xlsx");
const { Op } = require("sequelize");

class Controller {
    static async Register(req, res, next) {
        const { email, password, username } = req.body;
        try {
            if (!email || !password || !username) {
                throw {
                    name: "BadRequest",
                    message: "Email, password and username must be filled",
                };
            }
            const userData = await User.create({
                email,
                name: username,
                password: bcrypt.hashSync(password, 10),
            });
            res.status(201).json({
                message: `Account ${username} created successfully`,
            });
        } catch (error) {
            next(error);
        }
    }

    static async Login(req, res, next) {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                throw {
                    name: "BadRequest",
                    message: "Email and password must be filled",
                };
            }
            const userData = await User.findOne({
                where: {
                    email,
                },
            });
            if (userData.dataValues) {
                const hasilBcrypt = bcrypt.compareSync(
                    password,
                    userData.password
                );
                if (hasilBcrypt) {
                    res.status(200).json({
                        message: `Welcome ${userData.name}`,
                        jwt: JWT.sign({
                            id: userData.id,
                            username: userData.name,
                            email: userData.email,
                        }),
                    });
                } else {
                    throw {
                        name: "BadRequest",
                        message: "Invalid email/password",
                    };
                }
            } else {
                throw {
                    name: "BadRequest",
                    message: "Invalid email/password",
                };
            }
        } catch (error) {
            next(error);
        }
    }

    static async CreateHistory(req, res, next) {
        const { sales, nominal, due_date } = req.body;
        try {
            if (!sales || !nominal || !due_date) {
                throw {
                    name: "BadRequest",
                    message: "Sales, nominal and due date must be filled",
                };
            }
            if (Number(nominal) != nominal && nominal >= 0) {
                throw {
                    name: "BadRequest",
                    message: "Nominal must be a positive number",
                };
            }
            const historyData = await History.create({
                nominal,
                date: due_date,
                sales,
                createor: req.userData.username,
            });
            res.status(201).json({
                message: "History created successfully",
                data: historyData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async GenerateSalesReport(req, res, next) {
        const { startDate, endDate } = req.body;
        const requestor = `${req.userData.username}(${req.userData.email})`;
        try {
            if (!startDate || !endDate) {
                throw {
                    name: "BadRequest",
                    message: "Start date and end date must be filled",
                };
            }
            if (startDate > endDate) {
                throw {
                    name: "BadRequest",
                    message: "Start date must be less than end date",
                };
            }
            const formattedStartDate = new Date(startDate).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
            );
            const formattedEndDate = new Date(endDate).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
            );

            const salesReportRequest = {
                requestor: requestor,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            };
            const users = await User.findAll();

            const worksheet = XLSX.utils.aoa_to_sheet([
                ["Requestor", salesReportRequest.requestor],
                [],
                ["Start Date", salesReportRequest.startDate],
                ["End Date", salesReportRequest.endDate],
                [],
                [
                    "User",
                    "Jumlah Hari Kerja",
                    "Jumlah Transaksi Barang",
                    "Jumlah Transaksi Jasa",
                    "Nominal Transaksi Barang",
                    "Nominal Transaksi Jasa",
                ],
            ]);
            for (const user of users) {
                const Histories = await History.findAll({
                    where: {
                        createor: user.name,
                        date: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                });

                const jumlahHariKerja = Histories.length;
                const jumlahTransaksiBarang = Histories.filter(
                    (t) => t.sales === "Barang"
                ).length;
                const jumlahTransaksiJasa = Histories.filter(
                    (t) => t.sales === "Jasa"
                ).length;
                const nominalTransaksiBarang = Histories.filter(
                    (t) => t.sales === "Barang"
                ).reduce((total, t) => total + t.nominal, 0);
                const nominalTransaksiJasa = Histories.filter(
                    (t) => t.sales === "Jasa"
                ).reduce((total, t) => total + t.nominal, 0);
                XLSX.utils.sheet_add_aoa(
                    worksheet,
                    [
                        [
                            user.name,
                            jumlahHariKerja,
                            jumlahTransaksiBarang,
                            jumlahTransaksiJasa,
                            nominalTransaksiBarang,
                            nominalTransaksiJasa,
                        ],
                    ],
                    { origin: -1 }
                );
            }

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

            const excelBuffer = XLSX.write(workbook, {
                type: "buffer",
                bookType: "xlsx",
                bookSST: true,
                compression: true,
                defaultEncoding: "utf-8",
            });

            res.setHeader(
                "Content-Disposition",
                "attachment; filename=SalesReport.xlsx"
            );
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8"
            );
            res.send(excelBuffer);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
