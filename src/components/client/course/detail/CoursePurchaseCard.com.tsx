import React from "react";
import { Card, Typography, Tag, Divider } from "antd";
import { motion } from "framer-motion";
import {
  PlayCircleOutlined,
  MobileOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";
import { formatCurrency } from "../../../../utils/helper";
import AddToCartButton from "../../../common/addToCartButton.com";
import noImage from "../../../../assets/images/no-image.svg";

const { Title, Text } = Typography;

interface CoursePurchaseCardProps {
  course: Course;
  highlights: string[];
}

const CoursePurchaseCard: React.FC<CoursePurchaseCardProps> = ({
  course,
  highlights,
}) => {
  const raw = course as any;
  const courseId =
    raw.id ||
    raw._id ||
    raw.courseId ||
    (raw.course && (raw.course._id || raw.course.id));

  const finalPrice = course.price * (1 - course.discount / 100);
  const discountPercentage = course.discount;
  const savingAmount = course.price * (course.discount / 100);

  return (
    <div className="sticky top-6 z-[9998]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className="shadow-xl border-0 overflow-hidden"
          style={{
            borderRadius: 16,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div className="relative">
            <img
              src={course.imageUrls?.[0] || noImage}
              alt={course.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const image = e.currentTarget as HTMLImageElement;
                image.onerror = null;
                image.src = noImage;
              }}
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 right-4">
                <Tag
                  color="red"
                  className="text-sm font-bold px-3 py-1 rounded-full"
                >
                  -{discountPercentage}%
                </Tag>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-3">
                <Text className="text-3xl font-bold text-gray-900">
                  {formatCurrency(finalPrice)}
                </Text>
                {course.discount > 0 && (
                  <Text delete className="text-gray-400 text-lg">
                    {formatCurrency(course.price)}
                  </Text>
                )}
              </div>
              {course.discount > 0 && (
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Text className="text-red-500 text-sm font-medium">
                    Tiết kiệm {formatCurrency(savingAmount)}
                  </Text>
                  <Tag
                    color="red"
                    className="text-xs font-bold px-2 py-1 rounded-full"
                  >
                    -{discountPercentage}%
                  </Tag>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <AddToCartButton
                courseId={courseId}
                isInCart={!!(course as any).isInCart}
              />
            </div>

            <div className="mb-6">
              <Title level={5} className="mb-3 text-gray-800">
                Khóa học này bao gồm:
              </Title>
              <div className="space-y-2">
                {highlights.map((highlight, index) => {
                  const icons = [
                    <ClockCircleOutlined
                      key="clock"
                      className="text-blue-600"
                    />,
                    <PlayCircleOutlined
                      key="play"
                      className="text-green-600"
                    />,
                    <MobileOutlined key="mobile" className="text-purple-600" />,
                    <TrophyOutlined key="trophy" className="text-yellow-600" />,
                  ];

                  return (
                    <div key={index} className="flex items-center space-x-3">
                      {icons[index % icons.length]}
                      <Text className="text-gray-700">{highlight}</Text>
                    </div>
                  );
                })}
              </div>
            </div>

            <Divider className="my-4" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CoursePurchaseCard;
