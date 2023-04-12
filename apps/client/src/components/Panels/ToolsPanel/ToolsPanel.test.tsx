import { fireEvent, render, screen } from '@testing-library/react';
import { TOOLS } from '@/constants/tool';
import { capitalizeFirstLetter } from '@/utils/string';
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
