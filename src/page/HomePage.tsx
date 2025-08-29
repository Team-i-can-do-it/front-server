import HomeCurrentSpeaking from '@_components/pageComponent/home/HomeCurrentSpeaking';
import HomeRecommend from '@_components/pageComponent/home/HomeRecommend';
import HomeTopicSelect from '@_components/pageComponent/home/HomeTopicSelect';
import HomeTitle from '@_pageComponent/home/HomeTitle';

export default function HomePage() {
  return (
    <>
      <section className="w-full bg-[#efe6ff]">
        {/* 컨텐츠 컨테이너 */}
        <div
          className="mx-auto max-w-[390px] px-6 
                  pt-[calc(env(safe-area-inset-top)+44px)] pb-8"
        >
          <HomeTitle />
          <HomeTopicSelect />
        </div>
      </section>
      <section>
        <HomeCurrentSpeaking />
        <HomeRecommend />
      </section>
    </>

    //
  );
}
