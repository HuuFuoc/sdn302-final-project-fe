import React from "react";

interface CourseListHeroProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CourseListHero: React.FC<CourseListHeroProps> = () => {
  return (
    <div className="bg-gradient-to-r from-[#1A8FE3] via-[#6610F2] to-[#6610F2] text-white py-16 px-8 mb-12 rounded-b-3xl shadow-lg">
      <div className="max-w-[2000px] mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#E6C229]/90 bg-clip-text text-transparent">
          Khám Phá Khóa Học Vẽ & Mỹ Thuật
        </h1>
        <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto">
          Cùng bé phát triển năng khiếu với các khóa học sáng tạo, vui nhộn và
          an toàn
        </p>
      </div>
    </div>
  );
};

export default CourseListHero;
