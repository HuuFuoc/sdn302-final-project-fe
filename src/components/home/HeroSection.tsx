import React from "react";
import { Link } from "react-router-dom";
import ColorBends from "./ColorBends";
import { ROUTER_URL } from "../../consts/router.path.const";

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* ColorBends background - full width */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent
          autoRotate={0}
        />
        {/* Overlay để text nổi rõ */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/75 to-white/90"
          aria-hidden
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-6 leading-tight">
          Khám phá thế giới{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            sắc màu
          </span>{" "}
          cùng bé
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Nền tảng khóa học vẽ và mỹ thuật cho thiếu nhi — sáng tạo, vui nhộn và
          an toàn. Chọn khóa học phù hợp hoặc liên hệ tư vấn để tìm hiểu lộ
          trình học cho bé.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={ROUTER_URL.CLIENT.COURSE}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Xem khóa học
          </Link>
          <Link
            to={ROUTER_URL.CLIENT.BLOG}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-primary bg-white border-2 border-primary hover:bg-primary/5 transition-all duration-300"
          >
            Xem bài đăng
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-10 text-slate-500 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Khóa học chất lượng
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fun" />
            Giáo viên thân thiện
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Học mọi lúc mọi nơi
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-slate-400 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
