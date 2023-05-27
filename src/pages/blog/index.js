import React, { useState, useMemo, useEffect } from "react";
import SEO from "../../components/seo";
import { graphql } from "gatsby";
import loadable from "@loadable/component";
import BlogList from "../../sections/Blog/Blog-list";
import BlogGrid from "../../sections/Blog/Blog-grid";
import useDataList from "../../utils/usedataList";

export const query = graphql`
  query allBlogs {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: { collection: { eq: "blog" } }
        frontmatter: { published: { eq: true } }
      }
    ) {
      nodes {
        id
        body
        frontmatter {
          title
          date(formatString: "MMM Do, YYYY")
          author
          thumbnail {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH)
            }
            extension
            publicURL
          }
          darkthumbnail {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH)
            }
            extension
            publicURL
          }
        }
        fields {
          slug
        }
      }
    }
  }
`;

const Blog = (props) => {
  const [isListView, setIsListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState(false);
  const { queryResults, searchData } = useDataList(
    props.data.allMdx.nodes,
    setSearchQuery,
    searchQuery,
    ["frontmatter", "title"],
    "id"
  );

  useEffect(() => {
    let previousSearch = localStorage.getItem("searchQuery");
    if (previousSearch){
      setSearchQuery(previousSearch);
    }
  }, []);

  let BlogView = useMemo(() => (props) => isListView
    ? <BlogList {...props} />
    : <BlogGrid {...props} />
  , [isListView]);

  return (
    <>
      <BlogView
        queryResults={queryResults}
        searchData={searchData}
        searchQuery={searchQuery}
        isListView= {isListView}
        setIsListView={setIsListView}
        pageContext={props.pageContext}
        data={props.data}
        location={props.location.pathname}
      />
    </>
  );
};
export default Blog;
export const Head = () => {
  return <SEO title="Blog" description="The latest news and announcements about Layer5, our products, and our ecosystem, as well as voices from across our community." />;
};