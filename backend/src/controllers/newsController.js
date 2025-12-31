const News = require('../models/newsModel')
const Errorhandler = require('../utils/errorhander')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const ApiFeatures = require('../utils/apiFeatures')
const cloudinary = require('../config/cloudinary')

exports.createNews = catchAsyncError(async(req,res) =>{

    // assigning value of req.body.user as the id of loggedin user (i.e id of logged in user will be req.user.id)
    const editor = req.user.id;
    const { title, description, category, videoUrl, subCategories } = req.body;

    const images = req.files ? req.files.map((file) => file.path) : [];

    if (!title || !description || !category ) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required including at least one image.'
        });
    }

    const news = await News.create({ title, description, videoUrl, editor, images, category, subCategories: subCategories || [], comments: []});

    res.status(201).json({
        success:true,
        news
    });
})

// for getting all products
exports.getAllNews = catchAsyncError(async(req,res) =>{
    
    const resultPerPage = req?.query?.limit || 20;
    const currentPage = Number(req.query.page) || 1;

    if(req?.query?.category === 'all'){
        req.query.category = { $in: ['National', 'World', 'Sports', 'Education', 'Entertainment'] };
    }

    const apiFeaturesForCount = new ApiFeatures(News.find(), req.query,['editor'])
        .search()
        .filter();

    const totalCount = await apiFeaturesForCount.query.clone().countDocuments();

    const apiFeatures = new ApiFeatures(News.find(),req.query,['editor'])
    .search()     // search function
    .filter()     // filter function on category,price,rating
    .pagination(resultPerPage);    // total result to show in 1 page

    // const products = await Product.find();  // now instead of this do below line due to search feature
    const news = await apiFeatures.query;
    const totalPages = Math.ceil(totalCount / resultPerPage);

    res.status(200).json({
        success:true,
        news,
        totalCount,
        totalPages,
        currentPage,
        hasMore: currentPage < totalPages
    });
})

// get all products of seller
exports.getEditorNews = catchAsyncError(async (req, res, next) => {
    const { editorId } = req.params;

    if (!editorId) {
        return next(new Errorhandler("editor ID is required", 400));
    }

    if(req?.query?.category === 'all'){
        req.query.category = { $in: ['National', 'World', 'Sports', 'Education', 'Entertainment'] };
    }

    const newsCount = await News.countDocuments({ editor: editorId });

    const apiFeatures = new ApiFeatures(News.find({ editor: editorId }), req.query,['editor'])
        .search()    // Apply search function
        .filter();   // Apply filters (category, price, rating)

    const news = await apiFeatures.query;

    res.status(200).json({
        success: true,
        news,
        newsCount
    });
});


// Get news details
exports.getNewsDetails=catchAsyncError(async(req,res,next)=>{
    let news = await News.findById(req.params.id).populate('editor');
    
    if(!news){
        return next(new Errorhandler("News Not Found",404));
    }
    res.status(200).json({
        success:true,
        news,
    })
})

// for updating the product - Admin -->
exports.updateNews = catchAsyncError(
    async(req,res) =>{
    let news = await News.findById(req.params.id);
    
    if(!news){
        return res.status(404).json({
            success:false,
            message:"News not found"})
    }
    news = await News.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        news
    })
})

// Delete the product - Admin -->
exports.deleteNews = catchAsyncError(async (req, res) => {
    const news = await News.findById(req.params.id);

    if (!news) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    // Delete images from Cloudinary
    if (news.images && news.images.length > 0) {
        const deletePromises = news.images.map(async (imageUrl) => {

            // Extracting public_id from the Cloudinary URL
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`social_media_task/${publicId}`);

        });

        await Promise.all(deletePromises);
    }

    await News.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "News Deleted Successfully"
    });
});

// toggle like / unlike for a news post
exports.likeNews = catchAsyncError(async (req, res, next) => {
    const newsId = req.params.id;
    const userId = req.user.id; // requires isAuthenticatedUser to set req.user
  
    // find news
    const news = await News.findById(newsId);
    if (!news) {
      return next(new Errorhandler("News not found", 404));
    }
  
    // check if already liked by this user
    const alreadyLiked = news.likes.some(l => l.user.toString() === userId.toString());
  
    if (alreadyLiked) {
      // unlike: remove the like entry
      news.likes = news.likes.filter(l => l.user.toString() !== userId.toString());
      await news.save();
  
      return res.status(200).json({
        success: true,
        message: "News unliked",
        likesCount: news.likes.length,
      });
    } else {
      // like: add the like entry
      news.likes.push({ user: userId });
      await news.save();
  
      return res.status(200).json({
        success: true,
        message: "News liked",
        likesCount: news.likes.length,
      });
    }
  });
  
