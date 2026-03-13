import React from "react";
import type { Consultant } from "../../../types/consultant/consultant.res.type";

interface ConsultantProps {
  counsel: Consultant;
}

const CounselCard: React.FC<ConsultantProps> = ({ counsel }) => {
  return (
    <div
      className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-center border-2 border-[#20558A] hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex justify-center md:justify-start">
        <img
          src={counsel.profilePicUrl || "/no-avatar.png"}
          alt="Instructor"
          className="rounded-full w-24 h-24 object-cover shadow-md border-4 border-[#4f35e2]"
        />
      </div>

      <div className="text-center md:text-left">
        <h3 className="text-2xl font-bold text-[#20558A] mb-2 tracking-wide">
          {counsel.fullName || "Gi?ng viên"}
        </h3>
        <p className="text-gray-700 text-sm mb-1">Email: {counsel.email || "Chưa cập nhật"}</p>
        <p className="text-gray-700 text-sm mb-1">SĐT: {counsel.phoneNumber || "Chưa cập nhật"}</p>
        <p className="text-gray-700 text-sm">
          {counsel.jobTitle || "Chua có mô t? v? gi?ng viên này."}
        </p>
      </div>
    </div>
  );
};

export default CounselCard;


