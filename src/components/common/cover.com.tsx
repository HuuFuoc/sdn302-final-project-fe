import React from "react";
import { Link } from "react-router-dom";

interface CoverProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  secondButtonText?: string;
  secondButtonLink?: string;
}

const Cover: React.FC<CoverProps> = ({
  title = "Khám phá thế giới",
  subtitle = "sắc màu cùng bé",
  buttonText = "Xem khóa học",
  buttonLink = "/khoa-hoc",
  secondButtonText = "Liên hệ tư vấn",
  secondButtonLink = "/lich-hen-tu-van",
}) => {
  return (
    <>
      <style>
        {`
          @keyframes float-soft {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          @keyframes gradient-shift {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.9; }
          }
          .float-soft { animation: float-soft 5s ease-in-out infinite; }
          .gradient-text-cover {
            background: linear-gradient(135deg, #1A8FE3 0%, #6610F2 50%, #F17105 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .cover-btn-primary {
            background: linear-gradient(135deg, #1A8FE3, #6610F2);
            border: none;
            box-shadow: 0 4px 20px rgba(26, 143, 227, 0.35);
            transition: all 0.3s ease;
          }
          .cover-btn-primary:hover {
            box-shadow: 0 8px 28px rgba(26, 143, 227, 0.45);
            transform: translateY(-2px);
          }
          .cover-btn-secondary {
            background: rgba(255,255,255,0.95);
            color: #1A8FE3;
            border: 2px solid #1A8FE3;
            transition: all 0.3s ease;
          }
          .cover-btn-secondary:hover {
            background: rgba(26, 143, 227, 0.08);
            transform: translateY(-2px);
          }
        `}
      </style>

      <section className="relative w-screen overflow-hidden flex items-center justify-center ml-[calc(-50vw+50%)] min-h-[90vh] bg-gradient-to-br from-[#e8f4fc] via-white to-[#efe6fc]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full bg-[#1A8FE3]/10 float-soft"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-[25%] right-[12%] w-16 h-16 rounded-full bg-[#E6C229]/20 float-soft"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-[20%] left-[20%] w-20 h-20 rounded-full bg-[#6610F2]/10 float-soft"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-[30%] right-[15%] w-14 h-14 rounded-full bg-[#F17105]/15 float-soft"
            style={{ animationDelay: "0.5s" }}
          />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-[#1A8FE3]/5 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-[1000px] w-full flex items-center justify-center relative z-10 px-6 py-16">
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              {title}{" "}
              <span className="gradient-text-cover block md:inline">
                {subtitle}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Nền tảng khóa học vẽ và mỹ thuật cho thiếu nhi — sáng tạo, vui
              nhộn và an toàn. Chọn khóa học phù hợp hoặc liên hệ tư vấn để tìm
              hiểu lộ trình học cho bé.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16">
              <Link
                to={buttonLink}
                className="cover-btn-primary text-white font-semibold py-4 px-8 rounded-2xl hover:text-white transition-all duration-300"
              >
                {buttonText}
              </Link>
              <Link
                to={secondButtonLink}
                className="cover-btn-secondary font-semibold py-4 px-8 rounded-2xl transition-all duration-300"
              >
                {secondButtonText}
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1A8FE3]" />
                Khóa học chất lượng
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E6C229]" />
                Giáo viên thân thiện
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F17105]" />
                Học mọi lúc mọi nơi
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center text-gray-400 cursor-pointer hover:text-primary transition-colors duration-300">
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
            </div>
            <span className="text-sm mt-2">Tìm hiểu thêm</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cover;
