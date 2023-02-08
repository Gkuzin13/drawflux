import React, { createElement, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { Container, Dropdown, NextUIProvider } from '@nextui-org/react';
import ArrowDrawable from './components/ArrowDrawable';
import CircleDrawable from './components/CircleDrawable';
import RectDrawable from './components/RectDrawable';
import FreePathDrawable from './components/FreePathDrawable';
import { useState } from 'react';
import { DrawableProps } from './components/types';
import EditableText from './components/EditableText';
import { ESCAPE_KEY } from './shared/constants/event-keys';
import { Html } from 'react-konva-utils';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';

const drawing_modes = {
  ARROW: 'arrow',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  FREE_PATH: 'free-path',
  EDITABLE_TEXT: 'editable-text',
};

const elements = {
  [drawing_modes.ARROW]: ArrowDrawable,
  [drawing_modes.CIRCLE]: CircleDrawable,
  [drawing_modes.RECTANGLE]: RectDrawable,
  [drawing_modes.FREE_PATH]: FreePathDrawable,
  [drawing_modes.EDITABLE_TEXT]: EditableText,
};

export type Drawable = {
  type: (typeof drawing_modes)[keyof typeof drawing_modes];
} & Pick<DrawableProps, 'shapeProps' | 'text' | 'isDrawable'>;

const App = () => {
  const [drawables, setDrawables] = React.useState<Drawable[]>([]);
  const [newDrawable, setNewDrawable] = React.useState<Drawable | null>(null);
  const [mode, setMode] = React.useState(drawing_modes.ARROW);
  const [selected, setSelected] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const contextMenuRef = useRef<Konva.Stage>(null);

  const handleOnContextMenu = (
    e: KonvaEventObject<PointerEvent>,
    id: string,
  ) => {
    e.evt.preventDefault();

    const position = e.target?.getStage()?.getPointerPosition();

    setMenuPosition({ x: position?.x || 0, y: position?.y || 0 });

    setContextMenu(id);
    setSelected(id);
  };

  function removeNode(id: string) {
    const updatedNodes = [...drawables].filter(
      (drawable) => drawable.shapeProps.id !== id,
    );

    setDrawables(updatedNodes);
  }

  const onMouseDown = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();

    if (clickedOnEmpty) {
      setSelected(null);
    }

    if (clickedOnEmpty && !selected) {
      const { x, y } = e.target.getStage().getPointerPosition();

      const newNode: Drawable = {
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
        isDrawable: mode !== drawing_modes.EDITABLE_TEXT,
        text: '',
      };

      setNewDrawable(newNode);
      setSelected(!newNode.isDrawable ? newNode.shapeProps.id : null);
      console.log('mousedown: adding new node state');
    }
  };

  const onMouseMove = (e: any) => {
    if (newDrawable && newDrawable.isDrawable) {
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

      console.log('mousemove: updating new node points and props');
    }
  };

  const onMouseUp = (e: any) => {
    if (newDrawable && newDrawable.isDrawable) {
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
      console.log('mouseup: adding node to list', drawables);
    }
  };

  useEffect(() => {
    const handleEscapeKeys = (e: any) => {
      if (e.key === ESCAPE_KEY) {
        setSelected(null);
      }
    };
    window.addEventListener('keydown', handleEscapeKeys);

    return () => {
      window.removeEventListener('keydown', handleEscapeKeys);
    };
  }, []);

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
          ref={contextMenuRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <Layer>
            {[...drawables, newDrawable].map((drawable, i) => {
              if (!drawable) return null;

              const element = elements[drawable.type];

              return (
                element &&
                createElement(element, {
                  key: i,
                  shapeProps: drawable.shapeProps,
                  isSelected: selected === drawable.shapeProps.id,
                  isDrawable: drawable.isDrawable,
                  type: drawable.type,
                  text: drawable.text,
                  onContextMenu: handleOnContextMenu,
                  onSelect: () => setSelected(drawable.shapeProps.id),
                  onChange: (newAttrs) => {
                    const draws = [...drawables];

                    draws[i] = {
                      type: drawable.type,
                      isDrawable: drawable.isDrawable,
                      ...newAttrs,
                    };

                    setDrawables(draws);
                    console.log(newAttrs.shapeProps);
                    if (!draws[i].isDrawable) {
                      setNewDrawable(null);
                    }

                    console.log('updating nodes state');
                  },
                })
              );
            })}
            <Html>
              <Container
                css={{
                  position: 'absolute',
                  top: menuPosition.y + 'px',
                  left: menuPosition.x + 'px',
                }}
              >
                <Dropdown
                  isOpen={Boolean(contextMenu?.length)}
                  closeOnSelect
                  onClose={() => setContextMenu(null)}
                  offset={-12}
                >
                  <Dropdown.Button flat css={{ visibility: 'hidden' }}>
                    Trigger
                  </Dropdown.Button>
                  <Dropdown.Menu
                    onAction={() => contextMenu && removeNode(contextMenu)}
                    aria-label="Static Actions"
                  >
                    <Dropdown.Item key="delete" color="error">
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Container>
            </Html>
          </Layer>
        </Stage>
      </>
    </NextUIProvider>
  );
};

export default App;
