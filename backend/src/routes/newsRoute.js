const express = require('express');
const {createNews, getNewsDetails, getAllNews, getEditorNews, updateNews, deleteNews, likeNews, addComment, deleteComment, toggleNewsApproval, getAllApprovedNews} = require('../controllers/newsController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();
const uploadBoth = require('../middleware/upload')

// create news --> Admin access
router.post('/news/create',isAuthenticatedUser,authorizeRoles("editor","admin"),uploadBoth.fields([
    { name: "images", maxCount: 6 },
    { name: "video", maxCount: 1 },
  ]), createNews)

// getting approved news news
router.get('/news',getAllApprovedNews);

// getting all news
router.get('/news/admin',isAuthenticatedUser,authorizeRoles("admin"),getAllNews);

// get single news details
router.get('/news/:id',getNewsDetails);

// getting all news of seller
router.get('/editor/news/:editorId',isAuthenticatedUser,authorizeRoles("editor","admin"),getEditorNews);

// update the news  -- Admin
router.put('/news/:id',isAuthenticatedUser,authorizeRoles("editor","admin"),updateNews);

// like / unlike a news post (toggle)
router.put('/news/:id/like', isAuthenticatedUser, likeNews);

// delete the news -- Admin
router.delete('/news/:id',isAuthenticatedUser,authorizeRoles("editor","admin"),deleteNews);

// comment on news
router.post('/news/:id/comment',isAuthenticatedUser,addComment);

// delete own comment
router.delete('/news/:id/comment/:commentId',isAuthenticatedUser,deleteComment);

// update status of news
router.put("/news/:id/approve",isAuthenticatedUser,authorizeRoles("admin"),toggleNewsApproval);



module.exports = router