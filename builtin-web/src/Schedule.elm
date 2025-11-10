module Schedule exposing
    ( Item
    , encodeItem
    , encodeSchedule
    , itemDecoder
    , scheduleDecoder
    )

import Json.Decode as D
import Json.Encode as E


type alias Item =
    { scriptName : String
    , tick : Int
    , done : Bool
    }


encodeItem : Item -> E.Value
encodeItem { scriptName, tick, done } =
    E.object
        [ ( "scriptName", E.string scriptName )
        , ( "tick", E.int tick )
        , ( "done", E.bool done )
        ]


encodeSchedule : List Item -> E.Value
encodeSchedule schedule =
    E.list encodeItem schedule


itemDecoder : D.Decoder Item
itemDecoder =
    D.map3 Item
        (D.field "scriptName" D.string)
        (D.field "tick" D.int)
        (D.field "done" D.bool)


scheduleDecoder : D.Decoder (List Item)
scheduleDecoder =
    D.list itemDecoder
