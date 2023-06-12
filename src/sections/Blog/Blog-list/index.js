import React, { useState, useEffect } from "react";
import BlogViewToolTip from "../../../components/blog-view-tooltip";
import { Container, Row, Col } from "../../../reusecore/Layout";
import PageHeader from "../../../reusecore/PageHeader";
import Sidebar from "../Blog-sidebar";
import Card from "../../../components/Card";
import { BlogPageWrapper } from "./blogList.style";
import RssFeedIcon from "../../../assets/images/socialIcons/rss-sign.svg";
import Pagination from "../../Resources/Resources-grid/paginate";
import SearchBox from "../../../reusecore/Search";
import useDataList from "../../../utils/usedataList";

const BlogList = ({
  queryResults,
  searchData,
  searchQuery,
  isListView,
  setIsListView,
  pageContext,
  data,
  type
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [typeSearchQuery, setTypeSearchQuery] = useState("");

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  let totalCount = queryResults?.length;
  let nodes = [];
  let previousSearch = "";
  type && ({ totalCount, nodes } = data.allMdx);

  const { queryResults: typeResults, searchData: typeData } = useDataList(
    nodes,
    setTypeSearchQuery,
    typeSearchQuery,
    ["frontmatter", "title"],
    "id"
  );

  console.log("previousSearch", previousSearch);
  console.log("type", type);
  console.log("typeResults", typeResults);
  console.log("typeData", typeData);
  console.log("queryResults", queryResults);

  const category = pageContext.category ? pageContext.category : null;
  const tag = pageContext.tag ? pageContext.tag : null;

  useEffect(() => {
    previousSearch = localStorage.getItem("searchQuery");
    if (previousSearch !== typeSearchQuery && type){
      setTypeSearchQuery(previousSearch);
    }
  },[]);

  let currentPosts = type
    ? typeResults.slice(indexOfFirstPost, indexOfLastPost)
    : queryResults.slice(indexOfFirstPost, indexOfLastPost);

  const header = tag
    ? `${typeSearchQuery
      ? currentPosts.length
      : totalCount} post${totalCount === 1 ? "" : "s"} tagged with "${tag}" ${typeSearchQuery ? `with keyword(s) "${typeSearchQuery}"` : ""}`
    : category
      ? `${typeSearchQuery
        ? currentPosts.length
        : totalCount} post${
        totalCount === 1 ? "" : "s"
      } categorized as "${category}" ${typeSearchQuery ? `with keyword(s) "${typeSearchQuery}"` : ""}`
      : "Blog";

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <BlogPageWrapper>
      <PageHeader
        title={header}
        path="Blog"
        img={RssFeedIcon}
        feedlink="/blog/feed.xml"
      />
      <div className="blog-page-wrapper">
        <Container>
          <Row>
            <Col xs={12} lg={8}>
              {!pageContext.tag && !pageContext.category ? (
                <div className="tooltip-search">
                  <BlogViewToolTip
                    isListView={isListView}
                    setIsListView={setIsListView}
                  />
                  <SearchBox
                    searchQuery={type
                      ? typeSearchQuery
                      : searchQuery
                    }
                    searchData={type
                      ? typeData
                      : searchData
                    }
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              ) : (
                <SearchBox
                  searchQuery={type
                    ? typeSearchQuery
                    : searchQuery
                  }
                  searchData={type
                    ? typeData
                    : searchData
                  }
                  paginate={paginate}
                  currentPage={currentPage}
                />
              )}
              <Row className="blog-lists">
                {currentPosts.length > 0
                  ? currentPosts.map(({ id, frontmatter, fields }) => (
                    <Col xs={12} key={id}>
                      <Card  frontmatter={frontmatter} fields={fields} />
                    </Col>
                  ))
                  : <Col xs={12} sm={6}>
                      No blog post that matches the search term "{typeSearchQuery || searchQuery}" found.
                  </Col>
                }
                <Col>
                  {currentPosts.length > 0 && (
                    <Pagination
                      postsPerPage={postsPerPage}
                      totalPosts={typeSearchQuery
                        ? currentPosts.length
                        : type
                          ? nodes.length
                          : queryResults.length}
                      currentPage={currentPage}
                      paginate={paginate}
                    />
                  )}
                </Col>
              </Row>
            </Col>
            <Col xs={12} lg={4}>
              <Sidebar pageContext={pageContext} />
            </Col>
          </Row>
        </Container>
      </div>
    </BlogPageWrapper>
  );
};

export default BlogList;
