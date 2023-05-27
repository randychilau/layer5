import * as JsSearch from "js-search";
import { useState, useEffect } from "react";

const useDataList = (
  data,
  setSearchQuery,
  searchQuery,
  paramsIndex,
  paramSearch
) => {
  const [dataList, setDataList] = useState(data);
  const [search, setSearch] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const queryResults = searchQuery ? searchResults : dataList;

  useEffect(() => {
    rebuildIndex();
  }, [dataList]);

  const rebuildIndex = () => {
    const dataToSearch = new JsSearch.Search(paramSearch);
    dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy();
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer();
    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex(paramSearch);
    dataToSearch.addIndex(paramsIndex);
    dataToSearch.addIndex("body");
    dataToSearch.addDocuments(dataList);
    setSearch(dataToSearch);
    setIsLoading(false);
  };

  const searchData = (inputValue) => {
      const queryResult = search.search(inputValue);  
      let previousSearch = localStorage.getItem("searchQuery"); 
      if (inputValue !== previousSearch) {
      setSearchQuery(inputValue.trim());
      localStorage.setItem("searchQuery", inputValue);
      }
      setSearchResults(queryResult);
  };

  return { queryResults, searchData, setDataList, dataList };
};

export default useDataList;
