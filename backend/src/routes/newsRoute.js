const express = require('express');
const {createNews, getNewsDetails, getAllNews, getEditorNews, updateNews, deleteNews} = require('../controllers/newsController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();
const upload = require('../middleware/fileUpload')

// create product --> Admin access
router.post('/news/create',isAuthenticatedUser,authorizeRoles("editor","admin"),upload.array("images", 10),createNews)

// get single Product details
router.get('/news/:id',getNewsDetails);

// getting all products
router.get('/news',getAllNews);

// getting all products of seller
router.get('/editor/news/:editorId',isAuthenticatedUser,authorizeRoles("editor","admin"),getEditorNews);

// update the product  -- Admin
router.put('/news/:id',isAuthenticatedUser,authorizeRoles("editor","admin"),updateNews);

// delete the product -- Admin
router.delete('/news/:id',isAuthenticatedUser,authorizeRoles("editor","admin"),deleteNews);


module.exports = router