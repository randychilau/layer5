import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import React, { useEffect } from "react";
import { SearchWrapper } from "./searchbox.style";
import Button from "../../reusecore/Button";
import { DebounceInput } from "react-debounce-input";

const SearchBox = ({
  searchQuery,
  searchData,
  hideFilter,
  setHideFilter,
  paginate,
  currentPage,
  classnames,
  location
}) => {

  useEffect(() => {
    //if (location === "/blog") {
    let previousSearch = localStorage.getItem("searchQuery");
    console.log(searchQuery);
    console.log(previousSearch);
    previousSearch && previousSearch === searchQuery && searchData(previousSearch);
  }, [searchQuery]);


  const handleChange = (inputValue) => {
    if (hideFilter != undefined && setHideFilter != undefined) {
      if (inputValue.length > 0) {
        setHideFilter(true);
      } else {
        setHideFilter(false);
      }
    }
    // if (
    //   e.target.value.length > 0 &&
    //   paginate != undefined &&
    //   currentPage != undefined &&
    //   currentPage != 1
    // )
    paginate(1);
    searchData(inputValue);
  };

  return (
    <SearchWrapper>
      <div className={`search-box ${classnames ? classnames.join(" ") : ""}`}>
        <DebounceInput
          type="text"
          value={searchQuery || ""}
          minLength={1}
          debounceTimeout={500}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search..."
        />
        <Button aria-label="search icon">
          <FaSearch />
        </Button>
      </div>
    </SearchWrapper>
  );
};

export default SearchBox;
