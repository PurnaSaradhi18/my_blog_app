import { getAllBlogPosts, getAllTopics } from "../../Lib/Data";
import { serialize } from "next-mdx-remote/serialize";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Head from "next/head";
import BlogInner from "../../Components/BlogInner";
import BlogShare from "../../Components/BlogShare";
import Comments from "../../Components/Comments";
import { SWRConfig } from "swr";
import { remarkHeadingId } from "remark-custom-heading-id";
import { getHeadings } from "../../Lib/GetHeadings";
import LikeBtn from "../../Components/LikeBtn";

export const getStaticPaths = () => {
  const allBlogs = getAllBlogPosts();

  // Sanitize the blog titles to remove invalid characters like ":"
  const sanitizeSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9- ]/g, '')  // Remove invalid characters
      .replace(/\s+/g, '-')  // Convert spaces to hyphens
      .replace(/-+/g, '-')  // Replace multiple hyphens with a single one
      .trim();
  };

  return {
    paths: allBlogs.map((blog) => ({
      params: {
        id: sanitizeSlug(blog.data.Title),  // Apply the sanitizeSlug function
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const params = context.params;
  const allBlogs = getAllBlogPosts();
  const allTopics = getAllTopics();

  // Sanitize function for comparison (reuse from getStaticPaths)
  const sanitizeSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9- ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  console.log('Requested ID:', params.id);

  const page = allBlogs.find((blog) => {
    const slug = sanitizeSlug(blog.data.Title);
    console.log('Sanitized Slug:', slug); // Logging each slug being compared
    return slug === params.id;
  });

  const { data, content } = page;
  const mdxSource = await serialize(content, {
    scope: data,
    mdxOptions: { remarkPlugins: [remarkHeadingId] },
  });

  const headings = await getHeadings(content);

  return {
    props: {
      data: data,
      content: mdxSource,
      id: params.id,
      headings: headings,
      topics: allTopics,
    },
  };
};


function id({ data, content, id, headings, topics }) {
  return (
    <>
      <Head>
        <title>{data.Title}</title>
        <meta name="title" content={data.Title} />
        <meta name="description" content={data.Abstract} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blogs.soumya-jit.tech/" />
        <meta property="og:title" content={data.Title} />
        <meta property="og:description" content={data.Abstract} />
        <meta
          property="og:image"
          content={`https://raw.githubusercontent.com/soumyajit4419/Bits-0f-C0de/main/public${data.HeaderImage}`}
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://blogs.soumya-jit.tech/" />
        <meta property="twitter:title" content={data.Title} />
        <meta property="twitter:description" content={data.Abstract} />
        <meta
          property="twitter:image"
          content={`https://raw.githubusercontent.com/soumyajit4419/Bits-0f-C0de/main/public${data.HeaderImage}`}
        />
      </Head>

      <div className="min-h-screen relative bg-white dark:bg-gray-900">
        <Navbar topics={topics} />
        <div className="py-24">
          <BlogInner data={data} content={content} headings={headings} />
          <LikeBtn id={id} />
          <BlogShare data={data} />

          <SWRConfig>
            <Comments id={id} />
          </SWRConfig>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default id;
