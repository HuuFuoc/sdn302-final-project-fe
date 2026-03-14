import React from "react";
import { Button, Row, Col } from "antd";
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

interface HeroSectionProps {
    onBookNow: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBookNow }) => {
    const features = [
        {
            icon: <CalendarOutlined className="text-2xl text-[#1A8FE3]" />,
            title: "Đặt lịch dễ dàng",
            description: "Chọn thời gian phù hợp với lịch trình của bé"
        },
        {
            icon: <UserOutlined className="text-2xl text-[#1A8FE3]" />,
            title: "Giáo viên giàu kinh nghiệm",
            description: "Đội ngũ giáo viên mỹ thuật thân thiện, yêu trẻ"
        },
        {
            icon: <ClockCircleOutlined className="text-2xl text-[#1A8FE3]" />,
            title: "Phản hồi nhanh chóng",
            description: "Hỗ trợ đặt lịch và tư vấn kịp thời"
        },
        {
            icon: <CheckCircleOutlined className="text-2xl text-[#1A8FE3]" />,
            title: "Chất lượng đảm bảo",
            description: "Cam kết mang đến trải nghiệm học vẽ tốt nhất"
        }
    ];

    return (
        <div className="hero-section bg-gradient-to-br from-[#e8f4fc] via-white to-[#efe6fc] py-16">
            <div className="container mx-auto px-4">
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} lg={12}>
                        <div className="hero-content">
                            <h1 className="text-4xl md:text-5xl font-bold text-[#1A8FE3] mb-6 leading-tight">
                                Gặp giáo viên
                                <br />
                                <span className="text-[#F17105]">hướng dẫn vẽ</span>
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Kết nối với giáo viên mỹ thuật để bé được hướng dẫn tận tình. Đặt lịch ngay và cùng con khám phá thế giới sắc màu.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<CalendarOutlined />}
                                    onClick={onBookNow}
                                    className="bg-[#1A8FE3] hover:bg-[#1572b6] border-none h-12 px-8 text-lg font-medium rounded-xl"
                                >
                                    Đặt lịch ngay
                                </Button>
                                <Button
                                    size="large"
                                    className="h-12 px-8 text-lg font-medium border-2 border-[#1A8FE3] text-[#1A8FE3] hover:bg-[#1A8FE3] hover:text-white rounded-xl"
                                >
                                    Tìm hiểu thêm
                                </Button>
                            </div>

                            <div className="stats flex flex-wrap gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircleOutlined className="text-[#1A8FE3]" />
                                    <span>1000+ phụ huynh hài lòng</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleOutlined className="text-[#1A8FE3]" />
                                    <span>20+ giáo viên mỹ thuật</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleOutlined className="text-[#1A8FE3]" />
                                    <span>Hỗ trợ tận tâm</span>
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