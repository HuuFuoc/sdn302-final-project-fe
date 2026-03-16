import React from "react";
import { Row, Col } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";

const HeroSection: React.FC = () => {
  const features = [
    {
      icon: <BookOutlined className="text-2xl text-[#1A8FE3]" />,
      title: "Định hướng học phù hợp",
      description: "Giúp phụ huynh hiểu rõ lộ trình học mỹ thuật theo độ tuổi của bé"
    },
    {
      icon: <UserOutlined className="text-2xl text-[#1A8FE3]" />,
      title: "Giảng viên giàu kinh nghiệm",
      description: "Đội ngũ giáo viên mỹ thuật thân thiện, chuyên môn vững"
    },
    {
      icon: <ClockCircleOutlined className="text-2xl text-[#1A8FE3]" />,
      title: "Theo dõi tiến bộ",
      description: "Nắm bắt sự phát triển kỹ năng vẽ của bé theo từng giai đoạn"
    },
    {
      icon: <CheckCircleOutlined className="text-2xl text-[#1A8FE3]" />,
      title: "Môi trường tích cực",
      description: "Khuyến khích sáng tạo và xây dựng sự tự tin cho trẻ"
    }
  ];

  return (
    <div className="hero-section bg-gradient-to-br from-[#e8f4fc] via-white to-[#efe6fc] py-16">
      <div className="container mx-auto px-4">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <div className="hero-content">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A8FE3] mb-6 leading-tight">
                Gặp giảng viên
                <br />
                <span className="text-[#F17105]">mỹ thuật thiếu nhi</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Khám phá đội ngũ giảng viên và thông tin chuyên môn để lựa chọn người đồng hành phù hợp
                trong hành trình học mỹ thuật của bé.
              </p>

              <div className="stats flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-[#1A8FE3]" />
                  <span>Nội dung học bám sát độ tuổi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-[#1A8FE3]" />
                  <span>Giảng viên chuyên môn mỹ thuật</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-[#1A8FE3]" />
                  <span>Môi trường học tập thân thiện</span>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-card bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeroSection;
