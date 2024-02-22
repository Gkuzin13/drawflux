import { memo } from 'react';
import { ARROW_HEADS } from '@/constants/panels';
import { capitalizeFirstLetter, createTitle } from '@/utils/string';
import Popover from '@/components/Elements/Popover/Popover';
import Icon from '@/components/Elements/Icon/Icon';
import { Button } from '@/components/Elements/Button/Button.styled';
import * as Styled from './StylePanel.styled';
import type { ArrowEndHead, ArrowHeadDirection, ArrowStartHead } from 'shared';

export type ArrowHead = NonNullable<ArrowStartHead | ArrowEndHead>;
export type ArrowHeadEntity = (typeof ARROW_HEADS)[keyof typeof ARROW_HEADS];

type Props = {
  startHead: ArrowStartHead;
  endHead: ArrowEndHead;
  onArrowHeadChange: (direction: ArrowHeadDirection, head: ArrowHead) => void;
};

const getCurrentIcon = (heads: ArrowHeadEntity, value: ArrowHead) => {
  return heads.find((head) => head.value === value)?.icon ?? 'minus';
};

const ArrowHeadsSection = ({
  startHead,
  endHead,
  onArrowHeadChange,
}: Props) => {
  const getCurrentHead = (direction: ArrowHeadDirection) => {
    if (direction === 'start') {
      return startHead ?? 'arrow';
    }
    return endHead ?? 'none';
  };

  return (
    <Styled.ArrowHeadsContainer aria-labelledby="arrow-heads">
      <Styled.Label>Arrow Heads</Styled.Label>
      <Styled.ArrowHeadsTriggers>
        {Object.entries(ARROW_HEADS).map(([key, heads]) => {
          const direction = key as ArrowHeadDirection;
          const currentHead = getCurrentHead(direction);
          const directionTitle = capitalizeFirstLetter(direction);

          return (
            <Popover key={direction}>
              <Popover.Trigger
                key={direction}
                value={direction}
                title={createTitle('Arrow Heads', directionTitle)}
                data-testid={`arrow-${direction}-head-trigger`}
                asChild
              >
                <Button color="secondary" size="xs" squared>
                  <Icon name={getCurrentIcon(heads, currentHead)} />
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  css={{ zIndex: 1 }}
                  sideOffset={8}
                  align="start"
                >
                  <Styled.InnerContainer
                    aria-label={`Arrow ${directionTitle} Head`}
                    aria-labelledby={`${directionTitle}-arrow-heads`}
                    orientation="vertical"
                    value={currentHead}
                    onValueChange={(value: ArrowHead) => {
                      onArrowHeadChange(direction, value);
                    }}
                  >
                    <Styled.ArrowHeadsPopoverContent>
                      {heads.map((head) => {
                        return (
                          <Styled.Item
                            key={head.name}
                            title={createTitle(
                              `Arrow ${directionTitle} Head`,
                              head.name,
                            )}
                            value={head.value}
                            checked={head.value === currentHead}
                            color={
                              head.value === currentHead
                                ? 'secondary-dark'
                                : 'secondary-light'
                            }
                            data-testid={`${direction}-${head.value}-button`}
                          >
                            <Icon name={head.icon} />
                          </Styled.Item>
                        );
                      })}
                    </Styled.ArrowHeadsPopoverContent>
                  </Styled.InnerContainer>
                </Popover.Content>
              </Popover.Portal>
            </Popover>
          );
        })}
      </Styled.ArrowHeadsTriggers>
    </Styled.ArrowHeadsContainer>
  );
};

export default memo(ArrowHeadsSection);
