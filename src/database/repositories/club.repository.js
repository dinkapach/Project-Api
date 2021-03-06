import ClubModel from '../../models/club-model';
import CustomerModel from '../../models/user-model';
import CreditModel from '../../models/credit-model';

export default {
    addClub(club) {
        return ClubModel.create(club);
    },
    removeClub(clubObjectId) {
        return new Promise((resolve, reject) => {
            ClubModel.findOneAndRemove({ _id: clubObjectId })
                .exec(function (err, removed) {
                    CustomerModel.update(
                        {},
                        { $pull: { clubs: clubObjectId } },
                        { multi: true }, (err, obj) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(obj);
                        });
                });
        });
    },
    findClubById(id) {
        return new Promise((resolve, reject) => {
            ClubModel.findOne({ id: id }, (err, club) => {
                if (err) reject(err);
                else resolve(club);
            });
        });
    },
    updateClub(clubId, clubUpdate) {
        return new Promise((resolve, reject) => {
            ClubModel.findOneAndUpdate({ id: clubId }, clubUpdate, { upsert: true, new: true }, (err, obj) => {
                if (err) {
                    console.log(" in Update Club", err);
                    reject(err);
                }
                resolve(obj);
            });
        });
    },
    getClubWithPopulatedCustomers(clubObjectId) {
        return new Promise((resolve, reject) => {
            ClubModel.findOne({ _id: clubObjectId })
                .populate('usersClub.customerId'
                    ,'id firstName lastName email address phoneNumber birthday img')
                .then(customer => resolve(customer))
                .catch(err => reject(err));
        });
    },
    findClubByObjectId(id) {
        return new Promise((resolve, reject) => {
            ClubModel.findOne({ _id: id }, (err, club) => {
                if (err) reject(err);
                else resolve(club);
            });
        });
    },
    getAllClubs() {
        return new Promise((resolve, reject) => {
            ClubModel.find({}, (err, clubs) => {
                if (err) reject(err);
                else resolve(clubs);
            });
        });
    },
    getAllCredits() {
        return new Promise((resolve, reject) => {
            CreditModel.find({}, (err, credits) => {
                if (err) reject(err);
                else resolve(credits);
            });
        });
    },
    removeCustomerByCustomerId(club, customerId) {
        return new Promise((resolve, reject) => {
            club.userClub = club.userClub.filter(userClub => {
                return customerId != userClub.customerId;
            })
            ClubModel.findOneAndUpdate({ id: club.id }, club, { upsert: true, new: true }, (err, obj) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(obj);
            });
        });
    },
    addSale(club, sale) {
        club.sales.push(sale);
        club.save();
    },
    findSale(club, saleId) {
        return club.sales.find(sale => sale.id == saleId)
    },
    removeSale(clubId, saleId) {
        return new Promise((resolve, reject) => {
            ClubModel.update(
                { id: clubId },
                { $pull: { sales: { id: saleId } } },
                { safe: true },
                function removeConnectionsCB(err, obj) {
                    if (err) {
                        console.log("err", err);
                        reject(err);
                    }
                    resolve(obj);
                });
        });
    },
    removeUser(club, customerId) {
        let i = 0;
        let index = 0;
        club.usersClub.forEach(function (userClub) {
            if (userClub.customerId == customerId) {
                index = i;
            }
            i++;
        });
        club.usersClub.splice(index, 1);
        return new Promise((resolve, reject) => {
            ClubModel.findOneAndUpdate({ id: club.id }, club, { upsert: true, new: true }, (err, obj) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(obj);
            });
        });
    },
    addPointsToClub(club, customerId, points) {
        club.usersClub.forEach(function (userClub) {
            if (customerId.equals(userClub.customerId)) {
                userClub.points = parseInt(userClub.Points) + parseInt(points);
            }
        });
        club.save();
    },
    changeInfo(clubId, itemIndex, newItem) {
        this.findClubById(clubId)
            .then(club => {
                if (club) {
                    club[itemIndex] = newItem;
                    club.save();
                }
                else { console.log("club not found"); }
            })
            .catch(err => { console.log(err); });
    },
    changeSaleInfo(clubId, saleId, itemIndex, newItem) {
        this.findClubById(clubId)
            .then(club => {
                if (club) {
                    let sale = this.findSale(club, saleId)
                    if (sale) {
                        sale[itemIndex] = newItem;
                        club.save();
                    }
                    else {
                        console.log("Sale wasnt found");
                    }

                }
                else { console.log("Club not found"); }
            })
            .catch(err => { console.log(err); });
    },
    addBranch(clubId, branchId) {
        this.findClubById(clubId)
            .then(club => {
                if (club) {
                    this.findClubById(branchId)
                        .then(branch => {
                            if (branch) {
                                if (club.branches.indexOf(branch._id) == -1) {
                                    club.branches.push(branch._id);
                                    club.save();
                                }
                            }
                            else { console.log("Branch wasnt found"); }
                        })
                        .catch(err => { console.log(err); })
                }
                else { console.log("Club wasnt found"); }
            })
            .catch(err => { console.log(err); });
    },
    removeBranch(clubId, branchId) {
        this.findClubById(clubId)
            .then(club => {
                if (club) {
                    this.findClubById(branchId)
                        .then(branch => {
                            if (branch) {
                                let index = club.branches.indexOf(branch._id);
                                club.branches.splice(index, 1);
                                club.save();
                            }
                            else { console.log("Branch wasnt found"); }
                        })
                        .catch(err => { console.log(err); })
                }
                else { console.log("Club wasnt found"); }
            })
            .catch(err => { console.log(err); });
    }
}