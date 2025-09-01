import { type ChangeEvent, useState } from 'react';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
);

// 상품 타입
type ProductType = {
  id: number
  name: string
  price: number
  quantity: number
}

// 새 상품 타입
type NewProductType = {
  name?: string
  price?: string
  quantity?: string
}

// 더미데이터
const dummyData: ProductType[] = [
  { id: 1, name: '아이폰 15', price: 1200000, quantity: 10 },
  { id: 2, name: '갤럭시 S24', price: 1100000, quantity: 8 },
  { id: 3, name: '맥북 프로', price: 2500000, quantity: 5 },
  { id: 4, name: '에어팟 프로', price: 350000, quantity: 15 },
];

export default function AdminPage() {
  const [products, setProducts] = useState<ProductType[]>(dummyData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

  // 새 상품 상태
  const [newProduct, setNewProduct] = useState<NewProductType>({
    name: '',
    price: '',
    quantity: '',
  });

  // 상품 추가 메서드
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 유효성 검사 및 파싱
    const price = Number.parseInt(newProduct.price, 10);
    const quantity = Number.parseInt(newProduct.quantity, 10);

    if (isNaN(price) || isNaN(quantity)) {
      alert('가격과 수량에는 유효한 숫자를 입력해주세요.');
      return;
    }

    setNewProduct(
      {
        name: '',
        price: '',
        quantity: ''
      }
    ); // 폼 초기화
    setIsAddDialogOpen(false);
  };

  // 상품 수량 수정 메서드
  const handleEditProduct = () => {
    if (!editingProduct) {
      console.log("수정할 상품이 없습니다.");
      return;
    }

    setProducts(
      products.map(
        (p) => (p.id === editingProduct.id ? editingProduct : p),
      ),
    );
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  // 상품 삭제 메서드
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // 상품 추가 이벤트 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [id]: value }));
  };

  // 상품 수정 이벤트 핸들러
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) {
      return;
    }
    const { value } = e.target;
    const quantity = Number.parseInt(value, 10);
    setEditingProduct({
      ...editingProduct,
      quantity: isNaN(quantity) ? 0 : quantity,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">상품 관리</p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* 상품 추가 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon />
            상품 추가
          </button>
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  가격: <span className="font-semibold text-gray-900">{product.price.toLocaleString()}원</span>
                </p>
                <p className="text-sm text-gray-600">
                  수량: <span className="font-semibold text-gray-900">{product.quantity}개</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setIsEditDialogOpen(true);
                  }}
                  className="flex items-center gap-1 flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <EditIcon />
                  수정
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <DeleteIcon />
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 상품이 없을 시 */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">등록된 상품이 없습니다.</p>
          </div>
        )}
      </div>

      {/* TODO: 추후 상품 추가 모달 창 컴포넌트화 고려 */}
      {/* 상품 추가 모달창 */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">새 상품 추가</h2>
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상품명
                </label>
                <input
                  id="name"
                  type="text"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="상품명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  가격
                </label>
                <input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="가격을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  수량
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  placeholder="수량을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddProduct}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  추가
                </button>
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TODO: 추후 수정 모달 창 컴포넌트화 고려 */}
      {/* 상품 수정 모달 창 */}
      {isEditDialogOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">상품 수량 수정</h2>
              <button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
                <p className="text-sm text-gray-600">{editingProduct.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  수량
                </label>
                <input
                  id="editQuantity"
                  type="number"
                  value={editingProduct.quantity}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleEditProduct}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
