import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx"; // Import SheetJS
import dummyPosts from "../data/data";
// import "./Calendar.css";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(""); // Store selected date
  const [selectedCategory, setSelectedCategory] = useState(""); // Store selected category
  const [selectedPages, setSelectedPages] = useState([]); // Store selected pages

  // Get unique categories & pages from dummy data
  const uniqueCategories = [...new Set(dummyPosts.map((post) => post.category))];
  const uniquePages = [...new Set(dummyPosts.map((post) => post.pageName))];

  // Handle page selection
  const togglePageSelection = (pageName) => {
    setSelectedPages((prev) =>
      prev.includes(pageName) ? prev.filter((p) => p !== pageName) : [...prev, pageName]
    );
  };

  // Function to reset filters
  const resetFilters = () => {
    setSelectedDate("");
    setSelectedCategory("");
    setSelectedPages([]);
  };

  // Filter posts based on user selection
  const filteredPosts = useMemo(() => {
    return dummyPosts.filter((post) => {
      return (
        (selectedDate ? post.date === selectedDate : true) &&
        (selectedCategory ? post.category === selectedCategory : true) &&
        (selectedPages.length > 0 ? selectedPages.includes(post.pageName) : true)
      );
    });
  }, [selectedDate, selectedCategory, selectedPages]);

  // Group posts by date
  const groupPostsByDate = () => {
    return filteredPosts.reduce((acc, post) => {
      if (!acc[post.date]) {
        acc[post.date] = [];
      }
      acc[post.date].push(post);
      return acc;
    }, {});
  };

  // Group posts by category for summary
  const groupPostsByCategory = () => {
    return filteredPosts.reduce((acc, post) => {
      if (!acc[post.category]) {
        acc[post.category] = { count: 0, likes: 0, reach: 0, impressions: 0 };
      }
      acc[post.category].count += 1;
      acc[post.category].likes += post.likes;
      acc[post.category].reach += post.reach;
      acc[post.category].impressions += post.impressions;
      return acc;
    }, {});
  };

  // Function to export data to Excel with per-date and category summary sheets
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Overview Sheet
    const overviewData = [
      ["Total Posts", filteredPosts.length],
      ["Total Likes", filteredPosts.reduce((sum, post) => sum + post.likes, 0)],
      ["Total Reach", filteredPosts.reduce((sum, post) => sum + post.reach, 0)],
      ["Total Impressions", filteredPosts.reduce((sum, post) => sum + post.impressions, 0)],
    ];
    const overviewWS = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, overviewWS, "Overview");

    // Category Summary Sheet
    const categorySummaryData = [
      ["Category", "Total Posts", "Total Likes", "Total Reach", "Total Impressions"],
      ...Object.entries(groupPostsByCategory()).map(([category, stats]) => [
        category,
        stats.count,
        stats.likes,
        stats.reach,
        stats.impressions,
      ]),
    ];
    const categorySummaryWS = XLSX.utils.aoa_to_sheet(categorySummaryData);
    XLSX.utils.book_append_sheet(wb, categorySummaryWS, "Category Summary");

    // Per-Date Sheets
    const groupedPosts = groupPostsByDate();
    Object.keys(groupedPosts).forEach((date) => {
      const dateData = [
        ["Page Name", "Category", "Followers", "Likes", "Reach", "Impressions", "Post Link"],
        ...groupedPosts[date].map((post) => [
          post.pageName,
          post.category,
          post.followers,
          post.likes,
          post.reach,
          post.impressions,
          post.postLink,
        ]),
      ];
      const dateWS = XLSX.utils.aoa_to_sheet(dateData);
      XLSX.utils.book_append_sheet(wb, dateWS, date); // Sheet name is the date
    });

    XLSX.writeFile(wb, "SocialMediaPosts.xlsx");
  };

  return (
    <div className="calendar-container">
      <h2>📅 Social Media Content Calendar</h2>

      {/* Date Filter */}
      <label>Select Date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* Category Filter */}
      <label>Select Category:</label>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        {uniqueCategories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      {/* Page Selection */}
      <div className="page-selection">
        <label>Select Pages:</label>
        <div className="page-list">
          {uniquePages.map((page) => (
            <label key={page}>
              <input
                type="checkbox"
                checked={selectedPages.includes(page)}
                onChange={() => togglePageSelection(page)}
              />
              {page}
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button className="reset-btn" onClick={resetFilters}>🔄 Reset Filters</button>

      {/* Export Button */}
      <button className="export-btn" onClick={exportToExcel}>📥 Export to Excel</button>

      {/* Display Filtered Posts */}
      <div className="calendar-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-item">
              <strong>@{post.pageName}</strong> ({post.category})
              <br />
              <a href={post.postLink} target="_blank" rel="noopener noreferrer">🔗 View Post</a>
              <p>👍 {post.likes} | 👥 {post.followers}</p>
              <p>📅 {post.date}</p>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
