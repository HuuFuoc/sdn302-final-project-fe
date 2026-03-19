import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { CourseService } from "../../services/course/course.service";
import type { Course } from "../../types/course/Course.res.type";
import { ROUTER_URL } from "../../consts/router.path.const";
import { DOMAIN_API } from "../../consts/domain.const";

const toImageUrl = (url?: string) => {
  if (!url) return "";
  const u = url.trim().replace(/\\/g, "/");
  if (/^(https?:)?\/\//i.test(u) || u.startsWith("data:")) return u;
  const base = DOMAIN_API.replace(/\/+$/, "");
  return u.startsWith("/") ? `${base}${u}` : `${base}/${u}`;
};

const formatPrice = (price: number) => {
  if (price === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

const FeaturedCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await CourseService.getAllCourses({ pageNumber: 1, pageSize: 6 });
        const raw = res.data?.data as Course[] | { pageData?: Course[] } | undefined;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as { pageData?: Course[] })?.pageData)
            ? (raw as { pageData: Course[] }).pageData
            : [];
        setCourses(list);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section className="py-20 px-6 bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Khóa học nổi bật
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Các khóa học được phụ huynh và học viên đánh giá cao. Chọn khóa phù hợp với độ tuổi và sở thích của bé.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 6).map((course) => {
              const img = course.imageUrls?.[0] ? toImageUrl(course.imageUrls[0]) : "";
              return (
                <Link
                  key={course.id}
                  to={ROUTER_URL.CLIENT.COURSE_DETAIL.replace(":courseId", course.id)}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                        <span className="text-4xl font-bold opacity-50">ART</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-primary font-semibold">{formatPrice(course.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to={ROUTER_URL.CLIENT.COURSE}
            className="inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-white bg-primary hover:bg-primary-600 transition-colors"
          >
            Xem tất cả khóa học
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
