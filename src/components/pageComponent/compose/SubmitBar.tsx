import record from '@_icons/common/icon-record.svg';

export default function SubmitBar() {
  return (
    <>
      <div className="w-full fixed bottom-0 flex items-center h-16">
        <div
          className="w-16 h-16 flex items-center justify-center 
        px-3 py-2 bg-brand-violet-500
        cursor-pointer hover:bg-brand-violet-200"
        >
          <button>
            <img
              className="cursor-pointer w-[26px] h-[26px]"
              src={record}
              alt="마이크 아이콘"
            />
          </button>
        </div>
        <div
          className="flex items-center justify-center cursor-pointer 
        w-[326px] h-16 bg-brand-violet-500
        hover:bg-brand-violet-200"
        >
          <button className="cursor-pointer typo-button-b-18  text-white-base">
            작성완료
          </button>
        </div>
      </div>
    </>
  );
}
