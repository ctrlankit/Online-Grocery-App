import mongoose  from "mongoose";


const authTokenSchema = new mongoose.Schema({
    token : {type : String,required : true},
    clientId : {type : String,required : true},
    revoked : {type: Boolean,required : true}},
    {timestamps: true 
});

export default mongoose.model("AuthToken",authTokenSchema);