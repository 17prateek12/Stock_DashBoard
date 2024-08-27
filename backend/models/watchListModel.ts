import mongoose, { model, Schema, Document, Types } from 'mongoose';
import { IUser } from './userModel';

export interface IWatchListItem {
    _id?:Types.ObjectId,
    symbol: string;
    addAt: Date;
}

export interface IWatchList extends Document {
    userId: Types.ObjectId | IUser;
    items: IWatchListItem[]; // Corrected type here
}

const watchListItemSchema: Schema = new Schema({
    symbol: {
        type: String,
        required: true,
        unique:true,
    },
    addAt: {
        type: Date,
        default: Date.now,
    },
});

const watchlistSchema: Schema<IWatchList> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: {
        type: [watchListItemSchema],
        default: [],
    },
}, {
    timestamps: true,
});

export default model<IWatchList>('WatchList', watchlistSchema);
