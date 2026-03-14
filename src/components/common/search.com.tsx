import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchCom = () => {
  return (
    <div className="relative">
      <Input
        placeholder="Tìm khóa học vẽ, mỹ thuật..."
        className="border-2 border-gray-200 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A8FE3] focus:border-[#1A8FE3] transition-all w-56"
        suffix={null}
        variant="borderless"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        <SearchOutlined />
      </span>
    </div>
  );
};

export default SearchCom;
