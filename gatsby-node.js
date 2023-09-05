/* eslint-env node */
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path");
const slugify = require("./src/utils/slugify");
const { paginate } = require("gatsby-awesome-pagination");
const { createFilePath } = require("gatsby-source-filesystem");
const config = require("./gatsby-config");

if (process.env.CI === "true") {
  // All process.env.CI conditionals in this file are in place for GitHub Pages, if webhost changes in the future, code may need to be modified or removed.
  //Replacing '/' would result in empty string which is invalid
  const replacePath = (url) => (url === "/" || url.includes("/404")) ? url : `${url}.html`;

  exports.onCreatePage = ({ page, actions }) => {

    if (page.path.endsWith("html")) return;
    const { createPage, deletePage, createRedirect } = actions;
    const oldPage = Object.assign({}, page);
    page.matchPath = page.path;
    page.path = replacePath(page.path);

    if (page.path !== oldPage.path) {
    // Replace new page with old page
      deletePage(oldPage);
      createPage(page);

      createRedirect({ fromPath: `/${page.matchPath}/`, toPath: `/${page.matchPath}`, redirectInBrowser: true, isPermanent: true });
    }
  };
}


exports.createPages = async ({ actions, graphql, reporter }) => {

  // Create client-side redirects (these only work in prod deployment)
  const { createRedirect } = actions;
  createRedirect({ fromPath: "/books", toPath: "/learn/service-mesh-books", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/workshops", toPath: "/learn/service-mesh-workshops", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/labs", toPath: "/learn/service-mesh-labs", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/meshery", toPath: "/cloud-native-management/meshery", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/service-mesh-management/meshery", toPath: "/cloud-native-management/meshery", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/service-mesh-management/meshery/operating-service-meshes", toPath: "/cloud-native-management/meshery/operating-service-meshes", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/service-mesh-management/meshery/getting-started", toPath: "/cloud-native-management/meshery/getting-started", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/landscape", toPath: "/service-mesh-landscape", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/events", toPath: "/community/events", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/programs", toPath: "/careers/programs", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/about", toPath: "/company/about", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/brand", toPath: "/company/brand", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/contact", toPath: "/company/contact", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/news", toPath: "/company/news", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/service-meshes", toPath: "/service-mesh-landscape", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/calendar", toPath: "/community/calendar", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/smi", toPath: "/projects/service-mesh-interface-conformance", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/projects/getnighthawk", toPath: "/projects/nighthawk", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/projects/getnighthawk", toPath: "/projects/nighthawk", redirectInBrowser: true, isPermanent: true });

  //****
  // External Resoruce Redirects
  //****

  // New Community Member (Google Form)
  createRedirect({ fromPath: "/newcomer", toPath: "/newcomers", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/meshmap", toPath: "/cloud-native-management/meshmap", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/go/meshmap", toPath: "/cloud-native-management/meshmap", redirectInBrowser: true, isPermanent: true });
  createRedirect({ fromPath: "/resources/cloud-native/hpes-adoption-of-meshery-and-meshmap", toPath: "/resources/case-study/hpes-adoption-of-meshery-and-meshmap", redirectInBrowser: true, isPermanent: true });

  // Create Pages
  const { createPage } = actions;

  const envCreatePage = (props) => {
    if (process.env.CI === "true"){
      const { path, ...rest } = props;

      createRedirect({ fromPath: `/${path}/`, toPath: `/${path}`, redirectInBrowser: true, isPermanent: true });

      return createPage({
        path: `${path}.html`,
        matchPath: path,
        ...rest
      });
    }
    return createPage(props);
  };


  const blogPostTemplate = path.resolve(
    "src/templates/blog-single.js"
  );
  const blogCategoryListTemplate = path.resolve(
    "src/templates/blog-category-list.js"
  );
  const blogTagListTemplate = path.resolve(
    "src/templates/blog-tag-list.js"
  );

  const EventsTemplate = path.resolve(
    "src/templates/events.js"
  );

  const EventTemplate = path.resolve(
    "src/templates/event-single.js"
  );

  const NewsPostTemplate = path.resolve(
    "src/templates/news-single.js"
  );

  const BookPostTemplate = path.resolve(
    "src/templates/book-single.js"
  );

  const ProgramPostTemplate = path.resolve(
    "src/templates/program-single.js"
  );

  const MultiProgramPostTemplate = path.resolve(
    "src/templates/program-multiple.js"
  );

  const CareerPostTemplate = path.resolve(
    "src/templates/career-single.js"
  );

  const MemberTemplate = path.resolve(
    "src/templates/member-single.js"
  );

  const MemberBioTemplate = path.resolve(
    "src/templates/executive-bio.js"
  );

  const WorkshopTemplate = path.resolve(
    "src/templates/workshop-single.js"
  );

  const LabTemplate = path.resolve(
    "src/templates/lab-single.js"
  );

  const resourcePostTemplate = path.resolve(
    "src/templates/resource-single.js"
  );
  const integrationTemplate = path.resolve(
    "src/templates/integrations.js"
  );

  const res_blog = await graphql(`
    {
      blogs: allMdx(
        filter: { 
          fields: { collection: { eq: "blog" } }, 
          frontmatter: { published: { eq: true } } 
        }
      ){
        nodes{
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);

  const res_blogTags = await graphql(`
    {
      blogTags: allMdx(
        filter: { fields: { collection: { eq: "blog" } }, frontmatter: { published: { eq: true } } }
        ){
          group(field: frontmatter___tags) {
            nodes{
              id
            }
            fieldValue
          }
        }
    }
    `);

  const res_blogCategory = await graphql(`
    {
      blogCategory: allMdx(
        filter: { fields: { collection: { eq: "blog" } }, frontmatter: { published: { eq: true } } }
        ){
          group(field: frontmatter___category) {
            nodes{
              id
            }
            fieldValue
          }
      }
    }
    `);

  const res_resources = await graphql(`
    {
      resources: allMdx(
        filter: { 
          fields: { collection: { eq: "resources" } }, 
          frontmatter: { published: { eq: true } } 
      }
      ){
        nodes{
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);

  const res_news = await graphql(`
    {
      news: allMdx(
        filter: { 
          fields: { collection: { eq: "news" } }, 
          frontmatter: { published: { eq: true } } 
      }
      ){
        nodes{
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);


  const res_books = await graphql(`
    {
      books: allMdx(
        filter: { 
          fields: { collection: { eq: "service-mesh-books" } }, 
          frontmatter: { published: { eq: true } } 
      }
      ){
        nodes{
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);

  const res_events = await graphql(`
    {
      events: allMdx(
        filter: { 
          fields: { collection: { eq: "events" } }, 
          frontmatter: { published: { eq: true } } 
      }
      ){
        nodes{
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);

  const res_programs = await graphql(`
    {
      programs: allMdx(
        filter: { 
          fields: { collection: { eq: "programs" } }, 
          frontmatter: { published: { eq: true } } 
      }
      ){
        nodes{
          frontmatter{
            program
            programSlug
          }
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);

  const res_careers = await graphql(`
    {
      careers: allMdx(
        filter: { 
          fields: { collection: { eq: "careers" } }, 
          frontmatter: { published: { eq: true } } 
      }
      ){
        nodes{
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);

  const res_members = await graphql(`
    {
      members: allMdx(
        filter: { 
          fields: { collection: { eq: "members" } }, 
          frontmatter: { published: { eq: true } } 
      }
      ){
        nodes{
          fields{
            slug
            collection
          }
        }
      }
    }
    `);

  const res_integrations = await graphql(`
    {
      integrations: allMdx(
        filter: { 
          fields: { collection: { eq: "integrations" } }, 
          frontmatter: { published: { eq: true } } 
      }
      ){
        nodes{
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);

  const res_memberBio = await graphql(`
    {
      memberBio: allMdx(
        filter: { fields: { collection: { eq: "members" } }, frontmatter: { published: { eq: true }, executive_bio: { eq: true } } }
        ){
          nodes{
            frontmatter{
              name
            }
            fields{
              slug
              collection
            }
            internal {
              contentFilePath
            }
          }
      }
    }
    `);

  const res_singleWorkshop = await graphql(`
    {
      singleWorkshop: allMdx(
        filter: {fields: {collection: {eq: "service-mesh-workshops"}}}
      ){
        nodes{
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);

  const res_labs = await graphql(`
    {
      labs: allMdx(
        filter: {fields: {collection: {eq: "service-mesh-labs"}}}
      ){
        nodes{
          fields{
            slug
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
    `);

  const res_learncontent = await graphql(`
    {
      learncontent: allMdx(
        filter: {fields: {collection: {eq: "content-learn"}}}
      ){
        nodes{
          fields{
            learnpath
            slug
            course
            section
            chapter
            pageType
            collection
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  // handle errors
  if (res_blog.errors) {
    reporter.panicOnBuild("Error while running GraphQL query.");
    return;
  }

  const blogs = res_blog.data.blogs.nodes;
  const resources = res_resources.data.resources.nodes;
  const news = res_news.data.news.nodes;
  const books = res_books.data.books.nodes;
  const events = res_events.data.events.nodes;
  const careers = res_careers.data.careers.nodes;
  const members = res_members.data.members.nodes;
  const integrations = res_integrations.data.integrations.nodes;
  const singleWorkshop = res_singleWorkshop.data.singleWorkshop.nodes;
  const labs = res_labs.data.labs.nodes;
  const programs = res_programs.data.programs.nodes;

  paginate({
    createPage: envCreatePage,
    items: events,
    itemsPerPage: 9,
    pathPrefix: "/community/events",
    component: EventsTemplate
  });

  blogs.forEach(blog => {
    envCreatePage({
      path: blog.fields.slug,
      component: `${blogPostTemplate}?__contentFilePath=${blog.internal.contentFilePath}`,
      context: {
        slug: blog.fields.slug,
      },
    });
  });

  const blogCategory = res_blogCategory.data.blogCategory.group;
  blogCategory.forEach(category => {
    envCreatePage({
      path: `/blog/category/${slugify(category.fieldValue)}`,
      component: blogCategoryListTemplate,
      context: {
        category: category.fieldValue,
      },
    });
  });

  const BlogTags = res_blogTags.data.blogTags.group;
  BlogTags.forEach(tag => {
    envCreatePage({
      path: `/blog/tag/${slugify(tag.fieldValue)}`,
      component: blogTagListTemplate,
      context: {
        tag: tag.fieldValue,
      },
    });
  });

  resources.forEach(resource => {
    envCreatePage({
      path: resource.fields.slug,
      component: `${resourcePostTemplate}?__contentFilePath=${resource.internal.contentFilePath}`,
      context: {
        slug: resource.fields.slug,
      },
    });
  });

  news.forEach(singleNews => {
    envCreatePage({
      path: singleNews.fields.slug,
      component: `${NewsPostTemplate}?__contentFilePath=${singleNews.internal.contentFilePath}`,
      context: {
        slug: singleNews.fields.slug,
      },
    });
  });

  books.forEach(book => {
    envCreatePage({
      path: book.fields.slug,
      component: `${BookPostTemplate}?__contentFilePath=${book.internal.contentFilePath}`,
      context: {
        slug: book.fields.slug,
      },
    });
  });

  events.forEach(event => {
    envCreatePage({
      path: event.fields.slug,
      component: `${EventTemplate}?__contentFilePath=${event.internal.contentFilePath}`,
      context: {
        slug: event.fields.slug,
      },
    });
  });

  programs.forEach(program => {
    envCreatePage({
      path: program.fields.slug,
      component: `${ProgramPostTemplate}?__contentFilePath=${program.internal.contentFilePath}`,
      context: {
        slug: program.fields.slug,
      },
    });
  });

  careers.forEach(career => {
    envCreatePage({
      path: career.fields.slug,
      component: `${CareerPostTemplate}?__contentFilePath=${career.internal.contentFilePath}`,
      context: {
        slug: career.fields.slug,
      },
    });
  });

  members.forEach(member => {
    envCreatePage({
      path: member.fields.slug,
      component: MemberTemplate,
      context: {
        slug: member.fields.slug,
      },
    });
  });

  const MemberBio = res_memberBio.data.memberBio.nodes;
  MemberBio.forEach(memberbio => {
    envCreatePage({
      path: `${memberbio.fields.slug}/bio`,
      component: `${MemberBioTemplate}?__contentFilePath=${memberbio.internal.contentFilePath}`,
      context: {
        member: memberbio.frontmatter.name,
      },
    });
  });

  singleWorkshop.forEach(workshop => {
    envCreatePage({
      path: workshop.fields.slug,
      component: `${WorkshopTemplate}?__contentFilePath=${workshop.internal.contentFilePath}`,
      context: {
        slug: workshop.fields.slug,
      },
    });
  });

  labs.forEach(lab => {
    envCreatePage({
      path: lab.fields.slug,
      component: `${LabTemplate}?__contentFilePath=${lab.internal.contentFilePath}`,
      context: {
        slug: lab.fields.slug,
      },
    });
  });

  integrations.forEach((integration) => {
    envCreatePage({
      path: `/cloud-native-management/meshery${integration.fields.slug}`,
      component: `${integrationTemplate}?__contentFilePath=${integration.internal.contentFilePath}`,
      context: {
        slug: integration.fields.slug,
      },
    });
  });


  let programsArray = [];
  programs.forEach(program => {
    if (
      programsArray.indexOf(program.frontmatter.program) >= 0 &&
      program.frontmatter.program === "Layer5"
    ) {
      return false;
    } else {
      programsArray.push(program.frontmatter.program);
      envCreatePage({
        path: `/programs/${program.frontmatter.programSlug}`,
        component: `${MultiProgramPostTemplate}?__contentFilePath=${program.internal.contentFilePath}`,
        context: {
          program: program.frontmatter.program,
        },
      });
    }
  });

  const learnNodes = res_learncontent.data.learncontent.nodes;

  learnNodes.forEach((node) => {
    if (node.fields) {
      const { pageType } = node.fields;

      if (pageType === "learnpath") {
        createCoursesListPage({ envCreatePage, node });
        return;
      }

      if (pageType === "course") {
        createCourseOverviewPage({ envCreatePage, node });
        return;
      }

      if (pageType === "chapter") {
        createChapterPage({ envCreatePage, node });
        return;
      }

      if (pageType === "section") {
        createSectionPage({ envCreatePage, node });
        return;
      }
    }
  });
};

// slug starts and ends with '/' so parts[0] and parts[-1] will be empty
const getSlugParts = slug => slug.split("/").filter(p => !!p);

const onCreatePathNode = ({ actions, node, slug }) => {
  const { createNodeField } = actions;
  const parts = getSlugParts(slug);
  const [learnpath] = parts;

  createNodeField({ node, name: "learnpath", value: learnpath });
  createNodeField({ node, name: "slug", value: `learn/learning-paths${slug}` });
  createNodeField({ node, name: "permalink", value: `${config.siteMetadata.permalink}${slug}` });
  createNodeField({ node, name: "pageType", value: "learnpath" });
};

const onCreateCourseNode = ({ actions, node, slug }) => {
  const { createNodeField } = actions;
  const parts = getSlugParts(slug);
  const [learnpath, course] = parts;

  createNodeField({ node, name: "learnpath", value: learnpath });
  createNodeField({ node, name: "slug", value: `learn/learning-paths${slug}` });
  createNodeField({ node, name: "permalink", value: `${config.siteMetadata.permalink}${slug}` });
  createNodeField({ node, name: "course", value: course });
  createNodeField({ node, name: "pageType", value: "course" });
};

const onCreateSectionNode = ({ actions, node, slug }) => {
  const { createNodeField } = actions;
  const parts = getSlugParts(slug);
  const [learnpath, course, section] = parts;

  createNodeField({ node, name: "learnpath", value: learnpath });
  createNodeField({ node, name: "slug", value: `learn/learning-paths${slug}` });
  createNodeField({ node, name: "permalink", value: `${config.siteMetadata.permalink}${slug}` });
  createNodeField({ node, name: "course", value: course });
  createNodeField({ node, name: "section", value: section });
  createNodeField({ node, name: "pageType", value: "section" });
};

const onCreateChapterNode = ({ actions, node, slug }) => {
  const { createNodeField } = actions;
  const parts = getSlugParts(slug);
  const [learnpath, course, section, chapter] = parts;

  createNodeField({ node, name: "learnpath", value: learnpath });
  createNodeField({ node, name: "slug", value: `learn/learning-paths${slug}` });
  createNodeField({ node, name: "permalink", value: `${config.siteMetadata.permalink}${slug}` });
  createNodeField({ node, name: "chapter", value: chapter });
  createNodeField({ node, name: "course", value: course });
  createNodeField({ node, name: "section", value: section });
  createNodeField({ node, name: "pageType", value: "chapter" });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "Mdx") {
    const collection = getNode(node.parent).sourceInstanceName;
    createNodeField({
      name: "collection",
      node,
      value: collection
    });
    if (collection !== "content-learn") {
      let slug = "";
      if (node.frontmatter.permalink) {
        slug = `/${collection}/${node.frontmatter.permalink}`;
      } else {
        switch (collection) {
          case "blog":
            if (node.frontmatter.published)
              slug = `/${collection}/${slugify(node.frontmatter.category)}/${slugify(node.frontmatter.title)}`;
            break;
          case "news":
            if (node.frontmatter.published)
              slug = `/company/${collection}/${slugify(node.frontmatter.title)}`;
            break;
          case "service-mesh-books":
          case "service-mesh-workshops":
          case "service-mesh-labs":
            slug = `/learn/${collection}/${slugify(node.frontmatter.title)}`;
            break;
          case "resources":
            if (node.frontmatter.published)
              slug = `/${collection}/${slugify(node.frontmatter.category)}/${slugify(node.frontmatter.title)}`;
            break;
          case "members":
            if (node.frontmatter.published)
              slug = `/community/members/${slugify(node.frontmatter.name)}`;
            break;
          case "events":
            if (node.frontmatter.title)
              slug = `/community/events/${slugify(node.frontmatter.title)}`;
            break;
          default:
            if (!node.frontmatter.title) console.log("default", node);
            slug = `/${collection}/${slugify(node.frontmatter.title)}`;
        }
      }
      createNodeField({
        name: "slug",
        node,
        value: slug,
      });
    } else {
      const slug = createFilePath({
        node,
        getNode,
        basePath: "content-learn",
        trailingSlash: false
      });

      // slug starts and ends with '/' so parts[0] and parts[-1] will be empty
      const parts = slug.split("/").filter(p => !!p);

      if (parts.length === 1) {
        onCreatePathNode({ actions, node, slug });
        return;
      }

      if (parts.length === 2) {
        onCreateCourseNode({ actions, node, slug });
        return;
      }

      if (parts.length === 3) {
        onCreateSectionNode({ actions, node, slug });
        return;
      }

      if (parts.length === 4) {
        onCreateChapterNode({ actions, node, slug });
        return;
      }
    }
  }
};

const createCoursesListPage = ({ envCreatePage, node }) => {
  const { learnpath, slug, pageType, permalink } = node.fields;

  envCreatePage({

    path: `${slug}`,
    component: path.resolve("src/templates/courses-list.js"),
    context: {
      // Data passed to context is available in page queries as GraphQL variables.
      learnpath,
      slug,
      permalink,
      pageType,
    },
  });
};

const createCourseOverviewPage = ({ envCreatePage, node }) => {
  const {
    learnpath,
    slug,
    course,
    pageType,
    permalink,
  } = node.fields;

  envCreatePage({
    path: `${slug}`,
    component: `${path.resolve("src/templates/course-overview.js")}?__contentFilePath=${node.internal.contentFilePath}`,
    context: {
      learnpath,
      slug,
      course,
      pageType,
      permalink,
    },
  });
};

const createChapterPage = ({ envCreatePage, node }) => {
  const {
    learnpath,
    slug,
    course,
    section,
    chapter,
    pageType,
    permalink,
  } = node.fields;

  envCreatePage({

    path: `${slug}`,
    component: `${path.resolve("src/templates/learn-chapter.js")}?__contentFilePath=${node.internal.contentFilePath}`,
    context: {
      learnpath,
      slug,
      course,
      section,
      chapter,
      pageType,
      permalink,
    },
  });
};

const createSectionPage = ({ envCreatePage, node }) => {
  const {
    learnpath,
    slug,
    course,
    section,
    pageType,
    permalink,
  } = node.fields;

  envCreatePage({

    path: `${slug}`,
    component: path.resolve("src/sections/Learn-Layer5/Section/index.js"),
    context: {
      learnpath,
      slug,
      course,
      section,
      pageType,
      permalink,
    },
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
     type Mdx implements Node {
       frontmatter: Frontmatter
     }
     type Frontmatter {
       subtitle: String,
       abstract: String,
       eurl: String,
       twitter: String,
       github: String,
       layer5: String,
       meshmate: String,
       maintainer:String,
       emeritus: String,
       link: String,
       labs: String,
       slides: String,
       slack: String,
       video: String,
       community_manager: String,
       docURL: String, 

     }
   `;
  createTypes(typeDefs);
};