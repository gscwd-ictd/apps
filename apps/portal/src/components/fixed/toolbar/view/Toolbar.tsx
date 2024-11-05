"use client";

import { FunctionComponent, createContext } from "react";
import { ToolbarProps } from "../utils/toolbar";
import { FormatBold } from "./FormatBold";
import { FormatItalic } from "./FormatItalic";
import { FormatUnderline } from "./FormatUnderline";
import { FormatAlignLeft } from "./FormatAlignLeft";
import { FormatAlignCenter } from "./FormatAlignCenter";
import { FormatAlignRight } from "./FormatAlignRight";
import { FormatAlignJustify } from "./FormatAlignJustify";
import { FormatOrderedList } from "./FormatOrderedList";
import { FormatBulletList } from "./FormatBulletList";
import { FormatLink } from "./FomatLink";
import { FormatImg } from "./FormatImg";

export const ToolbarContext = createContext<ToolbarProps>({ editor: null });

export const Toolbar: FunctionComponent<ToolbarProps> = ({ editor }) => {
  return (
    <div className="space-x-1">
      <ToolbarContext.Provider value={{ editor }}>
        <div>
          <FormatBold />
          <FormatItalic />
          <FormatUnderline />
          {/* <FormatAlignLeft />
          <FormatAlignCenter />
          <FormatAlignRight /> */}
          <FormatAlignJustify />
          <FormatOrderedList />
          <FormatBulletList />
          <FormatLink />
          {/* <FormatImg /> */}
        </div>
      </ToolbarContext.Provider>
    </div>
  );
};
