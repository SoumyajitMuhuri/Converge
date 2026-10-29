import mongoose from "mongoose";
import Link from "../models/Link.js";
import Visit from "../models/Visit.js";

export const getLinkAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid link ID",
      });
    }

    const link = await Link.findOne({
      _id: id,
      user: req.userId,
    }).select("_id originalUrl shortCode createdAt");

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    const [totalVisits, dailyVisits] = await Promise.all([
      Visit.countDocuments({ link: link._id }),

      Visit.aggregate([
        { $match: { link: link._id } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$visitedAt",
                timezone: "UTC",
              },
            },
            visits: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            visits: 1,
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        link,
        totalVisits,
        dailyVisits,
      },
    });
  } catch (error) {
    console.error("Get link analytics error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve link analytics",
    });
  }
};