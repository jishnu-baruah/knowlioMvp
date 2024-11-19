// lib/mongodb.ts
import mongoose from 'mongoose';

// @ts-ignore - Ignore global type declarations
declare global {
    var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// @ts-ignore - Ignore cached type checking
let cached = global.mongoose || {
    conn: null,
    promise: null,
};

if (!global.mongoose) {
    // @ts-ignore - Ignore global assignment
    global.mongoose = cached;
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export async function disconnectFromDatabase() {
    if (cached.conn) {
        await mongoose.disconnect();
        cached.conn = null;
        cached.promise = null;
    }
}

export function getDatabaseConnection() {
    return cached.conn;
}