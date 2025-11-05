module PromptQueue exposing
        ( Item
        , encodeItem
        , encodeQueue
        , itemDecoder
        , queueDecoder
        )

import Json.Decode as D
import Json.Encode as E


type alias Item =
    { name : String
    , id : Int
    }

encodeItem : Item -> E.Value
encodeItem { name, id } =
        E.object
                [ ( "name", E.string name )
                , ( "id", E.int id )
                ]

encodeQueue : List Item -> E.Value
encodeQueue promptQueue =
        E.list encodeItem promptQueue

itemDecoder : D.Decoder Item
itemDecoder =
        D.map2 Item
                (D.field "name" D.string)
                (D.field "id" D.int)

queueDecoder : D.Decoder (List Item)
queueDecoder =
        D.list itemDecoder
