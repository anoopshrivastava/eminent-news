const Ads = require("../models/adsModel");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("../config/cloudinary");

const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "social_media_task" }, (err, res) =>
        err ? reject(err) : resolve(res)
      )
      .end(buffer);
  });

const uploadVideo = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
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
      )
      .end(buffer);
  });

exports.createAds = catchAsyncError(async (req, res) => {
  const { title, description, category, url, videoUrl, videoPublicId } =
    req.body;

  let imageUploads = [];
  let video = null;

  // 🔹 VIDEO ADS (metadata only)
  if (category === "VideoShorts") {
    if (!videoUrl || !videoPublicId) {
      return res.status(400).json({
        success: false,
        message: "Video is required for video ads",
      });
    }

    video = {
      url: videoUrl,
      publicId: videoPublicId,
    };
  }

  // 🔹 IMAGE ADS
  else {
    const imageFiles = req.files?.images || [];

    if (imageFiles.length < 1) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    imageUploads = await Promise.all(
      imageFiles.map((img) => uploadImage(img.buffer))
    );
  }

  const ads = await Ads.create({
    title,
    description,
    category,
    url,
    images: imageUploads.map((i) => i.secure_url),
    video,
    createdBy: req.user._id,
    isApproved: req.user.role === "admin",
  });

  res.status(201).json({
    success: true,
    ads,
  });
});

// for getting all ads
exports.getAllAds = catchAsyncError(async (req, res) => {
  req.query.isApproved = true;

  const apiFeatures = new ApiFeatures(Ads.find(), req.query)
    .search() // search function
    .filter() // filter function on category,price,rating
    .sort();

  // const products = await Product.find();  // now instead of this do below line due to search feature
  const ads = await apiFeatures.query;

  res.status(200).json({
    success: true,
    ads,
  });
});

// for getting all ads
exports.getMyAds = catchAsyncError(async (req, res) => {
  const resultPerPage = req?.query?.limit || 20;
  const currentPage = Number(req.query.page) || 1;

  if (req?.query?.category === "all") {
    req.query.category = {
      $in: ["Banner", "Highlights", "FullPageShorts", "VideoShorts"],
    };
  }

  const baseQuery = {};

  if (req.user?.role !== "admin") {
    baseQuery.createdBy = req.user._id || "admin";
  }

  const apiFeaturesForCount = new ApiFeatures(Ads.find(baseQuery), req.query, [
    "createdBy",
  ])
    .search()
    .filter();

  const totalCount = await apiFeaturesForCount.query.clone().countDocuments();

  const apiFeatures = new ApiFeatures(Ads.find(baseQuery), req.query, [
    "createdBy",
  ])
    .search() // search function
    .filter() // filter function on category,price,rating
    .sort()
    .pagination(resultPerPage); // total result to show in 1 page

  // const products = await Product.find();  // now instead of this do below line due to search feature
  const ads = await apiFeatures.query;
  const totalPages = Math.ceil(totalCount / resultPerPage);

  res.status(200).json({
    success: true,
    ads,
    totalCount,
    totalPages,
    currentPage,
    hasMore: currentPage < totalPages,
  });
});

// Delete the product - Admin -->
exports.deleteAds = catchAsyncError(async (req, res) => {
  const ads = await Ads.findById(req.params.id);

  if (!ads) {
    return res.status(404).json({
      success: false,
      message: "Ads not found",
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
  if (ads.images?.length) {
    await Promise.all(
      ads.images.map((img) => {
        const publicId = img.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`social_media_task/${publicId}`);
      })
    );
  }

  // delete video
  if (ads.video?.publicId) {
    await cloudinary.uploader.destroy(ads.video.publicId, {
      resource_type: "video",
    });
  }

  await Ads.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Ads Deleted Successfully",
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
