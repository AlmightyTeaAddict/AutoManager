module Main exposing (main)

import Api
import Browser
import Css exposing (..)
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Http
import PromptQueue
import Schedule
import Time


totalReload : Cmd Msg
totalReload =
    Cmd.batch
        [ Api.getPromptQueue GotPromptQueue
        , Api.getSchedule GotSchedule
        ]


type alias State =
    { schedule : List Schedule.Item
    , promptQueue : List PromptQueue.Item
    , selectedPrompt : Maybe Int
    }


type Msg
    = GotPromptQueue (Result Http.Error (List PromptQueue.Item))
    | GotSchedule (Result Http.Error (List Schedule.Item))
    | RefreshTimerTick
    | SelectPrompt Int


main =
    Browser.document
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : () -> ( State, Cmd Msg )
init _ =
    let
        state =
            { schedule = []
            , promptQueue = []
            , selectedPrompt = Nothing
            }

        cmd =
            totalReload
    in
    ( state, cmd )


subscriptions : State -> Sub Msg
subscriptions _ =
    Time.every 2000 (always RefreshTimerTick)


update : Msg -> State -> ( State, Cmd Msg )
update msg state =
    case msg of
        RefreshTimerTick ->
            ( state, totalReload )

        GotPromptQueue (Err httpError) ->
            ( state, Cmd.none )

        GotPromptQueue (Ok promptQueue) ->
            let
                newState =
                    { state
                        | promptQueue = promptQueue
                    }
            in
            ( newState, Cmd.none )

        GotSchedule (Err httpError) ->
            ( state, Cmd.none )

        GotSchedule (Ok schedule) ->
            let
                newState =
                    { state
                        | schedule = schedule
                    }
            in
            ( newState, Cmd.none )

        SelectPrompt id ->
            let
                newState =
                    { state
                        | selectedPrompt = Just id
                    }
            in
            ( newState, Cmd.none )


view : State -> Browser.Document Msg
view state =
    { title = "Auto Manager: THE #1 MANAGER OF AUTOS!!"
    , body =
        div
            [ css
                [ displayFlex
                ]
            ]
            [ viewSchedule state.schedule
            , viewPromptQueue state.promptQueue
            ]
            |> toUnstyled
            |> List.singleton
    }


viewSchedule : List Schedule.Item -> Html Msg
viewSchedule items =
    let
        itemsScheduledText =
            items
                |> List.length
                |> String.fromInt
                |> (\n -> n ++ " scripts are scheduled.")

        itemElements =
            items
                |> List.sortBy .tick
                |> List.map viewScheduleItem
    in
    div [ css [ overflow scroll ] ]
        [ div []
            [ h2 [] [ text "Scheduled Scripts" ]
            , text itemsScheduledText
            ]
        , div [] (List.map viewScheduleItem items)
        ]


viewScheduleItem : Schedule.Item -> Html Msg
viewScheduleItem item =
    button [] [ text item.scriptName ]


viewPromptQueue : List PromptQueue.Item -> Html Msg
viewPromptQueue items =
    let
        itemsQueuedText =
            items
                |> List.length
                |> String.fromInt
                |> (\n -> n ++ " prompts are queued.")
    in
    div []
        [ div []
            [ h2 [] [ text "Prompt Queue" ]
            , text itemsQueuedText
            ]
        , div [] (List.indexedMap viewPromptQueueItem items)
        ]


viewPromptQueueItem : Int -> PromptQueue.Item -> Html Msg
viewPromptQueueItem id item =
    button [ onClick (SelectPrompt id) ] [ text item.name ]
