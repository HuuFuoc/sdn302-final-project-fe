import React from "react";
import { Col, Row } from "antd";
import HeroSection from "../../../components/client/appointment/HeroSection";
import ConsultantShowcase from "../../../components/client/appointment/ConsultantShowcase.com";

const AppointmentPage: React.FC = () => {
  return (
    <div className="appointment-page">
      <HeroSection />

      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20558A] mb-4">
              Học mỹ thuật đúng phương pháp cho thiếu nhi
            </h2>
            <p className="text-lg text-gray-600">
              Chúng tôi tập trung vào 3 điều quan trọng nhất cho phụ huynh: giáo viên phù hợp,
              lộ trình rõ ràng và trải nghiệm học tập tích cực cho bé.
            </p>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div className="bg-[#F5FAFF] border border-[#DCEEFF] rounded-xl p-5 h-full">
                <h3 className="text-lg font-semibold text-[#20558A] mb-2">Giáo viên phù hợp độ tuổi</h3>
                <p className="text-gray-600">Ưu tiên giảng viên có kinh nghiệm dạy trẻ, giao tiếp nhẹ nhàng và tạo hứng thú học vẽ.</p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="bg-[#FFF8F2] border border-[#FFE5CF] rounded-xl p-5 h-full">
                <h3 className="text-lg font-semibold text-[#20558A] mb-2">Lộ trình học rõ ràng</h3>
                <p className="text-gray-600">Định hướng theo mục tiêu học của bé để chọn khóa học mỹ thuật phù hợp ngay từ đầu.</p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="bg-[#F7FFF8] border border-[#DDF4E0] rounded-xl p-5 h-full">
                <h3 className="text-lg font-semibold text-[#20558A] mb-2">Đồng hành cùng phụ huynh</h3>
                <p className="text-gray-600">Thông tin minh bạch về phương pháp dạy, tiến độ học và định hướng phát triển năng khiếu.</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <ConsultantShowcase />
    </div>
  );
};

export default AppointmentPage;
