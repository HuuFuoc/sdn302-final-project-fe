import React from "react";
import { Modal, Form, Input, Select, Tag, Divider } from "antd";
import { InlineLoader } from "../../common/loaders";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import { SurveyService } from "../../../services/survey/survey.service";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";
import { helpers } from "../../../utils";
import Editor from "../../common/Editor.com";
import { EditOutlined, ClockCircleOutlined, FileTextOutlined, BarChartOutlined, SaveOutlined } from "@ant-design/icons";

interface Props {
    open: boolean;
    initialData: SurveyResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

const SurveyUpdateModal: React.FC<Props> = ({ open, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [surveyData, setSurveyData] = React.useState<SurveyResponse | null>(null);

    /* Load survey data when the modal opens */
    React.useEffect(() => {
        if (open && initialData?.id) {
            fetchSurveyById(initialData.id);
        } else if (!open) {
            setSurveyData(null);
            form.resetFields();
        }
    }, [open, initialData]);

    /* Populate form once data is available */
    React.useEffect(() => {
        if (surveyData && !loading) {
            let normalizedSurveyType: SurveyType = (surveyData.surveyType as SurveyType) || SurveyType.RISK_ASSESSMENT;

            if (!Object.values(SurveyType).includes(normalizedSurveyType)) {
                const matchingType = Object.values(SurveyType).find(
                    type =>
                        type.toLowerCase() === (normalizedSurveyType as any).toLowerCase() ||
                        type === (normalizedSurveyType as any).replace(/([A-Z])/g, " $1").trim()
                );
                normalizedSurveyType = matchingType || SurveyType.RISK_ASSESSMENT;
            }

            form.setFieldsValue({
                name: surveyData.name,
                description: surveyData.description,
                surveyType: normalizedSurveyType,
                estimateTime: surveyData.estimateTime || 5,
            });
        }
    }, [surveyData, loading, form]);

    const getSurveyTypeIcon = (type: SurveyType) => {
        const iconMap = {
            [SurveyType.RISK_ASSESSMENT]: "⚠️",
            [SurveyType.PRE_FEEDBACK]: "🚀",
            [SurveyType.POST_FEEDBACK]: "✅",
        };
        return iconMap[type] || "📊";
    };

    const getSurveyTypeColor = (type: SurveyType) => {
        const colorMap = {
            [SurveyType.RISK_ASSESSMENT]: "orange",
            [SurveyType.PRE_FEEDBACK]: "green",
            [SurveyType.POST_FEEDBACK]: "purple",
        };
        return colorMap[type] || "default";
    };

    const getSurveyTypeDisplayName = (type: SurveyType) => {
        const nameMap = {
            [SurveyType.RISK_ASSESSMENT]: "Đánh giá Rủi ro",
            [SurveyType.PRE_FEEDBACK]: "Phản hồi Trước",
            [SurveyType.POST_FEEDBACK]: "Phản hồi Sau",
        };
        return nameMap[type] || type;
    };

    const fetchSurveyById = async (id: string) => {
        try {
            setLoading(true);
            const response = await SurveyService.getSurveyById(id);
            const survey = (response as any)?.data?.data ?? (response as any)?.data ?? null;

            if (survey?.id) {
                // Normalize surveyType
                if (!survey.surveyType) {
                    survey.surveyType = (survey.type as SurveyType) || SurveyType.RISK_ASSESSMENT;
                }
                setSurveyData(survey);
            } else {
                throw new Error("Invalid survey data received");
            }
        } catch (error) {
            console.error("Error fetching survey:", error);
            helpers.notificationMessage("Không thể tải dữ liệu khảo sát", "error");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (!initialData?.id) return;

            let processedValues = {
                name: (values.name || "").trim(),
                description: values.description || "",
                surveyType: values.surveyType || SurveyType.RISK_ASSESSMENT,
                estimateTime: Number(values.estimateTime) || 5,
            };

            if (!processedValues.name) {
                helpers.notificationMessage("Tên khảo sát không được để trống", "error");
                return;
            }

            setSubmitting(true);

            await SurveyService.updateSurvey(initialData.id, processedValues);

            helpers.notificationMessage("Cập nhật khảo sát thành công", "success");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error updating survey:", error);

            let errorMessage = "Có lỗi xảy ra khi cập nhật khảo sát";

            if (error?.message?.includes('Network Error') || error?.code === 'ERR_NETWORK') {
                errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.";
            } else if (error?.response?.status === 500) {
                errorMessage = "Nội dung chứa ký tự không hợp lệ. Vui lòng thử lại với nội dung đơn giản hơn.";
            } else if (error?.response?.status === 404) {
                errorMessage = "Khảo sát không tồn tại hoặc đã bị xóa.";
            } else if (error?.response?.status === 400) {
                errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            helpers.notificationMessage(errorMessage, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <EditOutlined className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Cập nhật khảo sát</h2>
                        <p className="text-sm text-gray-500">Chỉnh sửa thông tin khảo sát</p>
                    </div>
                </div>
            }
            open={open}
            onOk={handleOk}
            confirmLoading={submitting}
            onCancel={onClose}
            destroyOnClose
            width={700}
            okText="Lưu thay đổi"
            cancelText="Hủy bỏ"
            okButtonProps={{
                className: "bg-green-500 hover:bg-green-600 border-0 shadow-sm hover:shadow-md transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large",
                icon: <SaveOutlined />
            }}
            cancelButtonProps={{
                className: "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            className="survey-update-modal"
            styles={{
                body: {
                    padding: '24px 32px'
                },
                content: {
                    borderRadius: '16px',
                    background: 'white'
                },
                header: {
                    background: 'white',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '24px 32px 0'
                }
            }}
        >
            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <InlineLoader />
                </div>
            ) : surveyData ? (
                <div className="space-y-6">
                    {/* Survey Preview Card */}

                    <Form form={form} layout="vertical" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="name"
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <FileTextOutlined className="mr-2" />
                                        Tên khảo sát
                                    </span>
                                }
                                rules={[{ required: true, whitespace: true, message: "Vui lòng nhập tên khảo sát" }]}
                            >
                                <Input
                                    placeholder="Nhập tên khảo sát..."
                                    className="h-11 rounded-lg border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-200"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="surveyType"
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <BarChartOutlined className="mr-2" />
                                        Loại khảo sát
                                    </span>
                                }
                                rules={[{ required: true, message: "Vui lòng chọn loại khảo sát" }]}
                            >
                                <Select
                                    placeholder="Chọn loại khảo sát"
                                    allowClear
                                    optionLabelProp="label"
                                    className="h-11 rounded-lg"
                                    size="large"
                                >
                                    {Object.values(SurveyType).map((t) => (
                                        <Select.Option
                                            key={t}
                                            value={t}
                                            label={
                                                <div className="flex items-center gap-2">
                                                    <span>{getSurveyTypeIcon(t)}</span>
                                                    <span>{getSurveyTypeDisplayName(t)}</span>
                                                </div>
                                            }
                                        >
                                            <div className="flex items-center gap-2">
                                                <Tag
                                                    color={getSurveyTypeColor(t)}
                                                    className="px-2 py-1 rounded-full font-medium border-0"
                                                    style={{ margin: 0 }}
                                                >
                                                    {getSurveyTypeIcon(t)} {getSurveyTypeDisplayName(t)}
                                                </Tag>
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="estimateTime"
                            label={
                                <span className="font-semibold text-gray-700">
                                    <ClockCircleOutlined className="mr-2" />
                                    Thời gian ước tính (phút)
                                </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng nhập thời gian ước tính' }]}
                        >
                            <Input
                                type="number"
                                min={1}
                                placeholder="Nhập số phút..."
                                className="h-11 rounded-lg border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-200"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={
                                <span className="font-semibold text-gray-700">
                                    <FileTextOutlined className="mr-2" />
                                    Mô tả khảo sát
                                </span>
                            }
                            rules={[{ required: true, message: "Vui lòng nhập mô tả khảo sát" }]}
                        >
                            <Editor
                                placeholder="Nhập mô tả chi tiết về khảo sát..."
                                height={200}
                            />
                        </Form.Item>
                    </Form>

                    <Divider />

                    {/* Changes Preview */}
                    <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-3">Xem trước thay đổi</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Thông tin sẽ được cập nhật sau khi lưu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>Các câu hỏi hiện tại sẽ được giữ nguyên</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Khảo sát sẽ sẵn sàng để sử dụng</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-4">⚠️</div>
                        <p className="text-gray-600 font-medium">Không thể tải dữ liệu khảo sát</p>
                        <p className="text-sm text-gray-500 mt-2">Vui lòng thử lại hoặc liên hệ hỗ trợ</p>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default SurveyUpdateModal;
