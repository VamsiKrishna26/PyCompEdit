import React, { useCallback, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history';
import styled from "styled-components";


const AddDiscussionInputDiv=styled.div``;

const AddDiscussionInput=(props)=>{
    return(
        <AddDiscussionInputDiv>

        </AddDiscussionInputDiv>
    )
}

export default AddDiscussionInput;