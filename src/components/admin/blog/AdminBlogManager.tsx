import { useEffect, useState } from "react";
import { BlogService } from "../../../services/blog/blog.service";
import { UserService } from "../../../services/user/user.service";
import type { BlogRequest } from "../../../types/blog/Blog.req.type";
import type { Blog } from "../../../types/blog/Blog.res.type";
import { Table, Button, message, Image, Modal, Tooltip, Input } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import CreateBlogForm from "./CreateBlog.com";
import DeleteBlog from "./DeleteBlog.com";
import UpdateBlogForm from "./UpdateBlog.com";
import CustomPagination from "../../common/Pagiation.com";
import CustomSearch from "../../common/CustomSearch.com";
import { helpers } from "../../../utils";

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [appliedUserId, setAppliedUserId] = useState("");

  // Thêm state cho View
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const enrichBlogsWithUserInfo = async (items: Blog[]) => {
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
      const directName =
        rawUser?.fullName || rawUser?.full_name || rawUser?.name || "";
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
        fullName: blog.fullName || userInfo?.fullName || "Không rõ",
        userAvatar: blog.userAvatar || userInfo?.userAvatar || "",
      };
    });
  };

  const fetchBlogs = async () => {
    setLoading(true);
    const params: BlogRequest = {
      pageNumber: current,
      pageSize: pageSize,
      filterByContent: searchKeyword,
    };
    try {
      if (appliedUserId.trim()) {
        const res = await BlogService.getBlogsByUserId({ user_id: appliedUserId.trim() });
        const data = res.data as any;
        const mappedBlogs = Array.isArray(data?.data) ? data.data : [];
        const enrichedBlogs = await enrichBlogsWithUserInfo(mappedBlogs);
        setBlogs(enrichedBlogs);
        setTotal(data?.totalCount || mappedBlogs.length || 0);
      } else {
        const res = await BlogService.getAllBlogs(params);
        const data = res.data as any;
        const mappedBlogs = Array.isArray(data?.data) ? data.data : [];
        const enrichedBlogs = await enrichBlogsWithUserInfo(mappedBlogs);
        setBlogs(enrichedBlogs);
        setTotal(data?.totalCount || 0);
      }
    } catch (err) {
      setBlogs([]);
      message.error("Lỗi khi lấy danh sách blog!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [current, pageSize, searchKeyword]);

  useEffect(() => {
    fetchBlogs();
  }, [appliedUserId]);

  const handleBlogCreated = () => {
    setShowModal(false);
    fetchBlogs();
  };

  const handleBlogUpdated = () => {
    setShowUpdateModal(false);
    fetchBlogs();
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  // Hàm view blog
  const handleViewBlog = async (id: string) => {
    setShowViewModal(true);
    setViewLoading(true);
    try {
      const res = await BlogService.getBlogById({ id });
      const rawBlog = (res.data?.data || null) as Blog | null;
      if (!rawBlog) {
        setViewingBlog(null);
        return;
      }

      const enriched = await enrichBlogsWithUserInfo([rawBlog]);
      setViewingBlog(enriched[0] || rawBlog);
    } catch {
      setViewingBlog(null);
      message.error("Không thể tải chi tiết blog!");
    } finally {
      setViewLoading(false);
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "blogImgUrl",
      key: "blogImgUrl",
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="blog"
            width={80}
            height={60}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span>Không có ảnh</span>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
      width: 180,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text: string) => (
        <div style={{ maxWidth: 300, whiteSpace: "pre-line" }}>{text}</div>
      ),
    },
    {
      title: "Người đăng",
      dataIndex: "user_id",
      key: "user_id",
      render: (_: string, record: Blog) => {
        const displayName = (record.fullName || "").trim();
        const fallbackId = record.user_id || record.userId || "";

        return (
          <div className="flex items-center gap-2">
            <img
              src={record.userAvatar || "/no-avatar.png"}
              alt={displayName || fallbackId || "Không rõ"}
              className="w-8 h-8 rounded-full object-cover border"
            />
            <div className="flex flex-col">
              <span>{displayName || fallbackId || "Không rõ"}</span>
              {!displayName && fallbackId ? (
                <span className="text-xs text-gray-500">{fallbackId}</span>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => helpers.formatDate(new Date(date)),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Blog) => (
        <div className="flex gap-2">
          {!record.isDeleted && (
            <>
              <Tooltip title="Xem chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  shape="circle"
                  type="default"
                  size="small"
                  onClick={() => handleViewBlog(record.id)}
                />
              </Tooltip>
              <Tooltip title="Cập nhật">
                <Button
                  icon={<EditOutlined />}
                  shape="circle"
                  type="default"
                  size="small"
                  onClick={() => {
                    setSelectedBlog(record);
                    setShowUpdateModal(true);
                  }}
                  style={{ borderColor: "#1677ff", color: "#1677ff" }}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <DeleteBlog
                  blogId={record.id}
                  onDeleted={fetchBlogs}
                  buttonProps={{
                    icon: <DeleteOutlined />,
                    shape: "circle",
                    danger: true,
                    size: "small",
                    style: { borderColor: "#ff4d4f", color: "#ff4d4f" },
                  }}
                />
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow relative">
      <Button
        type="primary"
        className="absolute top-6 right-6 bg-[#20558A]"
        onClick={() => setShowModal(true)}
      >
        Tạo blog mới
      </Button>

      {/* Thanh tìm kiếm */}
      <CustomSearch
        onSearch={(keyword) => {
          setCurrent(1);
          setSearchKeyword(keyword);
        }}
        className="mb-4"
        placeholder="Tìm kiếm theo tiêu đề blog"
        inputWidth="w-96"
      />



      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />

      <CustomPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
      />

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={600}
      >
        <CreateBlogForm onSuccess={handleBlogCreated} />
      </Modal>

      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        width={600}
      >
        {selectedBlog && (
          <UpdateBlogForm blog={selectedBlog} onSuccess={handleBlogUpdated} />
        )}
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        footer={null}
        title="Chi tiết blog"
        width={600}
      >
        {viewLoading ? (
          <div>Đang tải...</div>
        ) : viewingBlog ? (
          <div className="space-y-4">
            <div>
              <strong>Tiêu đề:</strong>
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                {viewingBlog.title}
              </div>
            </div>
            <div>
              <strong>Nội dung:</strong>
              <div style={{ whiteSpace: "pre-line" }}>
                {viewingBlog.content}
              </div>
            </div>
            <div>
              <strong>Ảnh:</strong>
              <div>
                {viewingBlog.blogImgUrl ? (
                  <Image
                    src={viewingBlog.blogImgUrl}
                    alt="blog"
                    width={120}
                    height={90}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span>Không có ảnh</span>
                )}
              </div>
            </div>
            <div>
              <strong>Người đăng:</strong>
              <div className="flex items-center gap-2">
                {(() => {
                  const displayName = (viewingBlog.fullName || "").trim();
                  const fallbackId = viewingBlog.user_id || viewingBlog.userId || "";

                  return (
                    <>
                      <img
                        src={viewingBlog.userAvatar || "/no-avatar.png"}
                        alt={displayName || fallbackId || "Không rõ"}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <span>{displayName || fallbackId || "Không rõ"}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <div>
              <strong>Ngày tạo:</strong>
              <div>{helpers.formatDate(new Date(viewingBlog.createdAt))}</div>
            </div>
          </div>
        ) : (
          <div>Không tìm thấy blog.</div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBlogManager;
