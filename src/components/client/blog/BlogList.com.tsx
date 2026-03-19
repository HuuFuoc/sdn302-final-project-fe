import { useEffect, useState } from "react";
import { BlogService } from "../../../services/blog/blog.service";
import { UserService } from "../../../services/user/user.service";
import type { Blog } from "../../../types/blog/Blog.res.type";
import type { BlogRequest } from "../../../types/blog/Blog.req.type";
import CustomPagination from "../../common/Pagiation.com";
import BlogCard from "./BlogCard.com";

const enrichBlogsWithUserInfo = async (items: Blog[]): Promise<Blog[]> => {
  const userIds = Array.from(
    new Set(
      items
        .map((blog) => blog.user_id || blog.userId)
        .filter((id): id is string => Boolean(id && id.trim())),
    ),
  );

  if (userIds.length === 0) return items;

  const userMap = new Map<string, { fullName?: string; userAvatar?: string }>();

  const userResults = await Promise.allSettled(
    userIds.map((id) => UserService.getUserById({ userId: id })),
  );

  const extractUserPayload = (response: any) => {
    const data = response?.data;
    if (!data) return {};
    return data.data || data.user || data;
  };

  const extractUserFullName = (rawUser: any) => {
    const directName = rawUser?.fullName || rawUser?.full_name || rawUser?.name || "";
    if (directName && String(directName).trim()) return String(directName).trim();

    const firstName = rawUser?.firstName || rawUser?.first_name || "";
    const lastName = rawUser?.lastName || rawUser?.last_name || "";
    return `${firstName} ${lastName}`.trim();
  };

  const extractUserAvatar = (rawUser: any) =>
    rawUser?.profilePicUrl ||
    rawUser?.profile_pic_url ||
    rawUser?.avatar ||
    rawUser?.avatarUrl ||
    "";

  userResults.forEach((result, index) => {
    if (result.status !== "fulfilled") return;

    const userId = userIds[index];
    const rawUser = extractUserPayload(result.value);
    const fullName = extractUserFullName(rawUser);
    const userAvatar = extractUserAvatar(rawUser);

    userMap.set(userId, { fullName, userAvatar });
  });

  return items.map((blog) => {
    const blogUserId = blog.user_id || blog.userId;
    const userInfo = blogUserId ? userMap.get(blogUserId) : undefined;

    return {
      ...blog,
      fullName: blog.fullName || userInfo?.fullName || "Tác giả",
      userAvatar: blog.userAvatar || userInfo?.userAvatar || "",
    };
  });
};

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async (page = 1, size = 6) => {
    setLoading(true);
    const params: BlogRequest = { pageNumber: page, pageSize: size };
    try {
      const res = await BlogService.getAllBlogs(params);
      const data = res.data as any;
      const rawBlogs = Array.isArray(data?.data) ? data.data : [];
      setTotal(data?.totalCount || 0);

      const enrichedBlogs = await enrichBlogsWithUserInfo(rawBlogs);
      setBlogs(enrichedBlogs);
    } catch (err) {
      setBlogs([]);
      console.error("Lỗi khi lấy bài đăng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(current, pageSize);
  }, [current, pageSize]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-lg text-gray-600 mt-4">Đang tải...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">📝</div>
            <p className="text-xl text-gray-500">Không có bài đăng nào.</p>
          </div>
        ) : (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <CustomPagination
                current={current}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;
