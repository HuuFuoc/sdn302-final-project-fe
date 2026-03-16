import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CourseService } from "../../../../services/course/course.service";
import type { Course } from "../../../../types/course/Course.res.type";
import CourseListHero from "./CourseListHero.com.tsx";
import CourseListFilters from "./CourseListFilters.com.tsx";
import CourseListGrid from "./CourseListGrid.com.tsx";
import { CourseStatus } from "../../../../app/enums/courseStatus.enum";

const itemsPerPage = 12;

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourseIds, setMyCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceSort, setPriceSort] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchMyCourses = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    const isLoggedIn = Boolean(token && userInfo);

    if (!isLoggedIn) {
      setMyCourseIds(new Set());
      return;
    }

    try {
      const res = await CourseService.getMyCourses();
      const rawCourses = Array.isArray(res.data?.data) ? res.data.data : [];
      const ids = rawCourses
        .map((course) => {
          const raw = course as Course & { _id?: string; courseId?: string };
          return raw.id ?? raw._id ?? raw.courseId ?? "";
        })
        .filter((id): id is string => Boolean(id));

      setMyCourseIds(new Set(ids));
    } catch {
      // Fallback empty set to avoid UI crash when my-courses API fails
      setMyCourseIds(new Set());
    }
  }, []);

  const fetchCourses = useCallback(
    async (page = 1, size = itemsPerPage) => {
      setLoading(true);
      const params = {
        pageNumber: 1,
        pageSize: 50,
      };

      try {
        const res = await CourseService.getAllCourses(params as never);
        const data = res.data as { data?: Course[] | unknown };

        const rawCourses = Array.isArray(data?.data)
          ? (data.data as Course[])
          : [];

        // Normalize id & image fields (backend may return _id, imageUrl)
        const normalizedCourses: Course[] = rawCourses.map((course) => {
          const c = course as Course & {
            _id?: string;
            courseId?: string;
            imageUrl?: string;
            description?: string;
          };

          const imageUrls =
            Array.isArray(c.imageUrls) && c.imageUrls.length > 0
              ? c.imageUrls
              : c.imageUrl
                ? [c.imageUrl]
                : [];

          return {
            ...c,
            id: c.id ?? c._id ?? c.courseId ?? "",
            imageUrls,
          };
        });

        // Lọc chỉ lấy course có status là "published"
        let filteredCourses = normalizedCourses.filter(
          (course) => course.status === CourseStatus.PUBLISHED,
        );

        // FRONTEND FILTERING
        // 1. Filter by search term
        if (searchTerm && searchTerm.trim() !== "") {
          const searchLower = searchTerm.toLowerCase().trim();
          filteredCourses = filteredCourses.filter(
            (course) =>
              course.name?.toLowerCase().includes(searchLower) ||
              (course as { description?: string }).description
                ?.toLowerCase()
                .includes(searchLower),
          );
        }

        // 2. Filter by category
        if (selectedCategory && selectedCategory !== "") {
          filteredCourses = filteredCourses.filter(
            (course) => course.categoryId === selectedCategory,
          );
        }

        // 3. Filter by target audience
        if (targetAudience && targetAudience !== "") {
          filteredCourses = filteredCourses.filter(
            (course) => course.targetAudience === targetAudience,
          );
        }

        // 4. Sort by price
        if (priceSort && priceSort !== "") {
          filteredCourses.sort((a, b) => {
            const priceA = a.price || 0;
            const priceB = b.price || 0;

            if (priceSort === "ASC") {
              return priceA - priceB; // Tăng dần
            } else if (priceSort === "DESC") {
              return priceB - priceA; // Giảm dần
            }
            return 0;
          });
        }

        // PAGINATION Ở FRONTEND
        const totalFiltered = filteredCourses.length;
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

        setCourses(paginatedCourses);
        setTotal(totalFiltered); // Set total theo số lượng đã filter
      } catch (err) {
        setCourses([]);
        setTotal(0);
        console.error("Lỗi khi lấy danh sách khóa học:", err);
      } finally {
        setLoading(false);
      }
    },
    [priceSort, searchTerm, selectedCategory, targetAudience],
  );

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  useEffect(() => {
    fetchCourses(current, pageSize);
  }, [current, pageSize, fetchCourses]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleApplyFilters = (filters: {
    category: string;
    targetAudience: string;
    priceSort: string;
    searchTerm: string;
  }) => {
    setSelectedCategory(filters.category);
    setTargetAudience(filters.targetAudience);
    setPriceSort(filters.priceSort);
    setSearchTerm(filters.searchTerm);
    setCurrent(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setSelectedCategory(""); // SỬA: "" thay vì "all"
    setTargetAudience(""); // SỬA: "" thay vì "all"
    setPriceSort(""); // SỬA: "" thay vì "default"
    setSearchTerm("");
    setCurrent(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <CourseListHero
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div className="max-w-7xl mx-auto px-8">
        {/* Filters */}
        <CourseListFilters
          selectedCategory={selectedCategory}
          targetAudience={targetAudience}
          priceSort={priceSort}
          searchTerm={searchTerm}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Course Grid */}
        <CourseListGrid
          courses={courses}
          myCourseIds={myCourseIds}
          loading={loading}
          total={total}
          current={current}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </motion.div>
  );
};

export default CourseList;
