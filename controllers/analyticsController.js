const Profile = require('../models/Profile');
const AnalyticsEvent = require('../models/AnalyticsEvent');

// @desc    Get analytics summary for current user's portfolio
// @route   GET /api/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile || !profile.subdomain) {
      return res.status(200).json({
        success: true,
        data: {
          totalViews: 0,
          todayViews: 0,
          monthly: [],
          daily: [],
          countries: [],
          devices: [],
          browsers: [],
          referrers: [],
        },
      });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    // Today views
    const todayViews = await AnalyticsEvent.countDocuments({
      profileId: profile._id,
      createdAt: { $gte: todayStart },
    });

    // Aggregate by month (last 6 months trend)
    const monthlyAgg = await AnalyticsEvent.aggregate([
      {
        $match: {
          profileId: profile._id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          views: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const monthly = monthlyAgg.map((item) => {
      const { year, month } = item._id;
      const date = new Date(year, month - 1, 1);
      const monthLabel = date.toLocaleString('default', { month: 'short' });
      return {
        key: `${year}-${String(month).padStart(2, '0')}`,
        month: monthLabel,
        year,
        views: item.views,
      };
    });

    const totalViews = monthly.reduce((sum, m) => sum + m.views, 0);

    // Daily breakdown for last 30 days
    const dailyAgg = await AnalyticsEvent.aggregate([
      {
        $match: {
          profileId: profile._id,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          views: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);

    const dailyMap = new Map();
    dailyAgg.forEach((item) => {
      const { year, month, day } = item._id;
      const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyMap.set(key, item.views);
    });

    const daily = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(thirtyDaysAgo.getDate() + i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const label = `${day} ${d.toLocaleString('default', { month: 'short' })}`;
      daily.push({
        key,
        label,
        views: dailyMap.get(key) || 0,
      });
    }

    // Aggregate by country (top traffic sources, last 6 months)
    const countryAgg = await AnalyticsEvent.aggregate([
      {
        $match: {
          profileId: profile._id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: '$country',
          views: { $sum: 1 },
        },
      },
      {
        $sort: { views: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const countries = countryAgg.map((item) => ({
      country: item._id || 'Unknown',
      views: item.views,
    }));

    // Device / browser / referrer breakdown for last 30 days
    const recentEvents = await AnalyticsEvent.find({
      profileId: profile._id,
      createdAt: { $gte: thirtyDaysAgo },
    })
      .select('userAgent referrer')
      .lean();

    const deviceCounts = {};
    const browserCounts = {};
    const refCounts = {};

    const classifyDevice = (ua = '') => {
      const uaLower = ua.toLowerCase();
      if (uaLower.includes('ipad') || uaLower.includes('tablet')) return 'Tablet';
      if (uaLower.includes('mobi')) return 'Mobile';
      return 'Desktop';
    };

    const classifyBrowser = (ua = '') => {
      const uaLower = ua.toLowerCase();
      if (uaLower.includes('edg')) return 'Edge';
      if (uaLower.includes('opr/') || uaLower.includes('opera')) return 'Opera';
      if (uaLower.includes('chrome') && !uaLower.includes('edg') && !uaLower.includes('opr/'))
        return 'Chrome';
      if (uaLower.includes('firefox')) return 'Firefox';
      if (uaLower.includes('safari') && !uaLower.includes('chrome')) return 'Safari';
      return 'Other';
    };

    const normalizeReferrer = (ref = '') => {
      if (!ref) return 'Direct / None';
      try {
        const url = new URL(ref);
        return url.hostname.replace(/^www\./i, '');
      } catch (e) {
        return 'Other';
      }
    };

    for (const ev of recentEvents) {
      const device = classifyDevice(ev.userAgent);
      const browser = classifyBrowser(ev.userAgent);
      const ref = normalizeReferrer(ev.referrer);

      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      refCounts[ref] = (refCounts[ref] || 0) + 1;
    }

    const devices = Object.entries(deviceCounts)
      .map(([device, views]) => ({ device, views }))
      .sort((a, b) => b.views - a.views);

    const browsers = Object.entries(browserCounts)
      .map(([browser, views]) => ({ browser, views }))
      .sort((a, b) => b.views - a.views);

    const referrers = Object.entries(refCounts)
      .map(([source, views]) => ({ source, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    res.status(200).json({
      success: true,
      data: {
        totalViews,
        todayViews,
        monthly,
        daily,
        countries,
        devices,
        browsers,
        referrers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsSummary,
};
