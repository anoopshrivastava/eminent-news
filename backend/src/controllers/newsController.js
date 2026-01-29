const News = require('../models/newsModel')
const Errorhandler = require('../utils/errorhander')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const ApiFeatures = require('../utils/apiFeatures')
const cloudinary = require('../config/cloudinary')

const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "social_media_task" },
      (err, res) => (err ? reject(err) : resolve(res))
    ).end(buffer);
  });

const uploadVideo = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "news/videos",
        transformation: [{ quality: "auto" }],
          eager: [
            {
              width: 720,
              height: 1280,
              crop: "limit",
              format: "mp4",
              quality: "auto",
            },
            {
              width: 480,
              height: 854,
              crop: "limit",
              format: "mp4",
              quality: "auto",
            },
          ],
          eager_async: true,
      },
      (err, res) => (err ? reject(err) : resolve(res))
    ).end(buffer);
  });

exports.createNews = async (req, res) => {
  const editor = req.user._id;
  const { title, description, category, subCategories, videoUrl2 } = req.body;

  const imageUploads = await Promise.all(
    (req.files.images || []).map((img) => uploadImage(img.buffer))
  );

  let videoUrl = null;
  let videoPublicId = null;

  if (req.files.video?.[0]) {
    const videoRes = await uploadVideo(req.files.video[0].buffer);
    videoUrl = videoRes.secure_url;
    videoPublicId = videoRes.public_id;
  }

  const news = await News.create({
    title,
    description,
    category,
    editor,
    images: imageUploads.map((i) => i.secure_url),
    videoUrl,
    videoPublicId,
    videoUrl2,
    subCategories: subCategories || [],
  });

  res.json({ success: true, news });
};


// exports.createNews = catchAsyncError(async (req, res) => {
//   const editor = req.user._id;
//   console.log("r",req.body);
//   const { title, description, category, subCategories } = req.body;

//   // images (multiple)
//   const images = req.files?.images ? req.files.images.map((file) => file.path) : [];

//   if (!title || !description || !category) {
//     return res.status(400).json({
//       success: false,
//       message: "Title, description and category are required",
//     });
//   }

//   let uploadedVideoUrl = null;
//   let videoPublicId = null;

//   // Upload video if present
//   if (req.files?.video?.[0]) {
//     console.log("reached2")
//     await new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           resource_type: "video",
//           folder: "news/videos",
//           transformation: [{ quality: "auto" }],
//           eager: [
//             {
//               width: 720,
//               height: 1280,
//               crop: "limit",
//               format: "mp4",
//               quality: "auto",
//             },
//             {
//               width: 480,
//               height: 854,
//               crop: "limit",
//               format: "mp4",
//               quality: "auto",
//             },
//           ],
//           eager_async: true,
//         },
//         (error, result) => {
//           if (error) {
//             reject(error);
//           } else {
//             uploadedVideoUrl = result.secure_url;
//             videoPublicId = result.public_id;
//             resolve();
//           }
//         }
//       );

//       uploadStream.end(req.files.video[0].buffer);
//     });
//   }
//   console.log("reached3")

//   //  Create news with uploaded video URL
//   const news = await News.create({
//     title,
//     description,
//     category,
//     editor,
//     images,
//     videoUrl: uploadedVideoUrl,
//     videoPublicId,
//     subCategories: subCategories || [],
//     comments: [],
//   });

//   res.status(201).json({
//     success: true,
//     message: "News created successfully",
//     news,
//   });
// });

// for getting all news
exports.getAllApprovedNews = catchAsyncError(async(req,res) =>{
    
    const resultPerPage = req?.query?.limit || 10;
    const currentPage = Number(req.query.page) || 1;

    req.query.isApproved = true;

    if(req?.query?.category === 'all'){
        req.query.category = { $in: ['National', 'World', 'Sports', 'Trending', 'Entertainment', 'Exam Update'] };
    }

    const apiFeaturesForCount = new ApiFeatures(News.find(), req.query,['editor'])
        .search()
        .filter();

    const totalCount = await apiFeaturesForCount.query.clone().countDocuments();

    const apiFeatures = new ApiFeatures(News.find(),req.query,['editor'])
    .search()     // search function
    .filter()     // filter function on category,price,rating
    .sort() 
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

// for getting all news
exports.getAllNews = catchAsyncError(async(req,res) =>{
    
    const resultPerPage = req?.query?.limit || 20;
    const currentPage = Number(req.query.page) || 1;

    if(req?.query?.category === 'all'){
        req.query.category = { $in: ['National', 'World', 'Sports', 'Trending', 'Entertainment', 'Exam Update'] };
    }

    const apiFeaturesForCount = new ApiFeatures(News.find(), req.query,['editor'])
        .search()
        .filter();

    const totalCount = await apiFeaturesForCount.query.clone().countDocuments();

    const apiFeatures = new ApiFeatures(News.find(),req.query,['editor'])
    .search()     // search function
    .filter()     // filter function on category,price,rating
    .sort() 
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

// get all news of editor
exports.getEditorNews = catchAsyncError(async (req, res, next) => {
    const { editorId } = req.params;
    const resultPerPage = req?.query?.limit || 20;
    const currentPage = Number(req.query.page) || 1;

    if (!editorId) {
        return next(new Errorhandler("editor ID is required", 400));
    }

    if(req?.query?.category === 'all'){
        req.query.category = { $in: ['National', 'World', 'Sports', 'Trending', 'Entertainment', 'Exam Update'] };
    }

    const apiFeaturesForCount = new ApiFeatures(News.find({ editor: editorId }), req.query,['editor'])
        .search()
        .filter();

    const totalCount = await apiFeaturesForCount.query.clone().countDocuments();

    const apiFeatures = new ApiFeatures(News.find({ editor: editorId }), req.query,['editor'])
        .search()    // Apply search function
        .filter()   // Apply filters (category, price, rating)
        .sort() 
        .pagination(resultPerPage);

    const news = await apiFeatures.query;
    const totalPages = Math.ceil(totalCount / resultPerPage);

    res.status(200).json({
        success: true,
        news,
        totalCount,
        totalPages,
        currentPage,
        hasMore: currentPage < totalPages
    });
});


// Get news details
exports.getNewsDetails=catchAsyncError(async(req,res,next)=>{
    let news = await News.findById(req.params.id).populate('editor').populate("comments.user", "name avatar");
    
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

    if (news.videoPublicId) {
        try {

        const destroyResult = await cloudinary.uploader.destroy(news.videoPublicId, { resource_type: "video" });
        console.log("cloudinary destroy result:", destroyResult);
        } catch (cloudErr) {
        console.warn("Cloudinary delete failed:", cloudErr);
        }
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
    const userId = req.user._id; // requires isAuthenticatedUser to set req.user
  
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
  

exports.addComment = catchAsyncError(async (req, res, next) => {

    const { id: newsId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    if (!comment || !comment.trim()) {
        return next(new Errorhandler("Comment cannot be empty", 400));
    }

    const news = await News.findById(newsId);
    if (!news) {
        return next(new Errorhandler("News not found", 404));
    }

    const newComment = {
        user: userId,
        comment,
    };

    news.comments.push(newComment);
    await news.save();

    res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: news.comments[news.comments.length - 1],
    });
});


exports.deleteComment = catchAsyncError(async (req, res, next) => {
    const { id: newsId, commentId } = req.params;
    const userId = req.user._id;

    const news = await News.findById(newsId);
    if (!news) {
        return next(new Errorhandler("News not found", 404));
    }

    const comment = news.comments.id(commentId);

    if (!comment) {
        return next(new Errorhandler("Comment not found", 404));
    }

    // allow only owner of comment
    if (comment.user.toString() !== userId.toString()) {
        return next(new Errorhandler("You can delete only your own comment", 403));
    }

    comment.deleteOne(); // mongoose subdocument delete
    await news.save();

    res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
    });
});

exports.toggleNewsApproval = async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({
      success: false,
      message: "News not found",
    });
  }

  news.isApproved = !news.isApproved;
  await news.save();

  res.status(200).json({
    success: true,
    isApproved: news.isApproved,
    message: news.isApproved
      ? "News approved successfully"
      : "News unapproved successfully",
  });
};

