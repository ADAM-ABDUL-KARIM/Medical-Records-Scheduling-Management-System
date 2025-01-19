import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Record.css";

const Pagination = ({ recordsPerPage, totalRecords, currentPage }) => {
  const pageNumbers = [];
  const navigate = useNavigate();
  const location = useLocation();

  for (let i = 1; i <= Math.ceil(totalRecords / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", number);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <a onClick={() => handleClick(number)} href={`#`} className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;