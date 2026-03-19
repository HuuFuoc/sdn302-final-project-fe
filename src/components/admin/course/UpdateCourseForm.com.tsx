import React, { useState, useEffect } from "react";
import type { Course } from "../../../types/course/Course.res.type";
import { useUpdateCourse } from "../../../hooks/useCourse";
import { BaseService } from "../../../app/api/base.service";
import { CourseStatus } from "../../../app/enums/courseStatus.enum";
import { CourseTargetAudience } from "../../../app/enums/courseTargetAudience.enum";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";
import { message } from "antd";
import Editor from "../../common/Editor.com";

interface UpdateCourseFormProps {
  course: Course;
  onSuccess?: () => void;
}

const UpdateCourseForm: React.FC<UpdateCourseFormProps> = ({
  course,
  onSuccess,
}) => {
  const { mutate: updateCourse, isPending } = useUpdateCourse();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [status, setStatus] = useState<CourseStatus>(CourseStatus.DRAFT);

  useEffect(() => {
    if (course) {
      setTitle(course.name || "");
      setContent(course.content || "");
      setImageUrls(course.imageUrls || []);
      setVideoUrls(course.videoUrls || []);
      setPrice(course.price || 0);
      setDiscount(course.discount || 0);
      setPreviewImage(course.imageUrls?.[0] || "");
      setStatus(course.status || CourseStatus.DRAFT);
    }
  }, [course]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewImage(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setPreviewImage(course.imageUrls?.[0] || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !status) {
      message.warning("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    let updatedImageUrls = imageUrls;

    if (file) {
      const uploadedUrl = await BaseService.uploadFile(file);
      if (uploadedUrl) {
        updatedImageUrls = [uploadedUrl];
        setImageUrls(updatedImageUrls);
      } else {
        message.error("Upload ảnh thất bại.");
        return;
      }
    }

    updateCourse(
      {
        id: course.id,
        name: title,
        content,
        categoryId: course.categoryId,
        targetAudience: (course.targetAudience || CourseTargetAudience.GENERAL_PUBLIC) as CourseTargetAudience,
        riskLevel: (course.riskLevel || RiskLevel.LOW) as RiskLevel,
        imageUrls: updatedImageUrls,
        videoUrls,
        price,
        discount,
        status: status as CourseStatus,
        updatedAt: new Date().toISOString(),
        slug: course.slug,
        userId: course.userId,
      },
      {
        onSuccess: () => {
          message.success("Cập nhật khóa học thành công!");
          if (onSuccess) onSuccess();
        },
        onError: () => {
          message.error("Cập nhật khóa học thất bại.");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-800 text-center">
        Cập nhật khóa học
      </h2>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Tên khóa học</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Nội dung khóa học</label>
        <Editor value={content} onChange={(value) => setContent(value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Giá</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Giảm giá</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Ảnh minh họa</label>
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border shadow"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Trạng thái khóa học</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CourseStatus)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          required
        >
          <option value={CourseStatus.DRAFT}>Nháp (draft)</option>
          <option value={CourseStatus.PUBLISHED}>Đã xuất bản (published)</option>
          <option value={CourseStatus.ARCHIVED}>Lưu trữ (archived)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r bg-[#20558A] text-white font-bold py-3 rounded-lg transition"
      >
        {isPending ? "Đang cập nhật..." : "Cập nhật khóa học"}
      </button>
    </form>
  );
};

export default UpdateCourseForm;
