module PromptForm exposing (view)

import Css
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import PromptForm.AskName
import PromptQueue


view : PromptQueue.Item -> Html msg
view prompt =
    case prompt.name of
        "ask-name" ->
            PromptForm.AskName.view prompt

        _ ->
            text "Unknown prompt"
