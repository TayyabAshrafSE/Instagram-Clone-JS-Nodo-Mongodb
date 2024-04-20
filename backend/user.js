import DB from "../db.js";
export default class User {
    async create(request) {
        // Validate inputs
        if (!request.full_name.match(/^[a-z ]+$/i)) {
            throw new Error('Invalid fullname');
        }

        if (!request.email.match(/^[a-z0-9-_\.]+@[a-z0-9-_\.]+\.[a-z0-9-_\.]+$/i)) {
            throw new Error('Invalid email address');
        }

        if (!request.dob.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i)) {
            throw new Error('Invalid date of birth');
        }
        
        if (!request.password.match(/^[0-9a-z-_\!@#\$%\^\&\*\(\)]{8,}$/i)) {
            throw new Error('Invalid password');
        }

        // Selecting collection
        const user = DB.collection('user');
        
        const duplicateUser = await user.findOne({
            $or: [
                {
                    misis: request.misis
                },
                {
                    email: request.email
                }
            ]
        });

        if (duplicateUser !== null) {
            throw new Error('User already exists!');
        }
        

        // Creating document to insert
        const newUser = {
            fullName: request.full_name,
            misis: request.misis,
            dob: request.dob,
            email: request.email,
            password: request.password,
            status: null,
            session: null,
        };

        const result = await user.insertOne(newUser);

        // Return result containing inserted id
        return result;
    }

    async login(email) {
        const user = DB.collection('user');

        const responseUser = await user.findOne({ email });

        const sessionUuid = crypto.randomUUID();

        if (responseUser === null) {
            throw new Error('User doesn\'t exist');
        }

        await user.updateOne({ _id: responseUser._id }, { $set: { session: sessionUuid } });

        responseUser.session = sessionUuid;

        return responseUser;
    }

    async search(request) {
        const user = DB.collection('user');

        const users = [];

        const wildcard = RegExp(`.*${request}.*`, "i");

        const filter = {
            $or: [
                { fullName: wildcard },
                { email: wildcard },
                { misis: wildcard }
            ]
        };
        
        const docs = user.find(filter, {projection: { _id: 0, fullName: 1, misis: 1 }});

        for await (const doc of docs) {
            users.push(doc);
        }

        return users;
    }

    async profile(request) {
        const user = DB.collection('user');

        const currentUser = await this.currentUser(request.cookies.session, true);

        const pipeline = [
            { $match: { misis: request.params.misis } },
            {
                $lookup: {
                    from: 'follow',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$follower', currentUser._id] },
                                        { $eq: ['$following', '$$userId'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'isFollowing'
                }
            },
            {
                $addFields: {
                    isFollowing: { $cond: { if: { $gt: [{ $size: '$isFollowing' }, 0] }, then: true, else: false } }
                }
            },
            {
                $project: { _id: 0 }
            }
        ];

        return await user.aggregate(pipeline).next();
    }

    async currentUser(session, includeId = false) {
        const user = DB.collection('user');

        return await user.findOne({ session: `${session}` }, includeId ? { _id: 1 } : { _id: 0, password: 0 });
    }

    async idFromMisis(misis) {
        const user = DB.collection('user');

        return await user.findOne({ misis }, { projection: { _id: 1 } });
    }

    async toggleFollow(request) {
        const user = DB.collection('user');
        const follow = DB.collection('follow');

        const currentUser = await this.currentUser(request.cookies.session, true);
        const followingUser = await user.findOne({ misis: request.params.misis }, { _id: 1 });
        
        const doc = await follow.findOne({
            follower: currentUser._id,
            following: followingUser._id
        });

        if (doc === null) {
            await follow.insertOne({
                follower: currentUser._id,
                following: followingUser._id
            });

            return 1;
        } else {
            await follow.deleteOne({
                follower: currentUser._id,
                following: followingUser._id
            });

            return 0;
        }
    }

    async followingList(request) {
        const follow = DB.collection('follow');

        const currentUser = await this.currentUser(request.cookies.session, true);

        const pipeline = [
            { $match: { follower: currentUser._id } },
            {
                $lookup: {
                    from: 'user',
                    localField: 'following',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    _id: 0,
                    user: 1
                }
            }
        ];

        const docs = await follow.aggregate(pipeline).toArray();

        return docs;
    }

    async updateStatus(request) {
        const user = DB.collection('user');

        const currentUser = await this.currentUser(request.cookies.session, true);

        await user.updateOne(
            { _id: currentUser._id },
            { $set: { status: `${request.body.verb} *${request.body.noun}*` } }
        );
    }

    async addMessage(senderId, receiverId, message) {
        const messageCollection = DB.collection('message');

        messageCollection.insertOne({
            senderId: senderId,
            receiverId: receiverId,
            timestamp: Date.now(),
            message
        });
    }

    async getMessage(senderId, receiverId, lastTimestamp) {
        const messageCollection = DB.collection('message');

        return await messageCollection.aggregate([
            {
                $match: {
                    $or: [
                        {
                            senderId,
                            receiverId,
                            timestamp: { $gt: lastTimestamp }
                        },
                        {
                            senderId: receiverId,
                            receiverId: senderId,
                            timestamp: { $gt: lastTimestamp }
                        }
                    ]
                }
            },
            {
                $limit: 1000
            }
        ]).toArray();
    }
}