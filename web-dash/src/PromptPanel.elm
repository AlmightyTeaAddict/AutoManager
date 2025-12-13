module PromptPanel exposing (Msg, State, init, subscriptions, update, view)

import Css
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Http
import List.Extra
import PromptPanel.Api
import PromptPanel.Form.AskName
import PromptPanel.Queue
import Styles
import Time


reloadPromptQueue : Cmd Msg
reloadPromptQueue =
    PromptPanel.Api.getQueue GotPromptQueue


type alias State =
    { queue : List PromptPanel.Queue.Item
    , selectedPrompt : Int
    }


type Msg
    = GotPromptQueue (Result Http.Error (List PromptPanel.Queue.Item))
    | SelectPrompt Int
    | ReloadPromptQueue


init : () -> ( State, Cmd Msg )
init _ =
    let
        state =
            { queue = []
            , selectedPrompt = -1
            }

        cmd =
            reloadPromptQueue
    in
    ( state, cmd )


subscriptions : State -> Sub Msg
subscriptions _ =
    Time.every 2000 (always ReloadPromptQueue)


update : Msg -> State -> ( State, Cmd Msg )
update msg state =
    case msg of
        GotPromptQueue (Err httpError) ->
            ( state, Cmd.none )

        GotPromptQueue (Ok promptQueue) ->
            let
                newState =
                    { state
                        | queue = promptQueue
                    }
            in
            ( newState, Cmd.none )

        SelectPrompt id ->
            let
                newState =
                    { state
                        | selectedPrompt = id
                    }
            in
            ( newState, Cmd.none )

        ReloadPromptQueue ->
            ( state, reloadPromptQueue )


view : State -> Html Msg
view state =
    div
        [ css
            [ Css.displayFlex
            , Css.property "gap" "1rem"
            , Css.height (Css.vh 100)
            , Css.width (Css.pct 100)
            ]
        ]
        [ viewQueuePanel state.queue
        , state.queue
            |> List.Extra.getAt state.selectedPrompt
            |> viewFormPanel
        ]


viewQueuePanel : List PromptPanel.Queue.Item -> Html Msg
viewQueuePanel items =
    let
        itemsQueuedText =
            items
                |> List.length
                |> String.fromInt
                |> (\n -> n ++ " prompts are queued.")
    in
    div
        [ css
            [ Css.width (Css.pct 100)
            , Css.height (Css.pct 100)
            , Css.overflowY Css.scroll
            ]
        ]
        [ div []
            [ h2 [] [ text "Prompt Queue" ]
            , text itemsQueuedText
            ]
        , div [] (List.indexedMap viewQueueItem items)
        ]


viewQueueItem : Int -> PromptPanel.Queue.Item -> Html Msg
viewQueueItem id item =
    button [ onClick (SelectPrompt id), css Styles.button ] [ text item.name ]


viewFormPanel : Maybe PromptPanel.Queue.Item -> Html Msg
viewFormPanel maybePrompt =
    let
        contents : List (Html Msg)
        contents =
            case maybePrompt of
                Nothing ->
                    [ p [] [ text "No prompt selected" ] ]

                Just prompt ->
                    [ h2 [] [ text prompt.name ], viewForm prompt ]
    in
    div
        [ css
            [ Css.width (Css.pct 100)
            , Css.height (Css.pct 100)
            , Css.overflowY Css.scroll
            ]
        ]
        contents


viewForm : PromptPanel.Queue.Item -> Html Msg
viewForm prompt =
    case prompt.name of
        "ask-name" ->
            PromptPanel.Form.AskName.view prompt

        _ ->
            text "Unknown Prompt"
