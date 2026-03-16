import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileTextOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { SectionLoader } from "../../../components/common/loaders";
import { SurveyService } from "../../../services/survey/survey.service";
import { QuestionService } from "../../../services/question/question.service";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";
import type { SearchSurveyRequest } from "../../../types/survey/Survey.req.type";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import AssessmentCard from "./AssessmentCard.com";
import CustomSearch from "../../common/CustomSearch.com";
import { ROUTER_URL } from "../../../consts/router.path.const";
import { helpers } from "../../../utils";

interface AssessmentListProps {
  onStartAssessment?: (surveyId: string) => void;
  onViewResult?: (surveyId: string) => void;
}

interface SurveyWithQuestionCount extends SurveyResponse {
  questionCount: number;
}

export default function AssessmentList({ onStartAssessment, onViewResult }: AssessmentListProps) {
  const [surveys, setSurveys] = useState<SurveyWithQuestionCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [lastKeyword, setLastKeyword] = useState("");

  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const isLoggedIn = token && userInfo;

  const navigate = useNavigate();

  const fetchSurveys = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params: SearchSurveyRequest = {
        pageNumber: page,
        pageSize: 12,
        filterByName: search,
      };
      const response = await SurveyService.getAllSurveys(params);

      let surveysData: SurveyResponse[] = [];
      if (response.data?.data) {
        surveysData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        surveysData = response.data;
      } else {
        setSurveys([]);
        setTotalPages(1);
        setTotalCount(0);
        return;
      }

      const riskAssessmentSurveys = surveysData.filter(
        (survey: SurveyResponse) =>
          survey.surveyType === SurveyType.RISK_ASSESSMENT || survey.type === SurveyType.RISK_ASSESSMENT
      );

      if (riskAssessmentSurveys.length === 0) {
        const allSurveysWithQuestionCount = await Promise.all(
          surveysData.map(async (survey: SurveyResponse) => {
            if (survey.questions && survey.questions.length > 0) {
              return { ...survey, questionCount: survey.questions.length };
            }
            const questionsResponse = await QuestionService.getQuestionBySurveyId(survey.id);
            const questionCount = questionsResponse.data?.length || 0;
            return { ...survey, questionCount };
          })
        );
        setSurveys(allSurveysWithQuestionCount);
        setTotalCount(response.data?.totalCount || allSurveysWithQuestionCount.length);
      } else {
        const surveysWithQuestionCount = await Promise.all(
          riskAssessmentSurveys.map(async (survey: SurveyResponse) => {
            if (survey.questions && survey.questions.length > 0) {
              return { ...survey, questionCount: survey.questions.length };
            }
            const questionsResponse = await QuestionService.getQuestionBySurveyId(survey.id);
            const questionCount = questionsResponse.data?.length || 0;
            return { ...survey, questionCount };
          })
        );
        setSurveys(surveysWithQuestionCount);
        setTotalCount(response.data?.totalCount || surveysWithQuestionCount.length);
      }

      setTotalPages(response.data?.totalPages || 1);
    } catch {
      setSurveys([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys(1, "");
  }, []);

  const handleStartAssessment = (surveyId: string) => {
    if (!isLoggedIn) {
      helpers.notificationMessage("Bạn cần đăng nhập để truy cập trang này", "warning");
      navigate?.(ROUTER_URL.AUTH.LOGIN);
      return;
    }
    if (onStartAssessment) {
      onStartAssessment(surveyId);
    }
  };

  const handleViewResult = (surveyId: string) => {
    if (onViewResult) {
      onViewResult(surveyId);
    }
  };

  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setLastKeyword(keyword);
    fetchSurveys(1, keyword);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchSurveys(page, lastKeyword);
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "screening":
        return {
          label: "Sàng lọc nhanh",
          color: "bg-blue-100 text-blue-800",
          icon: InfoCircleOutlined,
        };
      case "comprehensive":
        return {
          label: "Đánh giá toàn diện",
          color: "bg-purple-100 text-purple-800",
          icon: FileTextOutlined,
        };
      case "specialized":
        return {
          label: "Năng khiếu chuyên biệt",
          color: "bg-orange-100 text-orange-800",
          icon: TeamOutlined,
        };
      default:
        return {
          label: "Khám phá năng khiếu",
          color: "bg-green-100 text-green-800",
          icon: InfoCircleOutlined,
        };
    }
  };

  const getDifficultyInfo = (questionsCount: number) => {
    if (questionsCount <= 5) {
      return {
        label: "Nhẹ nhàng",
        color: "bg-green-100 text-green-800",
      };
    } else if (questionsCount <= 10) {
      return {
        label: "Cơ bản",
        color: "bg-yellow-100 text-yellow-800",
      };
    } else {
      return {
        label: "Chi tiết",
        color: "bg-red-100 text-red-800",
      };
    }
  };

  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch =
      survey.name.toLowerCase().includes(lastKeyword.toLowerCase()) ||
      survey.description?.toLowerCase().includes(lastKeyword.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Khám Phá Năng Khiếu Mỹ Thuật</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thực hiện các bài khảo sát để hiểu điểm mạnh, phong cách học và định hướng lộ trình mỹ thuật phù hợp cho bé.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <CustomSearch placeholder="Tìm kiếm bài khảo sát năng khiếu..." onSearch={handleSearch} />
          </div>
        </div>

        {loading && (
          <SectionLoader className="min-h-0 py-12">
            <span className="text-lg text-gray-600">Đang tải bài khảo sát...</span>
          </SectionLoader>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurveys.map((survey) => {
              const categoryInfo = getCategoryInfo(survey.surveyType || "risk-assessment");
              const difficultyInfo = getDifficultyInfo(survey.questionCount);
              const CategoryIcon = categoryInfo.icon;

              return (
                <AssessmentCard
                  key={survey.id}
                  survey={survey}
                  categoryInfo={categoryInfo}
                  difficultyInfo={difficultyInfo}
                  CategoryIcon={CategoryIcon}
                  onStartAssessment={handleStartAssessment}
                  onViewResult={handleViewResult}
                />
              );
            })}
          </div>
        )}

        {!loading && filteredSurveys.length === 0 && (
          <div className="text-center py-12">
            <ExclamationCircleOutlined className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài khảo sát</h3>
            <p className="text-gray-600">Hiện tại chưa có bài khảo sát phù hợp. Vui lòng thử lại sau.</p>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex flex-col items-center mt-8">
            <span className="text-sm text-gray-500 mb-2">
              Trang {currentPage} / {totalPages} &nbsp;|&nbsp; Tổng số: {totalCount}
            </span>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vì sao nên làm khảo sát năng khiếu?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <InfoCircleOutlined className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hiểu điểm mạnh của bé</h3>
              <p className="text-gray-600">Xác định sớm sở thích và thiên hướng để chọn hướng học phù hợp.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TeamOutlined className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lộ trình cá nhân hóa</h3>
              <p className="text-gray-600">Đề xuất khóa học và hoạt động mỹ thuật phù hợp với từng bé.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleOutlined className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Theo dõi tiến bộ</h3>
              <p className="text-gray-600">Dễ dàng nhìn thấy sự phát triển kỹ năng mỹ thuật theo thời gian.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
