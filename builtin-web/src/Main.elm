module Main exposing (main)

import Api
import Browser
import Html exposing (..)
import Http
import PromptQueue


type alias ScheduleItem =
        { scriptName : String
        , tick : Int
        }


type alias State =
        { schedule : List ScheduleItem
        , promptQueue : List PromptQueue.Item
        }


type Msg
        = GotPromptQueue (Result Http.Error (List PromptQueue.Item))


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
                        { schedule =
                            [ { scriptName = "First Script"
                            , tick = 0
                            }
                            , { scriptName = "Second Script"
                            , tick = 1
                            }
                            , { scriptName = "Third Script"
                            , tick = 2
                            }
                            ]
                            , promptQueue = []
                        }
                cmd = Api.getPromptQueue GotPromptQueue
        in
                ( state, cmd )

subscriptions : State -> Sub Msg
subscriptions _ =
        Sub.none


update : Msg -> State -> ( State, Cmd Msg )
update msg state =
        case msg of
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

view : State -> Browser.Document Msg
view state =
        { title = "Auto Manager: THE #1 MANAGER OF AUTOS!!"
        , body = 
                [ viewSchedule state.schedule
                , viewPromptQueue state.promptQueue
                ]
        }


viewSchedule : List ScheduleItem -> Html Msg
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


viewScheduleItem : ScheduleItem -> Html Msg
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
