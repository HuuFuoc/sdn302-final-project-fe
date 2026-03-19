import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { BlogService } from "../../../services/blog/blog.service";
import { UserService } from "../../../services/user/user.service";
import type { BlogRequest } from "../../../types/blog/Blog.req.type";
import type { Blog } from "../../../types/blog/Blog.res.type";
import CreateBlogForm from "./CreateBlog.com";
import DeleteBlog from "./DeleteBlog.com";
import UpdateBlogForm from "./UpdateBlog.com";
import CustomPagination from "../../common/Pagiation.com";
import { helpers } from "../../../utils";

const { Title, Text } = Typography;

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
  const [authorIdInput, setAuthorIdInput] = useState("");
  const [authorIdApplied, setAuthorIdApplied] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchKeyword]);

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
        fullName: blog.fullName || userInfo?.fullName || "Không rõ",
        userAvatar: blog.userAvatar || userInfo?.userAvatar || "",
      };
    });
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let source: Blog[] = [];

      // Case 1: filter by author id => use GET /api/blog/user/{userId}
      if (authorIdApplied.trim()) {
        const res = await BlogService.getBlogsByUserId({ userId: authorIdApplied.trim() });
        const data = res.data as any;
        source = Array.isArray(data?.data) ? data.data : [];

        if (debouncedSearchKeyword.trim()) {
          const keyword = debouncedSearchKeyword.trim().toLowerCase();
          source = source.filter((item) =>
            `${item.title} ${item.content}`.toLowerCase().includes(keyword),
          );
        }

        const enriched = await enrichBlogsWithUserInfo(source);
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        setBlogs(enriched.slice(start, end));
        setTotal(enriched.length);
        return;
      }

      // Case 2: default list => use GET /api/blog with paging and keyword
      const params: BlogRequest = {
        pageNumber: current,
        pageSize,
        filterByContent: debouncedSearchKeyword.trim() || undefined,
      };

      const res = await BlogService.getAllBlogs(params);
      const data = res.data as any;
      const rows = Array.isArray(data?.data) ? data.data : [];
      const enriched = await enrichBlogsWithUserInfo(rows);

      setBlogs(enriched);
      setTotal(data?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching blog list:", error);
      setBlogs([]);
      setTotal(0);
      message.error("Không thể tải danh sách bài đăng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [current, pageSize, debouncedSearchKeyword, authorIdApplied]);

  const handleViewBlog = async (id: string) => {
    setShowViewModal(true);
    setViewLoading(true);
    try {
      // GET /api/blog/{id}
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
      message.error("Không thể tải chi tiết bài đăng");
    } finally {
      setViewLoading(false);
    }
  };

  const onCreated = () => {
    setShowCreateModal(false);
    fetchBlogs();
  };

  const onUpdated = () => {
    setShowUpdateModal(false);
    setSelectedBlog(null);
    fetchBlogs();
  };

  const resetFilters = () => {
    setCurrent(1);
    setSearchKeyword("");
    setDebouncedSearchKeyword("");
    setAuthorIdInput("");
    setAuthorIdApplied("");
  };

  const stats = useMemo(() => {
    const deleted = blogs.filter((item) => item.isDeleted).length;
    const active = blogs.length - deleted;
    return {
      currentPageCount: blogs.length,
      active,
      deleted,
    };
  }, [blogs]);

  const columns: ColumnsType<Blog> = [
    {
      title: "Ảnh",
      dataIndex: "blogImgUrl",
      key: "blogImgUrl",
      width: 100,
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="blog"
            width={72}
            height={52}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <Text type="secondary">Không có</Text>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Text strong>{text || "(Không tiêu đề)"}</Text>,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (content: string) => (
        <Text className="line-clamp-2" style={{ maxWidth: 360 }}>
          {content || "Không có nội dung"}
        </Text>
      ),
    },
    {
      title: "Người đăng",
      key: "author",
      width: 220,
      render: (_: unknown, record: Blog) => {
        const fallbackId = record.user_id || record.userId || "Không rõ";
        const displayName = record.fullName?.trim() || fallbackId;

        return (
          <Space>
            <Avatar src={record.userAvatar} icon={<UserOutlined />} />
            <div>
              <div>{displayName}</div>
              {displayName !== fallbackId ? (
                <Text type="secondary" className="text-xs">
                  {fallbackId}
                </Text>
              ) : null}
            </div>
          </Space>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (date: string) => {
        if (!date) return <Text type="secondary">-</Text>;
        return <Text>{helpers.formatDate(new Date(date))}</Text>;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_: unknown, record: Blog) =>
        record.isDeleted ? <Tag color="red">Đã xóa</Tag> : <Tag color="green">Hiển thị</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      render: (_: unknown, record: Blog) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              shape="circle"
              size="small"
              onClick={() => handleViewBlog(record.id)}
            />
          </Tooltip>

          {!record.isDeleted && (
            <>
              <Tooltip title="Cập nhật">
                <Button
                  icon={<EditOutlined />}
                  shape="circle"
                  size="small"
                  onClick={() => {
                    setSelectedBlog(record);
                    setShowUpdateModal(true);
                  }}
                />
              </Tooltip>
              <DeleteBlog
                blogId={record.id}
                onDeleted={fetchBlogs}
                buttonProps={{
                  icon: <DeleteOutlined />,
                  shape: "circle",
                  size: "small",
                  danger: true,
                }}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title level={4} className="!mb-1">Quản lý bài đăng</Title>
          </div>
          <Button type="primary" icon={<PlusOutlined />} className="bg-[#20558A]" onClick={() => setShowCreateModal(true)}>
            Tạo bài đăng
          </Button>
        </div>
      </Card>

      <Row gutter={[12, 12]}>
        <Col xs={24} md={8}>
          <Card size="small">
            <Text type="secondary">Bài đăng trang hiện tại</Text>
            <Title level={3} className="!mb-0">{stats.currentPageCount}</Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small">
            <Text type="secondary">Đang hiển thị</Text>
            <Title level={3} className="!mb-0 text-green-600">{stats.active}</Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small">
            <Text type="secondary">Đã xóa</Text>
            <Title level={3} className="!mb-0 text-red-500">{stats.deleted}</Title>
          </Card>
        </Col>
      </Row>

      <Card>
        <Space wrap className="w-full">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm theo tiêu đề hoặc nội dung"
            value={searchKeyword}
            onChange={(e) => {
              setCurrent(1);
              setSearchKeyword(e.target.value);
            }}
            style={{ width: 320 }}
          />

          <Input
            allowClear
            placeholder="Lọc theo ID người đăng (tuỳ chọn)"
            value={authorIdInput}
            onChange={(e) => setAuthorIdInput(e.target.value)}
            style={{ width: 280 }}
          />

          <Button
            type="default"
            onClick={() => {
              setCurrent(1);
              setAuthorIdApplied(authorIdInput.trim());
            }}
          >
            Áp dụng lọc người đăng
          </Button>

          <Button icon={<ReloadOutlined />} onClick={resetFilters}>
            Xóa lọc
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={blogs}
          loading={loading}
          pagination={false}
          scroll={{ x: 1100 }}
          locale={{ emptyText: "Chưa có bài đăng." }}
        />
        <div className="mt-4">
          <CustomPagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={(page: number, size: number) => {
              setCurrent(page);
              setPageSize(size);
            }}
          />
        </div>
      </Card>

      <Modal
        open={showCreateModal}
        title={null}
        footer={null}
        width={760}
        onCancel={() => setShowCreateModal(false)}
        destroyOnClose
      >
        <CreateBlogForm onSuccess={onCreated} />
      </Modal>

      <Modal
        open={showUpdateModal}
        title={null}
        footer={null}
        width={760}
        onCancel={() => {
          setShowUpdateModal(false);
          setSelectedBlog(null);
        }}
        destroyOnClose
      >
        {selectedBlog ? <UpdateBlogForm blog={selectedBlog} onSuccess={onUpdated} /> : null}
      </Modal>

      <Modal
        open={showViewModal}
        title="Chi tiết bài đăng"
        footer={null}
        width={760}
        onCancel={() => setShowViewModal(false)}
      >
        {viewLoading ? (
          <Text>Đang tải...</Text>
        ) : viewingBlog ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tiêu đề">{viewingBlog.title}</Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              <div className="whitespace-pre-wrap">{viewingBlog.content}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Ảnh">
              {viewingBlog.blogImgUrl ? (
                <Image src={viewingBlog.blogImgUrl} width={180} />
              ) : (
                <Text type="secondary">Không có ảnh</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Người đăng">
              <Space>
                <Avatar src={viewingBlog.userAvatar} icon={<UserOutlined />} />
                <Text>{viewingBlog.fullName || viewingBlog.user_id || viewingBlog.userId}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {viewingBlog.createdAt ? helpers.formatDate(new Date(viewingBlog.createdAt)) : "-"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Text type="secondary">Không tìm thấy bài đăng.</Text>
        )}
      </Modal>
    </div>
  );
};

export default AdminBlogManager;
