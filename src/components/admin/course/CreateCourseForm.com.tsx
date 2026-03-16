import React, { useEffect, useMemo, useState } from "react";
import { message, Select } from "antd";
import { useCreateCourse } from "../../../hooks/useCourse";
import type { CreateCourseRequest } from "../../../types/course/Course.req.type";
import { CategoryService } from "../../../services/category/category.service";
import { useAuth } from "../../../contexts/Auth.context";
import Editor from "../../common/Editor.com";
import { uploadFileToS3 } from "../../../utils/upload";

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
  const [categories, setCategories] = useState<CategoryLike[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      setCategoryError(null);
      try {
        const res = await CategoryService.getAllCategories({
          pageNumber: 1,
          pageSize: 100,
        });
        const list = (res.data?.data || []) as CategoryLike[];
        setCategories(list);
        const picked = pickCategoryId(list);
        setCategoryId(picked);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        setCategoryError("Không thể tải danh mục. Vui lòng thử lại sau.");
        setCategoryId("");
      } finally {
        setCategoryLoading(false);
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

    if (!name.trim()) {
      message.warning("Vui lòng nhập tên khóa học!");
      return;
    }

    if (!content.trim()) {
      message.warning("Vui lòng nhập nội dung khóa học!");
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

    if (price < 0 || discount < 0) {
      message.error("Giá và giảm giá không được âm.");
      return;
    }

    const generatedSlug = toVietnameseSlug(name);
    if (!generatedSlug) {
      message.warning("Slug không hợp lệ. Vui lòng kiểm tra lại tên khóa học.");
      return;
    }

    const payload: CreateCourseRequest = {
      name: name.trim(),
      slug: generatedSlug,
      user_id: userId,
      category_id: categoryId,
      content,
      price: price || 0,
      discount: discount || 0,
      imageUrl: imageUrl.trim(),
      imageUrls: imageUrl.trim() ? [imageUrl.trim()] : [],
    };

    createCourse(payload, {
      onSuccess: () => {
        message.success("Tạo khóa học thành công!");
        setName("");
        setContent("");
        setPrice(0);
        setDiscount(0);
        setImageUrl("");
        setImageFile(null);
        setImagePreview("");
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
      className="max-w-2xl mx-auto p-6 bg-white rounded-2xl space-y-6"
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
          <label className="block mb-2 font-semibold text-gray-700">Danh mục</label>
          <Select
            value={categoryId || undefined}
            onChange={(value) => setCategoryId(value)}
            placeholder={
              categoryLoading
                ? "Đang tải danh mục..."
                : categoryError
                ? "Không thể tải danh mục"
                : "Chọn danh mục"
            }
            className="w-full"
            loading={categoryLoading}
            disabled={categoryLoading || !!categoryError}
          >
            {categories.map((cat) => {
              const id = cat.id || cat._id || cat.category_id || "";
              const label = cat.name || id;
              if (!id) return null;
              return (
                <Select.Option key={id} value={id}>
                  {label}
                </Select.Option>
              );
            })}
          </Select>
          {categoryError && (
            <p className="mt-1 text-xs text-red-500">{categoryError}</p>
          )}
        </div>
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

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Ảnh đại diện</label>
        <input
          type="file"
          accept="image/*"
          className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImageFile(file);
            if (file) {
              setImagePreview(URL.createObjectURL(file));
            } else {
              setImagePreview("");
            }
          }}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            className="mt-3 w-40 h-28 object-cover rounded-lg border"
          />
        )}
        <button
          type="button"
          className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60"
          disabled={!imageFile || imageUploading}
          onClick={async () => {
            if (!imageFile) return;
            try {
              setImageUploading(true);
              const uploaded = await uploadFileToS3(imageFile);
              setImageUrl(uploaded.url);
              message.success("Tải ảnh lên thành công!");
            } catch {
              // error đã được upload util handle
            } finally {
              setImageUploading(false);
            }
          }}
        >
          {imageUploading ? "Đang tải ảnh..." : "Upload ảnh lên hệ thống"}
        </button>
        {imageUrl && (
          <p className="mt-1 text-xs text-gray-500 break-all">
            URL ảnh đã lưu: <span className="font-mono">{imageUrl}</span>
          </p>
        )}
      </div>

      {/* imageUrls vẫn gửi lên backend dưới dạng mảng, được lấy từ imageUrl ở trên */}

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
