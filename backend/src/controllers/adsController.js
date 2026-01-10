const Ads = require('../models/adsModel')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const ApiFeatures = require('../utils/apiFeatures')
const cloudinary = require('../config/cloudinary')

exports.createAds = catchAsyncError(async(req,res) =>{

    const { title, description, category, url } = req.body;

    const images = req.files ? req.files.map((file) => file.path) : [];

    if (images.length < 1 ) {
        return res.status(400).json({ 
            success: false, 
            message: 'Image is required!!'
        });
    }

     const ads = await Ads.create({
        title,
        description,
        url,
        images,
        category,
        createdBy: req.user._id,
        // auto approve admin ads
        isApproved: req.user.role === "admin",
    });

    res.status(201).json({
        success:true,
        ads
    });
})

// for getting all ads
exports.getAllAds = catchAsyncError(async(req,res) =>{

    req.query.isApproved = true;

    const apiFeatures = new ApiFeatures(Ads.find(),req.query)
    .search()     // search function
    .filter()     // filter function on category,price,rating
    .sort() 

    // const products = await Product.find();  // now instead of this do below line due to search feature
    const ads = await apiFeatures.query;

    res.status(200).json({
        success:true,
        ads,
    });
})

// for getting all ads
exports.getMyAds = catchAsyncError(async(req,res) =>{
    
    const resultPerPage = req?.query?.limit || 20;
    const currentPage = Number(req.query.page) || 1;

    if(req?.query?.category === 'all'){
        req.query.category = { $in: ['Banner', 'Highlights'] };
    }

    const baseQuery = {};

    if (req.user?.role === "editor") {
        baseQuery.createdBy = req.user._id || "admin";
    }

    const apiFeaturesForCount = new ApiFeatures(Ads.find(baseQuery), req.query)
        .search()
        .filter();

    const totalCount = await apiFeaturesForCount.query.clone().countDocuments();

    const apiFeatures = new ApiFeatures(Ads.find(baseQuery),req.query)
    .search()     // search function
    .filter()     // filter function on category,price,rating
    .sort() 
    .pagination(resultPerPage);    // total result to show in 1 page

    // const products = await Product.find();  // now instead of this do below line due to search feature
    const ads = await apiFeatures.query;
    const totalPages = Math.ceil(totalCount / resultPerPage);

    res.status(200).json({
        success:true,
        ads,
        totalCount,
        totalPages,
        currentPage,
        hasMore: currentPage < totalPages
    });
})


// Delete the product - Admin -->
exports.deleteAds = catchAsyncError(async (req, res) => {
    const ads = await Ads.findById(req.params.id);

    if (!ads) {
        return res.status(404).json({
            success: false,
            message: "Ads not found"
        });
    }

    if (
        req.user.role !== "admin" &&
        ads.createdBy.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
        success: false,
        message: "Not authorized to delete this ad",
        });
    }

    // Delete images from Cloudinary
    if (ads.images && ads.images.length > 0) {
        const deletePromises = ads.images.map(async (imageUrl) => {

            // Extracting public_id from the Cloudinary URL
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`social_media_task/${publicId}`);

        });

        await Promise.all(deletePromises);
    }

    await Ads.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Ads Deleted Successfully"
    });
});


exports.toggleAdsApproval = async (req, res) => {
  const ads = await Ads.findById(req.params.id);

  if (!ads) {
    return res.status(404).json({
      success: false,
      message: "Ads not found",
    });
  }

  ads.isApproved = !ads.isApproved;
  await ads.save();

  res.status(200).json({
    success: true,
    isApproved: ads.isApproved,
    message: ads.isApproved
      ? "Ad approved successfully"
      : "Ad unapproved successfully",
  });
};


