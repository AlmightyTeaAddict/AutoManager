module PromptForm.AskName exposing (view)

import Css
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import PromptQueue


view : PromptQueue.Item -> Html msg
view prompt =
    text "ask name!!!"
