import React, { useEffect, useState } from "react";
import { Card, Select, Input, Button, Typography } from "antd";
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { TargetAudience } from "../../../../app/enums/targetAudience.enum";

const { Option } = Select;
const { Text } = Typography;

interface CourseListFiltersProps {
  targetAudience: string;
  searchTerm: string;
  onFiltersChange: (filters: {
    targetAudience: string;
    searchTerm: string;
  }) => void;
  onClearFilters: () => void;
}

const CourseListFilters: React.FC<CourseListFiltersProps> = ({
  targetAudience,
  searchTerm,
  onFiltersChange,
  onClearFilters,
}) => {
  const [tempTargetAudience, setTempTargetAudience] = useState(targetAudience);
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm);

  const hasActiveFilters =
    (targetAudience !== "" && targetAudience !== "all") ||
    searchTerm.trim() !== "";

  const handleSearchChange = (value: string) => {
    setTempSearchTerm(value);
    onFiltersChange({
      targetAudience: tempTargetAudience,
      searchTerm: value,
    });
  };

  const handleTargetAudienceChange = (value: string) => {
    setTempTargetAudience(value);
    onFiltersChange({
      targetAudience: value,
      searchTerm: tempSearchTerm,
    });
  };

  const handleClearFilters = () => {
    setTempTargetAudience("");
    setTempSearchTerm("");
    onClearFilters();
  };

  useEffect(() => {
    setTempTargetAudience(targetAudience);
    setTempSearchTerm(searchTerm);
  }, [targetAudience, searchTerm]);

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="shadow-lg border-0"
        styles={{ body: { padding: "24px" } }}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FilterOutlined className="text-blue-600 text-lg" />
            <Text strong className="text-lg text-gray-800">
              Bộ lọc khóa học
            </Text>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>

          <div className="mb-6">
            <Input
              size="large"
              placeholder="Tìm kiếm khóa học..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={tempSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="rounded-xl border-gray-200 shadow-sm"
              style={{
                borderRadius: "12px",
                fontSize: "16px",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Text strong className="block mb-2 text-gray-700">
              Đối tượng
            </Text>
            <Select
              size="large"
              value={tempTargetAudience}
              onChange={handleTargetAudienceChange}
              style={{ width: "100%" }}
              className="rounded-lg"
              placeholder="Chọn đối tượng"
            >
              <Option value="">Tất cả đối tượng</Option>
              <Option value={TargetAudience.STUDENT}>Học sinh</Option>
              <Option value={TargetAudience.TEACHER}>Giáo viên</Option>
              <Option value={TargetAudience.PARENT}>Phụ huynh</Option>
              <Option value={TargetAudience.COMMUNITY}>Cộng đồng</Option>
            </Select>
          </div>

          <div>
            {hasActiveFilters && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="large"
                  icon={<ClearOutlined />}
                  onClick={handleClearFilters}
                  className="w-full h-[42px] rounded-xl border-gray-300 hover:border-red-400 hover:text-red-500 font-medium"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseListFilters;
