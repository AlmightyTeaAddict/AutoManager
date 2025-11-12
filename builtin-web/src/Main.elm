module Main exposing (main)

import Api
import Browser
import Html exposing (..)
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
    }


type Msg
    = GotPromptQueue (Result Http.Error (List PromptQueue.Item))
    | GotSchedule (Result Http.Error (List Schedule.Item))
    | RefreshTimerTick


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


view : State -> Browser.Document Msg
view state =
    { title = "Auto Manager: THE #1 MANAGER OF AUTOS!!"
    , body =
        [ viewSchedule state.schedule
        , viewPromptQueue state.promptQueue
        ]
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
    div []
        [ div []
            [ h2 [] [ text "Scheduled Scripts" ]
            , text itemsScheduledText
            ]
        , div [] (List.map viewScheduleItem items)
        ]


viewScheduleItem : Schedule.Item -> Html Msg
viewScheduleItem item =
    div [] [ text item.scriptName ]


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
        , div [] (List.map viewPromptQueueItem items)
        ]


viewPromptQueueItem : PromptQueue.Item -> Html Msg
viewPromptQueueItem item =
    div [] [ text item.name ]
