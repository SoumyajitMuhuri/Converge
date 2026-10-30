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

export const getDashboardAnalytics = async (req, res) => {
  try {
    const links = await Link.find({ user: req.userId }).select(
      "_id originalUrl shortCode createdAt qrCodeUrl"
    ).lean();

    const linkIds = links.map((link) => link._id);
    const now = new Date();
    const today = new Date(now);
    today.setUTCHours(0, 0, 0, 0);

    const windowStart = new Date(today);
    windowStart.setUTCDate(windowStart.getUTCDate() - 29);

    const [totalVisits, popularLinks, dailyVisitCounts] = await Promise.all([
      Visit.countDocuments({ link: { $in: linkIds } }),

      Visit.aggregate([
        {
          $match: { link: { $in: linkIds } }
        }, {
          $group: {
            _id: "$link",
            visits: { $sum: 1 },
          },
        }, {
          $sort: { visits: -1 }
        }, {
          $limit: 5
        },
      ]),

      Visit.aggregate([
        {
          $match: {
            link: { $in: linkIds },
            visitedAt: { $gte: windowStart, $lte: now },
          },
        },
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

    const visitsByDate = new Map(
      dailyVisitCounts.map(({ date, visits }) => [date, visits]),
    );
    const visitsOverTime = [];

    for (const date = new Date(windowStart); date <= today; date.setUTCDate(date.getUTCDate() + 1)) {
      const dateKey = date.toISOString().slice(0, 10);
      visitsOverTime.push({
        date: dateKey,
        visits: visitsByDate.get(dateKey) ?? 0,
      });
    }

    const visitCounts = new Map(
      popularLinks.map((item) => [item._id.toString(), item.visits])
    );

    const topLinks = popularLinks.map((item) => {
      const link = links.find(
        (entry) => entry._id.toString() === item._id.toString()
      );


      return {
        id: item._id,
        originalUrl: link?.originalUrl,
        shortCode: link?.shortCode,
        qrCodeUrl: link?.qrCodeUrl ?? null,
        visits: visitCounts.get(item._id.toString())??0,
      };
    });

    return res.status(200).json({
      success: true,
      analytics: {
        totalLinks: links.length,
        totalVisits,
        topLinks,
        visitsOverTime,
      },
    });
  } catch (error) {
    console.error("Dashboard Analytics error:",error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard analytics",
    });
  }
};
