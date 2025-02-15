import { useState } from "react";
import PropTypes from "prop-types";

function CandidateCell({ candidates }) {
  const [expanded, setExpanded] = useState(false);
  const mappedCandidates = candidates.map((c) => c.name);
  const visibleCandidates = expanded
    ? mappedCandidates
    : mappedCandidates.slice(0, 2);

  return (
    <td>
      {visibleCandidates.join(", ")}
      {candidates.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary/80 hover:text-primary ml-2 underline text-sm"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </td>
  );
}

CandidateCell.propTypes = {
  candidates: PropTypes.array.isRequired,
};

export default CandidateCell;
