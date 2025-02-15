import { useState } from "react";
import PropTypes from "prop-types";

function FilterRow({ submitFunction }) {
  const [formData, setFormData] = useState({
    title: "",
    candidate: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  function handleInputChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitFunction(formData);
      }}
    >
      <div className="flex flex-wrap gap-4 max-h-20">
        <input
          className="min-w-52 flex-1 px-3 py-1 rounded-md bg-light shadow-md shadow-shadowDark border-none focus:outline-accent"
          name="title"
          type="text"
          placeholder="Filter by title..."
          value={formData.title}
          onChange={handleInputChange}
        />
        <input
          className="min-w-52 flex-1 px-3 py-1 rounded-md bg-light shadow-md shadow-shadowDark border-none focus:outline-accent"
          name="candidate"
          type="text"
          placeholder="Filter by candidate(s)..."
          value={formData.candidate}
          onChange={handleInputChange}
        />
        <input
          className="min-w-52 flex-1 px-3 py-1 rounded-md bg-light shadow-md shadow-shadowDark border-none focus:outline-accent"
          name="dateFrom"
          type="date"
          placeholder="From..."
          value={formData.dateFrom}
          onChange={handleInputChange}
        />
        <input
          className="min-w-52 flex-1 px-3 py-1 rounded-md bg-light shadow-md shadow-shadowDark border-none focus:outline-accent"
          name="dateTo"
          type="date"
          placeholder="To..."
          value={formData.dateTo}
          onChange={handleInputChange}
        />
        <button
          className="bg-primary/80 hover:bg-primary text-primaryContrast font-bold px-3 py-1 rounded-md shadow-md shadow-shadowDark border-none"
          type="submit"
        >
          Filter
        </button>
      </div>
    </form>
  );
}

FilterRow.propTypes = {
  submitFunction: PropTypes.func,
};

export default FilterRow;
