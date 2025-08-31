import EditorArea from '@_components/pageComponent/compose/EditorArea';
import MicPanel from '@_components/pageComponent/compose/MicPanel';
import SubmitBar from '@_components/pageComponent/compose/SubmitBar';
import TopicBar from '@_components/pageComponent/compose/TopicBar';

export default function ComposePage() {
  return (
    <>
      <div>
        <TopicBar />
        <EditorArea />
      </div>

      <div>
        <MicPanel />
        <SubmitBar />
      </div>
    </>
  );
}
