import React, { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { useCreateCourse } from "../../../hooks/useCourse";
import type { CreateCourseRequest } from "../../../types/course/Course.req.type";
import { CategoryService } from "../../../services/category/category.service";
import { useAuth } from "../../../contexts/Auth.context";
import Editor from "../../common/Editor.com";

interface CreateCourseFormProps {
  onSuccess?: () => void;
}

type CategoryLike = {
  id?: string;
  _id?: string;
  category_id?: string;
  name?: string;
};

const objectIdRegex = /^[a-f\d]{24}$/i;

const toVietnameseSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const pickCategoryId = (list: CategoryLike[]) => {
  for (const item of list) {
    const id = item.id || item._id || item.category_id || "";
    if (objectIdRegex.test(id)) {
      return id;
    }
  }
  return "";
};

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({ onSuccess }) => {
  const { mutate: createCourse, isPending } = useCreateCourse();
  const { userInfo } = useAuth();

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryService.getAllCategories({
          pageNumber: 1,
          pageSize: 100,
        });
        const list = (res.data?.data || []) as CategoryLike[];
        setCategoryId(pickCategoryId(list));
      } catch {
        setCategoryId("");
      }
    };

    fetchCategories();
  }, []);

  const userId = useMemo(() => {
    const typed = userInfo?.id || "";
    const anyUser = userInfo as unknown as { _id?: string } | null;
    const fromContext = typed || anyUser?._id || "";
    if (fromContext) return fromContext;

    try {
      const raw = localStorage.getItem("userInfo");
      if (!raw) return "";
      const parsed = JSON.parse(raw) as { id?: string; _id?: string };
      return parsed.id || parsed._id || "";
    } catch {
      return "";
    }
  }, [userInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      message.warning("Vui lòng nhập tên và nội dung khóa học!");
      return;
    }

    if (!objectIdRegex.test(userId)) {
      message.error("Không lấy được user_id hợp lệ để tạo khóa học.");
      return;
    }

    if (!objectIdRegex.test(categoryId)) {
      message.error("Không lấy được category_id hợp lệ. Vui lòng kiểm tra danh mục trên hệ thống.");
      return;
    }

    const payload: CreateCourseRequest = {
      name: name.trim(),
      slug: toVietnameseSlug(name),
      user_id: userId,
      category_id: categoryId,
      content,
      price: price || 0,
      discount: discount || 0,
    };

    createCourse(payload, {
      onSuccess: () => {
        message.success("Tạo khóa học thành công!");
        setName("");
        setContent("");
        setPrice(0);
        setDiscount(0);
        if (onSuccess) onSuccess();
      },
      onError: () => {
        message.error("Tạo khóa học thất bại. Vui lòng kiểm tra lại dữ liệu.");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white rounded-xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#20558A] mb-2 text-center">
        Tạo khóa học mới
      </h2>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Tên khóa học</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          placeholder="Nhập tên khóa học"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Nội dung khóa học</label>
        <Editor height={300} value={content} onChange={setContent} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Giá (VNĐ)</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Giảm giá</label>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md transition disabled:opacity-60"
      >
        {isPending ? "Đang tạo..." : "Tạo khóa học"}
      </button>
    </form>
  );
};

export default CreateCourseForm;
