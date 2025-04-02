import React, { useState } from "react";
import Calendar from "./components/Calendar";
import DateSelector from "./components/DatePicker";
import CategoryFilter from "./components/CategoryFilter";
import { fetchPosts } from "./utils/api";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleFilterChange = async (categories) => {
    setSelectedCategories(categories);
    const allPosts = await fetchPosts();
    const filtered = allPosts.filter((post) => categories.includes(post.category));
    setFilteredPosts(filtered);
  };

  return (
    <div className="App">
      <h2 className="text-center">Social Media Content Calendar</h2>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
          <CategoryFilter onFilterChange={handleFilterChange} />
          <DateSelector onDateSelect={setSelectedDates} />
          </div>
       <div className="col-md-6">
       {selectedDates.length > 0 && (
        <Calendar selectedDates={selectedDates} posts={filteredPosts} />
      )}
       </div>
      
      
        </div>
    
      </div>
    </div>
  );
}

export default App;
