import React, { createElement } from 'react';
import { Stage, Layer } from 'react-konva';
import { NextUIProvider } from '@nextui-org/react';
import ArrowDrawable from './components/ArrowDrawable';
import CircleDrawable from './components/CircleDrawable';
import RectDrawable from './components/RectDrawable';
import FreePathDrawable from './components/FreePathDrawable';
import { useState } from 'react';
import { DrawableProps, ShapeProps } from './components/types';

const drawing_modes = {
  ARROW: 'arrow',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  FREE_PATH: 'free-path',
};

const elements = {
  [drawing_modes.ARROW]: ArrowDrawable,
  [drawing_modes.CIRCLE]: CircleDrawable,
  [drawing_modes.RECTANGLE]: RectDrawable,
  [drawing_modes.FREE_PATH]: FreePathDrawable,
};

type Drawable = {
  type: (typeof drawing_modes)[keyof typeof drawing_modes];
} & Pick<DrawableProps, 'shapeProps'>;

const App = () => {
  const [drawables, setDrawables] = React.useState<Drawable[]>([]);
  const [newDrawable, setNewDrawable] = React.useState<Drawable | null>(null);
  const [mode, setMode] = React.useState(drawing_modes.ARROW);
  const [selected, setSelected] = useState<string | null>(null);

  const checkSelected = (id: string | null) => {
    if (newDrawable) return;

    setSelected(id);
  };

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target?.getStage();
    if (clickedOnEmpty) {
      setSelected(null);

      return true;
    }

    return false;
  };

  const onMouseDown = (e: any) => {
    if (!newDrawable && checkDeselect(e)) {
      const { x, y } = e.target.getStage().getPointerPosition();

      setNewDrawable({
        shapeProps: {
          points: [
            { x, y },
            { x, y },
          ],
          x,
          y,
          id: `${x}-${y}`,
        },
        type: mode,
      });

      return;
    }
  };

  const onMouseMove = (e: any) => {
    if (newDrawable) {
      const { x, y } = e.target.getStage().getPointerPosition();

      setNewDrawable((prevState) => {
        if (!prevState) return null;
        return {
          ...prevState,
          shapeProps: {
            ...prevState.shapeProps,
            points: [prevState.shapeProps.points[0], { x, y }],
          },
        };
      });
    }
  };
  const onMouseUp = (e: any) => {
    if (newDrawable) {
      const { x, y } = e.target.getStage().getPointerPosition();

      setNewDrawable((prevState) => {
        if (!prevState) return null;

        return {
          ...prevState,
          shapeProps: {
            ...prevState.shapeProps,
            points: [prevState.shapeProps.points[0], { x, y }],
          },
        };
      });

      setDrawables([...drawables, newDrawable]);

      setNewDrawable(null);
    }
  };

  return (
    <NextUIProvider>
      <>
        {Object.values(drawing_modes).map((mode, i) => {
          return (
            <button key={i} onClick={() => setMode(mode)}>
              {mode}
            </button>
          );
        })}
        <button onClick={() => setDrawables([])}>Clear</button>

        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onTouchStart={checkDeselect}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <Layer>
            {[...drawables, newDrawable].map((drawable, i) => {
              if (!drawable) return null;

              const element = elements[drawable?.type];

              return (
                element &&
                createElement(element, {
                  key: i,
                  shapeProps: drawable.shapeProps,
                  isSelected: selected === drawable.shapeProps.id,
                  onSelect: checkSelected,
                  onChange: (newAttrs: ShapeProps) => {
                    const draws = [...drawables];

                    draws[i] = {
                      ...draws[i],
                      shapeProps: newAttrs,
                    };
                    console.log('updated shapes');
                    setDrawables(draws);
                  },
                })
              );
            })}
          </Layer>
        </Stage>
      </>
    </NextUIProvider>
  );
};

export default App;
