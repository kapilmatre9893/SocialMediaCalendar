import * as XLSX from "xlsx";

export const exportToExcel = (calendarData) => {
  const wb = XLSX.utils.book_new(); // Create a new workbook

  // Overview Sheet (Category-wise and Date-wise Summary)
  const overviewData = [];
  const categorySummary = {};
  const dateSummary = {};

  Object.keys(calendarData).forEach((date) => {
    calendarData[date].forEach((post) => {
      // Add to category summary
      if (!categorySummary[post.category]) {
        categorySummary[post.category] = 0;
      }
      categorySummary[post.category]++;

      // Add to date summary
      if (!dateSummary[date]) {
        dateSummary[date] = {
          likes: 0,
          views: 0,
          shares: 0,
          reach: 0,
          impressions: 0,
        };
      }
      dateSummary[date].likes += post.likes;
      dateSummary[date].views += post.views;
      dateSummary[date].shares += post.shares;
      dateSummary[date].reach += post.reach;
      dateSummary[date].impressions += post.impressions;
    });
  });

  // Convert category summary into Excel format
  Object.keys(categorySummary).forEach((category) => {
    overviewData.push({ Category: category, "Total Posts": categorySummary[category] });
  });

  overviewData.push({ Category: "Total", "Total Posts": Object.values(categorySummary).reduce((a, b) => a + b, 0) });

  const wsOverview = XLSX.utils.json_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, "Overview");

  // Convert date summary into Excel format
  const dateSummaryData = Object.keys(dateSummary).map((date) => ({
    Date: date,
    Likes: dateSummary[date].likes,
    Views: dateSummary[date].views,
    Shares: dateSummary[date].shares,
    Reach: dateSummary[date].reach,
    Impressions: dateSummary[date].impressions,
  }));

  const wsDateSummary = XLSX.utils.json_to_sheet(dateSummaryData);
  XLSX.utils.book_append_sheet(wb, wsDateSummary, "Date Summary");

  // Per-Date Detailed Breakdown
  Object.keys(calendarData).forEach((date) => {
    const postsData = calendarData[date].map((post) => ({
      "Page Name": post.pageName,
      "Profile Link": post.profileLink || "N/A",
      Followers: post.followers,
      "Date of Post": date,
      "Post Link": post.postLink,
      "Post Type": post.postType,
      Likes: post.likes,
      Views: post.views,
      Shares: post.shares,
      Reach: post.reach,
      Impressions: post.impressions,
    }));

    const ws = XLSX.utils.json_to_sheet(postsData);
    XLSX.utils.book_append_sheet(wb, ws, date); // Each date gets a separate sheet
  });

  // Download the file
  XLSX.writeFile(wb, "SocialMediaCalendar.xlsx");
};
