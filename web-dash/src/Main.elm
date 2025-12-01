module Main exposing (main)

import Api
import Browser
import Css
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Http
import PromptPanel
import Schedule
import Time


totalReload : Cmd Msg
totalReload =
    Api.getSchedule GotSchedule


type alias State =
    { schedule : List Schedule.Item
    , promptPanel : PromptPanel.State
    }


type Msg
    = GotSchedule (Result Http.Error (List Schedule.Item))
    | RefreshTimerTick
    | PromptPanelMsg PromptPanel.Msg


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
        ( promptPanelState, promptPanelCmd ) =
            PromptPanel.init ()

        state : State
        state =
            { schedule = []
            , promptPanel = promptPanelState
            }

        cmd : Cmd Msg
        cmd =
            Cmd.batch
                [ totalReload
                , promptPanelCmd |> Cmd.map PromptPanelMsg
                ]
    in
    ( state, cmd )


subscriptions : State -> Sub Msg
subscriptions state =
    let
        promptPanelSubs =
            state.promptPanel
                |> PromptPanel.subscriptions
                |> Sub.map PromptPanelMsg

        refresh =
            Time.every 2000 (always RefreshTimerTick)
    in
    Sub.batch [ refresh, promptPanelSubs ]


update : Msg -> State -> ( State, Cmd Msg )
update msg state =
    case msg of
        RefreshTimerTick ->
            ( state, totalReload )

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

        PromptPanelMsg childMsg ->
            let
                ( promptPanelState, promptPanelCmd ) =
                    PromptPanel.update childMsg state.promptPanel

                newState =
                    { state
                        | promptPanel = promptPanelState
                    }

                cmd =
                    Cmd.map PromptPanelMsg promptPanelCmd
            in
            ( newState, cmd )


view : State -> Browser.Document Msg
view state =
    { title = "Auto Manager: THE #1 MANAGER OF AUTOS!!"
    , body =
        div
            [ css
                [ Css.displayFlex
                , Css.property "gap" "1rem"
                , Css.height (Css.vh 100)
                ]
            ]
            [ viewSchedule state.schedule
            , state.promptPanel |> PromptPanel.view |> Html.Styled.map PromptPanelMsg
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
                |> List.map viewScheduleItem
    in
    div
        [ css
            [ Css.width (Css.pct 100)
            , Css.height (Css.pct 100)
            , Css.overflowY Css.scroll
            ]
        ]
        [ div []
            [ h2 [] [ text "Scheduled Scripts" ]
            , text itemsScheduledText
            ]
        , div [] (List.map viewScheduleItem items)
        ]


viewScheduleItem : Schedule.Item -> Html Msg
viewScheduleItem item =
    button [] [ text item.scriptName ]
