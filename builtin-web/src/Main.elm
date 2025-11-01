module Main exposing (main)

import Browser
import Html exposing (..)


type alias PromptQueueItem =
    { name : String
    , id : Int
    }


type alias ScheduleItem =
    { scriptName : String
    , tick : Int
    }


type alias State =
    { schedule : List ScheduleItem
    , promptQueue : List PromptQueueItem
    }


type Msg
    = Destruction


main =
    Browser.sandbox
        { init = init
        , update = update
        , view = view
        }


init : State
init =
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
    , promptQueue =
        [ { name = "First Prompt"
          , id = 0
          }
        , { name = "Second Prompt"
          , id = 1
          }
        , { name = "Third Prompt"
          , id = 2
          }
        ]
    }


update : Msg -> State -> State
update msg state =
    state


view : State -> Html Msg
view state =
    div []
        [ viewSchedule state.schedule
        , viewPromptQueue state.promptQueue
        ]


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


viewPromptQueue : List PromptQueueItem -> Html Msg
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


viewPromptQueueItem : PromptQueueItem -> Html Msg
viewPromptQueueItem item =
    div [] [ text item.name ]
