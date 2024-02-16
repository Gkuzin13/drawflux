import { selectConfig } from '@/services/canvas/slice';
import { useAppSelector } from '@/stores/hooks';
import LineGuide from './LineGuide';
import type { SnapLineGuide } from '../DrawingCanvas/helpers/snap';

type Props = {
  lineGuides: SnapLineGuide[];
};

const SnapLineGuides = ({ lineGuides }: Props) => {
  const stageConfig = useAppSelector(selectConfig);
  
  return (
    <>
      {lineGuides.map((lineGuide, index) => {
        return (
          <LineGuide
            key={`${lineGuide.orientation}-${index}`}
            stageConfig={stageConfig}
            lineGuide={lineGuide}
          />
        );
      })}
    </>
  );
};

export default SnapLineGuides;
