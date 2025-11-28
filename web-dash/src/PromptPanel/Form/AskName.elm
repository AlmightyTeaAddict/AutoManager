module PromptPanel.Form.AskName exposing (view)

import Css
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import PromptPanel.Queue


view : PromptPanel.Queue.Item -> Html msg
view prompt =
    text "ask name!!!"
