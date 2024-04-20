import express from 'express';
import path from 'path';
import multer from 'multer';
import expressWs from 'express-ws';
import User from './backend/user.js';
import Story from './backend/story.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const __dirname = import.meta.dirname;

const app = express();
expressWs(app);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, "frontend", "static")));


const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, "frontend/static/user");
    },
    filename: function (request, file, cb) {
        const users = new User();
        users.currentUser(request.cookies.session).then(user => {
            cb(null, user.misis + ".jpg");
        }).catch(err => {
            cb(err);
        });
    },
});

const fileFilter = function (request, file, cb) {
    const filetypes = /jpeg|jpg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error("This file type is not accepted! Allowed filetypes - " + filetypes));
    }
};

const uploadProfilePicture = multer({
    storage: storage,
    limits: { fileSize: 5 * 1000 * 1000 },
    fileFilter: fileFilter
}).single("image");

const uploadStory = multer({
    storage: multer.diskStorage({
        destination: function (request, file, cb) {
            cb(null, "frontend/static/story");
        },
        filename: async function (request, file, cb) {
            
            const user = new User();
            const story = new Story();
            
            const uuid = await story.create(request);

            cb(null, uuid + ".jpg");
            
            await user.updateStatus(request);
        },
    }),
    limits: { fileSize: 5 * 1000 * 1000 },
    fileFilter: function (request, file, cb) {
        const filetypes = /jpeg|jpg/;
        const mimetype = filetypes.test(file.mimetype);
 
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
 
        if (mimetype && extname) {
            return cb(null, true);
        }
 
        cb("This file type is not accepted! Allowed filetypes - " + filetypes);
    }
}).single("image");



app.post("/M00853622/signup", async (request, response) => {
    try {
        const users = new User();

        const result = await users.create(request.body);

        response.send({
            status: 'success',
            message: `Signup successful`
        });
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.post("/M00853622/login", async (request, response) => {
    try {
        const users = new User();
    
        const user = await users.login(request.body.email);
        
        if (user.password !== request.body.password) {
            throw new Error("Incorrect credentials");
        }

        response.cookie('session', user.session);
        
        response.send({
            status: 'success',
            message: 'You\'re logged in'
        });
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.post("/M00853622/upload-profile-picture", async function (request, response) {
    try {
        uploadProfilePicture(request, response, async function (err) {
            if (err) {
                throw new Error('Something went wrong. Please try again later!');
            } else {
                response.send({
                    status: 'success',
                    message: 'Profile picture updated!'
                });
            }
        });

    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.get("/M00853622/search/:attribute", async (request, response) => {
    try {

        const users = new User();

        const userList = await users.search(request.params.attribute);

        response.send(userList);
        
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.get("/M00853622/profile/:misis", async (request, response) => {
    try {
        const users = new User();

        const user = await users.profile(request);

        response.send(user);
        
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.get("/M00853622/current-user", async (request, response) => {
    try {
        const users = new User();

        const user = await users.currentUser(request.cookies.session);

        response.send(user);
    
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.get("/M00853622/toggle-follow/:misis", async (request, response) => {
    try {

        const users = new User();

        const isFollowing = await users.toggleFollow(request);

        response.send({
            status: 'success',
            message: isFollowing === 1 ? 'Followed' : 'Unfollowed',
            isFollowing
        });
        
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.get("/M00853622/following-list", async (request, response) => {
    try {

        const users = new User();
        
        const followingList = await users.followingList(request);
        
        response.send(followingList);
        
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.post("/M00853622/update-status", async (request, response) => {
    try {

        const users = new User();

        await users.updateStatus(request);

        response.send({
            status: 'success',
            message: 'Status updated'
        });
        
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.post("/M00853622/upload-story", async function (request, response) {
    try {
        uploadStory(request, response, async function (err) {
            if (err) {
                response.send({
                    status: 'error',
                    message: 'Something went wrong. Please try again later!'
                });
            } else {
                response.send({
                    status: 'success',
                    message: 'Story uploaded!'
                });
            }
        });

    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.get("/M00853622/stories", async function (request, response) {
    try {
        const story = new Story();

        const list = await story.list(request.cookies.session);

        response.send(list);
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.get("/M00853622/story/:uuid", async function (request, response) {
    try {
        const story = new Story();

        response.send(await story.one(request));
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.post("/M00853622/toggle-like", async function (request, response) {
    try {
        const story = new Story();

        const likeDoc = await story.toggleLike(request);

        response.send({
            status: 'success',
            message: likeDoc.isLiked === 1 ? 'Liked' : 'Unliked',
            isLiked: likeDoc.isLiked,
            count: likeDoc.count
        });
    } catch (e) {
        response.send({
            status: 'error',
            message: e.message
        });
    }
});

app.ws('/M00853622/message', async (ws, request) => {
    const user = new User();
    const currentUser = await user.currentUser(request.cookies.session, true);
    const receiverUser = {};
    let lastReceiver = null;
    let lastTimestamp = Date.now() - 86400000;
    
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            if (!receiverUser.hasOwnProperty(data.user)) {
                receiverUser[data.user] = (await user.idFromMisis(data.user))._id;
            }
    
            lastReceiver = receiverUser[data.user];
            
            if (data.hasOwnProperty('message') && data.message !== '') {
                await user.addMessage(currentUser._id, receiverUser[data.user], data.message);
            }
        } catch (e) {
            throw e;
        }
    });

    setInterval(async () => {
        if (lastReceiver === null) return;

        const messages = await user.getMessage(currentUser._id, lastReceiver, lastTimestamp);

        if (messages.length > 0) {
            lastTimestamp = messages[messages.length - 1].timestamp;

            const response = [];

            messages.forEach(message => {
                if (currentUser._id.equals(message.senderId)) {
                    response.push({
                        you: message.message
                    });
                } else {
                    response.push({
                        user: message.message
                    });
                }
            });

            ws.send(JSON.stringify(response));
        }
    }, 1000);
});

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));