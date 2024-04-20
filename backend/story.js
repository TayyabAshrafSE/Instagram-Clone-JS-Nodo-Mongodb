import DB from "../db.js";
import User from "./user.js";

export default class Story {
    async create(request) {
        const user = DB.collection('user');
        const story = DB.collection('story');

        const currentUser = await user.findOne({ session: request.cookies.session });

        const uuid = crypto.randomUUID();
        const description = request.body.description;

        const doc = {
            userId: currentUser._id,
            uuid,
            description,
            timestamp: (Date.now() / 1000),
            viewCount: 0,
            likeCount: 0,
            shareCount: 0
        };

        await story.insertOne(doc);

        return uuid;
    }

    async list(session) {
        const user = new User();
        const follow = DB.collection('follow');

        const currentUser = await user.currentUser(session, true);

        const pipeline = [
            {
                $match: { follower: currentUser._id }
            },
            {
                $lookup: {
                    from: 'story',
                    localField: 'following',
                    foreignField: 'userId',
                    as: 'stories'
                }
            },
            { $unwind: '$stories' },
            { $match: { 'stories.timestamp': { $gte: ((Date.now() / 1000).toFixed(0) - 86400) } } },
            { $project: { 'stories._id': 0 } },
            {
                $project: {
                    _id: 0,
                    story: '$stories'
                }
            },
            { $sort: { 'story.timestamp': -1 } }
        ];

        const stories = await follow.aggregate(pipeline).toArray();

        return stories;
    }

    async one(request) {
        const story = DB.collection('story');
        const user = DB.collection('user');

        const currentUser = await user.findOne({ session: request.cookies.session });

        const pipeline = [
            {
                $match: { uuid: request.params.uuid }
            },
            {
                $lookup: {
                    from: 'like',
                    let: { storyId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$storyId', '$$storyId'] },
                                        { $eq: ['$userId', currentUser._id] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'isLiked'
                }
            },
            {
                $addFields: {
                    isLiked: { $cond: { if: { $gt: [{ $size: '$isLiked' }, 0] }, then: true, else: false } }
                }
            },
            {
                $project: {
                    _id: 0
                }
            }
        ];

        // const doc = await story.findOne({ uuid }, { _id: 0 });

        const doc = await story.aggregate(pipeline).toArray();

        await story.updateOne({ uuid: request.params.uuid }, { $set: { viewCount: doc[0].viewCount + 1  } });

        return doc[0];
    }

    async toggleLike(request) {
        const user = DB.collection('user');
        const story = DB.collection('story');
        const like = DB.collection('like');

        const currentUser = await user.findOne({ session: request.cookies.session });
        const currentStory = await story.findOne({ uuid: request.body.uuid });

        const likeData = {
            userId: currentUser._id,
            storyId: currentStory._id
        };

        const likeDoc = await like.findOne(likeData);

        if (likeDoc === null) {
            await like.insertOne(likeData);

            await story.updateOne({
                _id: currentStory._id
            }, {
                $set: { likeCount: currentStory.likeCount + 1 }
            });

            return {
                isLiked: 1,
                count: currentStory.likeCount + 1
            };
        } else {
            await like.deleteOne(likeData);

            await story.updateOne({
                _id: currentStory._id
            }, {
                $set: { likeCount: currentStory.likeCount - 1 }
            });

            return {
                isLiked: 0,
                count: currentStory.likeCount - 1
            };
        }
    }
}