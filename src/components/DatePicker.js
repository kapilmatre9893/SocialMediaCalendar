import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = ({ onDateSelect }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
      if (!selectedDates.includes(formattedDate)) {
        const newDates = [...selectedDates, formattedDate];
        setSelectedDates(newDates);
        onDateSelect(newDates);
      }
    }
  };

  return (
    <div>
      <h4>Select Dates for Scheduling</h4>
      <DatePicker
        selected={null} // Disable default selection
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        placeholderText="Pick a date"
        minDate={new Date()} // Prevent past dates
        inline
      />
      <div>
        <h5>Selected Dates:</h5>
        {selectedDates.length > 0 ? (
          <ul>
            {selectedDates.map((date) => (
              <li key={date}>{date}</li>
            ))}
          </ul>
        ) : (
          <p>No dates selected</p>
        )}
      </div>
    </div>
  );
};

export default DateSelector;
