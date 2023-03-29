import { TOOLS } from '@/client/shared/constants/tool';
import { capitalizeFirstLetter } from '@/client/shared/utils/string';
import { fireEvent, render, screen } from '@testing-library/react';
import ToolsPanel from './ToolsPanel';

describe('ToolsPanel', () => {
  it('calls onToolSelect when clicked', () => {
    const handleToolSelect = vi.fn();

    render(<ToolsPanel activeTool="arrow" onToolSelect={handleToolSelect} />);

    TOOLS.forEach((tool) => {
      fireEvent.click(
        screen.getByTitle(new RegExp(capitalizeFirstLetter(tool.value))),
      );
    });

    expect(handleToolSelect).toBeCalledTimes(TOOLS.length);
  });
});
