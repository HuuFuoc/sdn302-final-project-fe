import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";
import { ConsultantService } from "../services/consultant/consultant.service";
import type {
  CreateConsultantRequest,
  UpdateConsultantRequest,
} from "../types/consultant/consultant.req.type";

export const useUpdateConsultant = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateConsultantRequest) =>
      ConsultantService.updateConsultant(data),
    onSuccess: () => {
      helpers.notificationMessage("C?p nh?t gi?ng viên thành công", "success");
      navigate(ROUTER_URL.ADMIN.STAFF_CONSULTANTS);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};

export const useCreateConsultant = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateConsultantRequest) =>
      ConsultantService.createConsultant(data),
    onSuccess: () => {
      helpers.notificationMessage(
        "G?i yêu c?u tr? thành gi?ng viên thành công",
        "success"
      );
      navigate(ROUTER_URL.ADMIN.STAFF_CONSULTANTS);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};

