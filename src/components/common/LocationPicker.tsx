import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Modal, Space, Tabs, message, Spin } from 'antd';
import { EnvironmentOutlined, SearchOutlined, GlobalOutlined, LoadingOutlined, AimOutlined } from '@ant-design/icons';

/**
 * LOCATION PICKER COMPONENT - CHỌN ĐỊA ĐIỂM
 * 
 * Component này cho phép người dùng chọn địa điểm theo nhiều cách:
 * 1. Tự động lấy vị trí GPS hiện tại
 * 2. Tìm kiếm địa điểm trên bản đồ
 * 3. Click trực tiếp trên bản đồ để chọn vị trí chính xác
 * 
 * Đặc điểm chính:
 * - Tích hợp Google Maps để hiển thị bản đồ
 * - Reverse geocoding để chuyển tọa độ thành địa chỉ tiếng Việt
 * - Hỗ trợ GPS để lấy vị trí hiện tại
 * - Giao diện thân thiện với tabs để chuyển đổi giữa các chế độ
 */

interface LocationPickerProps {
    value?: string;              // Giá trị địa chỉ hiện tại
    onChange?: (value: string) => void;  // Callback khi thay đổi địa chỉ
    placeholder?: string;        // Text hiển thị khi chưa có giá trị
}

const LocationPicker: React.FC<LocationPickerProps> = ({
    value,
    onChange,
    placeholder = "Chọn địa điểm..."
}) => {
    // ========== STATES QUẢN LÝ MODAL VÀ GIAO DIỆN ==========
    const [isModalOpen, setIsModalOpen] = useState(false);               // Modal mở/đóng
    const [selectedLocation, setSelectedLocation] = useState<string>(value || '');  // Địa chỉ đã chọn
    const [mapLocation, setMapLocation] = useState<string>('');          // Địa điểm tìm kiếm trên bản đồ
    const [activeTab, setActiveTab] = useState<string>('map');           // Tab hiện tại (chỉ có bản đồ)
    
    // ========== STATES QUẢN LÝ TỌA ĐỘ VÀ GPS ==========
    const [clickedCoords, setClickedCoords] = useState<{ lat: number, lng: number } | null>(null);  // Tọa độ được click
    const [currentGPSLocation, setCurrentGPSLocation] = useState<{ lat: number, lng: number } | null>(null);  // Vị trí GPS hiện tại
    
    // ========== STATES QUẢN LÝ LOADING ==========
    const [isGeocodingLoading, setIsGeocodingLoading] = useState(false); // Loading khi chuyển tọa độ thành địa chỉ
    const [isGPSLoading, setIsGPSLoading] = useState(false);             // Loading khi lấy GPS
    
    // ========== REF CHO MAP CONTAINER ==========
    const mapContainerRef = useRef<HTMLDivElement>(null);

    /**
     * KIỂM TRA GPS CÓ KHẢ DỤNG KHÔNG
     * Kiểm tra xem trình duyệt có hỗ trợ geolocation API hay không
     */
    const isGPSAvailable = () => {
        return navigator.geolocation && navigator.geolocation.getCurrentPosition;
    };

    /**
     * LẤY VỊ TRÍ GPS HIỆN TẠI
     * Sử dụng Geolocation API để lấy tọa độ GPS của thiết bị
     * Trả về Promise với {lat, lng} hoặc throw error nếu thất bại
     */
    const getCurrentLocation = (): Promise<{ lat: number, lng: number }> => {
        return new Promise((resolve, reject) => {
            // Kiểm tra GPS có khả dụng không
            if (!isGPSAvailable()) {
                reject(new Error('Trình duyệt không hỗ trợ GPS'));
                return;
            }

            // Cấu hình GPS với độ chính xác cao
            const options = {
                enableHighAccuracy: true,    // Yêu cầu độ chính xác cao (GPS thay vì WiFi/Cell)
                timeout: 10000,              // Timeout 10 giây
                maximumAge: 60000            // Cache vị trí trong 1 phút
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ lat: latitude, lng: longitude });
                },
                (error) => {
                    // Xử lý các loại lỗi GPS khác nhau
                    let errorMessage = 'Không thể lấy vị trí hiện tại';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Bạn cần cấp quyền truy cập vị trí để sử dụng tính năng này. Vui lòng kiểm tra cài đặt trình duyệt.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Thông tin vị trí không khả dụng. Vui lòng thử lại sau.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Hết thời gian lấy vị trí. Vui lòng thử lại.';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                options
            );
        });
    };

    /**
     * XỬ LÝ NÚT "VỊ TRÍ HIỆN TẠI"
     * 1. Lấy tọa độ GPS
     * 2. Chuyển tọa độ thành địa chỉ chi tiết
     * 3. Hiển thị trên bản đồ
     * 4. Tự động chuyển sang tab bản đồ
     */
    const handleGetCurrentLocation = async () => {
        setIsGPSLoading(true);
        try {
            // Lấy tọa độ GPS
            const coords = await getCurrentLocation();
            setCurrentGPSLocation(coords);

            // Chuyển tọa độ thành địa chỉ
            const address = await reverseGeocode(coords.lat, coords.lng);
            setSelectedLocation(address);
            setMapLocation(address);

            // Chuyển sang tab bản đồ để hiển thị
            setActiveTab('map');

            message.success('Đã lấy vị trí hiện tại thành công!');
        } catch (error: any) {
            message.error(error.message || 'Không thể lấy vị trí hiện tại');
        } finally {
            setIsGPSLoading(false);
        }
    };

    /**
     * REVERSE GEOCODING - CHUYỂN TỌA ĐỘ THÀNH ĐỊA CHỈ
     * Sử dụng OpenStreetMap Nominatim API (miễn phí) để:
     * 1. Gửi request với tọa độ lat, lng
     * 2. Nhận về thông tin địa chỉ chi tiết
     * 3. Format theo chuẩn địa chỉ Việt Nam
     * 
     * Format địa chỉ: Số nhà + Đường, Phường/Xã, Quận/Huyện, Thành phố, Quốc gia
     */
    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        setIsGeocodingLoading(true);
        try {
            // Gọi API Nominatim với các tham số:
            // - format=json: trả về JSON
            // - zoom=18: độ chi tiết cao nhất
            // - addressdetails=1: bao gồm chi tiết địa chỉ
            // - accept-language=vi: ưu tiên tiếng Việt
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=vi`
            );

            if (response.ok) {
                const data = await response.json();
                if (data && data.display_name) {
                    // Lấy object address chứa các thành phần địa chỉ
                    const address = data.address;
                    let formattedAddress = '';

                    if (address) {
                        // Xây dựng địa chỉ theo chuẩn Việt Nam
                        const parts = [];

                        // Số nhà và tên đường
                        if (address.house_number && address.road) {
                            parts.push(`${address.house_number} ${address.road}`);
                        } else if (address.road) {
                            parts.push(address.road);
                        }

                        // Phường/Xã (suburb, quarter, neighbourhood)
                        if (address.suburb) {
                            parts.push(address.suburb);
                        } else if (address.quarter) {
                            parts.push(address.quarter);
                        } else if (address.neighbourhood) {
                            parts.push(address.neighbourhood);
                        }

                        // Quận/Huyện
                        if (address.city_district) {
                            parts.push(address.city_district);
                        } else if (address.county) {
                            parts.push(address.county);
                        }

                        // Thành phố/Tỉnh
                        if (address.city) {
                            parts.push(address.city);
                        } else if (address.state) {
                            parts.push(address.state);
                        }

                        // Quốc gia (chỉ hiển thị nếu là Việt Nam)
                        if (address.country && address.country === 'Việt Nam') {
                            parts.push('Việt Nam');
                        }

                        // Nối các phần bằng dấu phẩy
                        formattedAddress = parts.join(', ');
                    }

                    // Fallback về display_name nếu không format được
                    const finalAddress = formattedAddress || data.display_name;
                    setIsGeocodingLoading(false);
                    return finalAddress;
                }
            }

            // Fallback nếu API thất bại - hiển thị tọa độ
            setIsGeocodingLoading(false);
            return `Vị trí: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            setIsGeocodingLoading(false);
            return `Vị trí: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    };

    /**
     * XỬ LÝ NÚT "XÁC NHẬN" TRONG MODAL
     * Gọi onChange callback với địa chỉ đã chọn và đóng modal
     */
    const handleOk = () => {
        if (onChange && selectedLocation) {
            onChange(selectedLocation);
        }
        setIsModalOpen(false);
    };

    /**
     * XỬ LÝ NÚT "HỦY" TRONG MODAL
     * Reset về trạng thái ban đầu và đóng modal
     */
    const handleCancel = () => {
        setSelectedLocation(value || '');
        setMapLocation('');
        setClickedCoords(null);
        setIsModalOpen(false);
    };

    /**
     * XỬ LÝ MỞ MODAL
     * Khởi tạo các giá trị từ props và mở modal
     */
    const handleModalOpen = () => {
        setSelectedLocation(value || '');
        setMapLocation(value || '');
        setClickedCoords(null);
        setIsModalOpen(true);
    };

    /**
     * XỬ LÝ THAY ĐỔI INPUT TÌM KIẾM
     * Cập nhật state khi người dùng nhập địa điểm để tìm kiếm
     */
    const handleMapLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const location = e.target.value;
        setMapLocation(location);
    };

    /**
     * TÌM KIẾM ĐỊA ĐIỂM
     * Cập nhật bản đồ với địa điểm mới được tìm kiếm
     */
    const searchLocation = (query: string) => {
        if (!query.trim()) return;
        setMapLocation(query);
    };

    /**
     * THIẾT LẬP PHÁT HIỆN CLICK TRÊN BẢN ĐỒ
     * 
     * Cách hoạt động:
     * 1. Tạo một div overlay trong suốt phủ lên bản đồ
     * 2. Bắt sự kiện click trên overlay
     * 3. Tính toán tọa độ dựa trên vị trí click
     * 4. Gọi reverse geocoding để lấy địa chỉ
     * 
     * Lưu ý: Đây là cách tiếp cận đơn giản vì không thể tương tác trực tiếp
     * với Google Maps iframe từ domain khác (CORS policy)
     */
    useEffect(() => {
        if (isModalOpen && activeTab === 'map') {
            const setupMapClickDetection = () => {
                const mapContainer = mapContainerRef.current;
                if (!mapContainer) return;

                // Tạo overlay trong suốt để bắt click
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.zIndex = '10';
                overlay.style.cursor = 'crosshair';
                overlay.style.backgroundColor = 'transparent';

                overlay.addEventListener('click', async (e) => {
                    // Tính toán vị trí click tương đối
                    const rect = overlay.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    // Kích thước overlay
                    const mapWidth = rect.width;
                    const mapHeight = rect.height;

                    // Tọa độ trung tâm mặc định (TP.HCM)
                    const baseLat = 10.8231;
                    const baseLng = 106.6297;

                    // Tính toán tọa độ gần đúng dựa trên vị trí click
                    // Giả định map hiển thị khoảng 0.02 độ ở zoom level 15
                    const latRange = 0.02;
                    const lngRange = 0.02;

                    // Chuyển đổi vị trí pixel thành tọa độ
                    const clickLat = baseLat + ((mapHeight / 2 - y) / mapHeight) * latRange;
                    const clickLng = baseLng + ((x - mapWidth / 2) / mapWidth) * lngRange;

                    setClickedCoords({ lat: clickLat, lng: clickLng });

                    // Lấy địa chỉ chi tiết từ tọa độ
                    message.loading('Đang tìm địa chỉ...', 0.5);
                    const detailedAddress = await reverseGeocode(clickLat, clickLng);
                    setSelectedLocation(detailedAddress);

                    message.success('Đã chọn địa điểm và lấy địa chỉ chi tiết!');
                });

                // Thêm overlay vào container
                mapContainer.style.position = 'relative';
                mapContainer.appendChild(overlay);

                // Cleanup function
                return () => {
                    if (mapContainer.contains(overlay)) {
                        mapContainer.removeChild(overlay);
                    }
                };
            };

            // Delay để đảm bảo iframe đã load
            const timer = setTimeout(setupMapClickDetection, 1000);
            return () => clearTimeout(timer);
        }
    }, [isModalOpen, activeTab, mapLocation]);

    /**
     * TỰ ĐỘNG LẤY VỊ TRÍ GPS KHI MỞ MODAL
     * Nếu chưa có giá trị và modal được mở, tự động lấy GPS sau 1 giây
     */
    useEffect(() => {
        if (isModalOpen && !value) {
            const timer = setTimeout(() => {
                handleGetCurrentLocation();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isModalOpen]);

    /**
     * CẤU HÌNH TABS CHO MODAL
     * Hiện tại chỉ có 1 tab "Bản đồ" nhưng có thể mở rộng thêm các tab khác
     */
    const tabItems = [
        {
            key: 'map',
            label: (
                <span>
                    <GlobalOutlined />
                    <span className='ml-1'>Bản đồ</span>
                </span>
            ),
            children: (
                <>
                    {/* THANH TÌM KIẾM VÀ BUTTONS */}
                    <div style={{ marginBottom: 16 }}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Nhập địa điểm để hiển thị trên bản đồ..."
                                value={mapLocation}
                                onChange={handleMapLocationChange}
                                prefix={<SearchOutlined />}
                                size="large"
                                onPressEnter={() => searchLocation(mapLocation)}
                            />
                            <Button
                                type="primary"
                                onClick={() => searchLocation(mapLocation)}
                                className='bg-primary p-5'
                            >
                                Tìm
                            </Button>
                            <Button
                                type="default"
                                icon={<AimOutlined />}
                                onClick={handleGetCurrentLocation}
                                loading={isGPSLoading}
                                title="Lấy vị trí hiện tại"
                                size="large"
                                disabled={!isGPSAvailable()}
                            >
                                Vị trí hiện tại
                            </Button>
                        </Space.Compact>
                    </div>

                    {/* HIỂN THỊ THÔNG TIN GPS HIỆN TẠI */}
                    {currentGPSLocation && (
                        <div style={{
                            marginBottom: 16,
                            padding: 12,
                            backgroundColor: '#e6f7ff',
                            border: '1px solid #91d5ff',
                            borderRadius: 6,
                            fontSize: 12
                        }}>
                            <Space>
                                <AimOutlined style={{ color: '#1890ff' }} />
                                <div>
                                    <strong style={{ color: '#1890ff' }}>Vị trí GPS hiện tại:</strong>
                                    <div style={{ color: '#52c41a', fontFamily: 'monospace' }}>
                                        {currentGPSLocation.lat.toFixed(6)}, {currentGPSLocation.lng.toFixed(6)}
                                    </div>
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* CẢNH BÁO GPS KHÔNG KHẢ DỤNG */}
                    {!isGPSAvailable() && (
                        <div style={{
                            marginBottom: 16,
                            padding: 12,
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: 6,
                            fontSize: 12,
                            color: '#dc2626'
                        }}>
                            <Space>
                                <AimOutlined style={{ color: '#dc2626' }} />
                                <div>
                                    <strong>⚠️ GPS không khả dụng:</strong>
                                    <div>Trình duyệt của bạn không hỗ trợ GPS hoặc không có quyền truy cập vị trí.</div>
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* CONTAINER BẢN ĐỒ VỚI OVERLAY */}
                    <div
                        ref={mapContainerRef}
                        style={{
                            marginBottom: 16,
                            border: '1px solid #d9d9d9',
                            borderRadius: 6,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {mapLocation ? (
                            <>
                                {/* GOOGLE MAPS IFRAME */}
                                <iframe
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    width="100%"
                                    height="400"
                                    style={{ border: 0, borderRadius: 6, display: 'block' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                
                                {/* HƯỚNG DẪN CLICK */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        left: 10,
                                        backgroundColor: 'rgba(32, 85, 138, 0.9)',
                                        color: 'white',
                                        padding: '8px 12px',
                                        borderRadius: 4,
                                        fontSize: 12,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        zIndex: 5
                                    }}
                                >
                                    🎯 Click trên bản đồ để chọn địa chỉ
                                </div>
                                
                                {/* LOADING INDICATOR KHI ĐANG LẤY ĐỊA CHỈ */}
                                {isGeocodingLoading && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            backgroundColor: 'rgba(24, 144, 255, 0.9)',
                                            color: 'white',
                                            padding: '8px 12px',
                                            borderRadius: 4,
                                            fontSize: 12,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            zIndex: 5
                                        }}
                                    >
                                        <Spin indicator={<LoadingOutlined style={{ fontSize: 12, color: 'white' }} spin />} />
                                        <span style={{ marginLeft: 8 }}>Đang lấy địa chỉ...</span>
                                    </div>
                                )}
                                
                                {/* THÔNG BÁO THÀNH CÔNG */}
                                {clickedCoords && !isGeocodingLoading && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            backgroundColor: 'rgba(82, 196, 26, 0.9)',
                                            color: 'white',
                                            padding: '8px 12px',
                                            borderRadius: 4,
                                            fontSize: 12,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            zIndex: 5,
                                            maxWidth: '200px'
                                        }}
                                    >
                                        ✓ Đã lấy địa chỉ chi tiết
                                    </div>
                                )}
                            </>
                        ) : (
                            // PLACEHOLDER KHI CHƯA CÓ ĐỊA ĐIỂM
                            <div style={{
                                height: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5',
                                borderRadius: 6,
                                color: '#999'
                            }}>
                                <EnvironmentOutlined style={{ fontSize: 48, marginBottom: 16, color: '#d9d9d9' }} />
                                <div>Nhập địa điểm để xem bản đồ</div>
                                <div style={{ fontSize: 11, marginTop: 4 }}>Sau đó click trên bản đồ để lấy địa chỉ chi tiết</div>
                            </div>
                        )}
                    </div>

                    {/* HƯỚNG DẪN CHI TIẾT */}
                    <div style={{
                        padding: 12,
                        backgroundColor: '#fff7e6',
                        border: '1px solid #ffd591',
                        borderRadius: 6,
                        fontSize: 12,
                        color: '#d48806'
                    }}>
                        <strong>🎯 Hướng dẫn lấy địa chỉ chi tiết:</strong>
                        <ol style={{ margin: '8px 0 0 16px', lineHeight: '1.6' }}>
                            <li><strong>GPS:</strong> Nhấn "Vị trí hiện tại" để tự động lấy địa chỉ từ GPS và hiển thị trên bản đồ</li>
                            <li><strong>Tìm kiếm:</strong> Nhập tên địa điểm và nhấn "Tìm" để hiển thị khu vực</li>
                            <li><strong>Click trên bản đồ:</strong> Click trực tiếp lên bản đồ tại vị trí bạn muốn chọn</li>
                            <li>Hệ thống sẽ tự động <strong>tìm địa chỉ chi tiết</strong> của vị trí đó</li>
                            <li>Địa chỉ đầy đủ (số nhà, đường, quận, thành phố) sẽ được hiển thị</li>
                            <li>Nhấn "Xác nhận" để lưu địa chỉ chi tiết đã chọn</li>
                        </ol>
                        <div style={{ marginTop: 8, padding: 6, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4, fontSize: 11 }}>
                            <strong>💡 Lưu ý:</strong>
                            <ul style={{ margin: '4px 0 0 16px', lineHeight: '1.4' }}>
                                <li>Địa chỉ sẽ được hiển thị theo định dạng Việt Nam (số nhà, tên đường, quận/huyện, thành phố)</li>
                                <li>GPS sẽ tự động lấy vị trí hiện tại khi mở modal lần đầu</li>
                                <li>Cần cấp quyền truy cập vị trí cho trình duyệt để sử dụng GPS</li>
                                <li>Khi bấm "Vị trí hiện tại", bản đồ sẽ tự động hiển thị vị trí GPS</li>
                            </ul>
                        </div>
                    </div>
                </>
            )
        }
    ];

    return (
        <>
            {/* Main input - shows selected address */}
            <Input
                value={value}
                placeholder={placeholder}
                readOnly
                suffix={
                    <Button
                        type="text"
                        icon={<EnvironmentOutlined />}
                        onClick={handleModalOpen}
                    />
                }
                onClick={handleModalOpen}
                style={{ cursor: 'pointer' }}
            />

            {/* MODAL CHỌN ĐỊA ĐIỂM */}
            <Modal
                title="Chọn địa điểm trên bản đồ"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ disabled: !selectedLocation }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                />

                {/* Selected address preview */}
                {selectedLocation && (
                    <div style={{
                        marginTop: 16,
                        padding: 12,
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: 6
                    }}>
                        <Space>
                            <EnvironmentOutlined style={{ color: '#52c41a' }} />
                            <div style={{ flex: 1 }}>
                                <strong style={{ color: '#389e0d' }}>Địa chỉ đã chọn:</strong>
                                <div style={{ color: '#52c41a', wordBreak: 'break-all', lineHeight: '1.4' }}>{selectedLocation}</div>
                                {currentGPSLocation && (
                                    <div style={{
                                        marginTop: 4,
                                        fontSize: 11,
                                        color: '#1890ff',
                                        fontFamily: 'monospace'
                                    }}>
                                        📍 GPS: {currentGPSLocation.lat.toFixed(6)}, {currentGPSLocation.lng.toFixed(6)}
                                    </div>
                                )}
                            </div>
                        </Space>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default LocationPicker;
