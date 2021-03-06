import mongoose from 'mongoose';
import { UserClubSchema } from './user-club-model';
import { SaleSchema } from './sale-model';
import { userSchema } from './user-model';
import ManagerModel from './manager-model'
import ClubModelValidator from './validations/club-model-schema-validations';

const Schema = mongoose.Schema;

const ClubSchema = new Schema({
    id: Number,
    name: String,
    address: String,
    phoneNumber: String,
    img: String,
    openingHours: [String, String],
    usersClub: [UserClubSchema],
    sales: [SaleSchema],
    branches: [mongoose.Schema.Types.ObjectId],
    isManual: Boolean
});

const ClubsApiSchema = new Schema({
    clubId : mongoose.Schema.Types.ObjectId,
    endpoint: String,  // url
});


ClubModelValidator.runClubModelValidations(ClubSchema); 
 export { ClubSchema, ClubsApiSchema };
 export default mongoose.model('Club', ClubSchema);
