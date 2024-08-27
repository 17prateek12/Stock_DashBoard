import mongoose, { model,Schema,Document} from "mongoose";

interface IUser extends Document{
    username:string;
    email:string;
    password:string;
};

const userSchema:Schema = new Schema({
    username:{
        type:String,
        required:[true,"Please add the user name"],
    },
    email:{
        type:String,
        required:[true,"Please add user email address"],
        unique:[true,"Email  address already taken"]
    },
    password:{
        type:String,
        required:[true,"Please add the user password"],
    },
},{
    timestamps:true,
});


export {IUser};
export default model<IUser>("User",userSchema);