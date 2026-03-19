import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CourseService } from "../../../../services/course/course.service";
import type { Course } from "../../../../types/course/Course.res.type";
import CourseListHero from "./CourseListHero.com.tsx";
import CourseListFilters from "./CourseListFilters.com.tsx";
import CourseListGrid from "./CourseListGrid.com.tsx";
import { CourseStatus } from "../../../../app/enums/courseStatus.enum";

const itemsPerPage = 12;

const normalizeSearchText = (value?: string) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourseIds, setMyCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [total, setTotal] = useState(0);
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [searchTerm]);

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

        let filteredCourses = normalizedCourses.filter(
          (course) => course.status === CourseStatus.PUBLISHED,
        );

        if (debouncedSearchTerm.trim() !== "") {
          const normalizedSearch = normalizeSearchText(debouncedSearchTerm);
          filteredCourses = filteredCourses.filter(
            (course) => {
              const normalizedName = normalizeSearchText(course.name);
              const normalizedDescription = normalizeSearchText(
                (course as { description?: string }).description,
              );

              return (
                normalizedName.includes(normalizedSearch) ||
                normalizedDescription.includes(normalizedSearch)
              );
            },
          );
        }

        if (targetAudience !== "") {
          filteredCourses = filteredCourses.filter(
            (course) => course.targetAudience === targetAudience,
          );
        }

        const totalFiltered = filteredCourses.length;
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

        setCourses(paginatedCourses);
        setTotal(totalFiltered);
      } catch (err) {
        setCourses([]);
        setTotal(0);
        console.error("Lỗi khi lấy danh sách khóa học:", err);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchTerm, targetAudience],
  );

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  useEffect(() => {
    fetchCourses(current, pageSize);
  }, [current, pageSize, fetchCourses]);

  useEffect(() => {
    setCurrent(1);
  }, [debouncedSearchTerm, targetAudience]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleFiltersChange = (filters: {
    targetAudience: string;
    searchTerm: string;
  }) => {
    setTargetAudience(filters.targetAudience);
    setSearchTerm(filters.searchTerm);
  };

  const handleClearFilters = () => {
    setTargetAudience("");
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
      <CourseListHero
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div className="max-w-7xl mx-auto px-8">
        <CourseListFilters
          targetAudience={targetAudience}
          searchTerm={searchTerm}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

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
